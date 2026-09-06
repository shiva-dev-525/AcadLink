/**
 * Comprehensive Phase 3 Student Core Verification Suite
 */
require('dotenv').config();
const { generateToken } = require('./jwt');
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

async function runStudentTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 3 STUDENT CORE TEST SUITE');
  console.log('==================================================\n');

  const studentUser = {
    userId: '654321654321654321654321',
    role: 'student',
    name: 'Aarav Sharma',
    email: 'aarav@academia.edu',
  };
  const studentToken = generateToken(studentUser);

  const industryUser = {
    userId: '123456123456123456123456',
    role: 'industry',
    name: 'Nexis Recruiter',
    email: 'recruiter@nexis.io',
  };
  const industryToken = generateToken(industryUser);

  const academicianUser = {
    userId: '789012789012789012789012',
    role: 'academician',
    name: 'Prof. Sunita',
    email: 'sunita@academia.edu',
  };
  const academicianToken = generateToken(academicianUser);

  // 1. Test Taxonomy Endpoint
  console.log('--- 1. Testing Taxonomy Metadata API ---');
  let res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/taxonomy',
    method: 'GET',
  });
  assert(res.status === 200 && res.body.success === true, 'Taxonomy metadata endpoint returns 200');
  assert(Array.isArray(res.body.data.careerInterests) && res.body.data.careerInterests.length > 5, 'Career interests taxonomy populated');
  assert(Array.isArray(res.body.data.softSkills) && res.body.data.softSkills.length > 5, 'Soft skills taxonomy populated');

  // 2. Test Authorization & RBAC
  console.log('\n--- 2. Testing Student Authorization & RBAC ---');
  // 2.1 Missing Token -> 401
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me',
    method: 'GET',
  });
  assert(res.status === 401, 'Access to /api/students/me rejected without token (401)');

  // 2.2 Industry Token -> 403 Forbidden
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${industryToken}` },
  });
  assert(res.status === 403 && res.body.message.includes('Forbidden'), 'Industry user blocked from student profile (403)');

  // 2.3 Academician Token -> 403 Forbidden
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${academicianToken}` },
  });
  assert(res.status === 403 && res.body.message.includes('Forbidden'), 'Academician blocked from student profile (403)');

  // 2.4 Student Token -> 200 OK
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(res.status === 200 && res.body.success === true, 'Student user granted access to own profile (200)');
  assert(res.body.data.completion.percentage !== undefined, 'Profile completion percentage returned');

  // 3. Test Updating Basic Information
  console.log('\n--- 3. Testing Basic Profile Updates ---');
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me',
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
  }, {
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    bio: 'Passionate computer science student aiming for full-stack engineering roles.',
  });
  assert(res.status === 200 && res.body.success === true, 'Basic profile updated successfully (200)');
  assert(res.body.data.student.bio.includes('Passionate computer science'), 'Bio successfully saved');
  assert(res.body.data.completion.completedSections.includes('Basic Information'), 'Basic Information section marked complete (20% earned)');

  // 4. Test Skills Management
  console.log('\n--- 4. Testing Technical & Soft Skills Management ---');
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me/skills',
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
  }, {
    technicalSkills: [
      { name: 'JavaScript', proficiency: 'Advanced' },
      { name: 'React', proficiency: 'Intermediate' },
      { name: 'Node.js', proficiency: 'Intermediate' },
      { name: 'react', proficiency: 'Intermediate' }, // duplicate test
    ],
    softSkills: [
      'Problem Solving',
      'Teamwork & Collaboration',
      'Communication',
      'Communication', // duplicate test
    ],
  });
  assert(res.status === 200 && res.body.success === true, 'Skills updated successfully (200)');
  assert(res.body.data.technicalSkills.length === 3, 'Duplicate technical skill "react" correctly deduplicated');
  assert(res.body.data.softSkills.length === 3, 'Duplicate soft skill "Communication" correctly deduplicated');
  assert(res.body.data.completion.completedSections.includes('Technical Skills'), 'Technical Skills marked complete (+20%)');
  assert(res.body.data.completion.completedSections.includes('Soft Skills'), 'Soft Skills marked complete (+20%)');

  // 5. Test Education Management
  console.log('\n--- 5. Testing Education CRUD ---');
  // 5.1 Validation: Missing degree
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me/education',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
  }, {
    institution: 'National Institute of Technology',
    degree: '',
    fieldOfStudy: 'Computer Science',
    startYear: 2023,
  });
  assert(res.status === 400, 'Adding education with missing degree rejected (400)');

  // 5.2 Valid Education Add
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me/education',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
  }, {
    institution: 'National Institute of Technology',
    degree: 'B.Tech',
    fieldOfStudy: 'Computer Science and Engineering',
    startYear: 2023,
    endYear: 2027,
    grade: '8.7 CGPA',
  });
  assert(res.status === 201 && res.body.success === true, 'Education entry added successfully (201)');
  assert(res.body.data.education.length >= 1, 'Education array contains the added entry');
  assert(res.body.data.completion.completedSections.includes('Education'), 'Education section marked complete (+20%)');

  // 6. Test Career Interests
  console.log('\n--- 6. Testing Career Interests ---');
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me/interests',
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
  }, {
    careerInterests: [
      'Full Stack Development',
      'Backend Development',
      'Cloud Computing & DevOps',
    ],
  });
  assert(res.status === 200 && res.body.success === true, 'Career interests updated successfully (200)');
  assert(res.body.data.careerInterests.length === 3, 'Selected career interests saved');
  assert(res.body.data.completion.completedSections.includes('Career Interests'), 'Career Interests marked complete (+20%)');

  // 7. Verify 100% Profile Completion
  console.log('\n--- 7. Testing 100% Profile Completion State ---');
  res = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/students/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(res.status === 200, 'Fetched updated profile');
  assert(res.body.data.completion.percentage === 100, 'Profile completion calculated at 100% when all 5 sections are satisfied');
  assert(res.body.data.completion.isComplete === true, 'isComplete flag is true');
  assert(res.body.data.completion.incompleteSections.length === 0, 'No incomplete sections remaining');

  console.log('\n==================================================');
  console.log(`ALL PHASE 3 BACKEND TESTS PASSED! (${passedTests}/${totalTests} assertions passed)`);
  console.log('==================================================\n');
}

runStudentTests().catch((err) => {
  console.error('\nStudent test suite failed with error:', err);
  process.exit(1);
});
