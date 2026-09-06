const mongoose = require('mongoose');

/**
 * Assessment Model
 *
 * Represents a skill assessment that students can take.
 * Questions are referenced by ObjectId so they can be populated
 * with or without correctAnswer depending on the context.
 */
const AssessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assessment title is required'],
      trim: true,
    },
    skill: {
      type: String,
      required: [true, 'Skill name is required'],
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
    },
    // Duration in minutes (0 = no time limit)
    durationMinutes: {
      type: Number,
      default: 15,
      min: 0,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
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

// Virtual for question count (convenience)
AssessmentSchema.virtual('questionCount').get(function () {
  return this.questions ? this.questions.length : 0;
});

AssessmentSchema.set('toJSON', { virtuals: true });
AssessmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);
