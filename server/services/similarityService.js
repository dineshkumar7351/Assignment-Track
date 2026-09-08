const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Submission = require('../models/Submission');
const SimilarityReport = require('../models/SimilarityReport');

/**
 * Standard Stop Words List for text normalization & TF-IDF
 */
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did',
  'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until',
  'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with',
  'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Modular Similarity Detection Service using TF-IDF and Cosine Similarity
 */
class SimilarityService {
  /**
   * 1. Extract text from uploaded submission file (PDF, DOCX, TXT)
   * @param {string|Buffer} fileInput - File path on disk, or Buffer
   * @param {string} fileType - Extension or mimetype ('pdf', 'docx', 'txt', etc.)
   * @returns {Promise<string>} Extracted raw text content
   */
  async extractText(fileInput, fileType = 'txt') {
    try {
      let buffer;
      let ext = (fileType || '').toLowerCase().replace(/^\./, '');

      if (typeof fileInput === 'string') {
        // If fileInput is a file path
        let resolvedPath = fileInput;
        if (!fs.existsSync(resolvedPath)) {
          // Check in server uploads directory
          const uploadPath = path.join(__dirname, '../uploads', path.basename(fileInput));
          if (fs.existsSync(uploadPath)) {
            resolvedPath = uploadPath;
          }
        }

        if (fs.existsSync(resolvedPath)) {
          buffer = fs.readFileSync(resolvedPath);
          if (!ext) {
            ext = path.extname(resolvedPath).toLowerCase().replace(/^\./, '');
          }
        } else {
          // If string is raw text content
          return fileInput;
        }
      } else if (Buffer.isBuffer(fileInput)) {
        buffer = fileInput;
      } else {
        return '';
      }

      if (ext === 'pdf') {
        const data = await pdfParse(buffer);
        return data.text || '';
      }

      if (ext === 'docx') {
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '';
      }

      // Default TXT / Plain Text
      return buffer.toString('utf-8');
    } catch (error) {
      console.warn('Text extraction warning (fallback applied):', error.message);
      if (Buffer.isBuffer(fileInput)) {
        return fileInput.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      }
      return typeof fileInput === 'string' ? fileInput : '';
    }
  }

  /**
   * 2. Normalize raw text into cleaned token stream
   * @param {string} text
   * @returns {string} Cleaned, lowercased string
   */
  normalizeText(text = '') {
    if (!text || typeof text !== 'string') return '';
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Replace punctuation with space
      .replace(/\s+/g, ' ') // Collapse multiple whitespace
      .trim();
  }

  /**
   * 3. Tokenize text into words (with optional stop word filtering)
   * @param {string} text
   * @param {boolean} filterStopWords
   * @returns {string[]}
   */
  tokenize(text = '', filterStopWords = true) {
    const normalized = this.normalizeText(text);
    if (!normalized) return [];

    const words = normalized.split(/\s+/).filter((w) => w.length > 1);
    if (filterStopWords) {
      return words.filter((w) => !STOP_WORDS.has(w));
    }
    return words;
  }

