/**
 * Skill Gap Analysis Service
 *
 * Provides deterministic, explainable, and transparent skill-gap
 * calculations comparing student self-reported skills, assessment performance,
 * and target career industry requirements.
 */

// ─── Career Target Taxonomy ───────────────────────────────────────────────────
// Centralized career role requirements (Required skills and target proficiencies)
const CAREER_REQUIREMENTS = {
  'Frontend Developer': [
    { skill: 'React', requiredLevel: 'Intermediate', weight: 1.2 },
    { skill: 'JavaScript', requiredLevel: 'Advanced', weight: 1.2 },
    { skill: 'HTML/CSS', requiredLevel: 'Advanced', weight: 1.0 },
    { skill: 'Git', requiredLevel: 'Intermediate', weight: 0.8 },
    { skill: 'REST APIs', requiredLevel: 'Intermediate', weight: 1.0 },
  ],
  'Backend Developer': [
    { skill: 'Java', requiredLevel: 'Intermediate', weight: 1.2 },
    { skill: 'Node.js', requiredLevel: 'Intermediate', weight: 1.2 },
    { skill: 'SQL', requiredLevel: 'Intermediate', weight: 1.0 },
    { skill: 'REST APIs', requiredLevel: 'Intermediate', weight: 1.0 },
    { skill: 'Git', requiredLevel: 'Intermediate', weight: 0.8 },
  ],
  'Full Stack Developer': [
    { skill: 'JavaScript', requiredLevel: 'Advanced', weight: 1.2 },
    { skill: 'React', requiredLevel: 'Intermediate', weight: 1.2 },
    { skill: 'Node.js', requiredLevel: 'Intermediate', weight: 1.0 },
    { skill: 'SQL', requiredLevel: 'Intermediate', weight: 1.0 },
    { skill: 'Git', requiredLevel: 'Intermediate', weight: 0.8 },
    { skill: 'REST APIs', requiredLevel: 'Intermediate', weight: 1.0 },
  ],
  'Data Analyst': [
    { skill: 'Python', requiredLevel: 'Intermediate', weight: 1.2 },
    { skill: 'SQL', requiredLevel: 'Advanced', weight: 1.2 },
    { skill: 'Statistics', requiredLevel: 'Intermediate', weight: 1.0 },
    { skill: 'Data Visualization', requiredLevel: 'Intermediate', weight: 1.0 },
    { skill: 'Excel', requiredLevel: 'Intermediate', weight: 0.8 },
  ],
  'AI/ML Engineer': [
    { skill: 'Python', requiredLevel: 'Advanced', weight: 1.2 },
    { skill: 'Machine Learning', requiredLevel: 'Intermediate', weight: 1.2 },
    { skill: 'Statistics', requiredLevel: 'Intermediate', weight: 1.0 },
    { skill: 'SQL', requiredLevel: 'Intermediate', weight: 0.8 },
    { skill: 'Git', requiredLevel: 'Intermediate', weight: 0.8 },
  ],
};

// Available target careers list
const AVAILABLE_CAREERS = Object.keys(CAREER_REQUIREMENTS);

// ─── Thresholds & Scoring Weights ─────────────────────────────────────────────
const THRESHOLDS = {
  STRONG_MIN_PERCENT: 70,       // >= 70% assessment score
  DEVELOPING_MIN_PERCENT: 40,   // 40% - 69% assessment score
  // Below 40% -> Needs Improvement
};

const READINESS_WEIGHTS = {
  Strong: 100,
  Developing: 65,
  'Needs Improvement': 30,
  Missing: 0,
};

/**
 * Normalizes skill strings for case-insensitive matching.
 */
const normalize = (str) => (str || '').trim().toLowerCase();

/**
 * Analyze skill gaps for a student against a target career.
 *
 * @param {Object} student - Student profile document
 * @param {Array} attempts - List of student's completed AssessmentAttempt documents
 * @param {string} [targetCareer] - Optional career interest to evaluate (defaults to student's first interest or 'Frontend Developer')
 * @returns {Object} Comprehensive skill gap analysis
 */
