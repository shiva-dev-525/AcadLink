import api from './api';

/**
 * Opportunity Service
 *
 * Handles HTTP requests to the Phase 6 Opportunities Discovery endpoints.
 */
const opportunityService = {
  /**
   * Fetch opportunities catalog with search, filters, sorting, and pagination
   * @param {Object} params - Query parameters (search, type, workMode, experience, category, sort, page, limit)
   */
  getOpportunities: async (params = {}) => {
    const response = await api.get('/opportunities', { params });
    return response.data;
  },

  /**
   * Fetch single opportunity details by ID
   * @param {string} opportunityId
   */
  getOpportunityById: async (opportunityId) => {
    const response = await api.get(`/opportunities/${opportunityId}`);
    return response.data;
  },

  /**
   * Fetch all opportunities saved/bookmarked by the student
   */
  getSavedOpportunities: async () => {
    const response = await api.get('/opportunities/saved');
    return response.data;
  },

  /**
   * Bookmark an opportunity
   * @param {string} opportunityId
   */
  saveOpportunity: async (opportunityId) => {
    const response = await api.post(`/opportunities/${opportunityId}/save`);
    return response.data;
  },

  /**
   * Remove opportunity from bookmarks
   * @param {string} opportunityId
   */
  unsaveOpportunity: async (opportunityId) => {
    const response = await api.delete(`/opportunities/${opportunityId}/save`);
    return response.data;
  },
};

export default opportunityService;
