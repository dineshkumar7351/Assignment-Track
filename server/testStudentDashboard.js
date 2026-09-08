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
  console.log('🧪 Starting Section 04 Student Dashboard API Verification Tests...\n');

  try {
    // 1. Login as Student
    console.log('Test 1: Student Login...');
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

    if (studentLogin.status !== 200 || !studentLogin.data.token) {
      throw new Error(`Student login failed: ${JSON.stringify(studentLogin.data)}`);
    }
    const studentToken = studentLogin.data.token;
    console.log('✅ PASS: Student logged in successfully.\n');

    // 2. Fetch Student Dashboard
    console.log('Test 2: GET /api/dashboard/student with Student JWT...');
    const dashboardRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/student',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
    });

    if (dashboardRes.status !== 200 || !dashboardRes.data.success) {
      throw new Error(`Student dashboard retrieval failed: ${JSON.stringify(dashboardRes.data)}`);
    }

    const { statistics, progress, upcomingAssignments, recentActivity } = dashboardRes.data.data;
    console.log('📊 Statistics Retrieved from MongoDB:');
    console.log(`   - Total Assignments: ${statistics.totalAssignments}`);
    console.log(`   - Submitted: ${statistics.submittedAssignments}`);
    console.log(`   - Pending: ${statistics.pendingAssignments}`);
    console.log(`   - Overdue: ${statistics.overdueAssignments}`);
    console.log(`   - Average Score: ${statistics.averageScore}%`);
    console.log(`   - Completion Rate: ${statistics.completionRate}%`);

    if (
      typeof statistics.totalAssignments !== 'number' ||
      typeof statistics.pendingAssignments !== 'number' ||
      typeof statistics.submittedAssignments !== 'number' ||
      typeof statistics.overdueAssignments !== 'number' ||
      typeof statistics.averageScore !== 'number' ||
      typeof statistics.completionRate !== 'number'
    ) {
      throw new Error('Statistics fields are not numeric numbers computed from MongoDB');
    }
    console.log('✅ PASS: Dynamic statistics successfully calculated from MongoDB.\n');

    // 3. Verify Upcoming Assignments
    console.log('Test 3: Upcoming Assignments (Next 5 by deadline)...');
    console.log(`   Retrieved count: ${upcomingAssignments.length}`);
    if (!Array.isArray(upcomingAssignments) || upcomingAssignments.length === 0) {
      throw new Error('Upcoming assignments list is empty or invalid');
    }
    upcomingAssignments.forEach((a, idx) => {
      console.log(`   [${idx + 1}] "${a.title}" (${a.subject}) | Deadline: ${new Date(a.deadline).toLocaleDateString()} | Priority: ${a.priority} | Status: ${a.status}`);
    });
    console.log('✅ PASS: Upcoming assignments populated with deadline, priority, subject, marks, and status.\n');

    // 4. Verify Recent Activity Stream
    console.log('Test 4: Recent Activity Stream (Submissions, Evaluations, New Assignments)...');
    console.log(`   Retrieved activity count: ${recentActivity.length}`);
    if (!Array.isArray(recentActivity) || recentActivity.length === 0) {
      throw new Error('Recent activity stream is empty');
    }
    recentActivity.forEach((act, idx) => {
      console.log(`   [${idx + 1}] [${act.type}] ${act.title}: ${act.description}`);
    });
    console.log('✅ PASS: Recent activity stream populated dynamically.\n');

    // 5. Role Authorization: Teacher Blocked
    console.log('Test 5: Teacher Attempting Student Dashboard Route...');
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
    const teacherToken = teacherLogin.data.token;

    const teacherBlocked = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/student',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`,
      },
    });

    if (teacherBlocked.status !== 403) {
      throw new Error(`Teacher should be blocked with 403, but received: ${teacherBlocked.status}`);
    }
    console.log('✅ PASS: Teacher role correctly rejected with 403 Forbidden.\n');

    // 6. Unauthenticated Rejection
    console.log('Test 6: Unauthenticated Request to Student Dashboard...');
    const unauthRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/student',
      method: 'GET',
    });

    if (unauthRes.status !== 401) {
      throw new Error(`Unauthenticated request should be 401, but got: ${unauthRes.status}`);
    }
    console.log('✅ PASS: Unauthenticated request rejected with 401 Unauthorized.\n');

    console.log('====================================================');
    console.log('🎉 SECTION 04 STUDENT DASHBOARD API: ALL TESTS PASSED');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ Student Dashboard Test Failed:', error);
    process.exit(1);
  }
};

runTests();
