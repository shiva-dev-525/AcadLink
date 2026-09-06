import api from './api';

/**
 * Application Service
 *
 * Handles HTTP requests to the Phase 7 Application Management endpoints.
 */
const applicationService = {
  /**
   * Submit a new application to an opportunity
   * @param {Object} data - { opportunityId, coverLetter?, resumeUrl?, contactPhone? }
   */
  submitApplication: async (data) => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  /**
   * Get all applications submitted by the authenticated student
   */
  getMyApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  /**
   * Get specific application details by ID
   * @param {string} applicationId
   */
  getApplicationById: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },

  /**
   * Withdraw an application
   * @param {string} applicationId
   */
  withdrawApplication: async (applicationId) => {
    const response = await api.patch(`/applications/${applicationId}/withdraw`);
    return response.data;
  },

  /**
   * Check if the student has already applied for a specific opportunity
   * @param {string} opportunityId
   */
  checkApplicationStatus: async (opportunityId) => {
    const response = await api.get(`/applications/check/${opportunityId}`);
    return response.data;
  },
};

export default applicationService;
