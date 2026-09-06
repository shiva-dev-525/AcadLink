const LearningResource = require('../models/LearningResource');
const LearningProgress = require('../models/LearningProgress');

/**
 * Learning Service
 *
 * Generates personalized learning recommendations based on identified
 * skill gaps and manages student progress across curated resources.
 */

/**
 * Get personalized recommendations for a student given their skill gap analysis.
 *
 * @param {string} studentId - User ID of the student
 * @param {Object} skillGapResult - Analysis from skillGapService.calculateSkillGap
 * @returns {Promise<Object>} Categorized and prioritized learning resources
 */
const getRecommendations = async (studentId, skillGapResult) => {
  const { targetCareer, needsImprovement = [], missingSkills = [], developingSkills = [] } = skillGapResult;

  // Build a priority map by skill name
  const skillPriorityMap = new Map();

  missingSkills.forEach((item) => {
    skillPriorityMap.set(item.skill.toLowerCase(), {
      priority: 'Critical',
      order: 1,
      reason: `Essential missing skill for your ${targetCareer} target goal. Not yet added to your profile.`,
      status: 'Missing',
    });
  });

  needsImprovement.forEach((item) => {
    skillPriorityMap.set(item.skill.toLowerCase(), {
      priority: 'High',
      order: 2,
      reason: item.gapReason || `Your proficiency in ${item.skill} needs improvement for ${targetCareer}.`,
      status: 'Needs Improvement',
    });
  });

  developingSkills.forEach((item) => {
    skillPriorityMap.set(item.skill.toLowerCase(), {
      priority: 'Medium',
      order: 3,
      reason: item.gapReason || `Strengthen ${item.skill} to meet the industry benchmark for ${targetCareer}.`,
      status: 'Developing',
    });
  });

  // Extract all target skills we need resources for
  const skillsToFetch = Array.from(skillPriorityMap.keys());

  // Fetch all active learning resources
  const resources = await LearningResource.find({ isActive: true }).lean();

  // Fetch student's progress records
  const progressRecords = await LearningProgress.find({ student: studentId }).lean();
  const progressMap = new Map();
  progressRecords.forEach((p) => {
    progressMap.set(p.resource.toString(), p.status);
  });

  // Tag each resource with recommendation priority, explanation, and current student progress
  const recommended = [];
  const otherResources = [];

  resources.forEach((res) => {
    const skillKey = (res.skill || '').toLowerCase();
    const priorityInfo = skillPriorityMap.get(skillKey);
    const studentStatus = progressMap.get(res._id.toString()) || 'Not Started';

    const enriched = {
      ...res,
      studentStatus,
      isRecommended: !!priorityInfo,
      recommendationPriority: priorityInfo ? priorityInfo.priority : 'General',
      priorityOrder: priorityInfo ? priorityInfo.order : 99,
      skillGapStatus: priorityInfo ? priorityInfo.status : null,
      whyRecommended: priorityInfo
        ? priorityInfo.reason
        : `General skill development resource for ${res.skill}.`,
    };

    if (priorityInfo) {
      recommended.push(enriched);
    } else {
      otherResources.push(enriched);
    }
  });

  // Sort recommendations: Critical first, then High, then Medium, then by resource order
  recommended.sort((a, b) => {
    if (a.priorityOrder !== b.priorityOrder) {
      return a.priorityOrder - b.priorityOrder;
    }
    return (a.order || 0) - (b.order || 0);
  });

  // Calculate stats
  const totalRecommended = recommended.length;
  const inProgressCount = recommended.filter((r) => r.studentStatus === 'In Progress').length;
  const completedCount = recommended.filter((r) => r.studentStatus === 'Completed').length;

  return {
    targetCareer,
    stats: {
      totalRecommended,
      inProgressCount,
      completedCount,
      completionRate: totalRecommended > 0 ? Math.round((completedCount / totalRecommended) * 100) : 0,
    },
    recommended,
    allResources: [...recommended, ...otherResources],
  };
};

/**
 * Update or initialize a student's progress on a resource.
 *
 * @param {string} studentId - User ID of the student
 * @param {string} resourceId - ObjectId of the LearningResource
 * @param {'Not Started'|'In Progress'|'Completed'} status - Target status
 * @returns {Promise<Object>} Updated progress record
 */
const updateProgress = async (studentId, resourceId, status) => {
  const allowedStatuses = ['Not Started', 'In Progress', 'Completed'];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of ${allowedStatuses.join(', ')}`);
  }

  const updates = {
    status,
  };

  if (status === 'In Progress') {
    updates.startedAt = new Date();
  } else if (status === 'Completed') {
    updates.completedAt = new Date();
    if (!updates.startedAt) updates.startedAt = new Date();
  } else if (status === 'Not Started') {
    updates.startedAt = null;
    updates.completedAt = null;
  }

  const progress = await LearningProgress.findOneAndUpdate(
    { student: studentId, resource: resourceId },
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );

  return progress;
};

module.exports = {
  getRecommendations,
  updateProgress,
};
