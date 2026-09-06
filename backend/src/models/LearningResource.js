const mongoose = require('mongoose');

/**
 * LearningResource Model
 *
 * Represents a curated learning item (course, documentation, tutorial, video, project)
 * mapped to a specific skill for remedial or advanced learning.
 */
const LearningResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    skill: {
      type: String,
      required: [true, 'Target skill name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
      index: true,
    },
    resourceType: {
      type: String,
      enum: ['Course', 'Article', 'Video', 'Documentation', 'Tutorial', 'Project'],
      default: 'Tutorial',
    },
    estimatedDuration: {
      type: String,
      trim: true,
      default: '45 min',
    },
    provider: {
      type: String,
      trim: true,
      default: 'Portal Academy',
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
    order: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LearningResource', LearningResourceSchema);
