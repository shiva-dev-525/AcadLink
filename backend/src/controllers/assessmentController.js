const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const { scoreAttempt } = require('../services/assessmentService');
const mongoose = require('mongoose');
const {
  getMockAssessments,
  getMockAssessmentById,
  startMockAttempt,
  submitMockAttempt,
  getMockMyAttempts,
  getMockAttemptById
} = require('../data/mockAssessmentStore');

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Safely validate a MongoDB ObjectId string.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── GET /api/assessments ────────────────────────────────────────────────────

/**
 * List all active assessments.
 * Returns safe metadata — NO correctAnswer exposed.
 */
const getAssessments = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const result = getMockAssessments();
    return res.status(200).json({
      success: true,
      data: { assessments: result },
    });
  }

  try {
    const assessments = await Assessment.find({ isActive: true })
      .select('title skill description difficulty durationMinutes questions createdAt')
      .lean();

    // Add question count without populating question documents
    const result = assessments.map((a) => ({
      ...a,
      questionCount: a.questions ? a.questions.length : 0,
    }));

    return res.status(200).json({
      success: true,
      data: { assessments: result },
    });
  } catch (error) {
    console.error('getAssessments error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load assessments.' });
  }
};

// ─── GET /api/assessments/:assessmentId ─────────────────────────────────────

/**
 * Get a single assessment's details (no questions content, no correctAnswer).
 */
const getAssessmentById = async (req, res) => {
  const { assessmentId } = req.params;

  if (!isValidObjectId(assessmentId)) {
    return res.status(400).json({ success: false, message: 'Invalid assessment ID.' });
  }

  if (mongoose.connection.readyState !== 1) {
    const a = getMockAssessmentById(assessmentId);
    if (!a) return res.status(404).json({ success: false, message: 'Assessment not found.' });
    return res.status(200).json({ success: true, data: { assessment: a } });
  }

  try {
    const assessment = await Assessment.findOne({ _id: assessmentId, isActive: true })
      .select('title skill description difficulty durationMinutes questions createdAt')
      .lean();

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        assessment: {
          ...assessment,
          questionCount: assessment.questions ? assessment.questions.length : 0,
        },
      },
    });
  } catch (error) {
    console.error('getAssessmentById error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load assessment.' });
  }
};

// ─── POST /api/assessments/:assessmentId/start ───────────────────────────────

/**
 * Start a new assessment attempt.
 *
 * Security:
 * - Student identity from JWT (not from body)
 * - Questions returned WITHOUT correctAnswer
 * - Allows multiple attempts (each creates a new document)
 * - If an in-progress attempt already exists, returns it instead of creating duplicate
 */
const startAssessment = async (req, res) => {
  const { assessmentId } = req.params;
  const studentId = req.user._id;

  if (!isValidObjectId(assessmentId)) {
    return res.status(400).json({ success: false, message: 'Invalid assessment ID.' });
  }

  if (mongoose.connection.readyState !== 1) {
    const result = startMockAttempt(assessmentId, studentId);
    if (!result) return res.status(404).json({ success: false, message: 'Assessment not found.' });
    return res.status(result.resumed ? 200 : 201).json({ success: true, data: result });
  }

  try {
    const assessment = await Assessment.findOne({ _id: assessmentId, isActive: true }).lean();

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    // Check for an existing in-progress attempt to prevent duplicates
    const existingAttempt = await AssessmentAttempt.findOne({
      student: studentId,
      assessment: assessmentId,
      status: 'in-progress',
    });

    if (existingAttempt) {
      // Resume the in-progress attempt
      const questions = await Question.find({ _id: { $in: assessment.questions } })
        .select('questionText options points difficulty')
        // correctAnswer intentionally excluded
        .lean();

      return res.status(200).json({
        success: true,
        data: {
          attempt: existingAttempt,
          questions,
          assessment: {
            _id: assessment._id,
            title: assessment.title,
            skill: assessment.skill,
            durationMinutes: assessment.durationMinutes,
          },
          resumed: true,
        },
      });
    }

    // Fetch questions WITHOUT correctAnswer
    const questions = await Question.find({ _id: { $in: assessment.questions } })
      .select('questionText options points difficulty')
      .lean();

    // Create new attempt
    const attempt = await AssessmentAttempt.create({
      student: studentId,
      assessment: assessmentId,
      answers: [],
      status: 'in-progress',
      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: {
        attempt,
        questions,
        assessment: {
          _id: assessment._id,
          title: assessment.title,
          skill: assessment.skill,
          durationMinutes: assessment.durationMinutes,
        },
        resumed: false,
      },
    });
  } catch (error) {
    console.error('startAssessment error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to start assessment.' });
  }
};

// ─── POST /api/assessments/attempts/:attemptId/submit ────────────────────────

/**
 * Submit an assessment attempt for server-side scoring.
 *
 * Security:
 * - Ownership enforced: only the student who created the attempt can submit
 * - Completed/expired attempts cannot be re-submitted
 * - Score computed entirely on the backend; any score in req.body is ignored
 * - correctAnswer fetched internally and NEVER returned in this response
 */
