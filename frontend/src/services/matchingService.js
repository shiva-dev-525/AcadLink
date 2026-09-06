import api from './api';

/**
 * Matching Service
 *
 * Handles HTTP requests to the Phase 7 Matching endpoints.
 */
const matchingService = {
  /**
   * Get personalized opportunity recommendations for the authenticated student
   * @param {Object} params - Optional query params (type, workMode, category, experience, minScore, limit)
   */
  getRecommendedOpportunities: async (params = {}) => {
    const response = await api.get('/matching/opportunities', { params });
    return response.data;
  },
};

export default matchingService;
