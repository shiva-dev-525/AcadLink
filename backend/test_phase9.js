const mongoose = require('mongoose');
const geminiService = require('./src/services/geminiService');

async function testPhase9() {
  console.log('=== VERIFYING PHASE 9: AI / GEMINI LAYER ===');

  const testUserId = new mongoose.Types.ObjectId('66d000000000000000000099');
  const testOppId = new mongoose.Types.ObjectId('66d000000000000000000001');

  // Test 1: Career Guidance
  console.log('\n1. Testing Career Assistant Guidance...');
  const careerRes = await geminiService.generateCareerGuidance(
    testUserId,
    'What skills should I learn to become a better frontend developer?'
  );
  console.log('   Source:', careerRes.source);
  console.log('   Reply preview:', careerRes.reply.slice(0, 100) + '...');
  console.log('   Recommended focus skills:', careerRes.recommendedFocusSkills);
  console.log('   Actionable steps count:', careerRes.actionableSteps?.length);
  if (!careerRes.reply || !Array.isArray(careerRes.recommendedFocusSkills)) {
    throw new Error('Career Guidance response format invalid');
  }

  // Test 2: Skill Gap Explanation
  console.log('\n2. Testing Skill Gap Explanation...');
  const gapRes = await geminiService.explainSkillGap(
    testUserId,
    'REST APIs',
    'Frontend Developer'
  );
  console.log('   Skill:', gapRes.skillName);
  console.log('   Industry Relevance preview:', gapRes.industryRelevance.slice(0, 80) + '...');
  console.log('   Milestones count:', gapRes.learningMilestones?.length);
  if (!gapRes.industryRelevance || !Array.isArray(gapRes.learningMilestones)) {
    throw new Error('Skill Gap Explanation format invalid');
  }

  // Test 3: Learning Guidance
  console.log('\n3. Testing Learning Guidance...');
  const learningRes = await geminiService.generateLearningGuidance(
    testUserId,
    'React',
    'React & Redux Deep Dive',
    'Frontend Developer'
  );
  console.log('   Skill:', learningRes.skillName);
  console.log('   Milestones count:', learningRes.weeklyMilestones?.length);
  console.log('   Project Idea Title:', learningRes.portfolioProjectIdea?.title);
  if (!learningRes.weeklyMilestones || !learningRes.portfolioProjectIdea) {
    throw new Error('Learning Guidance format invalid');
  }

  // Test 4: Opportunity Explanation
  console.log('\n4. Testing Opportunity Match Explanation...');
  const oppRes = await geminiService.explainOpportunityMatch(
    testUserId,
    testOppId
  );
  console.log('   Deterministic Match Score preserved:', oppRes.matchScore);
  console.log('   Match Category:', oppRes.matchCategory);
  console.log('   Match Overview preview:', oppRes.matchOverview?.slice(0, 80) + '...');
  console.log('   Primary Strengths count:', oppRes.primaryStrengths?.length);
  if (typeof oppRes.matchScore !== 'number' || !oppRes.matchOverview) {
    throw new Error('Opportunity Match Explanation format invalid');
  }

  // Test 5: Application Guidance
  console.log('\n5. Testing Application Guidance...');
  const appRes = await geminiService.generateApplicationGuidance(
    testUserId,
    testOppId
  );
  console.log('   Checklist items:', appRes.preApplicationChecklist?.length);
  console.log('   Revision topics count:', appRes.highPriorityRevisionTopics?.length);
  console.log('   Sample questions count:', appRes.sampleInterviewQuestions?.length);
  if (!appRes.preApplicationChecklist || !appRes.sampleInterviewQuestions) {
    throw new Error('Application Guidance format invalid');
  }

  console.log('\n>>> ALL PHASE 9 BACKEND AI CHECKS PASSED! <<<');
}

testPhase9().catch((err) => {
  console.error('Phase 9 Test FAILED:', err);
  process.exit(1);
});
