const express = require('express');
const router = express.Router();
const {
  getCareerGuidance,
  getSkillGapExplanation,
  getLearningGuidance,
  getOpportunityExplanation,
  getApplicationGuidance,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { aiRateLimiter } = require('../middleware/aiRateLimitMiddleware');

/**
 * AI Routes
 *
 * Base: /api/ai
 * All endpoints require authentication and are protected by rate limiting.
 */

// Apply auth protection and AI rate limiting (30 requests/minute)
router.use(protect);
router.use(aiRateLimiter(30, 60000));

// POST /api/ai/career-assistant — Interactive career advisory chat
router.post('/career-assistant', getCareerGuidance);

// POST /api/ai/skill-gap-explanation — Contextual explanation for a skill gap
router.post('/skill-gap-explanation', getSkillGapExplanation);

// POST /api/ai/learning-guidance — Personalized weekly milestones & project idea
router.post('/learning-guidance', getLearningGuidance);

// POST /api/ai/opportunity-explanation — AI explanation of match strengths and improvements
router.post('/opportunity-explanation', getOpportunityExplanation);

// POST /api/ai/application-guidance — Interview prep and revision checklist
router.post('/application-guidance', getApplicationGuidance);

module.exports = router;
