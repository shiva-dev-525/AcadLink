const mongoose = require('mongoose');
const geminiService = require('../services/geminiService');

/**
 * AI Controller
 *
 * Handles HTTP requests for AI career assistance, skill gap explanations,
 * learning milestones, and opportunity match intelligence.
 */

// POST /api/ai/career-assistant
async function getCareerGuidance(req, res, next) {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid question or message is required.',
      });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message exceeds maximum length of 1000 characters.',
      });
    }

    const sanitizedHistory = Array.isArray(history)
      ? history.slice(-6).map((h) => ({
          sender: h.sender === 'user' ? 'user' : 'assistant',
          text: String(h.text || '').slice(0, 500),
        }))
      : [];

    const guidance = await geminiService.generateCareerGuidance(
      req.user._id,
      message.trim(),
      sanitizedHistory
    );

    res.status(200).json({
      success: true,
      data: guidance,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/skill-gap-explanation
async function getSkillGapExplanation(req, res, next) {
  try {
    const { skillName, targetCareer } = req.body;

    if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required.',
      });
    }

    const explanation = await geminiService.explainSkillGap(
      req.user._id,
      skillName.trim(),
      targetCareer ? String(targetCareer).trim() : null
    );

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/learning-guidance
async function getLearningGuidance(req, res, next) {
  try {
    const { skillName, resourceTitle, targetCareer } = req.body;

    if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required.',
      });
    }

    const guidance = await geminiService.generateLearningGuidance(
      req.user._id,
      skillName.trim(),
      resourceTitle ? String(resourceTitle).trim() : null,
      targetCareer ? String(targetCareer).trim() : null
    );

    res.status(200).json({
      success: true,
      data: guidance,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/opportunity-explanation
async function getOpportunityExplanation(req, res, next) {
  try {
    const { opportunityId } = req.body;

    if (!opportunityId || !mongoose.Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Opportunity ID is required.',
      });
    }

    const explanation = await geminiService.explainOpportunityMatch(
      req.user._id,
      opportunityId
    );

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/application-guidance
async function getApplicationGuidance(req, res, next) {
  try {
    const { opportunityId } = req.body;

    if (!opportunityId || !mongoose.Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Opportunity ID is required.',
      });
    }

    const guidance = await geminiService.generateApplicationGuidance(
      req.user._id,
      opportunityId
    );

    res.status(200).json({
      success: true,
      data: guidance,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCareerGuidance,
  getSkillGapExplanation,
  getLearningGuidance,
  getOpportunityExplanation,
  getApplicationGuidance,
};
