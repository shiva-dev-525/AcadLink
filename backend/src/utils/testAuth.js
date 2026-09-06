/**
 * Comprehensive Phase 2 Auth & Role Verification Suite
 * Tests:
 * 1. Password hashing with bcrypt (genSalt, hash, matchPassword)
 * 2. JWT generation, decoding, expiration & malformed handling
 * 3. Input validation on registration (missing fields, invalid email, weak password, invalid role)
 * 4. Input validation on login (missing credentials)
 * 5. Role-based access control (RBAC):
 *    - Student accessing student-only endpoint (200) vs industry-only endpoint (403)
 *    - Industry accessing industry-only endpoint (200) vs admin-only endpoint (403)
 *    - Admin accessing admin-only endpoint (200)
 *    - Unauthenticated request (401)
 *    - Malformed token (401)
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('./jwt');
const http = require('http');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 2 AUTHENTICATION & ROLE TEST SUITE');
  console.log('==================================================\n');

  // 1. Test Bcrypt Password Security
  console.log('--- 1. Testing Password Security (bcryptjs) ---');
  const rawPassword = 'SecurePassword2026!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawPassword, salt);
  assert(hash !== rawPassword, 'Password is never stored in plain text');
  assert(hash.startsWith('$2'), 'Bcrypt hash format is valid');
  assert(await bcrypt.compare(rawPassword, hash), 'Correct password matches hash');
  assert(!(await bcrypt.compare('WrongPassword', hash)), 'Incorrect password rejected by bcrypt');

  // 2. Test JWT Generation & Decoding
  console.log('\n--- 2. Testing JWT Issuance & Verification ---');
  const payload = { userId: '507f1f77bcf86cd799439011', role: 'student', name: 'Aarav Sharma' };
  const token = generateToken(payload);
  assert(typeof token === 'string' && token.split('.').length === 3, 'Valid JWT structure generated');
  const decoded = verifyToken(token);
  assert(decoded.userId === payload.userId, 'JWT contains correct userId');
  assert(decoded.role === 'student', 'JWT contains correct role');
  assert(!decoded.password, 'JWT does not contain passwords');

  // 3. Test Token Expiration Handling
  console.log('\n--- 3. Testing Token Expiration & Tampering ---');
  const expiredToken = generateToken(payload, '1ms');
  await new Promise((r) => setTimeout(r, 10)); // wait for token to expire
  try {
    verifyToken(expiredToken);
    assert(false, 'Expired token should throw an error');
  } catch (err) {
    assert(err.name === 'TokenExpiredError', 'Expired token correctly throws TokenExpiredError');
  }

  try {
    verifyToken('tampered.' + token.split('.')[1] + '.tampered');
    assert(false, 'Tampered token should throw an error');
  } catch (err) {
    assert(err.name === 'JsonWebTokenError', 'Tampered token rejected with JsonWebTokenError');
  }

  // 4. Test API Validation via HTTP Requests to port 5000
  console.log('\n--- 4. Testing API Input Validation (HTTP) ---');

  // Test 4.1: Missing Name
  let res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { email: 'user@test.com', password: 'password123', role: 'student' });
  assert(res.status === 400 && res.body.success === false, 'Registration rejects missing name (400)');

  // Test 4.2: Invalid Email Format
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { name: 'Test User', email: 'not-an-email', password: 'password123', role: 'student' });
  assert(res.status === 400 && res.body.message.includes('valid email'), 'Registration rejects invalid email format (400)');

  // Test 4.3: Short Password
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { name: 'Test User', email: 'user@test.com', password: '123', role: 'student' });
  assert(res.status === 400 && res.body.message.includes('at least 6 characters'), 'Registration rejects password < 6 chars (400)');

  // Test 4.4: Invalid Role
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { name: 'Test User', email: 'user@test.com', password: 'password123', role: 'invalid_role' });
  assert(res.status === 400 && res.body.message.includes('Invalid role'), 'Registration rejects unsupported role (400)');

  // Test 4.5: Missing Login Credentials
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {});
  assert(res.status === 400 && res.body.success === false, 'Login rejects empty credentials (400)');

  // 5. Test Authentication Middleware
  console.log('\n--- 5. Testing Authentication Middleware (HTTP) ---');

  // Test 5.1: Missing Token
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
  });
  assert(res.status === 401 && res.body.message.includes('No authorization token provided'), 'Access to /api/auth/me denied without token (401)');

  // Test 5.2: Malformed Token
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: 'Bearer this-is-not-a-valid-jwt' },
  });
  assert(res.status === 401 && res.body.message.includes('Malformed authorization token'), 'Malformed token rejected (401)');

  // Test 5.3: Valid Student Token Access to /api/auth/me
  const studentToken = generateToken({
    userId: '507f1f77bcf86cd799439011',
    role: 'student',
    name: 'Aarav Student',
    email: 'aarav@academia.edu',
  });

  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(res.status === 200 && res.body.success === true, 'Valid token accesses /api/auth/me (200)');
  assert(res.body.data.user.role === 'student', 'Returned user role matches token payload');

  // 6. Test Role-Based Access Control (RBAC)
  console.log('\n--- 6. Testing Role-Based Authorization (RBAC) ---');

  const industryToken = generateToken({
    userId: '507f1f77bcf86cd799439012',
    role: 'industry',
    name: 'Nexis Recruiter',
    email: 'recruiter@nexis.io',
  });

  const adminToken = generateToken({
    userId: '507f1f77bcf86cd799439013',
    role: 'admin',
    name: 'System Admin',
    email: 'admin@academia.edu',
  });

  // Test 6.1: Student accesses Student-only route -> 200
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/role-check/student',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(res.status === 200 && res.body.success === true, 'Student successfully accesses /role-check/student (200)');

  // Test 6.2: Student tries to access Industry-only route -> 403 Forbidden
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/role-check/industry',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(res.status === 403 && res.body.message.includes('Forbidden'), 'Student blocked from /role-check/industry (403)');

  // Test 6.3: Industry accesses Industry-only route -> 200
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/role-check/industry',
    method: 'GET',
    headers: { Authorization: `Bearer ${industryToken}` },
  });
  assert(res.status === 200 && res.body.success === true, 'Industry successfully accesses /role-check/industry (200)');

  // Test 6.4: Industry tries to access Admin-only route -> 403 Forbidden
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/role-check/admin',
    method: 'GET',
    headers: { Authorization: `Bearer ${industryToken}` },
  });
  assert(res.status === 403 && res.body.message.includes('Forbidden'), 'Industry blocked from /role-check/admin (403)');

  // Test 6.5: Admin accesses Admin-only route -> 200
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/role-check/admin',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(res.status === 200 && res.body.success === true, 'Admin successfully accesses /role-check/admin (200)');

  console.log('\n==================================================');
  console.log(`ALL TESTS PASSED! (${passedTests}/${totalTests} assertions passed)`);
  console.log('==================================================\n');
}

runTests().catch((err) => {
  console.error('\nTest suite failed with error:', err);
  process.exit(1);
});
