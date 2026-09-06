const mongoose = require('mongoose');
const Student = require('../models/Student');
const { 
  CAREER_INTERESTS, 
  SOFT_SKILLS, 
  COMMON_TECH_SKILLS, 
  PROFICIENCY_LEVELS 
} = require('../utils/constants');

// In-memory store fallback for offline/development mode when MongoDB is not connected
const inMemoryStudentStore = new Map();

/**
 * Helper to get or create student profile for authenticated user
 */
const getOrCreateStudentProfile = async (userId) => {
  const userKey = userId.toString();

  if (mongoose.connection.readyState !== 1) {
    if (!inMemoryStudentStore.has(userKey)) {
      const isDemoStudent = userKey === '65a000000000000000000001';
      const fallbackStudent = new Student({
        userId,
        phone: isDemoStudent ? '+91 98765 43210' : '',
        location: isDemoStudent ? 'Bengaluru, Karnataka, India' : '',
        bio: isDemoStudent 
          ? 'Final-year Computer Science student passionate about full-stack engineering, scalable cloud services, and UI/UX design. Actively solving DSA challenges and building production-grade web apps.' 
          : '',
        education: isDemoStudent ? [
          {
            institution: 'Apex Institute of Technology',
            degree: 'Bachelor of Technology',
            fieldOfStudy: 'Computer Science & Engineering',
            startYear: 2022,
            endYear: 2026,
            grade: '8.8 CGPA',
          }
        ] : [],
        technicalSkills: isDemoStudent ? [
          { name: 'JavaScript', proficiency: 'Advanced', verificationType: 'Assessment-verified' },
          { name: 'React', proficiency: 'Intermediate', verificationType: 'Assessment-verified' },
          { name: 'Git', proficiency: 'Intermediate', verificationType: 'Assessment-verified' },
          { name: 'HTML/CSS', proficiency: 'Advanced', verificationType: 'Self-reported' },
          { name: 'SQL', proficiency: 'Beginner', verificationType: 'Self-reported' },
          { name: 'Node.js', proficiency: 'Intermediate', verificationType: 'Self-reported' }
        ] : [],
        softSkills: isDemoStudent ? [
          'Analytical Thinking',
          'Team Collaboration',
          'Technical Communication',
          'Problem Solving'
        ] : [],
        careerInterests: isDemoStudent ? [
          'Frontend Developer',
          'Software Development',
          'Full Stack Developer'
        ] : []
      });
      inMemoryStudentStore.set(userKey, fallbackStudent);
    }
    return inMemoryStudentStore.get(userKey);
  }

  let student = await Student.findOne({ userId });
  if (!student) {
    student = await Student.create({
      userId,
      education: [],
      technicalSkills: [],
      softSkills: [],
      careerInterests: [],
    });
  }
  return student;
};

/**
 * GET /api/students/me
 * Fetch complete student profile with completion metrics
 */
