const analyticsService = require('../services/analyticsService');

// @desc    Get dashboard analytics for manager
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const { timeframe = '7d' } = req.query;

    const data = await analyticsService.getManagerAnalytics(
      req.user._id,
      timeframe
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
