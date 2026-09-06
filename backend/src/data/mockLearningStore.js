const mongoose = require('mongoose');
const { learningData } = require('./seedLearning');

// Assign stable ObjectIds to the learning resources
const rawLearningResources = learningData.map((item, index) => {
  const hex = (index + 1).toString(16).padStart(6, '0');
  return {
    _id: new mongoose.Types.ObjectId(`65c000000000000000${hex}`),
    ...item,
    isActive: true,
    createdAt: new Date()
  };
});

// In-memory student progress: key = `${studentId}_${resourceId}`
const mockProgressMap = new Map();

function getMockResources(filter = {}) {
  let list = [...rawLearningResources];
  if (filter.skill) {
    const q = filter.skill.trim().toLowerCase();
    list = list.filter((r) => r.skill.toLowerCase() === q);
  }
  if (filter.difficulty) {
    list = list.filter((r) => r.difficulty === filter.difficulty);
  }
  return list;
}

function getMockRecommendations(studentId, skillGapResult) {
  const { targetCareer = 'Software Development', needsImprovement = [], missingSkills = [], developingSkills = [] } = skillGapResult;

  const skillPriorityMap = new Map();

  missingSkills.forEach((item) => {
    skillPriorityMap.set(item.skill.toLowerCase(), {
      priority: 'Critical',
      order: 1,
      reason: `Essential missing skill for your ${targetCareer} target goal. Not yet added to your profile.`,
      status: 'Missing'
    });
  });

  needsImprovement.forEach((item) => {
    skillPriorityMap.set(item.skill.toLowerCase(), {
      priority: 'High',
      order: 2,
      reason: item.gapReason || `Your proficiency in ${item.skill} needs improvement for ${targetCareer}.`,
      status: 'Needs Improvement'
    });
  });

  developingSkills.forEach((item) => {
    skillPriorityMap.set(item.skill.toLowerCase(), {
      priority: 'Medium',
      order: 3,
      reason: item.gapReason || `Strengthen ${item.skill} to meet the industry benchmark for ${targetCareer}.`,
      status: 'Developing'
    });
  });

  const studentKey = studentId.toString();

  // Attach progress info
  const decorated = rawLearningResources.map((res) => {
    const progressKey = `${studentKey}_${res._id.toString()}`;
    const p = mockProgressMap.get(progressKey);
    const gapInfo = skillPriorityMap.get(res.skill.toLowerCase());

    return {
      ...res,
      studentStatus: p ? p.status : 'not-started',
      startedAt: p?.startedAt || null,
      completedAt: p?.completedAt || null,
      recommendationPriority: gapInfo?.priority || 'Standard',
      recommendationReason: gapInfo?.reason || `Curated skill development resource for ${res.skill}.`,
      gapStatus: gapInfo?.status || null,
      _sortOrder: gapInfo?.order || 99
    };
  });

  const recommended = decorated.filter((r) => skillPriorityMap.has(r.skill.toLowerCase()));
  recommended.sort((a, b) => {
    if (a._sortOrder !== b._sortOrder) return a._sortOrder - b._sortOrder;
    return (a.order || 0) - (b.order || 0);
  });

  const inProgress = decorated.filter((r) => r.studentStatus === 'in-progress');
  const completed = decorated.filter((r) => r.studentStatus === 'completed');

  return {
    targetCareer,
    recommended,
    inProgress,
    completed,
    totalRecommended: recommended.length
  };
}

function getMockProgress(studentId) {
  const studentKey = studentId.toString();
  const list = [];
  for (const [key, val] of mockProgressMap.entries()) {
    if (key.startsWith(studentKey + '_')) {
      const res = rawLearningResources.find((r) => r._id.toString() === val.resourceId.toString());
      list.push({
        _id: new mongoose.Types.ObjectId(),
        student: studentId,
        resource: res || val.resourceId,
        status: val.status,
        startedAt: val.startedAt,
        completedAt: val.completedAt
      });
    }
  }
  return list;
}

function updateMockProgress(studentId, resourceId, newStatus) {
  const progressKey = `${studentId.toString()}_${resourceId.toString()}`;
  const now = new Date();
  const existing = mockProgressMap.get(progressKey);

  const updated = {
    resourceId,
    status: newStatus,
    startedAt: existing?.startedAt || (newStatus !== 'not-started' ? now : null),
    completedAt: newStatus === 'completed' ? now : null
  };

  mockProgressMap.set(progressKey, updated);
  return updated;
}

module.exports = {
  rawLearningResources,
  getMockResources,
  getMockRecommendations,
  getMockProgress,
  updateMockProgress
};
