const express = require('express');
const router = express.Router();
const {
  getRecommendedLearning,
  getAllResources,
  getMyProgress,
  updateResourceProgress,
} = require('../controllers/learningController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Public/authenticated browse of all resources
router.get('/resources', getAllResources);

// Personalized recommendations based on skill gaps
router.get(
  '/recommendations',
  protect,
  requireRole('student', 'admin'),
  getRecommendedLearning
);

// Student progress endpoints
router.get(
  '/progress',
  protect,
  requireRole('student', 'admin'),
  getMyProgress
);

router.patch(
  '/progress/:resourceId',
  protect,
  requireRole('student', 'admin'),
  updateResourceProgress
);

module.exports = router;
