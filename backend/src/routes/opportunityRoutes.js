const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  getSavedOpportunities,
  saveOpportunity,
  unsaveOpportunity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Opportunity Routes
 *
 * Base: /api/opportunities
 */

// Public / Authenticated catalog query
router.get('/', getOpportunities);

// Saved opportunities for authenticated student (MUST precede /:opportunityId parameter)
router.get('/saved', protect, getSavedOpportunities);

// Individual opportunity details
router.get('/:opportunityId', getOpportunityById);

// Bookmark and un-bookmark operations
router.post('/:opportunityId/save', protect, saveOpportunity);
router.delete('/:opportunityId/save', protect, unsaveOpportunity);

module.exports = router;
