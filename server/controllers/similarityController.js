const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const SimilarityReport = require('../models/SimilarityReport');
const similarityService = require('../services/similarityService');

const DISCLAIMER_TEXT =
  'Similarity does not automatically indicate plagiarism. Common phrases, references, templates, and legitimate collaboration can contribute to similarity.';

/**
 * @desc    Get overall similarity metrics & submission risk records across teacher's assignments
 * @route   GET /api/similarity/teacher
 * @access  Private (Teacher or Admin only)
 */
const getTeacherSimilarityOverview = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { assignmentId, risk, search } = req.query;

    // 1. Fetch teacher's assignments
    const teacherAssignQuery = req.user.role === 'admin' ? {} : { teacherId };
    if (assignmentId) {
      teacherAssignQuery._id = assignmentId;
    }

    const teacherAssignments = await Assignment.find(teacherAssignQuery).select('_id title subject');
    const teacherAssignmentIds = teacherAssignments.map((a) => a._id);

    // 2. Fetch submissions for these assignments
    const subQuery = {
      $or: [
        { assignment: { $in: teacherAssignmentIds } },
        { assignmentId: { $in: teacherAssignmentIds } },
      ],
    };

    if (risk && risk !== 'all') {
      subQuery.similarityStatus = risk.toLowerCase();
    }

    let submissions = await Submission.find(subQuery)
      .populate('student', 'fullName email studentId department')
      .populate('matchedStudent', 'fullName email studentId department')
      .populate('highestSimilarSubmission', 'fileName submittedAt')
      .populate({
        path: 'assignment',
        populate: { path: 'subjectId', select: 'name code' },
      })
      .sort({ similarityScore: -1, submittedAt: -1 })
      .lean();

    // 3. Optional search filtering by student name/ID or assignment title
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      submissions = submissions.filter(
        (s) =>
          s.student?.fullName?.toLowerCase().includes(term) ||
          s.student?.studentId?.toLowerCase().includes(term) ||
          s.assignment?.title?.toLowerCase().includes(term)
      );
    }

    // 4. Compute dynamic live metrics
    let totalSubmissions = 0;
    let lowSimilarity = 0;
    let mediumSimilarity = 0;
    let highSimilarity = 0;
    let veryHighSimilarity = 0;
    let sumSimilarity = 0;

    // Fetch all raw submissions for these teacher assignments to compute complete metrics
    const allTeacherSubs = await Submission.find({
      $or: [
        { assignment: { $in: teacherAssignmentIds } },
        { assignmentId: { $in: teacherAssignmentIds } },
      ],
    }).select('similarityScore similarityStatus');

    allTeacherSubs.forEach((sub) => {
      totalSubmissions++;
      const score = typeof sub.similarityScore === 'number' ? sub.similarityScore : 0;
      sumSimilarity += score;

      const riskClass = sub.similarityStatus || similarityService.classifyRisk(score);
      if (riskClass === 'low' || score <= 20) lowSimilarity++;
      else if (riskClass === 'medium' || score <= 50) mediumSimilarity++;
      else if (riskClass === 'high' || score <= 75) highSimilarity++;
      else veryHighSimilarity++;
    });

    const averageSimilarity =
      totalSubmissions > 0 ? Math.round((sumSimilarity / totalSubmissions) * 10) / 10 : 0;

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalSubmissions,
          lowSimilarity,
          mediumSimilarity,
          highSimilarity,
          veryHighSimilarity,
          highRiskTotal: highSimilarity + veryHighSimilarity,
          averageSimilarity,
        },
        submissions,
        teacherAssignments,
        disclaimer: DISCLAIMER_TEXT,
      },
    });
  } catch (error) {
    console.error('Error in getTeacherSimilarityOverview:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving similarity overview',
      error: error.message,
    });
  }
};

/**
 * @desc    Compare two submissions side-by-side
 * @route   GET /api/similarity/compare/:id1/:id2
 * @access  Private (Teacher assigned to assignment or Admin only)
 */
const compareSubmissions = async (req, res) => {
  try {
    const { id1, id2 } = req.params;

    if (!id1 || !id2) {
      return res.status(400).json({
        success: false,
        message: 'Both submission IDs are required for comparison',
      });
    }

    // 1. Fetch submission 1 to check teacher permissions
    const sub1 = await Submission.findById(id1).populate('assignment');
    if (!sub1) {
      return res.status(404).json({
        success: false,
        message: 'First submission not found',
      });
    }

    const assignment = sub1.assignment;
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Associated assignment not found',
      });
    }

    // 2. Authorization check: Teacher must own assignment, or Admin
    const isTeacherOwner =
      assignment.teacherId?.toString() === req.user._id.toString() ||
      assignment.teacher?.toString() === req.user._id.toString();

    if (!isTeacherOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have authorization to view this comparison',
      });
    }

    // 3. Perform comparison analysis
    const comparison = await similarityService.compareSubmissions(id1, id2);

    return res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error in compareSubmissions:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error comparing submissions',
    });
  }
};

/**
 * @desc    Trigger on-demand batch similarity scan for all submissions of an assignment
 * @route   POST /api/similarity/scan/:assignmentId
 * @access  Private (Teacher assigned to assignment or Admin only)
 */
const scanAssignmentSimilarity = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Authorization check
    const isTeacherOwner =
      assignment.teacherId?.toString() === req.user._id.toString() ||
      assignment.teacher?.toString() === req.user._id.toString();

    if (!isTeacherOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have authorization to scan this assignment',
      });
    }

    const result = await similarityService.scanAssignmentSimilarity(assignmentId);

    return res.status(200).json({
      success: true,
      message: `Successfully analyzed textual similarity across ${result.scannedCount} submissions`,
      data: result,
    });
  } catch (error) {
    console.error('Error in scanAssignmentSimilarity:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error scanning assignment similarity',
    });
  }
};

module.exports = {
  getTeacherSimilarityOverview,
  compareSubmissions,
  scanAssignmentSimilarity,
};
