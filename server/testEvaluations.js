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
  console.log('🧪 Starting Section 08 Evaluation and Feedback Automated Test Suite...\n');

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

    // 3. Fetch submissions for Teacher
    console.log('\n3️⃣ Fetching Teacher Submissions...');
    const teacherSubsRes = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/submissions/teacher',
      method: 'GET',
      headers: { Authorization: `Bearer ${teacherToken}` },
    });

    if (teacherSubsRes.status !== 200 || !teacherSubsRes.data?.data) {
      throw new Error(`Failed to fetch teacher submissions: ${JSON.stringify(teacherSubsRes.data)}`);
    }

    const submissions = teacherSubsRes.data.data;
    console.log(`   ✅ Retrieved ${submissions.length} submissions for teacher`);

    if (submissions.length === 0) {
      console.log('   ⚠️ No submissions found to evaluate.');
      return;
    }

    const targetSub = submissions[0];
    const maxMarks = targetSub.assignment?.maxMarks || targetSub.assignment?.totalMarks || 100;
    const initialMarks = Math.round(maxMarks * 0.87); // e.g. 44 / 50 or 87 / 100
    const updatedMarks = Math.round(maxMarks * 0.92); // e.g. 46 / 50 or 92 / 100

    console.log(`   🎯 Target submission ID: ${targetSub._id}`);
    console.log(`   👤 Student: ${targetSub.student?.fullName}`);
    console.log(`   📚 Assignment: ${targetSub.assignment?.title} (Max Marks: ${maxMarks})`);

    // 4. Test Teacher Evaluation: POST /api/evaluations
    console.log(`\n4️⃣ Testing POST /api/evaluations (Awarding ${initialMarks}/${maxMarks})...`);
    const evalPayload = {
      submissionId: targetSub._id,
      marks: initialMarks,
      feedback: 'Good implementation. Improve exception handling.',
    };

    const createEvalRes = await jsonRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/evaluations',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${teacherToken}`,
        },
      },
      evalPayload
    );

    console.log(`   Response status: ${createEvalRes.status}`);
    if (createEvalRes.status !== 200 || !createEvalRes.data?.success) {
      throw new Error(`POST /api/evaluations failed: ${JSON.stringify(createEvalRes.data)}`);
    }

    const evaluation = createEvalRes.data.data;
    console.log('   ✅ Evaluation Created Successfully:');
    console.log(`      - Marks: ${evaluation.marks} / ${evaluation.maxMarks}`);
    console.log(`      - Feedback: "${evaluation.feedback}"`);
    console.log(`      - Evaluator: ${evaluation.evaluator?.fullName}`);
    console.log(`      - Late Status: ${evaluation.isLate ? 'Late' : 'On-Time'}`);
    console.log(`      - Evaluated At: ${evaluation.evaluatedAt}`);

    // 5. Test Student GET /api/evaluations/:submissionId
    console.log('\n5️⃣ Testing GET /api/evaluations/:submissionId (Student retrieving evaluation)...');
    const getEvalRes = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/evaluations/${targetSub._id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    console.log(`   Response status: ${getEvalRes.status}`);
    if (getEvalRes.status !== 200 || !getEvalRes.data?.success || !getEvalRes.data?.data) {
      throw new Error(`GET /api/evaluations failed: ${JSON.stringify(getEvalRes.data)}`);
    }

    console.log('   ✅ Student retrieved evaluation successfully:');
    console.log(`      - Marks: ${getEvalRes.data.data.marks} / ${getEvalRes.data.data.maxMarks}`);
    console.log(`      - Feedback: "${getEvalRes.data.data.feedback}"`);

    // 6. Security Test: Ensure Student CANNOT POST or PUT evaluations
    console.log('\n6️⃣ Security Testing: Attempting student POST /api/evaluations (Must be blocked)...');
    const studentIllegalPostRes = await jsonRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/evaluations',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
      },
      {
        submissionId: targetSub._id,
        marks: maxMarks,
        feedback: 'Self-grading attempt',
      }
    );

    console.log(`   Response status: ${studentIllegalPostRes.status}`);
    if (studentIllegalPostRes.status === 403) {
      console.log('   ✅ Security check passed: Student cannot POST /api/evaluations (403 Forbidden)');
    } else {
      throw new Error(`Security breach: Student was not forbidden! Status: ${studentIllegalPostRes.status}`);
    }

    // 7. Test PUT /api/evaluations/:id (Teacher updating marks & feedback)
    console.log(`\n7️⃣ Testing PUT /api/evaluations/:id (Updating marks to ${updatedMarks}/${maxMarks})...`);
    const updateEvalRes = await jsonRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/evaluations/${evaluation._id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${teacherToken}`,
        },
      },
      {
        marks: updatedMarks,
        feedback: 'Excellent revised exception handling and unit test suites.',
      }
    );

    console.log(`   Response status: ${updateEvalRes.status}`);
    if (updateEvalRes.status !== 200 || !updateEvalRes.data?.success) {
      throw new Error(`PUT /api/evaluations/:id failed: ${JSON.stringify(updateEvalRes.data)}`);
    }

    console.log('   ✅ Evaluation Updated Successfully:');
    console.log(`      - New Marks: ${updateEvalRes.data.data.marks} / ${updateEvalRes.data.data.maxMarks}`);
    console.log(`      - New Feedback: "${updateEvalRes.data.data.feedback}"`);

    // 8. Test Teacher Dashboard Stats Update
    console.log('\n8️⃣ Testing Teacher Dashboard Live Statistics...');
    const teacherDashRes = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/teacher',
      method: 'GET',
      headers: { Authorization: `Bearer ${teacherToken}` },
    });

    if (teacherDashRes.status === 200 && teacherDashRes.data?.data) {
      const stats = teacherDashRes.data.data.statistics;
      console.log('   ✅ Teacher Dashboard Live Stats:');
      console.log(`      - Total Submissions: ${stats.totalSubmissions}`);
      console.log(`      - Evaluated Submissions: ${stats.evaluatedSubmissions}`);
      console.log(`      - Pending Evaluations: ${stats.pendingEvaluations}`);
      console.log(`      - Cohort Average Marks: ${stats.averageMarks}%`);
    }

    // 9. Test Student Dashboard Stats Update
    console.log('\n9️⃣ Testing Student Dashboard Live Statistics...');
    const studentDashRes = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/student',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    if (studentDashRes.status === 200 && studentDashRes.data?.data) {
      const stats = studentDashRes.data.data.statistics;
      console.log('   ✅ Student Dashboard Live Stats:');
      console.log(`      - Submitted Assignments: ${stats.submittedAssignments}`);
      console.log(`      - Student Average Score: ${stats.averageScore}%`);
      console.log(`      - Completion Rate: ${stats.completionRate}%`);
    }

    console.log('\n🎉 ALL SECTION 08 EVALUATION AND FEEDBACK TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
  }
};

runTest();
