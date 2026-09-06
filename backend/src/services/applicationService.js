const mongoose = require('mongoose');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const { opportunitiesData } = require('../data/seedOpportunities');

/**
 * Application Service
 *
 * Manages student application submissions, duplicate prevention,
 * status transitions, history tracking, and student withdrawal operations.
 */

// In-memory mock applications map for offline/testing mode: Map<studentId_opportunityId, appDoc>
const mockApplications = new Map();

// Helper to lookup mock opportunity by id
const getMockOpportunity = (oppId) => {
  const hex = oppId.toString();
  const index = parseInt(hex.slice(-2), 16) - 1;
  if (index >= 0 && index < opportunitiesData.length) {
    return {
      ...opportunitiesData[index],
      _id: oppId,
    };
  }
  return null;
};

/**
 * Submit a new application for the authenticated student
 */
const submitApplication = async (studentId, applicationData) => {
  const { opportunityId, coverLetter, resumeUrl, contactPhone } = applicationData;

  if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
    const error = new Error('Invalid Opportunity ID format.');
    error.statusCode = 400;
    throw error;
  }

  // Degraded / offline mode handling
  if (mongoose.connection.readyState !== 1) {
    const key = `${studentId}_${opportunityId}`;
    if (mockApplications.has(key)) {
      const error = new Error('You have already applied for this opportunity.');
      error.statusCode = 400;
      throw error;
    }

    const mockOpp = getMockOpportunity(opportunityId);
    if (!mockOpp) {
      const error = new Error('Opportunity not found.');
      error.statusCode = 404;
      throw error;
    }

    if (new Date(mockOpp.deadline) < new Date()) {
      const error = new Error('The application deadline for this opportunity has passed.');
      error.statusCode = 400;
      throw error;
    }

    const newApp = {
      _id: new mongoose.Types.ObjectId(),
      student: studentId,
      opportunity: mockOpp,
      status: 'Applied',
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || '',
      contactPhone: contactPhone || '',
      appliedAt: new Date(),
      statusHistory: [
        {
          status: 'Applied',
          changedAt: new Date(),
          note: 'Application submitted successfully by candidate.',
        },
      ],
    };

    mockApplications.set(key, newApp);
    return newApp;
  }

  // 1. Verify Opportunity Exists, Is Active, and Not Expired
  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    const error = new Error('Opportunity not found.');
    error.statusCode = 404;
    throw error;
  }

  if (opportunity.status !== 'Active') {
    const error = new Error('This opportunity is closed and no longer accepting applications.');
    error.statusCode = 400;
    throw error;
  }

  if (new Date(opportunity.deadline) < new Date()) {
    const error = new Error('The application deadline for this opportunity has passed.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Prevent Duplicate Application
  const existingApp = await Application.findOne({
    student: studentId,
    opportunity: opportunityId,
  });

  if (existingApp) {
    const error = new Error('You have already applied for this opportunity.');
    error.statusCode = 400;
    throw error;
  }

  // 3. Create Application with Initial Status History
  const application = await Application.create({
    student: studentId,
    opportunity: opportunityId,
    coverLetter: coverLetter || '',
    resumeUrl: resumeUrl || '',
    contactPhone: contactPhone || '',
    status: 'Applied',
    appliedAt: new Date(),
    statusHistory: [
      {
        status: 'Applied',
        changedAt: new Date(),
        note: 'Application submitted successfully by candidate.',
      },
    ],
  });

  await application.populate('opportunity');
  return application;
};

/**
 * Retrieve all applications submitted by the authenticated student
 */
const getMyApplications = async (studentId) => {
  if (mongoose.connection.readyState !== 1) {
    const apps = Array.from(mockApplications.values()).filter(
      (app) => app.student.toString() === studentId.toString()
    );
    return apps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }

  const applications = await Application.find({ student: studentId })
    .populate('opportunity')
    .sort({ appliedAt: -1 })
    .lean();

  return applications.filter((app) => app.opportunity !== null);
};

/**
 * Retrieve specific application details by ID (verifying ownership)
 */
const getApplicationById = async (applicationId, studentId) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    const error = new Error('Invalid Application ID format.');
    error.statusCode = 400;
    throw error;
  }

  if (mongoose.connection.readyState !== 1) {
    const app = Array.from(mockApplications.values()).find(
      (a) => a._id.toString() === applicationId.toString()
    );
    if (!app || app.student.toString() !== studentId.toString()) {
      const error = new Error('Application not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return app;
  }

  const application = await Application.findById(applicationId)
    .populate('opportunity')
    .lean();

  if (!application) {
    const error = new Error('Application not found.');
    error.statusCode = 404;
    throw error;
  }

  // Verify ownership
  if (application.student.toString() !== studentId.toString()) {
    const error = new Error('Access denied. You can only view your own applications.');
    error.statusCode = 403;
    throw error;
  }

  return application;
};

/**
 * Withdraw an application (permitted only while in 'Applied' or 'Under Review')
 */
const withdrawApplication = async (applicationId, studentId) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    const error = new Error('Invalid Application ID format.');
    error.statusCode = 400;
    throw error;
  }

  if (mongoose.connection.readyState !== 1) {
    const app = Array.from(mockApplications.values()).find(
      (a) => a._id.toString() === applicationId.toString()
    );
    if (!app || app.student.toString() !== studentId.toString()) {
      const error = new Error('Application not found or access denied.');
      error.statusCode = 404;
      throw error;
    }

    if (!['Applied', 'Under Review'].includes(app.status)) {
      const error = new Error(`Cannot withdraw application with status '${app.status}'.`);
      error.statusCode = 400;
      throw error;
    }

    app.status = 'Withdrawn';
    app.statusHistory.push({
      status: 'Withdrawn',
      changedAt: new Date(),
      note: 'Application withdrawn by candidate.',
    });

    return app;
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    const error = new Error('Application not found.');
    error.statusCode = 404;
    throw error;
  }

  if (application.student.toString() !== studentId.toString()) {
    const error = new Error('Access denied.');
    error.statusCode = 403;
    throw error;
  }

  if (!['Applied', 'Under Review'].includes(application.status)) {
    const error = new Error(
      `Cannot withdraw an application with current status '${application.status}'.`
    );
    error.statusCode = 400;
    throw error;
  }

  application.status = 'Withdrawn';
  application.statusHistory.push({
    status: 'Withdrawn',
    changedAt: new Date(),
    note: 'Application withdrawn by candidate.',
  });

  await application.save();
  await application.populate('opportunity');
  return application;
};

/**
 * Check if the student has already applied for a specific opportunity
 */
const checkApplicationStatus = async (opportunityId, studentId) => {
  if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
    return { hasApplied: false, application: null };
  }

  if (mongoose.connection.readyState !== 1) {
    const key = `${studentId}_${opportunityId}`;
    const app = mockApplications.get(key);
    return {
      hasApplied: Boolean(app),
      application: app || null,
    };
  }

  const app = await Application.findOne({
    student: studentId,
    opportunity: opportunityId,
  }).lean();

  return {
    hasApplied: Boolean(app),
    application: app || null,
  };
};

module.exports = {
  submitApplication,
  getMyApplications,
  getApplicationById,
  withdrawApplication,
  checkApplicationStatus,
};
