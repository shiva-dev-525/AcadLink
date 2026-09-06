const mongoose = require('mongoose');

/**
 * AssessmentAttempt Model
 *
 * Records a single student's attempt at an assessment.
 * Each attempt is stored independently — retakes create new documents.
 * Server-side scoring fields (score, percentage, skillLevel) are
 * populated by the backend only on submission; frontend cannot supply them.
 */
const AnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    // 0-indexed selected option; null means question was skipped
    selectedOption: {
      type: Number,
      min: 0,
      max: 3,
      default: null,
    },
    // Populated by server during scoring
    isCorrect: {
      type: Boolean,
      default: null,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const AssessmentAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    // Array of answers (one per question)
    answers: [AnswerSchema],

    // --- Scoring fields (set by server on submission) ---
    score: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: null,
    },

    // --- Timing ---
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    timeTakenSeconds: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ['in-progress', 'completed', 'expired'],
      default: 'in-progress',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: useful for finding in-progress attempts per student+assessment
AssessmentAttemptSchema.index({ student: 1, assessment: 1, status: 1 });

module.exports = mongoose.model('AssessmentAttempt', AssessmentAttemptSchema);
