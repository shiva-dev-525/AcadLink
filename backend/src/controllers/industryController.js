const industryService = require('../services/industryService');

async function getDashboard(req, res, next) {
  try {
    const data = await industryService.getIndustryDashboardStats(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const data = await industryService.getOrganizationProfile(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const data = await industryService.updateOrganizationProfile(req.user._id, req.body);
    res.status(200).json({ success: true, message: 'Organization profile updated successfully.', data });
  } catch (err) {
    next(err);
  }
}

async function createOpportunity(req, res, next) {
  try {
    const data = await industryService.createOpportunity(req.user._id, req.body);
    res.status(201).json({ success: true, message: 'Opportunity published successfully.', data });
  } catch (err) {
    next(err);
  }
}

async function getApplicants(req, res, next) {
  try {
    const { opportunityId } = req.params;
    const data = await industryService.getOpportunityApplicants(opportunityId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { applicationId } = req.params;
    const { status, note } = req.body;
    const data = await industryService.updateApplicationStatus(applicationId, status, note);
    res.status(200).json({ success: true, message: `Application status updated to '${status}'.`, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  createOpportunity,
  getApplicants,
  updateStatus,
};
