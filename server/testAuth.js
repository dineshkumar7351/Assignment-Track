const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const API_BASE = 'http://localhost:5000/api/auth';

async function runTests() {
  console.log('🧪 Starting Comprehensive Section 02 Authentication Verification Tests...\n');

  let passed = 0;
  let total = 10;

  try {
    // Connect to MongoDB to inspect directly
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-assignment-tracker');

    // Clean up test users first
    await User.deleteMany({ email: { $in: ['john.student@college.edu', 'sarah.teacher@college.edu', 'fake.admin@college.edu'] } });

    // TEST 1: Student can register
    console.log('Test 1: Student Registration...');
    const studentPayload = {
      fullName: 'John Student',
      email: 'john.student@college.edu',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      role: 'student',
      department: 'Computer Science & Engineering',
      studentId: 'STU-2026-999',
    };

    const res1 = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentPayload),
    });
    const data1 = await res1.json();

    if (res1.status === 201 && data1.token && data1.user.role === 'student') {
      console.log('✅ PASS: Student registered successfully with token and role student.\n');
      passed++;
    } else {
      throw new Error(`Test 1 failed: ${JSON.stringify(data1)}`);
    }

    const studentToken = data1.token;

    // TEST 2: Teacher can register
    console.log('Test 2: Teacher Registration...');
    const teacherPayload = {
      fullName: 'Dr. Sarah Teacher',
      email: 'sarah.teacher@college.edu',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      role: 'teacher',
      department: 'Information Technology',
      employeeId: 'FAC-2026-888',
    };

    const res2 = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherPayload),
    });
    const data2 = await res2.json();

    if (res2.status === 201 && data2.token && data2.user.role === 'teacher') {
      console.log('✅ PASS: Teacher registered successfully with token and role teacher.\n');
      passed++;
    } else {
      throw new Error(`Test 2 failed: ${JSON.stringify(data2)}`);
    }

    const teacherToken = data2.token;

    // TEST 3: Duplicate email is rejected
    console.log('Test 3: Duplicate Email Rejection...');
    const res3 = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentPayload),
    });
    const data3 = await res3.json();

    if (res3.status === 400 && data3.success === false) {
      console.log(`✅ PASS: Duplicate email rejected with 400 Bad Request: "${data3.message}"\n`);
      passed++;
    } else {
      throw new Error('Test 3 failed: Duplicate email was not rejected with 400');
    }

    // TEST 4: Wrong password is rejected
    console.log('Test 4: Wrong Password Rejection...');
    const res4 = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.student@college.edu',
        password: 'WrongPassword!',
      }),
    });
    const data4 = await res4.json();

    if (res4.status === 401 && data4.success === false) {
      console.log(`✅ PASS: Wrong password rejected with 401 Unauthorized: "${data4.message}"\n`);
      passed++;
    } else {
      throw new Error('Test 4 failed: Wrong password allowed');
    }

    // TEST 5: Successful login returns JWT
    console.log('Test 5: Successful Login Returns JWT...');
    const res5 = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.student@college.edu',
        password: 'Password@123',
      }),
    });
    const data5 = await res5.json();

    if (res5.status === 200 && data5.token && data5.user.email === 'john.student@college.edu') {
      console.log('✅ PASS: Successful login returned JWT token and user profile.\n');
      passed++;
    } else {
      throw new Error('Test 5 failed: Login did not return expected user/token');
    }

    // TEST 6: /api/auth/me works
    console.log('Test 6: GET /api/auth/me Endpoint...');
    const res6 = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data6 = await res6.json();

    if (res6.status === 200 && data6.user.email === 'john.student@college.edu') {
      console.log(`✅ PASS: GET /api/auth/me returned authenticated user: "${data6.user.fullName}" (${data6.user.role}).\n`);
      passed++;
    } else {
      throw new Error('Test 6 failed: /me endpoint error');
    }

    // TEST 7: Logout / Invalid Token rejection
    console.log('Test 7: Token Rejection after Logout / Invalid Bearer...');
    const res7 = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: 'Bearer invalid_or_expired_token' },
    });
    const data7 = await res7.json();

    if (res7.status === 401 && data7.success === false) {
      console.log('✅ PASS: Unauthenticated/invalid token requests are properly rejected with 401 Unauthorized.\n');
      passed++;
    } else {
      throw new Error('Test 7 failed: Invalid token was accepted');
    }

    // TEST 8: Student cannot access teacher route
    console.log('Test 8: Student Cannot Access Teacher Route...');
    const res8 = await fetch(`${API_BASE}/teacher-only`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data8 = await res8.json();

    if (res8.status === 403 && data8.success === false) {
      console.log(`✅ PASS: Student blocked from teacher route with 403 Forbidden: "${data8.message}"\n`);
      passed++;
    } else {
      throw new Error('Test 8 failed: Student accessed teacher route');
    }

    // TEST 9: Teacher cannot access admin route
    console.log('Test 9: Teacher Cannot Access Admin Route...');
    const res9 = await fetch(`${API_BASE}/admin-only`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    const data9 = await res9.json();

    if (res9.status === 403 && data9.success === false) {
      console.log(`✅ PASS: Teacher blocked from admin route with 403 Forbidden: "${data9.message}"\n`);
      passed++;
    } else {
      throw new Error('Test 9 failed: Teacher accessed admin route');
    }

    // TEST 10: Password is encrypted with bcrypt in MongoDB
    console.log('Test 10: Password Hashing Verification in MongoDB...');
    const rawStudent = await User.findOne({ email: 'john.student@college.edu' });
    if (
      rawStudent &&
      rawStudent.password &&
      rawStudent.password.startsWith('$2') &&
      rawStudent.password !== 'Password@123'
    ) {
      console.log(`✅ PASS: Password is encrypted with bcrypt: ${rawStudent.password.substring(0, 20)}...\n`);
      passed++;
    } else {
      throw new Error('Test 10 failed: Password not hashed');
    }

    console.log(`========================================`);
    console.log(`📊 FINAL TEST SUMMARY: ${passed}/${total} TESTS PASSED`);
    console.log(`========================================\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  }
}

runTests();
