const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');
const Student = require('../models/Student');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const SavedOpportunity = require('../models/SavedOpportunity');
const Application = require('../models/Application');
const { opportunitiesData } = require('../data/seedOpportunities');

/**
 * Matching Service
 *
 * Implements transparent, deterministic rule-based opportunity compatibility scoring
 * compliant with BusinessGuidelines.md:
 * - Skill Match: 50%
 * - Career Interest: 20%
 * - Eligibility: 15%
 * - Experience: 10%
 * - Work Mode: 5%
 */

// In-memory mock opportunities for offline mode
const mockOpportunities = opportunitiesData.map((item, index) => ({
  ...item,
  _id: new mongoose.Types.ObjectId(`66d0000000000000000000${(index + 1).toString(16).padStart(2, '0')}`),
  createdAt: new Date(Date.now() - (14 - index) * 3600000),
}));

/**
 * Normalizes skill strings for reliable matching (e.g., 'rest apis' === 'rest api')
 */
const normalize = (s) => (s || '').toLowerCase().trim().replace(/[-_]/g, ' ');

/**
 * Calculate match metrics between a student and a single opportunity
 */
const calculateOpportunityMatch = (opportunity, studentProfile, assessmentScoresMap) => {
  const reqSkills = opportunity.requiredSkills || [];
  const prefSkills = opportunity.preferredSkills || [];

  const matchedSkills = [];
  const developingSkills = [];
  const missingSkills = [];

  let rawSkillPoints = 0;

  // 1. Required Skills Evaluation (up to 45 pts from required + 5 pts bonus from preferred = 50 pts total)
  if (reqSkills.length > 0) {
    reqSkills.forEach((reqSkill) => {
      const normReq = normalize(reqSkill);

      // Check if assessment verified score exists
      const assessmentScore = assessmentScoresMap.get(normReq);
      // Check if self-reported technical skill exists
      const selfReported = (studentProfile.technicalSkills || []).find(
        (s) => normalize(s.name) === normReq
      );

      if (assessmentScore !== undefined) {
        if (assessmentScore >= 70) {
          matchedSkills.push({ name: reqSkill, level: 'Assessment-verified (Strong)', score: assessmentScore });
          rawSkillPoints += 1.0;
        } else if (assessmentScore >= 40) {
          developingSkills.push({ name: reqSkill, level: 'Assessment-verified (Developing)', score: assessmentScore });
          rawSkillPoints += 0.7;
        } else {
          developingSkills.push({ name: reqSkill, level: 'Assessment-verified (Needs Work)', score: assessmentScore });
          rawSkillPoints += 0.4;
        }
      } else if (selfReported) {
        if (selfReported.proficiency === 'Advanced') {
          matchedSkills.push({ name: reqSkill, level: 'Self-reported (Advanced)', score: 85 });
          rawSkillPoints += 0.9;
        } else if (selfReported.proficiency === 'Intermediate') {
          developingSkills.push({ name: reqSkill, level: 'Self-reported (Intermediate)', score: 65 });
          rawSkillPoints += 0.65;
        } else {
          developingSkills.push({ name: reqSkill, level: 'Self-reported (Beginner)', score: 35 });
          rawSkillPoints += 0.35;
        }
      } else {
        missingSkills.push({ name: reqSkill, level: 'Missing' });
      }
    });

    // Scale to 45 points max
    rawSkillPoints = (rawSkillPoints / reqSkills.length) * 45;
  } else {
    rawSkillPoints = 45;
  }

  // Preferred skills bonus (up to 5 points)
  let prefPoints = 0;
  prefSkills.forEach((prefSkill) => {
    const normPref = normalize(prefSkill);
    if (
      assessmentScoresMap.has(normPref) ||
      (studentProfile.technicalSkills || []).some((s) => normalize(s.name) === normPref)
    ) {
      prefPoints += 2.5;
    }
  });
  const skillScore = Math.min(50, rawSkillPoints + Math.min(5, prefPoints));

  // 2. Career Interest Alignment (20 points max)
  let careerScore = 8;
  const careerInterests = (studentProfile.careerInterests || []).map(normalize);
  const oppCategory = normalize(opportunity.category);
  const oppTitle = normalize(opportunity.title);

  if (careerInterests.length > 0) {
    const directMatch = careerInterests.some(
      (c) => oppTitle.includes(c) || c.includes(oppTitle) || oppCategory.includes(c) || c.includes(oppCategory)
    );
    if (directMatch) {
      careerScore = 20;
    } else {
      // General tech field alignment
      const techInterests = careerInterests.some((c) =>
        ['developer', 'engineer', 'analyst', 'software', 'data', 'ai', 'cloud', 'security'].some((k) =>
          c.includes(k)
        )
      );
      careerScore = techInterests ? 14 : 10;
    }
  }

  // 3. Eligibility & Education (15 points max)
  let eligibilityScore = 10;
  if (studentProfile.education && studentProfile.education.length > 0) {
    eligibilityScore = 15;
  }

  // 4. Experience Level Compatibility (10 points max)
  let experienceScore = 7;
  if (opportunity.experienceLevel === 'Beginner') {
    experienceScore = 10;
  } else if (opportunity.experienceLevel === 'Intermediate') {
    experienceScore = matchedSkills.length >= 2 ? 10 : 7;
  } else if (opportunity.experienceLevel === 'Advanced') {
    experienceScore = matchedSkills.length >= 3 ? 10 : 5;
  }

  // 5. Work Mode / Other (5 points max)
  const workModeScore = 5;

  // Total Compatibility Score
  const totalScore = Math.min(
    100,
    Math.round(skillScore + careerScore + eligibilityScore + experienceScore + workModeScore)
  );

  // Categorization
  let matchCategory = 'Potential Match';
  if (totalScore >= 85) {
    matchCategory = 'Excellent Match';
  } else if (totalScore >= 70) {
    matchCategory = 'Good Match';
  } else if (totalScore >= 50) {
    matchCategory = 'Potential Match';
  } else {
    matchCategory = 'Needs Skill Development';
  }

  // Generate transparent explanation
  let explanation = '';
  if (matchedSkills.length > 0) {
    const strongList = matchedSkills.slice(0, 3).map((m) => m.name).join(', ');
    explanation += `Strong alignment: your proficiency in ${strongList} directly satisfies key prerequisites for ${opportunity.organization}. `;
  } else if (developingSkills.length > 0) {
    const devList = developingSkills.slice(0, 2).map((d) => d.name).join(', ');
    explanation += `Developing alignment: you have foundational knowledge in ${devList}. `;
  } else {
    explanation += `Growth opportunity: this role introduces core requirements for your career progression. `;
  }

  if (missingSkills.length > 0) {
    const missList = missingSkills.slice(0, 2).map((m) => m.name).join(' & ');
    explanation += `Bridging ${missList} will significantly elevate your candidacy for this position.`;
  } else {
    explanation += `Your declared skill profile satisfies all mandatory requirements for this role.`;
  }

  return {
    matchScore: totalScore,
    matchCategory,
    breakdown: {
      skillScore: Math.round(skillScore),
      careerScore,
      eligibilityScore,
      experienceScore,
      workModeScore,
    },
    matchedSkills: matchedSkills.map((m) => m.name),
    developingSkills: developingSkills.map((d) => d.name),
    missingSkills: missingSkills.map((m) => m.name),
    explanation,
  };
};

