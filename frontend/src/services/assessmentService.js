import api from './api';

/**
 * Assessment Service — Phase 4
 * All assessment-related API calls.
 */
export const assessmentService = {
  // GET /api/assessments — list all active assessments
  getAssessments: async () => {
    const response = await api.get('/assessments');
    return response.data;
  },

  // GET /api/assessments/:id — single assessment detail
  getAssessmentById: async (assessmentId) => {
    const response = await api.get(`/assessments/${assessmentId}`);
    return response.data;
  },

  // POST /api/assessments/:id/start — start a new attempt
  startAssessment: async (assessmentId) => {
    const response = await api.post(`/assessments/${assessmentId}/start`);
    return response.data;
  },

  // POST /api/assessments/attempts/:attemptId/submit — submit answers
  submitAssessment: async (attemptId, answers, timeTakenSeconds) => {
    const response = await api.post(`/assessments/attempts/${attemptId}/submit`, {
      answers,
      timeTakenSeconds,
    });
    return response.data;
  },

  // GET /api/assessments/attempts — all my attempts
  getMyAttempts: async () => {
    const response = await api.get('/assessments/attempts');
    return response.data;
  },

  // GET /api/assessments/attempts/:id — single attempt result
  getAttemptById: async (attemptId) => {
    const response = await api.get(`/assessments/attempts/${attemptId}`);
    return response.data;
  },
};

export default assessmentService;
