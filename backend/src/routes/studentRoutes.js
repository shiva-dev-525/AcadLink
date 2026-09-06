const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getSkills,
  updateSkills,
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  getCareerInterests,
  updateCareerInterests,
  getTaxonomyMetadata,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Public/Shared Metadata
router.get('/taxonomy', getTaxonomyMetadata);

// Protected Student Endpoints (Strictly requiring 'student' or 'admin' role)
router.use(protect, requireRole('student', 'admin'));

// Profile Operations
router.get('/me', getProfile);
router.put('/me', updateProfile);

// Skills Operations
router.get('/me/skills', getSkills);
router.put('/me/skills', updateSkills);

// Education Operations
router.get('/me/education', getEducation);
router.post('/me/education', addEducation);
router.put('/me/education/:eduId', updateEducation);
router.delete('/me/education/:eduId', deleteEducation);

// Career Interests Operations
router.get('/me/interests', getCareerInterests);
router.put('/me/interests', updateCareerInterests);

module.exports = router;
