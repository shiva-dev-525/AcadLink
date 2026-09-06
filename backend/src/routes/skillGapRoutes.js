const express = require('express');
const router = express.Router();
const { getMySkillGaps, getSupportedCareers } = require('../controllers/skillGapController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Get supported career roles
router.get('/careers', getSupportedCareers);

// Get skill-gap analysis for authenticated student
router.get('/me', protect, requireRole('student', 'admin'), getMySkillGaps);

module.exports = router;
