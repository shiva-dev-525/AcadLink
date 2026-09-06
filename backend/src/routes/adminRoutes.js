const express = require('express');
const router = express.Router();
const { getOverview, getUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

/**
 * Admin & Institution Routes
 *
 * Base: /api/admin & /api/institution
 * Role protected: admin, institution
 */
router.use(protect);
router.use(requireRole('admin', 'institution'));

// GET overview analytics (platform KPIs, cohort readiness, skill demand)
router.get('/overview', getOverview);

// GET users directory
router.get('/users', getUsers);

module.exports = router;
