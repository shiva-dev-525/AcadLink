import api from './api';

/**
 * AI Service
 *
 * Client-side integration for Gemini intelligence layer features:
 * - Interactive Career Assistant
 * - Contextual Skill Gap Explanations
 * - Personalized Learning Roadmaps
 * - Opportunity Match Intelligence
 * - Application & Interview Prep Checklists
 */
const aiService = {
  /**
   * Send a question to the AI Career Assistant
   * @param {string} message - The student's question
   * @param {Array} history - Optional recent conversation history [{ sender: 'user'|'assistant', text: string }]
   */
  getCareerGuidance: async (message, history = []) => {
    try {
      const res = await api.post('/ai/career-assistant', { message, history });
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'AI Career Assistant is temporarily unavailable.',
        data: null,
      };
    }
  },

  /**
   * Request contextual explanation and bridging roadmap for a skill gap
   * @param {string} skillName
   * @param {string} [targetCareer]
   */
  getSkillGapExplanation: async (skillName, targetCareer) => {
    try {
      const res = await api.post('/ai/skill-gap-explanation', { skillName, targetCareer });
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Skill gap explanation temporarily unavailable.',
        data: null,
      };
    }
  },

  /**
   * Request personalized weekly milestones and portfolio project idea for a skill
   * @param {string} skillName
   * @param {string} [resourceTitle]
   * @param {string} [targetCareer]
   */
  getLearningGuidance: async (skillName, resourceTitle, targetCareer) => {
    try {
      const res = await api.post('/ai/learning-guidance', {
        skillName,
        resourceTitle,
        targetCareer,
      });
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Learning guidance temporarily unavailable.',
        data: null,
      };
    }
  },

  /**
   * Request AI Opportunity Match Explanation
   * @param {string} opportunityId
   */
  getOpportunityExplanation: async (opportunityId) => {
    try {
      const res = await api.post('/ai/opportunity-explanation', { opportunityId });
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Opportunity match analysis temporarily unavailable.',
        data: null,
      };
    }
  },

  /**
   * Request Application & Interview Preparation Guidance
   * @param {string} opportunityId
   */
  getApplicationGuidance: async (opportunityId) => {
    try {
      const res = await api.post('/ai/application-guidance', { opportunityId });
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Application guidance temporarily unavailable.',
        data: null,
      };
    }
  },
};

export default aiService;
