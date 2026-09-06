const mongoose = require('mongoose');
const { calculateOpportunityMatch } = require('./src/services/matchingService');
const applicationService = require('./src/services/applicationService');
const Application = require('./src/models/Application');

async function testPhase7() {
  console.log('=== VERIFYING PHASE 7 COMPONENTS ===');

  // Test 1-6: Match Calculation Engine
  const sampleOpp = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Frontend Developer Intern',
    organization: 'CloudScale Technologies',
    category: 'Engineering',
    type: 'Internship',
    workMode: 'Remote',
    experienceLevel: 'Beginner',
    requiredSkills: ['React', 'JavaScript', 'Tailwind CSS'],
    preferredSkills: ['TypeScript'],
    deadline: new Date(Date.now() + 86400000 * 30),
    status: 'Active'
  };

  const sampleStudent = {
    technicalSkills: [
      { name: 'JavaScript', proficiency: 'Advanced' },
      { name: 'React', proficiency: 'Intermediate' }
    ],
    careerInterests: ['Frontend Developer'],
    education: [{ degree: 'B.Tech Computer Science' }]
  };

  const assessmentScoresMap = new Map();
  assessmentScoresMap.set('javascript', 88);

  const matchResult = calculateOpportunityMatch(sampleOpp, sampleStudent, assessmentScoresMap);

  console.log('1. Match Score:', matchResult.matchScore);
  console.log('2. Match Category:', matchResult.matchCategory);
  console.log('3. Matched Skills:', matchResult.matchedSkills);
  console.log('4. Missing Skills:', matchResult.missingSkills);
  console.log('5. Explanation:', matchResult.explanation);

  if (typeof matchResult.matchScore !== 'number') throw new Error('Match score calculation failed');
  if (!matchResult.matchCategory) throw new Error('Match category missing');
  if (!Array.isArray(matchResult.matchedSkills)) throw new Error('Matched skills missing');
  if (!Array.isArray(matchResult.missingSkills)) throw new Error('Missing skills missing');
  if (!matchResult.explanation) throw new Error('Match explanation missing');

  // Test 8-14: Application flow in offline/mock mode
  const testStudentId = new mongoose.Types.ObjectId('66d000000000000000000099');
  const testOppId = new mongoose.Types.ObjectId('66d000000000000000000001'); // maps to mock opp 1

  // Submit Application
  const newApp = await applicationService.submitApplication(testStudentId, {
    opportunityId: testOppId.toString(),
    coverLetter: 'I am excited about this frontend developer internship.',
    contactPhone: '+1-555-0199',
    resumeUrl: 'https://example.com/resume.pdf'
  });
  console.log('6. Submitted Application ID:', newApp._id);
  console.log('7. Initial Status:', newApp.status);
  console.log('8. Status History length:', newApp.statusHistory.length);

  // Duplicate Prevention Check
  let duplicateCaught = false;
  try {
    await applicationService.submitApplication(testStudentId, {
      opportunityId: testOppId.toString(),
      coverLetter: 'Duplicate attempt'
    });
  } catch (err) {
    duplicateCaught = true;
    console.log('9. Duplicate Prevention verified:', err.message);
  }
  if (!duplicateCaught) throw new Error('Duplicate application prevention failed!');

  // Application History & Detail
  const myApps = await applicationService.getMyApplications(testStudentId);
  console.log('10. My Applications count:', myApps.length);
  if (myApps.length === 0) throw new Error('Failed to retrieve applications');

  const appDetail = await applicationService.getApplicationById(newApp._id, testStudentId);
  console.log('11. Retrieved App Detail status:', appDetail.status);

  // Security Check: Unauthorized Student
  const hackerId = new mongoose.Types.ObjectId('66d000000000000000000088');
  let securityPassed = false;
  try {
    await applicationService.getApplicationById(newApp._id, hackerId);
  } catch (err) {
    securityPassed = true;
    console.log('12. Security Check (unauthorized student) verified:', err.message);
  }
  if (!securityPassed) throw new Error('Unauthorized student access was not blocked!');

  // Withdraw Application
  const withdrawn = await applicationService.withdrawApplication(newApp._id, testStudentId);
  console.log('13. Withdrawn status:', withdrawn.status);
  console.log('14. History after withdraw:', withdrawn.statusHistory.map(h => h.status));

  console.log('\n>>> ALL PHASE 7 VERIFICATION CHECKS PASSED! <<<');
}

testPhase7().catch((err) => {
  console.error('Phase 7 Verification FAILED:', err);
  process.exit(1);
});