const submitAssessment = async (req, res) => {
  const { attemptId } = req.params;
  const studentId = req.user._id;

  if (!isValidObjectId(attemptId)) {
    return res.status(400).json({ success: false, message: 'Invalid attempt ID.' });
  }

  if (mongoose.connection.readyState !== 1) {
    const { answers, timeTakenSeconds } = req.body;
    const result = submitMockAttempt(attemptId, studentId, answers, timeTakenSeconds);
    if (result.error) return res.status(result.code || 400).json({ success: false, message: result.error });
    return res.status(200).json(result);
  }

  try {
    const attempt = await AssessmentAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Assessment attempt not found.' });
    }

    // Ownership check
    if (attempt.student.toString() !== studentId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: this attempt does not belong to you.' });
    }

    // Prevent re-submission
    if (attempt.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'This attempt has already been submitted or has expired.',
      });
    }

    // Fetch the assessment to get the question list
    const assessment = await Assessment.findById(attempt.assessment).lean();
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    // Fetch questions WITH correctAnswer for server-side scoring only
    const questions = await Question.find({ _id: { $in: assessment.questions } })
      .select('+correctAnswer')
      .lean();

    // Extract submitted answers from request body
    const { answers: submittedAnswers, timeTakenSeconds } = req.body;

    // Score the attempt
    const { score, totalScore, percentage, skillLevel, answers } = scoreAttempt(
      questions,
      submittedAnswers || []
    );

    const submittedAt = new Date();

    // Save the scored attempt
    attempt.answers = answers;
    attempt.score = score;
    attempt.totalScore = totalScore;
    attempt.percentage = percentage;
    attempt.skillLevel = skillLevel;
    attempt.submittedAt = submittedAt;
    attempt.timeTakenSeconds = timeTakenSeconds || null;
    attempt.status = 'completed';

    await attempt.save();

    return res.status(200).json({
      success: true,
      data: {
        attemptId: attempt._id,
        score,
        totalScore,
        percentage,
        skillLevel,
        submittedAt,
        assessmentId: assessment._id,
        assessmentTitle: assessment.title,
        skill: assessment.skill,
      },
    });
  } catch (error) {
    console.error('submitAssessment error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to submit assessment.' });
  }
};

// ─── GET /api/assessments/attempts ──────────────────────────────────────────

/**
 * Get all attempts for the authenticated student.
 * Newest first. Only the student's own attempts are returned.
 */
const getMyAttempts = async (req, res) => {
  const studentId = req.user._id;

  if (mongoose.connection.readyState !== 1) {
    const attempts = getMockMyAttempts(studentId);
    return res.status(200).json({
      success: true,
      data: { attempts },
    });
  }

  try {
    const attempts = await AssessmentAttempt.find({ student: studentId })
      .populate('assessment', 'title skill difficulty durationMinutes')
      .select('assessment score totalScore percentage skillLevel status startedAt submittedAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: { attempts },
    });
  } catch (error) {
    console.error('getMyAttempts error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load assessment history.' });
  }
};

// ─── GET /api/assessments/attempts/:attemptId ────────────────────────────────

/**
 * Get a single completed attempt with full result details.
 *
 * After submission, correctAnswer and explanation ARE exposed
 * so the student can review which answers were right/wrong.
 *
 * Security: only the owning student can access their attempt.
 */
const getAttemptById = async (req, res) => {
  const { attemptId } = req.params;
  const studentId = req.user._id;

  if (!isValidObjectId(attemptId)) {
    return res.status(400).json({ success: false, message: 'Invalid attempt ID.' });
  }

  if (mongoose.connection.readyState !== 1) {
    const result = getMockAttemptById(attemptId, studentId);
    if (!result) return res.status(404).json({ success: false, message: 'Attempt not found.' });
    return res.status(200).json({ success: true, data: result });
  }

  try {
    const attempt = await AssessmentAttempt.findById(attemptId)
      .populate('assessment', 'title skill description difficulty durationMinutes')
      .lean();

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found.' });
    }

    // Ownership check
    if (attempt.student.toString() !== studentId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    // Only show question details for completed/expired attempts
    if (attempt.status !== 'completed' && attempt.status !== 'expired') {
      return res.status(400).json({
        success: false,
        message: 'Results are only available after the assessment is submitted.',
      });
    }

    // Fetch the assessment questions WITH correctAnswer (for review)
    const assessment = await Assessment.findById(attempt.assessment._id).lean();
    const questions = await Question.find({ _id: { $in: assessment.questions } })
      .select('+correctAnswer')
      .lean();

    // Build per-question review array
    const questionReview = questions.map((q) => {
      const answerRecord = attempt.answers.find(
        (a) => a.questionId && a.questionId.toString() === q._id.toString()
      );

      return {
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        selectedOption: answerRecord ? answerRecord.selectedOption : null,
        isCorrect: answerRecord ? answerRecord.isCorrect : false,
        pointsEarned: answerRecord ? answerRecord.pointsEarned : 0,
        points: q.points,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        attempt: {
          _id: attempt._id,
          assessment: attempt.assessment,
          score: attempt.score,
          totalScore: attempt.totalScore,
          percentage: attempt.percentage,
          skillLevel: attempt.skillLevel,
          status: attempt.status,
          startedAt: attempt.startedAt,
          submittedAt: attempt.submittedAt,
          timeTakenSeconds: attempt.timeTakenSeconds,
        },
        questionReview,
      },
    });
  } catch (error) {
    console.error('getAttemptById error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load attempt result.' });
  }
};

module.exports = {
  getAssessments,
  getAssessmentById,
  startAssessment,
  submitAssessment,
  getMyAttempts,
  getAttemptById,
};
