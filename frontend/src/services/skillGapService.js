import api from './api';

/**
 * Skill Gap Service — Phase 5
 */
export const skillGapService = {
  // GET /api/skill-gaps/me — compute and fetch skill gap analysis
  getMySkillGaps: async (career = null) => {
    const params = career ? { career } : {};
    const response = await api.get('/skill-gaps/me', { params });
    return response.data;
  },

  // GET /api/skill-gaps/careers — list supported career goals
  getSupportedCareers: async () => {
    const response = await api.get('/skill-gaps/careers');
    return response.data;
  },
};

export default skillGapService;
