const mongoose = require('mongoose');

/**
 * Question Model
 *
 * Represents a single MCQ question.
 * correctAnswer is protected with select:false — it is NEVER returned
 * unless explicitly requested via .select('+correctAnswer').
 * This ensures correct answers are never leaked to the frontend during
 * an active assessment session.
 */
const QuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    // Exactly 4 options (A, B, C, D)
    options: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 4,
        message: 'A question must have exactly 4 options',
      },
      required: true,
    },
    // 0-indexed position in options array (0=A, 1=B, 2=C, 3=D)
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
      select: false, // CRITICAL: never expose correct answer by default
    },
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
    points: {
      type: Number,
      default: 1,
      min: 1,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', QuestionSchema);
