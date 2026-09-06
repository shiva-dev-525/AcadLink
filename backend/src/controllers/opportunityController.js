const mongoose = require('mongoose');
const opportunityService = require('../services/opportunityService');
const { verifyToken } = require('../utils/jwt');

/**
 * Helper to optionally extract authenticated user ID from Authorization header
 * without failing public read requests.
 */
const getOptionalUserId = (req) => {
  if (req.user && req.user._id) {
    return req.user._id;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      return decoded.userId;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * @desc    Get catalog of opportunities with search, filtering, sorting, pagination
 * @route   GET /api/opportunities
 * @access  Public / Authenticated
 */
const getOpportunities = async (req, res, next) => {
  try {
    const userId = getOptionalUserId(req);
    const result = await opportunityService.listOpportunities(req.query, userId);

    return res.status(200).json({
      success: true,
      message: 'Opportunities retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get specific opportunity details by ID
 * @route   GET /api/opportunities/:opportunityId
 * @access  Public / Authenticated
 */
const getOpportunityById = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity ID format.',
      });
    }

    const userId = getOptionalUserId(req);
    const opportunity = await opportunityService.getOpportunityById(opportunityId, userId);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found or no longer active.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Opportunity details retrieved successfully',
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all opportunities saved by the authenticated student
 * @route   GET /api/opportunities/saved
 * @access  Protected (Student/Admin)
 */
const getSavedOpportunities = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const saved = await opportunityService.getSavedOpportunities(userId);

    return res.status(200).json({
      success: true,
      message: 'Saved opportunities retrieved successfully',
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bookmark an opportunity for the authenticated student
 * @route   POST /api/opportunities/:opportunityId/save
 * @access  Protected (Student/Admin)
 */
const saveOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity ID format.',
      });
    }

    const userId = req.user._id;
    const result = await opportunityService.saveOpportunity(opportunityId, userId);

    return res.status(200).json({
      success: true,
      message: 'Opportunity bookmarked successfully',
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Remove bookmark for an opportunity
 * @route   DELETE /api/opportunities/:opportunityId/save
 * @access  Protected (Student/Admin)
 */
const unsaveOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity ID format.',
      });
    }

    const userId = req.user._id;
    const result = await opportunityService.unsaveOpportunity(opportunityId, userId);

    return res.status(200).json({
      success: true,
      message: 'Opportunity removed from bookmarks',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  getSavedOpportunities,
  saveOpportunity,
  unsaveOpportunity,
};
