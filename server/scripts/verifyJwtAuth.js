process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect, authorize } = require('../middleware/authMiddleware');
const app = require('../server');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_smart_tracker_2026';

async function runJwtAuthVerification() {
  console.log('===============================================================');
  console.log('🔒 IN-DEPTH JWT AUTHENTICATION VERIFICATION SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
    }
  }

  try {
    // 1. Database Connection
    await connectDB();
    console.log('📦 Database ready for JWT verification\n');

    // Clean up any test users
    await User.deleteMany({ email: { $in: ['jwt.student@test.edu', 'jwt.teacher@test.edu', 'jwt.deactivated@test.edu', 'jwt.clerk@test.edu'] } });

    // -------------------------------------------------------------
    // SECTION 1: Token Generation & Cryptographic Verification
    // -------------------------------------------------------------
    console.log('--- SECTION 1: Token Generation & Cryptographic Signatures ---');
    const mockUserId = new mongoose.Types.ObjectId();
    const token1 = generateToken(mockUserId.toString(), 'student');

    assert(typeof token1 === 'string' && token1.split('.').length === 3, 'generateToken returns valid 3-part JWT format (header.payload.signature)');

    const decoded1 = jwt.verify(token1, JWT_SECRET);
    assert(decoded1.id === mockUserId.toString(), 'Decoded JWT payload contains correct user ID');
    assert(decoded1.role === 'student', 'Decoded JWT payload contains correct user role');
    assert(decoded1.exp > decoded1.iat, 'Decoded JWT contains valid expiration claim');

    // Verification with wrong secret must fail
    let wrongSecretFailed = false;
    try {
      jwt.verify(token1, 'wrong_secret_key_123');
    } catch (err) {
      wrongSecretFailed = true;
    }
    assert(wrongSecretFailed, 'JWT signature verification fails with incorrect secret key');

    // -------------------------------------------------------------
    // SECTION 2: Middleware Direct Unit Tests
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: Auth Middleware Behavior & Error Handling ---');

    // Create test user in DB
    const studentUser = await User.create({
      fullName: 'JWT Test Student',
      email: 'jwt.student@test.edu',
      password: 'Password123!',
      role: 'student',
      department: 'Computer Science',
      studentId: 'JWT-STU-001',
      isActive: true,
    });

    const studentValidToken = generateToken(studentUser._id.toString(), 'student');

    // Test 2.1: Valid Bearer Token populates req.user
    const req1 = { headers: { authorization: `Bearer ${studentValidToken}` } };
    const res1 = { status: (code) => ({ json: (data) => data }) };
    let nextCalled1 = false;
    await protect(req1, res1, (err) => {
      if (!err) nextCalled1 = true;
    });
    assert(nextCalled1 && req1.user && req1.user._id.toString() === studentUser._id.toString(), 'protect middleware succeeds with valid JWT and populates req.user');

    // Test 2.2: Missing Authorization header
    let error2 = null;
    const req2 = { headers: {} };
    const res2 = { status: (c) => {} };
    await protect(req2, res2, (err) => {
      error2 = err;
    });
    assert(error2 && error2.message.includes('no token provided'), 'protect rejects request with missing Authorization header');

    // Test 2.3: Malformed Authorization header (no Bearer prefix)
    let error3 = null;
    const req3 = { headers: { authorization: 'Basic dXNlcjpwYXNz' } };
    await protect(req3, res2, (err) => {
      error3 = err;
    });
    assert(error3 && error3.message.includes('no token provided'), 'protect rejects non-Bearer Authorization header');

    // Test 2.4: Tampered / Invalid JWT
    let error4 = null;
    const req4 = { headers: { authorization: 'Bearer invalid.tampered.token' } };
    await protect(req4, res2, (err) => {
      error4 = err;
    });
    assert(error4 !== null, 'protect rejects tampered / invalid JWT token');

    // Test 2.5: Deactivated Account rejection
    const deactivatedUser = await User.create({
      fullName: 'Deactivated User',
      email: 'jwt.deactivated@test.edu',
      password: 'Password123!',
      role: 'student',
      department: 'Physics',
      studentId: 'JWT-STU-002',
      isActive: false,
    });
    const deactToken = generateToken(deactivatedUser._id.toString(), 'student');
    let error5 = null;
    const req5 = { headers: { authorization: `Bearer ${deactToken}` } };
    await protect(req5, res2, (err) => {
      error5 = err;
    });
    assert(error5 && error5.message.includes('deactivated'), 'protect blocks deactivated user accounts even with valid signed token');

    // -------------------------------------------------------------
    // SECTION 3: Role-Based Authorization Tests
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: Role-Based Authorization (`authorize`) ---');

    const studentReq = { user: { role: 'student' } };
    const teacherReq = { user: { role: 'teacher' } };
    const adminReq = { user: { role: 'admin' } };

    let studentAllowedOnStudentRoute = false;
    authorize('student')(studentReq, {}, (err) => { if (!err) studentAllowedOnStudentRoute = true; });
    assert(studentAllowedOnStudentRoute, 'authorize("student") permits student user');

    let studentBlockedOnTeacherRoute = false;
    authorize('teacher')(studentReq, res2, (err) => { if (err) studentBlockedOnTeacherRoute = true; });
    assert(studentBlockedOnTeacherRoute, 'authorize("teacher") blocks student user');

    let teacherAllowedOnTeacherRoute = false;
    authorize('teacher', 'admin')(teacherReq, {}, (err) => { if (!err) teacherAllowedOnTeacherRoute = true; });
    assert(teacherAllowedOnTeacherRoute, 'authorize("teacher", "admin") permits teacher user');

    let teacherBlockedOnAdminRoute = false;
    authorize('admin')(teacherReq, res2, (err) => { if (err) teacherBlockedOnAdminRoute = true; });
    assert(teacherBlockedOnAdminRoute, 'authorize("admin") blocks teacher user');

    let adminAllowedOnAdminRoute = false;
    authorize('admin')(adminReq, {}, (err) => { if (!err) adminAllowedOnAdminRoute = true; });
    assert(adminAllowedOnAdminRoute, 'authorize("admin") permits admin user');

    // -------------------------------------------------------------
    // SECTION 4: Live HTTP Server Endpoint Integration Tests
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: Live HTTP API End-to-End Authentication ---');

    const server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    const port = server.address().port;
    const BASE_URL = `http://localhost:${port}/api/auth`;

    try {
      // Test 4.1: Register Teacher
      const regRes = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'JWT Professor',
          email: 'jwt.teacher@test.edu',
          password: 'SecurePassword123!',
          confirmPassword: 'SecurePassword123!',
          role: 'teacher',
          department: 'Computer Science',
          employeeId: 'EMP-JWT-999',
        }),
      });
      const regData = await regRes.json();
      assert(regRes.status === 201 && regData.token && regData.user.role === 'teacher', 'POST /api/auth/register creates user and returns valid JWT');

      const teacherToken = regData.token;

      // Test 4.2: Login with Valid Credentials
      const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'jwt.teacher@test.edu',
          password: 'SecurePassword123!',
        }),
      });
      const loginData = await loginRes.json();
      assert(loginRes.status === 200 && loginData.token && loginData.user.email === 'jwt.teacher@test.edu', 'POST /api/auth/login verifies credentials and returns JWT');

      // Test 4.3: Login with Invalid Password
      const badLoginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'jwt.teacher@test.edu',
          password: 'WrongPassword!',
        }),
      });
      assert(badLoginRes.status === 401, 'POST /api/auth/login rejects incorrect password with 401 Unauthorized');

      // Test 4.4: Access Protected Profile (/api/auth/me) with Teacher JWT
      const meRes = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${teacherToken}` },
      });
      const meData = await meRes.json();
      assert(meRes.status === 200 && meData.user.email === 'jwt.teacher@test.edu', 'GET /api/auth/me returns authenticated user with valid JWT');

      // Test 4.5: Teacher accessing Teacher-Only route
      const teacherOnlyRes = await fetch(`${BASE_URL}/teacher-only`, {
        headers: { Authorization: `Bearer ${teacherToken}` },
      });
      assert(teacherOnlyRes.status === 200, 'GET /api/auth/teacher-only succeeds with Teacher JWT');

      // Test 4.6: Teacher accessing Admin-Only route is Forbidden
      const adminOnlyRes = await fetch(`${BASE_URL}/admin-only`, {
        headers: { Authorization: `Bearer ${teacherToken}` },
      });
      assert(adminOnlyRes.status === 403, 'GET /api/auth/admin-only is blocked for Teacher JWT with 403 Forbidden');

      // Test 4.7: Password Hashing Verification
      const dbTeacher = await User.findOne({ email: 'jwt.teacher@test.edu' });
      assert(
        dbTeacher && dbTeacher.password && dbTeacher.password.startsWith('$2') && dbTeacher.password !== 'SecurePassword123!',
        'Password is encrypted with bcrypt salt & hash in MongoDB'
      );

      // Test 4.8: Clerk Sync endpoint produces valid JWT
      const clerkRes = await fetch(`${BASE_URL}/clerk-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: 'clerk_user_test_998877',
          email: 'jwt.clerk@test.edu',
          fullName: 'Clerk Sync User',
          role: 'student',
          department: 'Information Technology',
        }),
      });
      const clerkData = await clerkRes.json();
      assert(clerkRes.status === 200 && clerkData.token, 'POST /api/auth/clerk-sync returns a signed JWT for synchronized users');

      // Test 4.9: Clerk Synchronized user can access /api/auth/me using their JWT
      const clerkMeRes = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${clerkData.token}` },
      });
      const clerkMeData = await clerkMeRes.json();
      assert(clerkMeRes.status === 200 && clerkMeData.user.email === 'jwt.clerk@test.edu', 'Clerk JWT token allows authenticated access to protected endpoints');

    } finally {
      server.close();
    }

    // Clean up test users
    await User.deleteMany({ email: { $in: ['jwt.student@test.edu', 'jwt.teacher@test.edu', 'jwt.deactivated@test.edu', 'jwt.clerk@test.edu'] } });
    await mongoose.disconnect();

    console.log('\n===============================================================');
    console.log(`📊 FINAL RESULT: ${passed} / ${total} CHECKS PASSED`);
    console.log('===============================================================\n');

    if (passed === total) {
      console.log('🎉 ALL JWT AUTHENTICATION CHECKS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      console.error('❌ SOME CHECKS FAILED!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runJwtAuthVerification();
