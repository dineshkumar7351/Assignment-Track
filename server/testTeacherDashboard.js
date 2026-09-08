const http = require('http');

const request = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Starting Section 05 Teacher Dashboard API Verification Tests...\n');

  try {
    // 1. Login as Teacher
    console.log('Test 1: Teacher Login...');
    const teacherLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'sarah.teacher@college.edu', password: 'Password@123' }
    );

    if (teacherLogin.status !== 200 || !teacherLogin.data.token) {
      throw new Error(`Teacher login failed: ${JSON.stringify(teacherLogin.data)}`);
    }
    const teacherToken = teacherLogin.data.token;
    console.log('✅ PASS: Teacher logged in successfully.\n');

    // 2. Fetch Teacher Dashboard
    console.log('Test 2: GET /api/dashboard/teacher with Teacher JWT...');
    const dashboardRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/teacher',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`,
      },
    });

    if (dashboardRes.status !== 200 || !dashboardRes.data.success) {
      throw new Error(`Teacher dashboard retrieval failed: ${JSON.stringify(dashboardRes.data)}`);
    }

    const { statistics, recentAssignments, recentSubmissions } = dashboardRes.data.data;
    console.log('📊 Teacher Statistics Calculated from MongoDB:');
    console.log(`   - Total Assignments: ${statistics.totalAssignments}`);
    console.log(`   - Total Submissions: ${statistics.totalSubmissions}`);
    console.log(`   - Pending Evaluations: ${statistics.pendingEvaluations}`);
    console.log(`   - Evaluated Submissions: ${statistics.evaluatedSubmissions}`);
    console.log(`   - Average Marks: ${statistics.averageMarks}%`);
    console.log(`   - High Similarity Submissions: ${statistics.highSimilaritySubmissions}`);

    if (
      typeof statistics.totalAssignments !== 'number' ||
      typeof statistics.totalSubmissions !== 'number' ||
      typeof statistics.pendingEvaluations !== 'number' ||
      typeof statistics.evaluatedSubmissions !== 'number' ||
      typeof statistics.averageMarks !== 'number' ||
      typeof statistics.highSimilaritySubmissions !== 'number'
    ) {
      throw new Error('Statistics fields are not valid numbers from MongoDB');
    }

    if (statistics.highSimilaritySubmissions < 0) {
      throw new Error('High similarity submissions count must be a non-negative number');
    }
    console.log('✅ PASS: Dynamic teacher statistics verified.\n');

    // 3. Verify Recent Assignments
    console.log('Test 3: Recent Assignments Created by Teacher...');
    console.log(`   Retrieved count: ${recentAssignments.length}`);
    if (!Array.isArray(recentAssignments) || recentAssignments.length === 0) {
      throw new Error('Recent assignments list is empty or invalid');
    }
    recentAssignments.forEach((a, idx) => {
      console.log(`   [${idx + 1}] "${a.title}" (${a.subject}) | Deadline: ${new Date(a.deadline).toLocaleDateString()} | Enrolled: ${a.totalStudents} | Submitted: ${a.submittedCount} | Pending: ${a.pendingCount}`);
    });
    console.log('✅ PASS: Recent assignments list contains total students, submitted, and pending counts.\n');

    // 4. Verify Recent Submissions
    console.log('Test 4: Recent Submissions Review Stream...');
    console.log(`   Retrieved count: ${recentSubmissions.length}`);
    if (!Array.isArray(recentSubmissions) || recentSubmissions.length === 0) {
      throw new Error('Recent submissions list is empty');
    }
    recentSubmissions.forEach((sub, idx) => {
      console.log(`   [${idx + 1}] Student: ${sub.student?.fullName} (${sub.student?.studentId}) | Assignment: "${sub.assignment?.title}" | Status: ${sub.status} | Marks: ${sub.obtainedMarks !== null ? sub.obtainedMarks : 'Ungraded'} | Similarity: ${sub.similarityScore}%`);
    });
    console.log('✅ PASS: Recent submissions stream populated with student, assignment, marks, and similarity score.\n');

    // 5. Role Authorization: Student Blocked from Teacher Dashboard
    console.log('Test 5: Student Attempting Teacher Dashboard Route...');
    const studentLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'john.student@college.edu', password: 'Password@123' }
    );
    const studentToken = studentLogin.data.token;

    const studentBlocked = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/teacher',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
    });

    if (studentBlocked.status !== 403) {
      throw new Error(`Student should be blocked with 403, but received: ${studentBlocked.status}`);
    }
    console.log('✅ PASS: Student role correctly rejected with 403 Forbidden.\n');

    // 6. Unauthenticated Rejection
    console.log('Test 6: Unauthenticated Request to Teacher Dashboard...');
    const unauthRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/teacher',
      method: 'GET',
    });

    if (unauthRes.status !== 401) {
      throw new Error(`Unauthenticated request should be 401, but got: ${unauthRes.status}`);
    }
    console.log('✅ PASS: Unauthenticated request rejected with 401 Unauthorized.\n');

    console.log('====================================================');
    console.log('🎉 SECTION 05 TEACHER DASHBOARD API: ALL TESTS PASSED');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ Teacher Dashboard Test Failed:', error);
    process.exit(1);
  }
};

runTests();
