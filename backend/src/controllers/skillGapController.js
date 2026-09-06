const mongoose = require('mongoose');
const Student = require('../models/Student');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const { calculateSkillGap, AVAILABLE_CAREERS } = require('../services/skillGapService');
const { getOrCreateStudentProfile } = require('./studentController');
const { getMockMyAttempts } = require('../data/mockAssessmentStore');

/**
 * Skill Gap Controller
 */

/**
 * GET /api/skill-gaps/me
 *
 * Compute and return skill-gap analysis for the authenticated student.
 * Supports query param: ?career=Frontend%20Developer to simulate other career paths.
 */
const getMySkillGaps = async (req, res) => {
  const studentId = req.user._id;
  const { career } = req.query;

  if (mongoose.connection.readyState !== 1) {
    try {
      const student = await getOrCreateStudentProfile(studentId);
      const attempts = getMockMyAttempts(studentId).filter((a) => a.status === 'completed');
      const analysis = calculateSkillGap(student, attempts, career);
      return res.status(200).json({
        success: true,
        data: analysis,
      });
    } catch (err) {
      console.error('getMySkillGaps offline error:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Unable to analyze skill gaps at this time.',
      });
    }
  }

  try {
    // 1. Fetch Student Profile
    const student = await Student.findOne({ userId: studentId }).lean();

    // 2. Fetch Student's Completed Assessment Attempts
    const attempts = await AssessmentAttempt.find({
      student: studentId,
      status: 'completed',
    })
      .populate('assessment', 'title skill difficulty')
      .lean();

    // 3. Run Skill Gap Engine
    const analysis = calculateSkillGap(student, attempts, career);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('getMySkillGaps error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to analyze skill gaps at this time.',
    });
  }
};

/**
 * GET /api/skill-gaps/careers
 *
 * Returns the list of supported career taxonomy titles.
 */
const getSupportedCareers = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      careers: AVAILABLE_CAREERS,
    },
  });
};

module.exports = {
  getMySkillGaps,
  getSupportedCareers,
};
