const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getMyApplications,
  getApplicationById,
  withdrawApplication,
  checkApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Application Routes
 *
 * Base: /api/applications
 * All routes require authentication.
 */

// POST /api/applications — Submit a new application
router.post('/', protect, submitApplication);

// GET /api/applications — Get all applications for authenticated student
router.get('/', protect, getMyApplications);

// GET /api/applications/check/:opportunityId — Check if already applied
router.get('/check/:opportunityId', protect, checkApplicationStatus);

// GET /api/applications/:applicationId — Get specific application details
router.get('/:applicationId', protect, getApplicationById);

// PATCH /api/applications/:applicationId/withdraw — Withdraw an application
router.patch('/:applicationId/withdraw', protect, withdrawApplication);

module.exports = router;
