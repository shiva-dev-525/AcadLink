const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessmentById,
  startAssessment,
  submitAssessment,
  getMyAttempts,
  getAttemptById,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// ─── Public Routes ────────────────────────────────────────────────────────────
// Assessment list and detail are publicly visible (no login needed to browse)
router.get('/', getAssessments);

// ─── Attempt Routes ───────────────────────────────────────────────────────────
// IMPORTANT: These must come BEFORE /:assessmentId to avoid Express routing
// treating "attempts" as an assessmentId.
router.get(
  '/attempts',
  protect,
  requireRole('student', 'admin'),
  getMyAttempts
);

router.get(
  '/attempts/:attemptId',
  protect,
  requireRole('student', 'admin'),
  getAttemptById
);

router.post(
  '/attempts/:attemptId/submit',
  protect,
  requireRole('student', 'admin'),
  submitAssessment
);

// ─── Assessment-Specific Routes ───────────────────────────────────────────────
router.get('/:assessmentId', getAssessmentById);

router.post(
  '/:assessmentId/start',
  protect,
  requireRole('student', 'admin'),
  startAssessment
);

module.exports = router;
