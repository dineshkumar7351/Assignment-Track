const http = require('http');

// Helper to make JSON HTTP request
const jsonRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
};

const runTest = async () => {
  console.log('🧪 Starting Section 09 Textual Similarity Detection Automated Test Suite...\n');

  try {
    // 1. Authenticate Teacher
    console.log('1️⃣ Authenticating Teacher account (sarah.teacher@college.edu)...');
    const teacherLoginRes = await jsonRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: 'sarah.teacher@college.edu',
        password: 'Password@123',
      }
    );

    const teacherToken = teacherLoginRes.data?.token || teacherLoginRes.data?.data?.token;
    if (teacherLoginRes.status !== 200 || !teacherToken) {
      throw new Error(`Teacher login failed: ${JSON.stringify(teacherLoginRes.data)}`);
    }
    console.log('   ✅ Teacher authenticated successfully');

    // 2. Authenticate Student
    console.log('2️⃣ Authenticating Student account (john.student@college.edu)...');
    const studentLoginRes = await jsonRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: 'john.student@college.edu',
        password: 'Password@123',
      }
    );

    const studentToken = studentLoginRes.data?.token || studentLoginRes.data?.data?.token;
    if (studentLoginRes.status !== 200 || !studentToken) {
      throw new Error(`Student login failed: ${JSON.stringify(studentLoginRes.data)}`);
    }
    console.log('   ✅ Student authenticated successfully');

    // 3. Test Unit Similarity Service Calculations directly
    console.log('\n3️⃣ Testing SimilarityService TF-IDF & Cosine Similarity Math...');
    const similarityService = require('./services/similarityService');

    const textA = 'A database deadlock occurs when two transactions wait for locks held by each other in mutual exclusion.';
    const textB = 'A database deadlock happens when two transactions wait for locks held by each other in mutual exclusion mode.';
    const textC = 'Convolutional neural networks apply kernel filter matrices over images to extract high dimensional visual features.';

    const vectors = similarityService.generateTfIdfVectors([
      { id: 'docA', text: textA },
      { id: 'docB', text: textB },
      { id: 'docC', text: textC },
    ]);

    const simAB = similarityService.calculateCosineSimilarity(vectors.vectors.get('docA'), vectors.vectors.get('docB'));
    const simAC = similarityService.calculateCosineSimilarity(vectors.vectors.get('docA'), vectors.vectors.get('docC'));
    const commonAB = similarityService.extractCommonPhrases(textA, textB, 3);

    console.log(`   - Similarity A & B (High overlap): ${simAB}% -> Risk: ${similarityService.classifyRisk(simAB)}`);
    console.log(`   - Similarity A & C (Unrelated topics): ${simAC}% -> Risk: ${similarityService.classifyRisk(simAC)}`);
    console.log(`   - Common overlapping phrases: ${JSON.stringify(commonAB)}`);

    if (simAB < 60 || simAC > 20) {
      throw new Error(`TF-IDF cosine similarity calculations out of expected bounds (AB: ${simAB}%, AC: ${simAC}%)`);
    }
    console.log('   ✅ TF-IDF and Cosine similarity mathematical model verified');

    // 4. Test Risk Classification Thresholds
    console.log('\n4️⃣ Testing Risk Classification Thresholds according to requirements...');
    const risks = [
      { score: 10, expected: 'low' },
      { score: 20, expected: 'low' },
      { score: 35, expected: 'medium' },
      { score: 50, expected: 'medium' },
      { score: 65, expected: 'high' },
      { score: 75, expected: 'high' },
      { score: 85, expected: 'very_high' },
      { score: 100, expected: 'very_high' },
    ];

    risks.forEach(({ score, expected }) => {
      const actual = similarityService.classifyRisk(score);
      if (actual !== expected) {
        throw new Error(`Risk classification failed for score ${score}%: expected ${expected}, got ${actual}`);
      }
    });
    console.log('   ✅ All risk thresholds (0-20% Low, 21-50% Medium, 51-75% High, 76-100% Very High) passed');

    // 5. Test Batch Scan Endpoint: POST /api/similarity/scan/:assignmentId
    console.log('\n5️⃣ Testing Batch Cohort Scan: POST /api/similarity/scan/:assignmentId...');
    // Fetch teacher assignments to pick target
    const teacherSubs = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/submissions/teacher',
      method: 'GET',
      headers: { Authorization: `Bearer ${teacherToken}` },
    });

    const submissions = teacherSubs.data?.data || [];
    if (submissions.length === 0) {
      throw new Error('No teacher submissions found for testing');
    }

    const targetAssignmentId = submissions[0].assignment?._id || submissions[0].assignment;
    console.log(`   🎯 Selected Assignment ID: ${targetAssignmentId}`);

    const scanRes = await jsonRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/similarity/scan/${targetAssignmentId}`,
        method: 'POST',
        headers: { Authorization: `Bearer ${teacherToken}` },
      },
      {}
    );

    console.log(`   Response status: ${scanRes.status}`);
    if (scanRes.status !== 200 || !scanRes.data?.success) {
      throw new Error(`Batch similarity scan failed: ${JSON.stringify(scanRes.data)}`);
    }
    console.log(`   ✅ Batch scan successful: ${scanRes.data.message}`);

    // 6. Test Overview Endpoint: GET /api/similarity/teacher
    console.log('\n6️⃣ Testing Similarity Overview: GET /api/similarity/teacher...');
    const overviewRes = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/similarity/teacher',
      method: 'GET',
      headers: { Authorization: `Bearer ${teacherToken}` },
    });

    console.log(`   Response status: ${overviewRes.status}`);
    if (overviewRes.status !== 200 || !overviewRes.data?.success) {
      throw new Error(`GET /api/similarity/teacher failed: ${JSON.stringify(overviewRes.data)}`);
    }

    const { metrics, submissions: subList, disclaimer } = overviewRes.data.data;
    console.log('   ✅ Teacher Similarity Overview Data:');
    console.log(`      - Total Submissions: ${metrics.totalSubmissions}`);
    console.log(`      - Low Similarity: ${metrics.lowSimilarity}`);
    console.log(`      - Medium Similarity: ${metrics.mediumSimilarity}`);
    console.log(`      - High / Very High Similarity: ${metrics.highRiskTotal}`);
    console.log(`      - Average Similarity: ${metrics.averageSimilarity}%`);
    console.log(`      - Disclaimer: "${disclaimer}"`);

    // 7. Test Side-by-Side Comparison Endpoint: GET /api/similarity/compare/:id1/:id2
    console.log('\n7️⃣ Testing Side-by-Side Comparison: GET /api/similarity/compare/:id1/:id2...');
    if (subList.length >= 2) {
      const id1 = subList[0]._id;
      const id2 = subList[0].highestSimilarSubmission?._id || subList[1]._id;

      const compareRes = await jsonRequest({
        hostname: 'localhost',
        port: 5000,
        path: `/api/similarity/compare/${id1}/${id2}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${teacherToken}` },
      });

      console.log(`   Response status: ${compareRes.status}`);
      if (compareRes.status !== 200 || !compareRes.data?.success) {
        throw new Error(`GET /api/similarity/compare failed: ${JSON.stringify(compareRes.data)}`);
      }

      const compData = compareRes.data.data;
      console.log('   ✅ Comparison Data Retrieved:');
      console.log(`      - Student 1: ${compData.submission1?.student?.fullName}`);
      console.log(`      - Student 2: ${compData.submission2?.student?.fullName}`);
      console.log(`      - Similarity: ${compData.similarityScore}% (${compData.riskLevel} risk)`);
      console.log(`      - Common Phrases Count: ${compData.commonPhrases?.length}`);
    }

    // 8. Security Test: Student Forbidden from Similarity Endpoints
    console.log('\n8️⃣ Security Testing: Attempting student access to similarity endpoints...');
    const studentIllegalOverview = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/similarity/teacher',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    console.log(`   Overview status for student: ${studentIllegalOverview.status}`);
    if (studentIllegalOverview.status === 403) {
      console.log('   ✅ Security check passed: Student cannot access similarity overview (403 Forbidden)');
    } else {
      throw new Error(`Security violation: Student was not forbidden from similarity overview! Status: ${studentIllegalOverview.status}`);
    }

    console.log('\n🎉 ALL SECTION 09 SUBMISSION SIMILARITY DETECTION TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
  }
};

runTest();
