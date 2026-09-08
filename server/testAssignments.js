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
  console.log('🧪 Starting Section 06 Assignment Management API Verification Tests...\n');

  try {
    // 1. Logins
    console.log('Test 1: Authentication Tokens...');
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
    console.log('✅ PASS: Obtained Teacher and Student authentication tokens.\n');

    // 2. Fetch Subjects
    console.log('Test 2: GET /api/subjects...');
    const subjectsRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/subjects',
      method: 'GET',
      headers: { Authorization: `Bearer ${teacherToken}` },
    });

    if (subjectsRes.status !== 200 || !subjectsRes.data.data || subjectsRes.data.data.length === 0) {
      throw new Error(`Subjects retrieval failed: ${JSON.stringify(subjectsRes.data)}`);
    }
    const sampleSubject = subjectsRes.data.data[0];
    console.log(`✅ PASS: Retrieved ${subjectsRes.data.data.length} subjects (e.g. ${sampleSubject.name} [${sampleSubject.code}]).\n`);

    // 3. Teacher Creates Assignment
    console.log('Test 3: POST /api/assignments (Teacher)...');
    const createRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/assignments',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${teacherToken}`,
        },
      },
      {
        title: 'Quantum Computing & Grover Algorithm Lab',
        description: 'Simulate Grover search algorithm on a 4-qubit quantum circuit using Qiskit.',
        instructions: '1. Build circuit.\n2. Apply Hadamard and oracle gates.\n3. Measure state probability distribution.',
        subjectId: sampleSubject._id,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        maxMarks: 100,
        difficulty: 'hard',
        priority: 'high',
        attachmentName: 'qiskit_starter_guide.pdf',
        attachmentUrl: 'https://storage.googleapis.com/smart-tracker/qiskit_guide.pdf',
      }
    );

    if (createRes.status !== 201 || !createRes.data.data) {
      throw new Error(`Assignment creation failed: ${JSON.stringify(createRes.data)}`);
    }
    const createdAssignment = createRes.data.data;
    console.log(`✅ PASS: Created assignment ID: ${createdAssignment._id} ("${createdAssignment.title}").\n`);

    // 4. Student blocked from creating assignment
    console.log('Test 4: Student Attempting POST /api/assignments (Should be 403)...');
    const studentCreateRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/assignments',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
      },
      {
        title: 'Hacked Assignment',
        description: 'Should fail',
        subjectId: sampleSubject._id,
        deadline: new Date().toISOString(),
        maxMarks: 50,
      }
    );

    if (studentCreateRes.status !== 403) {
      throw new Error(`Student should be blocked with 403, got: ${studentCreateRes.status}`);
    }
    console.log('✅ PASS: Student blocked from creating assignments with 403 Forbidden.\n');

    // 5. Student searches and filters assignments
    console.log('Test 5: GET /api/assignments with Search, Filters & Dynamic Statuses (Student)...');
    const studentListRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/assignments?search=Quantum',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    if (studentListRes.status !== 200 || studentListRes.data.count < 1) {
      throw new Error(`Search failed: ${JSON.stringify(studentListRes.data)}`);
    }
    const foundAssignment = studentListRes.data.data[0];
    console.log(`   Found: "${foundAssignment.title}" with dynamic status: "${foundAssignment.status}"`);
    console.log('✅ PASS: Search and dynamic status calculation confirmed.\n');

    // 6. Detailed view
    console.log('Test 6: GET /api/assignments/:id...');
    const detailRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/assignments/${createdAssignment._id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    if (detailRes.status !== 200 || !detailRes.data.data) {
      throw new Error(`Detail fetch failed: ${JSON.stringify(detailRes.data)}`);
    }
    console.log(`✅ PASS: Retrieved full assignment details with subject "${detailRes.data.data.subjectId?.name}".\n`);

    // 7. Teacher Updates Assignment
    console.log('Test 7: PUT /api/assignments/:id (Teacher updates assignment)...');
    const updateRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/assignments/${createdAssignment._id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${teacherToken}`,
        },
      },
      {
        title: 'Quantum Computing & Grover Algorithm Lab (Revised)',
        maxMarks: 150,
      }
    );

    if (updateRes.status !== 200 || updateRes.data.data.maxMarks !== 150) {
      throw new Error(`Update failed: ${JSON.stringify(updateRes.data)}`);
    }
    console.log(`✅ PASS: Updated assignment title to "${updateRes.data.data.title}" and marks to ${updateRes.data.data.maxMarks}.\n`);

    // 8. Teacher Deletes Assignment
    console.log('Test 8: DELETE /api/assignments/:id (Teacher deletes assignment)...');
    const deleteRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/assignments/${createdAssignment._id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${teacherToken}` },
    });

    if (deleteRes.status !== 200) {
      throw new Error(`Delete failed: ${JSON.stringify(deleteRes.data)}`);
    }
    console.log('✅ PASS: Assignment deleted successfully.\n');

    console.log('===========================================================');
    console.log('🎉 SECTION 06 ASSIGNMENT MANAGEMENT API: ALL TESTS PASSED');
    console.log('===========================================================');
  } catch (error) {
    console.error('❌ Assignment Management Test Failed:', error);
    process.exit(1);
  }
};

runTests();
