const mongoose = require('mongoose');

/**
 * Application Model
 *
 * Represents an authenticated student's formal application to an active opportunity.
 * Tracks application lifecycle status, cover letter, resume, and chronological status history.
 */
const StatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview',
        'Selected',
        'Rejected',
        'Withdrawn',
      ],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const ApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true,
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: [true, 'Opportunity reference is required'],
      index: true,
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview',
        'Selected',
        'Rejected',
        'Withdrawn',
      ],
      default: 'Applied',
      index: true,
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
      default: '',
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    statusHistory: [StatusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring a student cannot apply twice to the same opportunity
ApplicationSchema.index({ student: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