const getProfile = async (req, res) => {
  try {
    const student = await getOrCreateStudentProfile(req.user._id);
    const completion = student.calculateProfileCompletion();

    return res.status(200).json({
      success: true,
      data: {
        student,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
        completion,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student profile.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * PUT /api/students/me
 * Update basic profile fields (phone, location, bio)
 */
const updateProfile = async (req, res) => {
  const { phone, location, bio } = req.body;

  if (bio && bio.length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Bio cannot exceed 500 characters.',
    });
  }

  try {
    const student = await getOrCreateStudentProfile(req.user._id);

    if (phone !== undefined) student.phone = phone.trim();
    if (location !== undefined) student.location = location.trim();
    if (bio !== undefined) student.bio = bio.trim();

    if (mongoose.connection.readyState === 1) {
      await student.save();
    }

    const completion = student.calculateProfileCompletion();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        student,
        completion,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * GET /api/students/me/skills
 * Get technical and soft skills
 */
const getSkills = async (req, res) => {
  try {
    const student = await getOrCreateStudentProfile(req.user._id);

    return res.status(200).json({
      success: true,
      data: {
        technicalSkills: student.technicalSkills || [],
        softSkills: student.softSkills || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve skills.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * PUT /api/students/me/skills
 * Update technical and soft skills
 */
const updateSkills = async (req, res) => {
  const { technicalSkills, softSkills } = req.body;

  try {
    const student = await getOrCreateStudentProfile(req.user._id);

    // Validate and sanitize Technical Skills
    if (technicalSkills !== undefined) {
      if (!Array.isArray(technicalSkills)) {
        return res.status(400).json({
          success: false,
          message: 'technicalSkills must be an array.',
        });
      }

      const sanitizedTech = [];
      const seenNames = new Set();

      for (const item of technicalSkills) {
        if (!item || !item.name || !item.name.trim()) {
          return res.status(400).json({
            success: false,
            message: 'Each technical skill must have a valid name.',
          });
        }

        const normalizedName = item.name.trim();
        const lowerKey = normalizedName.toLowerCase();

        if (!seenNames.has(lowerKey)) {
          seenNames.add(lowerKey);
          const prof = PROFICIENCY_LEVELS.includes(item.proficiency) 
            ? item.proficiency 
            : 'Beginner';

          sanitizedTech.push({
            name: normalizedName,
            proficiency: prof,
            verificationType: item.verificationType || 'Self-reported',
          });
        }
      }

      student.technicalSkills = sanitizedTech;
    }

    // Validate and sanitize Soft Skills
    if (softSkills !== undefined) {
      if (!Array.isArray(softSkills)) {
        return res.status(400).json({
          success: false,
          message: 'softSkills must be an array of strings.',
        });
      }

      const sanitizedSoft = [];
      const seenSoft = new Set();

      for (const item of softSkills) {
        if (typeof item === 'string' && item.trim()) {
          const trimmed = item.trim();
          const lowerKey = trimmed.toLowerCase();
          if (!seenSoft.has(lowerKey)) {
            seenSoft.add(lowerKey);
            sanitizedSoft.push(trimmed);
          }
        }
      }

      student.softSkills = sanitizedSoft;
    }

    if (mongoose.connection.readyState === 1) {
      await student.save();
    }

    const completion = student.calculateProfileCompletion();

    return res.status(200).json({
      success: true,
      message: 'Skills updated successfully.',
      data: {
        technicalSkills: student.technicalSkills,
        softSkills: student.softSkills,
        completion,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update skills.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * GET /api/students/me/education
 * Get student's education history
 */
const getEducation = async (req, res) => {
  try {
    const student = await getOrCreateStudentProfile(req.user._id);

    return res.status(200).json({
      success: true,
      data: {
        education: student.education || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve education history.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * POST /api/students/me/education
 * Add an education entry
 */
const addEducation = async (req, res) => {
  const { institution, degree, fieldOfStudy, startYear, endYear, grade } = req.body;

  if (!institution || !institution.trim()) {
    return res.status(400).json({ success: false, message: 'Institution name is required.' });
  }
  if (!degree || !degree.trim()) {
    return res.status(400).json({ success: false, message: 'Degree is required.' });
  }
  if (!fieldOfStudy || !fieldOfStudy.trim()) {
    return res.status(400).json({ success: false, message: 'Field of study / major is required.' });
  }
  if (!startYear || isNaN(startYear)) {
    return res.status(400).json({ success: false, message: 'Valid start year is required.' });
  }
  if (endYear && (!isNaN(endYear) && Number(endYear) < Number(startYear))) {
    return res.status(400).json({ success: false, message: 'End year cannot be earlier than start year.' });
  }

  try {
    const student = await getOrCreateStudentProfile(req.user._id);

    const newEdu = {
      institution: institution.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      startYear: Number(startYear),
      endYear: endYear && !isNaN(endYear) ? Number(endYear) : undefined,
      grade: grade ? grade.trim() : '',
    };

    student.education.push(newEdu);

    if (mongoose.connection.readyState === 1) {
      await student.save();
    }

    const completion = student.calculateProfileCompletion();

    return res.status(201).json({
      success: true,
      message: 'Education added successfully.',
      data: {
        education: student.education,
        completion,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add education.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * PUT /api/students/me/education/:eduId
 * Update an existing education entry
 */
const updateEducation = async (req, res) => {
  const { eduId } = req.params;
  const { institution, degree, fieldOfStudy, startYear, endYear, grade } = req.body;

  try {
    const student = await getOrCreateStudentProfile(req.user._id);
    const edu = student.education.id(eduId);

    if (!edu) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found.',
      });
    }

    if (institution !== undefined) edu.institution = institution.trim();
    if (degree !== undefined) edu.degree = degree.trim();
    if (fieldOfStudy !== undefined) edu.fieldOfStudy = fieldOfStudy.trim();
    if (startYear !== undefined) edu.startYear = Number(startYear);
    if (endYear !== undefined) edu.endYear = endYear ? Number(endYear) : undefined;
    if (grade !== undefined) edu.grade = grade.trim();

    if (edu.endYear && edu.startYear && edu.endYear < edu.startYear) {
      return res.status(400).json({
        success: false,
        message: 'End year cannot be earlier than start year.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      await student.save();
    }

    const completion = student.calculateProfileCompletion();

    return res.status(200).json({
      success: true,
      message: 'Education record updated.',
      data: {
        education: student.education,
        completion,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update education record.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * DELETE /api/students/me/education/:eduId
 * Delete an education record
 */
const deleteEducation = async (req, res) => {
  const { eduId } = req.params;

  try {
    const student = await getOrCreateStudentProfile(req.user._id);
    const edu = student.education.id(eduId);

    if (!edu) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found.',
      });
    }

    student.education.pull({ _id: eduId });

    if (mongoose.connection.readyState === 1) {
      await student.save();
    }

    const completion = student.calculateProfileCompletion();

    return res.status(200).json({
      success: true,
      message: 'Education record removed.',
      data: {
        education: student.education,
        completion,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete education record.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * GET /api/students/me/interests
 * Get selected career interests
 */
const getCareerInterests = async (req, res) => {
  try {
    const student = await getOrCreateStudentProfile(req.user._id);

    return res.status(200).json({
      success: true,
      data: {
        careerInterests: student.careerInterests || [],
        availableOptions: CAREER_INTERESTS,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve career interests.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * PUT /api/students/me/interests
 * Update selected career interests
 */
const updateCareerInterests = async (req, res) => {
  const { careerInterests } = req.body;

  if (!Array.isArray(careerInterests)) {
    return res.status(400).json({
      success: false,
      message: 'careerInterests must be an array of strings.',
    });
  }

  try {
    const student = await getOrCreateStudentProfile(req.user._id);

    const sanitizedInterests = [];
    const seen = new Set();

    for (const item of careerInterests) {
      if (typeof item === 'string' && item.trim()) {
        const trimmed = item.trim();
        const lowerKey = trimmed.toLowerCase();
        if (!seen.has(lowerKey)) {
          seen.add(lowerKey);
          sanitizedInterests.push(trimmed);
        }
      }
    }

    student.careerInterests = sanitizedInterests;

    if (mongoose.connection.readyState === 1) {
      await student.save();
    }

    const completion = student.calculateProfileCompletion();

    return res.status(200).json({
      success: true,
      message: 'Career interests updated successfully.',
      data: {
        careerInterests: student.careerInterests,
        completion,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update career interests.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * GET /api/students/taxonomy
 * Public or authenticated metadata endpoint returning available taxonomy
 */
const getTaxonomyMetadata = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      careerInterests: CAREER_INTERESTS,
      softSkills: SOFT_SKILLS,
      commonTechSkills: COMMON_TECH_SKILLS,
      proficiencyLevels: PROFICIENCY_LEVELS,
    },
  });
};

module.exports = {
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
  getOrCreateStudentProfile,
};
