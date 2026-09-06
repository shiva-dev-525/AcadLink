/**
 * Assessment Service
 *
 * Contains all business logic for scoring and skill level classification.
 * Keeping these separate from the controller ensures they are testable
 * and reusable in future phases (e.g. Phase 5 skill-gap engine).
 */

/**
 * Skill level thresholds (centralized — change here to affect entire system)
 */
const SKILL_LEVEL_THRESHOLDS = {
  EXPERT: 90,
  ADVANCED: 70,
  INTERMEDIATE: 40,
  // Below INTERMEDIATE → Beginner
};

/**
 * Classify a percentage into a skill level string.
 * @param {number} percentage - 0 to 100
 * @returns {'Expert'|'Advanced'|'Intermediate'|'Beginner'}
 */
const classifySkillLevel = (percentage) => {
  if (percentage >= SKILL_LEVEL_THRESHOLDS.EXPERT) return 'Expert';
  if (percentage >= SKILL_LEVEL_THRESHOLDS.ADVANCED) return 'Advanced';
  if (percentage >= SKILL_LEVEL_THRESHOLDS.INTERMEDIATE) return 'Intermediate';
  return 'Beginner';
};

/**
 * Score a submitted attempt.
 *
 * @param {Array} questions - Array of Question documents WITH correctAnswer populated
 * @param {Array} submittedAnswers - Array of { questionId: string, selectedOption: number|null }
 * @returns {{ score, totalScore, percentage, skillLevel, answers }}
 */
const scoreAttempt = (questions, submittedAnswers) => {
  // Build a lookup map for submitted answers
  const answerMap = {};
  if (Array.isArray(submittedAnswers)) {
    submittedAnswers.forEach((a) => {
      if (a.questionId) {
        answerMap[a.questionId.toString()] = a.selectedOption ?? null;
      }
    });
  }

  let score = 0;
  let totalScore = 0;
  const answers = [];

  questions.forEach((q) => {
    const qId = q._id.toString();
    const selected = answerMap[qId] !== undefined ? answerMap[qId] : null;
    const isCorrect = selected !== null && selected === q.correctAnswer;
    const points = q.points || 1;

    totalScore += points;
    if (isCorrect) {
      score += points;
    }

    answers.push({
      questionId: q._id,
      selectedOption: selected,
      isCorrect,
      pointsEarned: isCorrect ? points : 0,
    });
  });

  const percentage = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;
  const skillLevel = classifySkillLevel(percentage);

  return {
    score,
    totalScore,
    percentage,
    skillLevel,
    answers,
  };
};

module.exports = {
  classifySkillLevel,
  scoreAttempt,
  SKILL_LEVEL_THRESHOLDS,
};