  /**
   * 4. Build TF-IDF vector representation for a collection of documents
   * @param {Array<{ id: string, text: string }>} documents
   * @returns {{ vocabulary: Map<string, number>, vectors: Map<string, Map<string, number>> }}
   */
  generateTfIdfVectors(documents = []) {
    const numDocs = documents.length;
    if (numDocs === 0) return { vocabulary: new Map(), vectors: new Map() };

    // Step A: Calculate Term Frequencies (TF) and Document Frequencies (DF)
    const docTfs = new Map();
    const docFrequency = new Map();

    documents.forEach((doc) => {
      const tokens = this.tokenize(doc.text, true);
      const tf = new Map();
      const uniqueTokensInDoc = new Set(tokens);

      tokens.forEach((token) => {
        tf.set(token, (tf.get(token) || 0) + 1);
      });

      // Normalize TF by document word count
      const docLen = tokens.length || 1;
      const normalizedTf = new Map();
      tf.forEach((count, token) => {
        normalizedTf.set(token, count / docLen);
      });

      docTfs.set(doc.id, normalizedTf);

      uniqueTokensInDoc.forEach((token) => {
        docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
      });
    });

    // Step B: Calculate Inverse Document Frequency (IDF) and build normalized TF-IDF vectors
    const vectors = new Map();

    documents.forEach((doc) => {
      const tf = docTfs.get(doc.id) || new Map();
      const vector = new Map();
      let normSq = 0;

      tf.forEach((tfVal, token) => {
        const df = docFrequency.get(token) || 1;
        // Standard smooth IDF formula
        const idf = Math.log((numDocs + 1) / (df + 1)) + 1;
        const tfidf = tfVal * idf;
        vector.set(token, tfidf);
        normSq += tfidf * tfidf;
      });

      // Unit vector normalization (L2 Norm)
      const norm = Math.sqrt(normSq) || 1;
      const unitVector = new Map();
      vector.forEach((val, token) => {
        unitVector.set(token, val / norm);
      });

      vectors.set(doc.id, unitVector);
    });

    return { docFrequency, vectors };
  }

  /**
   * 5. Calculate Cosine Similarity between two document vectors
   * @param {Map<string, number>} vectorA
   * @param {Map<string, number>} vectorB
   * @returns {number} Similarity percentage (0 - 100)
   */
  calculateCosineSimilarity(vectorA, vectorB) {
    if (!vectorA || !vectorB || vectorA.size === 0 || vectorB.size === 0) {
      return 0;
    }

    let dotProduct = 0;
    // Iterate over the smaller vector for speed
    const [smaller, larger] = vectorA.size <= vectorB.size ? [vectorA, vectorB] : [vectorB, vectorA];

    smaller.forEach((valA, token) => {
      if (larger.has(token)) {
        dotProduct += valA * larger.get(token);
      }
    });

    // Bound between 0 and 1, convert to percentage
    const clamped = Math.max(0, Math.min(1, dotProduct));
    return Math.round(clamped * 1000) / 10; // e.g. 87.4%
  }

  /**
   * 6. Classify similarity risk level according to requirements:
   * 0-20%: Low, 21-50%: Medium, 51-75%: High, 76-100%: Very High
   * @param {number} score - Similarity percentage (0-100)
   * @returns {'low'|'medium'|'high'|'very_high'}
   */
  classifyRisk(score = 0) {
    const num = Number(score) || 0;
    if (num <= 20) return 'low';
    if (num <= 50) return 'medium';
    if (num <= 75) return 'high';
    return 'very_high';
  }

  /**
   * 7. Extract overlapping phrases/n-grams between two submissions for side-by-side highlighting
   * @param {string} textA
   * @param {string} textB
   * @param {number} minShingleWords - Minimum words per matched phrase (default: 4)
   * @returns {string[]} Array of matched common phrases
   */
  extractCommonPhrases(textA = '', textB = '', minShingleWords = 4) {
    if (!textA || !textB) return [];

    const wordsA = this.normalizeText(textA).split(/\s+/).filter(Boolean);
    const wordsB = this.normalizeText(textB).split(/\s+/).filter(Boolean);

    if (wordsA.length < minShingleWords || wordsB.length < minShingleWords) {
      return [];
    }

    // Build n-gram set for text B
    const shinglesB = new Set();
    for (let i = 0; i <= wordsB.length - minShingleWords; i++) {
      const shingle = wordsB.slice(i, i + minShingleWords).join(' ');
      shinglesB.add(shingle);
    }

    // Find all matching n-grams from text A
    const matches = new Set();
    for (let i = 0; i <= wordsA.length - minShingleWords; i++) {
      const shingle = wordsA.slice(i, i + minShingleWords).join(' ');
      if (shinglesB.has(shingle)) {
        matches.add(shingle);
      }
    }

    // Filter out short sub-phrases contained in larger matched phrases
    const rawMatches = Array.from(matches);
    const filtered = rawMatches.filter((phrase, idx) => {
      return !rawMatches.some((other, oIdx) => idx !== oIdx && other.includes(phrase) && other.length > phrase.length);
    });

    // Return top 15 most significant common phrases sorted by length descending
    return filtered.sort((a, b) => b.length - a.length).slice(0, 15);
  }

