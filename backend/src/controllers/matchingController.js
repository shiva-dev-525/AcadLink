const matchingService = require('../services/matchingService');

/**
 * @desc    Get rule-based personalized opportunity recommendations for student
 * @route   GET /api/matching/opportunities
 * @access  Protected (Student/Admin)
 */
const getRecommendedOpportunities = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const result = await matchingService.getRecommendedOpportunities(studentId, req.query);

    return res.status(200).json({
      success: true,
      message: 'Personalized recommendations calculated successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendedOpportunities,
};