/**
 * Get personalized recommendations for authenticated student
 */
const getRecommendedOpportunities = async (userId, queryParams = {}) => {
  const {
    type,
    workMode,
    category,
    experience,
    minScore = 0,
    limit = 20,
  } = queryParams;

  let studentProfile = {
    technicalSkills: [],
    careerInterests: ['Frontend Developer', 'Software Engineer'],
    education: [{ degree: 'B.Tech' }],
  };
  const assessmentScoresMap = new Map();

  let activeOpportunities = [];
  let savedOppIds = new Set();
  let appliedOppIds = new Set();

  if (mongoose.connection.readyState === 1) {
    // 1. Fetch Student Profile
    const student = await Student.findOne({ userId }).lean();
    if (student) {
      studentProfile = student;
    }

    // 2. Fetch Latest Completed Assessment Attempts
    const attempts = await AssessmentAttempt.find({
      student: userId,
      status: 'completed',
    })
      .populate('assessment', 'skill')
      .sort({ submittedAt: -1 })
      .lean();

    attempts.forEach((att) => {
      const skillName = att.assessment?.skill;
      if (skillName && !assessmentScoresMap.has(normalize(skillName))) {
        assessmentScoresMap.set(normalize(skillName), att.percentage || 0);
      }
    });

    // 3. Fetch Active Opportunities
    const oppFilter = {
      status: 'Active',
      deadline: { $gte: new Date() },
    };

    if (type && type !== 'All') oppFilter.type = type;
    if (workMode && workMode !== 'All') oppFilter.workMode = workMode;
    if (category && category !== 'All') oppFilter.category = category;
    if (experience && experience !== 'All') oppFilter.experienceLevel = experience;

    activeOpportunities = await Opportunity.find(oppFilter).lean();

    // 4. Fetch Student's Bookmarked & Applied IDs
    const [savedRecords, appliedRecords] = await Promise.all([
      SavedOpportunity.find({ student: userId }).select('opportunity').lean(),
      Application.find({ student: userId }).select('opportunity status').lean(),
    ]);

    savedOppIds = new Set(savedRecords.map((r) => r.opportunity.toString()));
    const appliedMap = new Map();
    appliedRecords.forEach((r) => appliedMap.set(r.opportunity.toString(), r.status));

    appliedOppIds = appliedMap;
  } else {
    // Degraded / offline mode
    activeOpportunities = mockOpportunities.filter(
      (o) => o.status === 'Active' && new Date(o.deadline) >= new Date()
    );

    if (type && type !== 'All') activeOpportunities = activeOpportunities.filter((o) => o.type === type);
    if (workMode && workMode !== 'All') activeOpportunities = activeOpportunities.filter((o) => o.workMode === workMode);
    if (category && category !== 'All') activeOpportunities = activeOpportunities.filter((o) => o.category === category);
    if (experience && experience !== 'All') activeOpportunities = activeOpportunities.filter((o) => o.experienceLevel === experience);
  }

  // Calculate matching scores for each opportunity
  const scoredOpportunities = activeOpportunities.map((opp) => {
    const matchAnalysis = calculateOpportunityMatch(opp, studentProfile, assessmentScoresMap);
    const oppIdStr = opp._id.toString();

    const isSaved = savedOppIds.has(oppIdStr);
    const appliedStatus = appliedOppIds instanceof Map ? appliedOppIds.get(oppIdStr) : null;

    return {
      ...opp,
      matchScore: matchAnalysis.matchScore,
      matchCategory: matchAnalysis.matchCategory,
      breakdown: matchAnalysis.breakdown,
      matchedSkills: matchAnalysis.matchedSkills,
      developingSkills: matchAnalysis.developingSkills,
      missingSkills: matchAnalysis.missingSkills,
      explanation: matchAnalysis.explanation,
      isSaved,
      hasApplied: Boolean(appliedStatus),
      applicationStatus: appliedStatus || null,
    };
  });

  // Filter by minScore and sort descending by matchScore
  const minScoreNum = parseInt(minScore, 10) || 0;
  const filtered = scoredOpportunities
    .filter((opp) => opp.matchScore >= minScoreNum)
    .sort((a, b) => b.matchScore - a.matchScore);

  const parsedLimit = Math.min(50, parseInt(limit, 10) || 20);

  return {
    recommendations: filtered.slice(0, parsedLimit),
    totalMatched: filtered.length,
    studentTargetGoal: (studentProfile.careerInterests && studentProfile.careerInterests[0]) || 'Software Developer',
  };
};

module.exports = {
  calculateOpportunityMatch,
  getRecommendedOpportunities,
};