  /**
   * 8. Compare two specific submissions side-by-side
   * @param {string} submissionId1
   * @param {string} submissionId2
   * @returns {Promise<Object>} Full comparison payload with common phrases
   */
  async compareSubmissions(submissionId1, submissionId2) {
    const [sub1, sub2] = await Promise.all([
      Submission.findById(submissionId1)
        .populate('student', 'fullName email studentId department')
        .populate('assignment', 'title subject teacherId deadline maxMarks totalMarks')
        .lean(),
      Submission.findById(submissionId2)
        .populate('student', 'fullName email studentId department')
        .populate('assignment', 'title subject teacherId deadline maxMarks totalMarks')
        .lean(),
    ]);

    if (!sub1 || !sub2) {
      throw new Error('One or both submissions could not be found');
    }

    // Ensure both submissions belong to the SAME assignment
    const assignId1 = sub1.assignment?._id?.toString() || sub1.assignmentId?.toString();
    const assignId2 = sub2.assignment?._id?.toString() || sub2.assignmentId?.toString();

    if (assignId1 !== assignId2) {
      throw new Error('Submissions must belong to the same assignment for similarity comparison');
    }

    // Extract text content
    const [text1, text2] = await Promise.all([
      sub1.content || this.extractText(sub1.fileUrl || sub1.fileName, sub1.fileType),
      sub2.content || this.extractText(sub2.fileUrl || sub2.fileName, sub2.fileType),
    ]);

    // Compute pairwise TF-IDF vectors
    const docs = [
      { id: sub1._id.toString(), text: text1 },
      { id: sub2._id.toString(), text: text2 },
    ];

    const { vectors } = this.generateTfIdfVectors(docs);
    const vector1 = vectors.get(sub1._id.toString());
    const vector2 = vectors.get(sub2._id.toString());

    const similarityScore = this.calculateCosineSimilarity(vector1, vector2);
    const riskLevel = this.classifyRisk(similarityScore);
    const commonPhrases = this.extractCommonPhrases(text1, text2, 3);

    return {
      assignment: sub1.assignment,
      similarityScore,
      riskLevel,
      commonPhrases,
      submission1: {
        _id: sub1._id,
        student: sub1.student,
        submittedAt: sub1.submittedAt,
        fileName: sub1.fileName,
        fileUrl: sub1.fileUrl,
        fileType: sub1.fileType,
        version: sub1.version,
        text: text1,
      },
      submission2: {
        _id: sub2._id,
        student: sub2.student,
        submittedAt: sub2.submittedAt,
        fileName: sub2.fileName,
        fileUrl: sub2.fileUrl,
        fileType: sub2.fileType,
        version: sub2.version,
        text: text2,
      },
      disclaimer:
        'Similarity does not automatically indicate plagiarism. Common phrases, references, templates, and legitimate collaboration can contribute to similarity.',
    };
  }

