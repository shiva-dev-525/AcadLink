const mongoose = require('mongoose');

/**
 * SavedOpportunity Model
 *
 * Represents an opportunity bookmarked by an authenticated student.
 * Enforces uniqueness per student + opportunity pairing.
 */
const SavedOpportunitySchema = new mongoose.Schema(
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
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring a student cannot bookmark the same opportunity more than once
SavedOpportunitySchema.index({ student: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('SavedOpportunity', SavedOpportunitySchema);
