const mongoose = require('mongoose');
const LearningResource = require('../models/LearningResource');
const LearningProgress = require('../models/LearningProgress');
const Student = require('../models/Student');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const { calculateSkillGap } = require('../services/skillGapService');
const { getRecommendations, updateProgress } = require('../services/learningService');
const { getOrCreateStudentProfile } = require('./studentController');
const { getMockMyAttempts } = require('../data/mockAssessmentStore');
const {
  getMockResources,
  getMockRecommendations,
  getMockProgress,
  updateMockProgress
} = require('../data/mockLearningStore');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/learning/recommendations
 *
 * Personalized recommendations based on the authenticated student's skill gaps.
 */
const getRecommendedLearning = async (req, res) => {
  const studentId = req.user._id;
  const { career } = req.query;

  if (mongoose.connection.readyState !== 1) {
    try {
      const student = await getOrCreateStudentProfile(studentId);
      const attempts = getMockMyAttempts(studentId).filter((a) => a.status === 'completed');
      const skillGapAnalysis = calculateSkillGap(student, attempts, career);
      const recommendations = getMockRecommendations(studentId, skillGapAnalysis);

      return res.status(200).json({
        success: true,
        data: {
          ...recommendations,
          skillGapSummary: skillGapAnalysis.summary,
          overallReadiness: skillGapAnalysis.overallReadiness,
        },
      });
    } catch (err) {
      console.error('getRecommendedLearning offline error:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Unable to generate learning recommendations.',
      });
    }
  }

  try {
    const student = await Student.findOne({ userId: studentId }).lean();
    const attempts = await AssessmentAttempt.find({
      student: studentId,
      status: 'completed',
    })
      .populate('assessment', 'title skill difficulty')
      .lean();

    const skillGapAnalysis = calculateSkillGap(student, attempts, career);
    const recommendations = await getRecommendations(studentId, skillGapAnalysis);

    return res.status(200).json({
      success: true,
      data: {
        ...recommendations,
        skillGapSummary: skillGapAnalysis.summary,
        overallReadiness: skillGapAnalysis.overallReadiness,
      },
    });
  } catch (error) {
    console.error('getRecommendedLearning error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to generate learning recommendations.',
    });
  }
};

/**
 * GET /api/learning/resources
 *
 * Browse curated learning resources with optional skill / difficulty filters.
 */
const getAllResources = async (req, res) => {
  const { skill, difficulty } = req.query;

  if (mongoose.connection.readyState !== 1) {
    const resources = getMockResources({ skill, difficulty });
    return res.status(200).json({
      success: true,
      data: { resources },
    });
  }

  try {
    const filter = { isActive: true };
    if (skill) filter.skill = new RegExp(`^${skill.trim()}$`, 'i');
    if (difficulty) filter.difficulty = difficulty;

    const resources = await LearningResource.find(filter).sort({ skill: 1, order: 1 }).lean();

    // If user is authenticated, attach their progress status
    let progressMap = new Map();
    if (req.user) {
      const progressRecords = await LearningProgress.find({ student: req.user._id }).lean();
      progressRecords.forEach((p) => {
        progressMap.set(p.resource.toString(), p.status);
      });
    }

    const result = resources.map((r) => ({
      ...r,
      studentStatus: progressMap.get(r._id.toString()) || 'Not Started',
    }));

    return res.status(200).json({
      success: true,
      data: { resources: result },
    });
  } catch (error) {
    console.error('getAllResources error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to load learning resources.',
    });
  }
};

/**
 * GET /api/learning/progress
 *
 * Get student's tracked learning progress records.
 */
const getMyProgress = async (req, res) => {
  const studentId = req.user._id;

  if (mongoose.connection.readyState !== 1) {
    const progress = getMockProgress(studentId);
    return res.status(200).json({
      success: true,
      data: { progress },
    });
  }

  try {
    const progress = await LearningProgress.find({ student: studentId })
      .populate('resource', 'title skill difficulty resourceType estimatedDuration provider')
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: { progress },
    });
  } catch (error) {
    console.error('getMyProgress error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to load learning progress.',
    });
  }
};

/**
 * PATCH /api/learning/progress/:resourceId
 *
 * Update progress on a learning resource ('Not Started' | 'In Progress' | 'Completed').
 */
const updateResourceProgress = async (req, res) => {
  const studentId = req.user._id;
  const { resourceId } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(resourceId)) {
    return res.status(400).json({ success: false, message: 'Invalid resource ID.' });
  }

  if (!status) {
    return res.status(400).json({ success: false, message: 'Progress status is required.' });
  }

  if (mongoose.connection.readyState !== 1) {
    const updated = updateMockProgress(studentId, resourceId, status);
    return res.status(200).json({
      success: true,
      data: { progress: updated },
    });
  }

  try {
    const resource = await LearningResource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Learning resource not found.' });
    }

    const updated = await updateProgress(studentId, resourceId, status);

    return res.status(200).json({
      success: true,
      data: { progress: updated },
    });
  } catch (error) {
    console.error('updateResourceProgress error:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to update learning progress.',
    });
  }
};

module.exports = {
  getRecommendedLearning,
  getAllResources,
  getMyProgress,
  updateResourceProgress,
};
