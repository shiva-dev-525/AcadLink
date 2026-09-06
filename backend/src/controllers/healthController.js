const { getDbStatus } = require('../config/db');

/**
 * Health check controller
 * Endpoint: GET /api/health
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AcadLink API is running',
    timestamp: new Date().toISOString(),
    database: getDbStatus()
  });
};

module.exports = {
  getHealth
};
