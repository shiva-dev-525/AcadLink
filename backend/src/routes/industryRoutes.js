const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getProfile,
  updateProfile,
  createOpportunity,
  getApplicants,
  updateStatus,
} = require('../controllers/industryController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

/**
 * Industry / Organization Routes
 *
 * Base: /api/industry
 * Role protected: industry, admin
 */
router.use(protect);
router.use(requireRole('industry', 'admin'));

// GET /api/industry/dashboard — KPIs and recent applicants
router.get('/dashboard', getDashboard);

// GET & PUT /api/industry/profile — Organization branding and details
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// POST /api/industry/opportunities — Post a new opportunity
router.post('/opportunities', createOpportunity);

// GET /api/industry/opportunities/:opportunityId/applications — View applicants with match score
router.get('/opportunities/:opportunityId/applications', getApplicants);

// PATCH /api/industry/applications/:applicationId/status — Shortlist, Review, Select, or Reject
router.patch('/applications/:applicationId/status', updateStatus);

module.exports = router;
