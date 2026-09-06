const mongoose = require('mongoose');

/**
 * Opportunity Model
 *
 * Represents an industry or institutional opportunity (Internship, Job, Training)
 * available for students to discover, bookmark, and eventually apply to.
 */
const OpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
      index: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['Internship', 'Job', 'Training'],
      required: [true, 'Opportunity type is required'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Opportunity description is required'],
      trim: true,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    preferredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    eligibility: {
      type: String,
      trim: true,
      default: 'Open to current students and recent graduates in relevant fields.',
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Hybrid',
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
      index: true,
    },
    stipend: {
      type: String,
      trim: true,
      default: '',
    },
    salary: {
      type: String,
      trim: true,
      default: '',
    },
    duration: {
      type: String,
      trim: true,
      default: '3 Months',
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, 'Openings count must be at least 1'],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
      index: true,
    },
    applicationUrl: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Software Development',
        'Data',
        'AI/ML',
        'Cloud',
        'Cybersecurity',
        'Design',
        'Business',
        'Other',
      ],
      required: [true, 'Category is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for case-insensitive search across key textual fields
OpportunitySchema.index(
  {
    title: 'text',
    organization: 'text',
    description: 'text',
    requiredSkills: 'text',
    category: 'text',
  },
  {
    weights: {
      title: 10,
      requiredSkills: 6,
      organization: 5,
      category: 3,
      description: 1,
    },
    name: 'OpportunityTextIndex',
  }
);

module.exports = mongoose.model('Opportunity', OpportunitySchema);
