const mongoose = require('mongoose');
const Student = require('../models/Student');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const skillGapService = require('./skillGapService');

/**
 * AI Context Service
 *
 * Extracts a compact, privacy-safe context from existing platform data.
 * Strictly excludes: passwords, tokens, full emails, phone numbers, and database internals.
 */
async function buildStudentContext(userId) {
  let profile = {
    fullName: 'Student Candidate',
    degree: 'Undergraduate Degree',
    institution: 'University Partner',
    careerInterests: ['Frontend Developer', 'Software Engineer'],
    technicalSkills: [
      { name: 'JavaScript', proficiency: 'Advanced', verificationStatus: 'Assessment-verified' },
      { name: 'React', proficiency: 'Intermediate', verificationStatus: 'Self-reported' },
      { name: 'Git', proficiency: 'Beginner', verificationStatus: 'Self-reported' }
    ],
    softSkills: ['Problem Solving', 'Team Collaboration']
  };

  const assessmentSummary = [];
  let currentGaps = [];

  if (mongoose.connection.readyState === 1) {
    try {
      // 1. Student Profile
      const studentDoc = await Student.findOne({ userId }).lean();
      if (studentDoc) {
        profile = {
          fullName: studentDoc.fullName || 'Student Candidate',
          degree: studentDoc.education?.[0]?.degree || 'Technical Degree',
          institution: studentDoc.education?.[0]?.institution || 'Academic Institution',
          careerInterests: studentDoc.careerInterests?.length ? studentDoc.careerInterests : ['Software Developer'],
          technicalSkills: (studentDoc.technicalSkills || []).map((s) => ({
            name: s.name,
            proficiency: s.proficiency || 'Intermediate',
            verificationStatus: s.verificationStatus || 'Self-reported'
          })),
          softSkills: (studentDoc.softSkills || []).map((s) => s.name || s)
        };
      }

      // 2. Latest Completed Assessments
      const attempts = await AssessmentAttempt.find({ student: userId, status: 'completed' })
        .populate('assessment', 'skill')
        .sort({ submittedAt: -1 })
        .limit(5)
        .lean();

      attempts.forEach((att) => {
        if (att.assessment?.skill) {
          assessmentSummary.push({
            skill: att.assessment.skill,
            score: `${att.percentage}%`,
            passed: att.passed
          });
        }
      });

      // 3. Current Skill Gaps
      const gapData = await skillGapService.getStudentSkillGaps(userId);
      if (gapData && gapData.gaps) {
        currentGaps = gapData.gaps.map((g) => ({
          skill: g.name,
          gapScore: g.gapScore,
          requiredLevel: g.requiredProficiency,
          currentLevel: g.studentProficiency || 'None'
        }));
      }
    } catch (err) {
      console.warn('[AIContext] Error hydrating context from DB, using safe defaults:', err.message);
    }
  }

  // Format concise string representation for prompt injection
  const primaryCareer = profile.careerInterests[0] || 'Software Engineer';
  const skillsList = profile.technicalSkills
    .map((s) => `${s.name} (${s.proficiency}, ${s.verificationStatus})`)
    .join(', ');
  
  const assessmentList = assessmentSummary.length
    ? assessmentSummary.map((a) => `${a.skill}: ${a.score} (${a.passed ? 'Passed' : 'Needs Practice'})`).join('; ')
    : 'None taken yet';

  const gapsList = currentGaps.length
    ? currentGaps.slice(0, 4).map((g) => `${g.skill} (Requires ${g.requiredLevel}, Current: ${g.currentLevel})`).join('; ')
    : 'None identified';

  return `Candidate Goal: ${primaryCareer}
All Career Goals: ${profile.careerInterests.join(', ')}
Education: ${profile.degree} at ${profile.institution}
Declared Skills: ${skillsList || 'None declared yet'}
Soft Skills: ${profile.softSkills.join(', ') || 'Communication, Problem Solving'}
Assessment Results: ${assessmentList}
Active Skill Gaps: ${gapsList}`;
}

module.exports = {
  buildStudentContext
};
