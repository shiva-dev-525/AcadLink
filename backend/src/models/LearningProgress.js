const mongoose = require('mongoose');

/**
 * LearningProgress Model
 *
 * Tracks an authenticated student's individual progress on a learning resource.
 * Enforces uniqueness per student + resource pair.
 */
const LearningProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningResource',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
      index: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate tracking documents for the same student and resource
LearningProgressSchema.index({ student: 1, resource: 1 }, { unique: true });

module.exports = mongoose.model('LearningProgress', LearningProgressSchema);
