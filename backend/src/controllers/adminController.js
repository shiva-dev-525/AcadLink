const adminService = require('../services/adminService');

async function getOverview(req, res, next) {
  try {
    const data = await adminService.getPlatformOverview();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getUsers(req, res, next) {
  try {
    const { role } = req.query;
    const data = await adminService.listUsers(role);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOverview,
  getUsers,
};
