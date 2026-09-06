import api from './api';

/**
 * Learning Service — Phase 5
 */
export const learningService = {
  // GET /api/learning/recommendations — fetch personalized recommendations
  getRecommendations: async (career = null) => {
    const params = career ? { career } : {};
    const response = await api.get('/learning/recommendations', { params });
    return response.data;
  },

  // GET /api/learning/resources — catalog of resources
  getAllResources: async (filters = {}) => {
    const response = await api.get('/learning/resources', { params: filters });
    return response.data;
  },

  // GET /api/learning/progress — student progress list
  getMyProgress: async () => {
    const response = await api.get('/learning/progress');
    return response.data;
  },

  // PATCH /api/learning/progress/:resourceId — update status
  updateProgress: async (resourceId, status) => {
    const response = await api.patch(`/learning/progress/${resourceId}`, { status });
    return response.data;
  },
};

export default learningService;