  /**
   * 9. Scan and update similarity across ALL submissions for a given assignment
   * Persists results in MongoDB so every page load doesn't re-calculate.
   * @param {string} assignmentId
   * @returns {Promise<{ scannedCount: number, updatedSubmissions: Array }>}
   */
  async scanAssignmentSimilarity(assignmentId) {
    const submissions = await Submission.find({
      $or: [{ assignment: assignmentId }, { assignmentId: assignmentId }],
    })
      .populate('student', 'fullName email studentId department')
      .populate('assignment', 'title subject');

    if (submissions.length === 0) {
      return { scannedCount: 0, updatedSubmissions: [] };
    }

    if (submissions.length === 1) {
      const single = submissions[0];
      single.similarityScore = 0;
      single.similarityStatus = 'low';
      single.highestSimilarSubmission = null;
      single.matchedStudent = null;
      await single.save();
      return { scannedCount: 1, updatedSubmissions: [single] };
    }

    // Step A: Ensure text content is extracted for all submissions
    const docList = [];
    for (const sub of submissions) {
      let text = sub.content;
      if (!text || text.trim().length === 0) {
        text = await this.extractText(sub.fileUrl || sub.fileName, sub.fileType);
        if (text) {
          sub.content = text;
          await sub.save();
        }
      }
      docList.push({ id: sub._id.toString(), text: text || sub.comment || sub.fileName || 'coursework deliverable' });
    }

    // Step B: Generate TF-IDF vectors for the assignment's document cohort
    const { vectors } = this.generateTfIdfVectors(docList);

    // Step C: Pairwise comparison matrix
    const maxScores = new Map(); // subId -> { maxScore, highestSubId, matchedStudentId }

    submissions.forEach((sub) => {
      maxScores.set(sub._id.toString(), {
        maxScore: 0,
        highestSubId: null,
        matchedStudentId: null,
      });
    });

    for (let i = 0; i < submissions.length; i++) {
      for (let j = i + 1; j < submissions.length; j++) {
        const subA = submissions[i];
        const subB = submissions[j];
        const idA = subA._id.toString();
        const idB = subB._id.toString();

        const vecA = vectors.get(idA);
        const vecB = vectors.get(idB);

        const score = this.calculateCosineSimilarity(vecA, vecB);
        const risk = this.classifyRisk(score);

        // Update maximum score for subA
        const currentA = maxScores.get(idA);
        if (score > currentA.maxScore) {
          maxScores.set(idA, {
            maxScore: score,
            highestSubId: subB._id,
            matchedStudentId: subB.student?._id || subB.student,
          });
        }

        // Update maximum score for subB
        const currentB = maxScores.get(idB);
        if (score > currentB.maxScore) {
          maxScores.set(idB, {
            maxScore: score,
            highestSubId: subA._id,
            matchedStudentId: subA.student?._id || subA.student,
          });
        }

        // Extract common phrases if score is notable (> 15%)
        const commonPhrases = score >= 15
          ? this.extractCommonPhrases(
              docList.find((d) => d.id === idA)?.text,
              docList.find((d) => d.id === idB)?.text,
              3
            )
          : [];

        // Upsert SimilarityReport pairwise record
        const report = await SimilarityReport.findOneAndUpdate(
          {
            $or: [
              { submission1: subA._id, submission2: subB._id },
              { submission1: subB._id, submission2: subA._id },
            ],
          },
          {
            assignment: assignmentId,
            submission1: subA._id,
            submission2: subB._id,
            student1: subA.student?._id || subA.student,
            student2: subB.student?._id || subB.student,
            similarityScore: score,
            riskLevel: risk,
            commonPhrases,
            calculatedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        // If high / very high risk, notify assignment instructor
        if (score >= 50) {
          try {
            const notificationService = require('./notificationService');
            const targetAssignment = subA.assignment;
            const teacherId = targetAssignment?.teacherId?._id || targetAssignment?.teacherId;
            if (teacherId) {
              notificationService.notifyHighSimilarity(report, targetAssignment, teacherId).catch(() => {});
            }
          } catch {
            // Ignore notification error
          }
        }
      }
    }

    // Step D: Update primary Submission records with calculated max similarities
    const updatedSubmissions = [];
    for (const sub of submissions) {
      const matchData = maxScores.get(sub._id.toString());
      if (matchData) {
        sub.similarityScore = matchData.maxScore;
        sub.similarityStatus = this.classifyRisk(matchData.maxScore);
        sub.highestSimilarSubmission = matchData.highestSubId;
        sub.matchedStudent = matchData.matchedStudentId;
        await sub.save();
        updatedSubmissions.push(sub);
      }
    }

    return {
      scannedCount: submissions.length,
      updatedSubmissions,
    };
  }
}

module.exports = new SimilarityService();
