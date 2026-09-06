const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Please provide institution name'],
    trim: true,
  },
  degree: {
    type: String,
    required: [true, 'Please provide degree'],
    trim: true,
  },
  fieldOfStudy: {
    type: String,
    required: [true, 'Please provide field of study / major'],
    trim: true,
  },
  startYear: {
    type: Number,
    required: [true, 'Please provide start year'],
    min: [1970, 'Start year must be valid'],
    max: [2100, 'Start year must be valid'],
  },
  endYear: {
    type: Number,
    min: [1970, 'End year must be valid'],
    max: [2100, 'End year must be valid'],
  },
  grade: {
    type: String,
    trim: true,
    default: '',
  },
});

const TechnicalSkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide skill name'],
    trim: true,
  },
  proficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  verificationType: {
    type: String,
    enum: ['Self-reported', 'Assessment-verified', 'Certification-verified'],
    default: 'Self-reported',
  },
});

const StudentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    education: [EducationSchema],
    technicalSkills: [TechnicalSkillSchema],
    softSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    careerInterests: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Helper to calculate profile completion breakdown and percentage
 */
StudentSchema.methods.calculateProfileCompletion = function () {
  let score = 0;
  const completedSections = [];
  const incompleteSections = [];

  // 1. Basic Info (Bio or Location or Phone) (20%)
  if ((this.bio && this.bio.trim()) || (this.location && this.location.trim()) || (this.phone && this.phone.trim())) {
    score += 20;
    completedSections.push('Basic Information');
  } else {
    incompleteSections.push('Add contact info, location or bio');
  }

  // 2. Education (20%)
  if (this.education && this.education.length > 0) {
    score += 20;
    completedSections.push('Education');
  } else {
    incompleteSections.push('Add education history');
  }

  // 3. Technical Skills (20%)
  if (this.technicalSkills && this.technicalSkills.length > 0) {
    score += 20;
    completedSections.push('Technical Skills');
  } else {
    incompleteSections.push('Add at least one technical skill');
  }

  // 4. Soft Skills (20%)
  if (this.softSkills && this.softSkills.length > 0) {
    score += 20;
    completedSections.push('Soft Skills');
  } else {
    incompleteSections.push('Add at least one soft skill');
  }

  // 5. Career Interests (20%)
  if (this.careerInterests && this.careerInterests.length > 0) {
    score += 20;
    completedSections.push('Career Interests');
  } else {
    incompleteSections.push('Select career interests');
  }

  return {
    percentage: score,
    isComplete: score === 100,
    completedSections,
    incompleteSections,
  };
};

module.exports = mongoose.model('Student', StudentSchema);
