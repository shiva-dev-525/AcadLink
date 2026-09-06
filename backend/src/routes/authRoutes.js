const express = require('express');
const router = express.Router();
const { register, login, getMe, testRoleAccess } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Public Authentication Endpoints
router.post('/register', register);
router.post('/login', login);

// Authenticated User Endpoint
router.get('/me', protect, getMe);

// Role Authorization Verification Endpoints (Used for testing and backend route protection verification)
router.get('/role-check/student', protect, requireRole('student'), testRoleAccess);
router.get('/role-check/industry', protect, requireRole('industry'), testRoleAccess);
router.get('/role-check/academician', protect, requireRole('academician'), testRoleAccess);
router.get('/role-check/institution', protect, requireRole('institution'), testRoleAccess);
router.get('/role-check/admin', protect, requireRole('admin'), testRoleAccess);

module.exports = router;
