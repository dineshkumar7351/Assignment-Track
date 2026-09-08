const http = require('http');
const fs = require('fs');
const path = require('path');

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

// Helper to make Multipart form upload request
const uploadRequest = (options, fields, fileInfo) => {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
    const headers = {
      ...options.headers,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    };

    const req = http.request({ ...options, headers }, (res) => {
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

    // Build multipart body
    let payload = '';
    for (const [key, val] of Object.entries(fields)) {
      payload += `--${boundary}\r\n`;
      payload += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
      payload += `${val}\r\n`;
    }

    payload += `--${boundary}\r\n`;
    payload += `Content-Disposition: form-data; name="file"; filename="${fileInfo.filename}"\r\n`;
    payload += `Content-Type: ${fileInfo.contentType || 'application/pdf'}\r\n\r\n`;

    req.write(Buffer.from(payload));
    req.write(fileInfo.content);
    req.write(Buffer.from(`\r\n--${boundary}--\r\n`));
    req.end();
  });
};

const runSubmissionTests = async () => {
  console.log('🧪 Starting Section 07 Assignment Submission Verification Tests...\n');

  try {
    // 1. Logins
    console.log('Test 1: User Logins...');
    const student1Login = await jsonRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'john.student@college.edu', password: 'Password@123' }
    );
    const student1Token = student1Login.data.token;

    const student2Login = await jsonRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'emily.davis@college.edu', password: 'Password@123' }
    );
    const student2Token = student2Login.data.token;

    const teacherLogin = await jsonRequest(
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
    console.log('✅ PASS: Obtained Student 1, Student 2, and Teacher tokens.\n');

    // 2. Fetch or Create Active Assignment for Teacher
    console.log('Test 2: Locating an active assignment for teacher...');
    const assignmentsRes = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/assignments',
      method: 'GET',
      headers: { Authorization: `Bearer ${student1Token}` },
    });

    let activeAssignment = (assignmentsRes.data?.data || []).find(
      (a) => (a.teacherId === teacherLogin.data?.user?._id || a.teacher?._id === teacherLogin.data?.user?._id || a.teacher?.email === 'sarah.teacher@college.edu') && new Date(a.deadline) > new Date()
    );

    if (!activeAssignment) {
      const subjectsRes = await jsonRequest({
        hostname: 'localhost',
        port: 5000,
        path: '/api/subjects',
        method: 'GET',
        headers: { Authorization: `Bearer ${teacherToken}` },
      });
      const subject = subjectsRes.data?.data?.[0];

      const createRes = await jsonRequest(
        {
          hostname: 'localhost',
          port: 5000,
          path: '/api/assignments',
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${teacherToken}` },
        },
        {
          title: 'Section 07 Submission Test Lab',
          description: 'Deliverable for verifying versioning and submissions.',
          subjectId: subject?._id,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          maxMarks: 100,
          difficulty: 'medium',
          department: 'Computer Science & Engineering',
          status: 'published',
        }
      );
      activeAssignment = createRes.data?.data || createRes.data;
    }

    if (!activeAssignment || !activeAssignment._id) {
      throw new Error('No active assignment with future deadline found');
    }
    console.log(`✅ PASS: Selected active assignment "${activeAssignment.title}" (ID: ${activeAssignment._id})\n`);

    // 3. First Submission (Version 1)
    console.log('Test 3: POST /api/submissions/:assignmentId (Version 1 Upload)...');
    const dummyPdfContent = Buffer.from('%PDF-1.4 Mock PDF Content for Section 07 Test');
    const sub1Res = await uploadRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/submissions/${activeAssignment._id}`,
        method: 'POST',
        headers: { Authorization: `Bearer ${student1Token}` },
      },
      { comment: 'First iteration submission with preliminary results' },
      { filename: 'research_deliverable_v1.pdf', contentType: 'application/pdf', content: dummyPdfContent }
    );

    if (sub1Res.status !== 200 || !sub1Res.data.success) {
      throw new Error(`Upload v1 failed: ${JSON.stringify(sub1Res.data)}`);
    }

    const createdSub = sub1Res.data.data;
    console.log(`✅ PASS: Uploaded Version ${createdSub.version} successfully!`);
    console.log(`   File: ${createdSub.fileName} (${createdSub.fileType}) -> URL: ${createdSub.fileUrl}`);
    console.log(`   Versions stored: ${createdSub.versions?.length}\n`);

    // 4. Resubmission (Version 2)
    console.log('Test 4: Resubmission before deadline (Version 2 Upload)...');
    const dummyDocxContent = Buffer.from('PK\x03\x04 Mock DOCX Content for Section 07 Test Revision');
    const sub2Res = await uploadRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/submissions/${activeAssignment._id}`,
        method: 'POST',
        headers: { Authorization: `Bearer ${student1Token}` },
      },
      { comment: 'Updated with full benchmarks and optimizer graphs' },
      {
        filename: 'research_deliverable_v2.docx',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content: dummyDocxContent,
      }
    );

    const expectedV2 = sub1Res.data.data.version + 1;
    if (sub2Res.status !== 200 || sub2Res.data.data.version !== expectedV2) {
      throw new Error(`Upload v2 failed: ${JSON.stringify(sub2Res.data)}`);
    }

    const updatedSub = sub2Res.data.data;
    console.log(`✅ PASS: Resubmitted as Version ${updatedSub.version}!`);
    console.log(`   Latest Current File: ${updatedSub.fileName}`);
    console.log(`   Preserved Historical Versions: ${updatedSub.versions?.length}`);
    updatedSub.versions.forEach((v) => {
      console.log(`     - Version ${v.version}: ${v.fileName} [isCurrent: ${v.isCurrent}] | "${v.comment}"`);
    });
    console.log('');

    // 5. Student Views Their Submission & History
    console.log('Test 5: GET /api/submissions/assignment/:assignmentId (Student View)...');
    const viewRes = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/submissions/assignment/${activeAssignment._id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${student1Token}` },
    });

    if (viewRes.status !== 200 || !viewRes.data.data) {
      throw new Error(`Student view failed: ${JSON.stringify(viewRes.data)}`);
    }
    console.log(`✅ PASS: Student fetched submission with ${viewRes.data.data.versions.length} versions.\n`);

    // 6. Teacher Views Submissions with Filter
    console.log('Test 6: GET /api/submissions/teacher (Teacher Portal)...');
    const teacherSubRes = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/submissions/teacher?assignmentId=${activeAssignment._id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${teacherToken}` },
    });

    if (teacherSubRes.status !== 200 || teacherSubRes.data.count < 1) {
      throw new Error(`Teacher submissions fetch failed: ${JSON.stringify(teacherSubRes.data)}`);
    }
    const foundSub = teacherSubRes.data.data.find((s) => s.student?.email === 'john.student@college.edu');
    if (!foundSub) {
      throw new Error('Teacher could not find student submission in list');
    }
    console.log(`✅ PASS: Teacher retrieved submission from student ${foundSub.student?.fullName} (Version ${foundSub.version}).\n`);

    // 7. Security Test: Student 2 blocked from viewing Student 1's submission
    console.log("Test 7: Security - Student 2 attempting to view Student 1's submission (Should be 403)...");
    const securityRes = await jsonRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/submissions/${updatedSub._id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${student2Token}` },
    });

    if (securityRes.status !== 403) {
      throw new Error(`Security failed: Student 2 got status ${securityRes.status} instead of 403 Forbidden`);
    }
    console.log('✅ PASS: Unauthorized cross-student access successfully blocked with 403 Forbidden.\n');

    // 8. Deadline Test: Submitting to overdue assignment blocked
    console.log('Test 8: Submitting to overdue assignment (Should be 400)...');
    const overdueAssignment = assignmentsRes.data.data.find(
      (a) => new Date(a.deadline) < new Date()
    );

    if (overdueAssignment) {
      const overdueSubRes = await uploadRequest(
        {
          hostname: 'localhost',
          port: 5000,
          path: `/api/submissions/${overdueAssignment._id}`,
          method: 'POST',
          headers: { Authorization: `Bearer ${student1Token}` },
        },
        { comment: 'Late attempt' },
        { filename: 'late.pdf', contentType: 'application/pdf', content: dummyPdfContent }
      );

      if (overdueSubRes.status !== 400) {
        throw new Error(`Overdue submission should fail with 400, got ${overdueSubRes.status}`);
      }
      console.log(`✅ PASS: Submission past deadline correctly rejected with 400 (${overdueSubRes.data.message}).\n`);
    }

    console.log('===========================================================');
    console.log('🎉 SECTION 07 ASSIGNMENT SUBMISSION: ALL TESTS PASSED');
    console.log('===========================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Submission Verification Failed:', error);
    process.exit(1);
  }
};

runSubmissionTests();
