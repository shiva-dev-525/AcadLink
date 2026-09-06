const express = require('express');
const router = express.Router();
const { getRecommendedOpportunities } = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Matching Routes
 *
 * Base: /api/matching
 */

// GET /api/matching/opportunities — Personalized opportunity recommendations
router.get('/opportunities', protect, getRecommendedOpportunities);

module.exports = router;
