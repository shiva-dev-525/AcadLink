const applicationService = require('../services/applicationService');

/**
 * @desc    Submit a formal application to an opportunity
 * @route   POST /api/applications
 * @access  Protected (Student/Admin)
 */
const submitApplication = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const application = await applicationService.submitApplication(studentId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: application,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all applications submitted by authenticated student
 * @route   GET /api/applications
 * @access  Protected (Student/Admin)
 */
const getMyApplications = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const applications = await applicationService.getMyApplications(studentId);

    return res.status(200).json({
      success: true,
      message: 'Student applications retrieved successfully.',
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of a specific application
 * @route   GET /api/applications/:applicationId
 * @access  Protected (Student/Admin)
 */
const getApplicationById = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { applicationId } = req.params;
    const application = await applicationService.getApplicationById(applicationId, studentId);

    return res.status(200).json({
      success: true,
      message: 'Application retrieved successfully.',
      data: application,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Withdraw an application
 * @route   PATCH /api/applications/:applicationId/withdraw
 * @access  Protected (Student/Admin)
 */
const withdrawApplication = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { applicationId } = req.params;
    const updated = await applicationService.withdrawApplication(applicationId, studentId);

    return res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully.',
      data: updated,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Check application status for a specific opportunity
 * @route   GET /api/applications/check/:opportunityId
 * @access  Protected (Student/Admin)
 */
const checkApplicationStatus = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { opportunityId } = req.params;
    const result = await applicationService.checkApplicationStatus(opportunityId, studentId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
  getApplicationById,
  withdrawApplication,
  checkApplicationStatus,
};
