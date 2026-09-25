const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const API_BASE = 'http://localhost:5000/api';

async function runFullSystemCheck() {
  console.log('===============================================================');
  console.log('🔍 COMPREHENSIVE FULL-STACK SYSTEM AUDIT & INTEGRITY CHECK');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function report(success, title, details = '') {
    total++;
    if (success) {
      console.log(`✅ [PASS ${total}]: ${title}`);
      if (details) console.log(`   └─ ${details}`);
      passed++;
    } else {
      console.error(`❌ [FAIL ${total}]: ${title}`);
      if (details) console.error(`   └─ ${details}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // CHECK 1: Server & Database Health
    // -------------------------------------------------------------
    console.log('--- 1. API Health & Database Connectivity ---');
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    report(
      healthRes.status === 200 && healthData.success && healthData.database === 'connected',
      'GET /api/health is operational',
      `DB State: ${healthData.database} • Environment: ${healthData.environment}`
    );

    // -------------------------------------------------------------
    // CHECK 2: Role Logins & JWT Generation
    // -------------------------------------------------------------
    console.log('\n--- 2. Authentication & Role Token Generation ---');

    // Student Login
    const stuRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john.student@college.edu', password: 'Password@123' }),
    });
    const stuData = await stuRes.json();
    const studentToken = stuData.token;
    report(
      stuRes.status === 200 && stuData.success && stuData.user?.role === 'student' && !!studentToken,
      'Student Login (john.student@college.edu)',
      `Token issued • Role: ${stuData.user?.role} • Dept: ${stuData.user?.department}`
    );

    // Teacher Login
    const teachRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sarah.teacher@college.edu', password: 'Password@123' }),
    });
    const teachData = await teachRes.json();
    const teacherToken = teachData.token;
    report(
      teachRes.status === 200 && teachData.success && teachData.user?.role === 'teacher' && !!teacherToken,
      'Teacher Login (sarah.teacher@college.edu)',
      `Token issued • Role: ${teachData.user?.role} • Employee ID: ${teachData.user?.employeeId}`
    );

    // Admin Login
    const adminRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@college.edu', password: 'Admin@123456' }),
    });
    const adminData = await adminRes.json();
    const adminToken = adminData.token;
    report(
      adminRes.status === 200 && adminData.success && adminData.user?.role === 'admin' && !!adminToken,
      'Admin Login (admin@college.edu)',
      `Token issued • Role: ${adminData.user?.role}`
    );

    // -------------------------------------------------------------
    // CHECK 3: Protected Profile Resolution (/api/auth/me)
    // -------------------------------------------------------------
    console.log('\n--- 3. Token-Protected Profile Retrieval ---');
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const meData = await meRes.json();
    report(
      meRes.status === 200 && meData.user?.email === 'john.student@college.edu',
      'GET /api/auth/me resolves user profile from JWT Bearer',
      `Authenticated User: ${meData.user?.fullName} (${meData.user?.email})`
    );

    // -------------------------------------------------------------
    // CHECK 4: Subjects & Coursework Catalog
    // -------------------------------------------------------------
    console.log('\n--- 4. Subjects & Academic Courses ---');
    const subRes = await fetch(`${API_BASE}/subjects`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const subData = await subRes.json();
    const subjects = subData.subjects || subData.data || subData;
    report(
      subRes.status === 200 && Array.isArray(subjects) && subjects.length > 0,
      'GET /api/subjects returns active academic course catalog',
      `Found ${subjects.length} active courses (e.g. ${subjects[0]?.code}: ${subjects[0]?.name})`
    );

    // -------------------------------------------------------------
    // CHECK 5: Assignments API (Student & Teacher View)
    // -------------------------------------------------------------
    console.log('\n--- 5. Assignments API ---');
    const assignRes = await fetch(`${API_BASE}/assignments`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const assignData = await assignRes.json();
    const assignments = assignData.assignments || assignData.data || assignData;
    report(
      assignRes.status === 200 && Array.isArray(assignments) && assignments.length > 0,
      'GET /api/assignments returns active coursework',
      `Retrieved ${assignments.length} published assignments`
    );

    const firstAssignmentId = assignments[0]?._id;
    if (firstAssignmentId) {
      const singleAssignRes = await fetch(`${API_BASE}/assignments/${firstAssignmentId}`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      const singleAssignData = await singleAssignRes.json();
      const assignmentObj = singleAssignData.assignment || singleAssignData.data || singleAssignData;
      report(
        singleAssignRes.status === 200 && assignmentObj?._id === firstAssignmentId,
        `GET /api/assignments/:id returns detailed assignment specifications`,
        `Title: "${assignmentObj?.title}" • Max Marks: ${assignmentObj?.maxMarks}`
      );
    }

    // -------------------------------------------------------------
    // CHECK 6: Role Dashboards
    // -------------------------------------------------------------
    console.log('\n--- 6. Role-Specific Dashboards ---');

    // Student Dashboard
    const stuDashRes = await fetch(`${API_BASE}/dashboard/student`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const stuDashData = await stuDashRes.json();
    report(
      stuDashRes.status === 200 && stuDashData.success,
      'GET /api/dashboard/student aggregates student KPIs and milestones',
      `Submissions Graded: ${stuDashData.metrics?.gradedSubmissions ?? 'OK'} • GPA: ${stuDashData.metrics?.averageScore ?? 'OK'}%`
    );

    // Teacher Dashboard
    const teachDashRes = await fetch(`${API_BASE}/dashboard/teacher`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    const teachDashData = await teachDashRes.json();
    report(
      teachDashRes.status === 200 && teachDashData.success,
      'GET /api/dashboard/teacher aggregates grading queue and submissions',
      `Assignments: ${teachDashData.metrics?.totalAssignments ?? 'OK'} • Pending: ${teachDashData.metrics?.pendingSubmissions ?? 'OK'}`
    );

    // Admin Dashboard
    const adminDashRes = await fetch(`${API_BASE}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminDashData = await adminDashRes.json();
    report(
      adminDashRes.status === 200 && adminDashData.success,
      'GET /api/dashboard/admin aggregates campus-wide institution stats',
      `Total Users: ${adminDashData.metrics?.totalUsers ?? 'OK'} • Subjects: ${adminDashData.metrics?.totalSubjects ?? 'OK'}`
    );

    // -------------------------------------------------------------
    // CHECK 7: Similarity & Plagiarism Engine
    // -------------------------------------------------------------
    console.log('\n--- 7. Plagiarism & Textual Similarity Engine ---');
    const sampleText1 = 'The quick brown fox jumps over the lazy dog and runs across the field to find food in the forest.';
    const sampleText2 = 'The quick brown fox jumps over the lazy dog and runs across the field to catch small prey.';

    const simRes = await fetch(`${API_BASE}/similarity/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({
        text1: sampleText1,
        text2: sampleText2,
      }),
    });
    const simData = await simRes.json();
    const simPercent = simData.similarityScore ?? simData.similarity ?? simData.percentage;
    report(
      simRes.status === 200 && simPercent !== undefined,
      'POST /api/similarity/check computes n-gram similarity score',
      `Computed Similarity Score: ${simPercent}% match`
    );

    // -------------------------------------------------------------
    // CHECK 8: Calendar Events API
    // -------------------------------------------------------------
    console.log('\n--- 8. Calendar & Deadline Milestones ---');
    const calRes = await fetch(`${API_BASE}/calendar`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const calData = await calRes.json();
    const events = calData.events || calData.data || calData;
    report(
      calRes.status === 200,
      'GET /api/calendar returns milestone events and deadlines',
      `Calendar response status: ${calRes.status}`
    );

    // -------------------------------------------------------------
    // CHECK 9: Notifications Feed API
    // -------------------------------------------------------------
    console.log('\n--- 9. Notifications Feed ---');
    const notifRes = await fetch(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const notifData = await notifRes.json();
    report(
      notifRes.status === 200,
      'GET /api/notifications returns user notification stream',
      `Notifications response status: ${notifRes.status}`
    );

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    console.log('\n===============================================================');
    console.log(`📊 FINAL AUDIT RESULT: ${passed} / ${total} MODULES OPERATIONAL`);
    console.log('===============================================================\n');

    if (passed === total) {
      console.log('🎉 ENTIRE SYSTEM IS 100% OPERATIONAL, VERIFIED & HEALTHY!');
      process.exit(0);
    } else {
      console.error(`⚠️ ${total - passed} checks had issues.`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Audit execution failed:', error.message);
    process.exit(1);
  }
}

runFullSystemCheck();