const calculateSkillGap = (student, attempts = [], targetCareer = null) => {
  // Determine target career
  const studentInterests = (student && student.careerInterests) || [];
  const selectedCareer =
    targetCareer && CAREER_REQUIREMENTS[targetCareer]
      ? targetCareer
      : studentInterests.find((ci) => CAREER_REQUIREMENTS[ci]) || 'Frontend Developer';

  const requiredSkills = CAREER_REQUIREMENTS[selectedCareer] || CAREER_REQUIREMENTS['Frontend Developer'];

  // 1. Build lookup for Student's Self-Reported Skills
  const selfReportedSkillsMap = new Map();
  if (student && Array.isArray(student.technicalSkills)) {
    student.technicalSkills.forEach((s) => {
      selfReportedSkillsMap.set(normalize(s.name), {
        name: s.name,
        proficiency: s.proficiency || 'Beginner',
        verificationType: s.verificationType || 'Self-reported',
      });
    });
  }

  // 2. Build lookup for Student's Latest Completed Assessments (by skill)
  const assessmentMap = new Map();
  attempts.forEach((att) => {
    // att.assessment may be populated or contain skill field
    const skillName = att.assessment?.skill || att.skill;
    if (skillName) {
      const key = normalize(skillName);
      // If multiple attempts for same skill, pick latest or highest
      const existing = assessmentMap.get(key);
      if (!existing || att.percentage > existing.percentage) {
        assessmentMap.set(key, {
          score: att.score,
          totalScore: att.totalScore,
          percentage: att.percentage,
          skillLevel: att.skillLevel,
          submittedAt: att.submittedAt,
          attemptId: att._id,
        });
      }
    }
  });

  // 3. Classify Each Required Skill
  const skillsAnalysis = [];
  const strengths = [];
  const developingSkills = [];
  const needsImprovement = [];
  const missingSkills = [];

  let totalWeight = 0;
  let accumulatedReadiness = 0;

  requiredSkills.forEach((req) => {
    const key = normalize(req.skill);
    const self = selfReportedSkillsMap.get(key);
    const assessed = assessmentMap.get(key);

    let status = 'Missing';
    let gapReason = '';
    let recommendationPriority = 'Low';

    if (assessed) {
      // Prioritize assessment performance data as empirical truth
      if (assessed.percentage >= THRESHOLDS.STRONG_MIN_PERCENT) {
        status = 'Strong';
        gapReason = `Verified through assessment (${assessed.percentage}% · ${assessed.skillLevel}). Meets or exceeds the target ${req.requiredLevel} requirement.`;
        recommendationPriority = 'None';
      } else if (assessed.percentage >= THRESHOLDS.DEVELOPING_MIN_PERCENT) {
        status = 'Developing';
        gapReason = `Assessment score (${assessed.percentage}% · ${assessed.skillLevel}) indicates solid foundation, but further mastery is recommended for ${selectedCareer}.`;
        recommendationPriority = 'Medium';
      } else {
        status = 'Needs Improvement';
        gapReason = `Assessment score (${assessed.percentage}% · ${assessed.skillLevel}) is below the required ${req.requiredLevel} standard. Immediate refresher needed.`;
        recommendationPriority = 'High';
      }
    } else if (self) {
      // Self-reported only (not verified by assessment)
      if (self.proficiency === 'Advanced') {
        status = 'Strong';
        gapReason = `Self-reported as Advanced. Taking the skill assessment is recommended to verify this competency.`;
        recommendationPriority = 'Low';
      } else if (self.proficiency === 'Intermediate') {
        status = 'Developing';
        gapReason = `Self-reported as Intermediate. Recommended to practice advanced topics and take assessment.`;
        recommendationPriority = 'Medium';
      } else {
        status = 'Needs Improvement';
        gapReason = `Self-reported as Beginner, while industry target for ${selectedCareer} is ${req.requiredLevel}.`;
        recommendationPriority = 'High';
      }
    } else {
      // Neither assessed nor listed in profile
      status = 'Missing';
      gapReason = `Required skill for ${selectedCareer} is missing from your profile. Not yet assessed.`;
      recommendationPriority = 'Critical';
    }

    const item = {
      skill: req.skill,
      requiredLevel: req.requiredLevel,
      weight: req.weight,
      status,
      recommendationPriority,
      gapReason,
      // Signal Breakdown
      selfReported: self ? { proficiency: self.proficiency, verificationType: self.verificationType } : null,
      assessment: assessed ? { percentage: assessed.percentage, skillLevel: assessed.skillLevel, attemptId: assessed.attemptId } : null,
      isAssessed: !!assessed,
    };

    skillsAnalysis.push(item);

    // Grouping
    if (status === 'Strong') strengths.push(item);
    else if (status === 'Developing') developingSkills.push(item);
    else if (status === 'Needs Improvement') needsImprovement.push(item);
    else if (status === 'Missing') missingSkills.push(item);

    // Score accumulation
    totalWeight += req.weight;
    accumulatedReadiness += (READINESS_WEIGHTS[status] || 0) * req.weight;
  });

  const overallReadiness = totalWeight > 0 ? Math.round(accumulatedReadiness / totalWeight) : 0;

  // 4. Generate Recommended Next Steps
  const nextSteps = [];
  missingSkills.forEach((m) => {
    nextSteps.push({
      action: 'learn',
      skill: m.skill,
      text: `Learn ${m.skill} fundamentals (essential for ${selectedCareer})`,
      priority: 'Critical',
    });
  });
  needsImprovement.forEach((n) => {
    nextSteps.push({
      action: 'improve',
      skill: n.skill,
      text: `Review core concepts and retake assessment for ${n.skill}`,
      priority: 'High',
    });
  });
  developingSkills.forEach((d) => {
    nextSteps.push({
      action: 'practice',
      skill: d.skill,
      text: `Deepen ${d.skill} knowledge to reach ${d.requiredLevel} level`,
      priority: 'Medium',
    });
  });

  return {
    targetCareer: selectedCareer,
    availableCareers: AVAILABLE_CAREERS,
    overallReadiness,
    summary: {
      totalRequired: requiredSkills.length,
      strongCount: strengths.length,
      developingCount: developingSkills.length,
      needsImprovementCount: needsImprovement.length,
      missingCount: missingSkills.length,
      attentionRequiredCount: needsImprovement.length + missingSkills.length,
    },
    strengths,
    developingSkills,
    needsImprovement,
    missingSkills,
    skillsAnalysis,
    nextSteps: nextSteps.slice(0, 5),
  };
};

module.exports = {
  calculateSkillGap,
  CAREER_REQUIREMENTS,
  AVAILABLE_CAREERS,
  THRESHOLDS,
  READINESS_WEIGHTS,
};
