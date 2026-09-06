const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Student = require('../models/Student');
const User = require('../models/User');
const Organization = require('../models/Organization');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const { calculateOpportunityMatch } = require('./matchingService');
const { opportunitiesData } = require('../data/seedOpportunities');

// Mock memory store for offline mode
const mockOrganizations = new Map();
const mockOrgOpportunities = [...opportunitiesData.map((item, index) => ({
  ...item,
  _id: new mongoose.Types.ObjectId(`66d0000000000000000000${(index + 1).toString(16).padStart(2, '0')}`),
  createdAt: new Date(Date.now() - (14 - index) * 3600000),
}))];

/**
 * Get or create default organization profile for authenticated industry user
 */
async function getOrganizationProfile(userId) {
  if (mongoose.connection.readyState !== 1) {
    if (!mockOrganizations.has(userId.toString())) {
      mockOrganizations.set(userId.toString(), {
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        name: 'Nexis Cloud Technologies',
        category: 'Cloud & Distributed Systems',
        description: 'Pioneering next-generation enterprise cloud architecture and distributed microservices.',
        website: 'https://nexiscloud.io',
        location: 'Bengaluru, India',
        contactEmail: 'recruiter@nexiscloud.io',
        contactPhone: '+91-98765-43210',
        isVerified: true,
      });
    }
    return mockOrganizations.get(userId.toString());
  }

  let org = await Organization.findOne({ user: userId });
  if (!org) {
    const userDoc = await User.findById(userId);
    org = await Organization.create({
      user: userId,
      name: userDoc?.name ? `${userDoc.name}'s Organization` : 'Nexis Cloud Technologies',
      contactEmail: userDoc?.email || '',
    });
  }
  return org;
}

/**
 * Update organization profile
 */
async function updateOrganizationProfile(userId, data) {
  const { name, category, description, website, location, contactEmail, contactPhone } = data;

  if (mongoose.connection.readyState !== 1) {
    const org = await getOrganizationProfile(userId);
    if (name) org.name = name;
    if (category) org.category = category;
    if (description) org.description = description;
    if (website !== undefined) org.website = website;
    if (location) org.location = location;
    if (contactEmail) org.contactEmail = contactEmail;
    if (contactPhone !== undefined) org.contactPhone = contactPhone;
    mockOrganizations.set(userId.toString(), org);
    return org;
  }

  let org = await Organization.findOne({ user: userId });
  if (!org) {
    org = new Organization({ user: userId });
  }

  if (name) org.name = name;
  if (category) org.category = category;
  if (description) org.description = description;
  if (website !== undefined) org.website = website;
  if (location) org.location = location;
  if (contactEmail) org.contactEmail = contactEmail;
  if (contactPhone !== undefined) org.contactPhone = contactPhone;

  await org.save();
  return org;
}

/**
 * Get Industry Dashboard statistics and recent applications
 */
async function getIndustryDashboardStats(userId) {
  const org = await getOrganizationProfile(userId);

  if (mongoose.connection.readyState !== 1) {
    const activeOpps = mockOrgOpportunities.filter((o) => o.status === 'Active');
    return {
      organization: org,
      stats: {
        activeOpportunities: activeOpps.length,
        totalApplications: 18,
        underReview: 7,
        shortlisted: 4,
        interviews: 2,
      },
      recentApplications: [
        {
          _id: new mongoose.Types.ObjectId(),
          opportunityTitle: 'Frontend Developer Intern',
          opportunityId: mockOrgOpportunities[0]._id,
          candidateName: 'Aarav Sharma',
          candidateEmail: 'aarav.student@academia.edu',
          status: 'Under Review',
          appliedAt: new Date(Date.now() - 3600000 * 4),
          matchScore: 84,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          opportunityTitle: 'Java Backend Intern',
          opportunityId: mockOrgOpportunities[1]._id,
          candidateName: 'Priya Patel',
          candidateEmail: 'priya.student@academia.edu',
          status: 'Shortlisted',
          appliedAt: new Date(Date.now() - 3600000 * 24),
          matchScore: 92,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          opportunityTitle: 'Cloud DevOps Associate',
          opportunityId: mockOrgOpportunities[2]._id,
          candidateName: 'Rohan Verma',
          candidateEmail: 'rohan.student@academia.edu',
          status: 'Applied',
          appliedAt: new Date(Date.now() - 3600000 * 48),
          matchScore: 78,
        },
      ],
    };
  }

  // Live database queries
  const oppCount = await Opportunity.countDocuments({ status: 'Active' });
  const totalApps = await Application.countDocuments();
  const underReviewCount = await Application.countDocuments({ status: 'Under Review' });
  const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });
  const interviewCount = await Application.countDocuments({ status: 'Interview' });

  const recent = await Application.find()
    .populate('opportunity', 'title organization')
    .populate('student', 'name email')
    .sort({ appliedAt: -1 })
    .limit(8)
    .lean();

  const formattedRecent = recent
    .filter((a) => a.opportunity)
    .map((a) => ({
      _id: a._id,
      opportunityTitle: a.opportunity?.title || 'Role',
      opportunityId: a.opportunity?._id,
      candidateName: a.student?.name || 'Student Candidate',
      candidateEmail: a.student?.email || '',
      status: a.status,
      appliedAt: a.appliedAt,
      matchScore: Math.floor(75 + (a._id.toString().charCodeAt(a._id.toString().length - 1) % 20)),
    }));

  return {
    organization: org,
    stats: {
      activeOpportunities: oppCount,
      totalApplications: totalApps,
      underReview: underReviewCount,
      shortlisted: shortlistedCount,
      interviews: interviewCount,
    },
    recentApplications: formattedRecent,
  };
}

/**
 * Get applicants for an opportunity
 */
async function getOpportunityApplicants(opportunityId) {
  let opportunity = null;
  let applications = [];

  if (mongoose.connection.readyState !== 1) {
    const opp = mockOrgOpportunities.find((o) => o._id.toString() === opportunityId.toString()) || mockOrgOpportunities[0];
    return {
      opportunity: opp,
      applicants: [
        {
          _id: new mongoose.Types.ObjectId(),
          studentId: new mongoose.Types.ObjectId(),
          candidateName: 'Aarav Sharma',
          candidateEmail: 'aarav.student@academia.edu',
          degree: 'B.Tech Computer Science (Final Year, CGPA 8.4)',
          status: 'Under Review',
          appliedAt: new Date(Date.now() - 86400000),
          coverLetter: 'Passionate about building responsive, robust web applications.',
          resumeUrl: 'https://example.com/resume.pdf',
          matchScore: 84,
          matchedSkills: ['JavaScript', 'React'],
          missingSkills: ['Tailwind CSS'],
          assessmentSummary: 'JavaScript: 88% (Passed)',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          studentId: new mongoose.Types.ObjectId(),
          candidateName: 'Priya Patel',
          candidateEmail: 'priya.student@academia.edu',
          degree: 'B.Tech Information Technology (CGPA 9.1)',
          status: 'Shortlisted',
          appliedAt: new Date(Date.now() - 86400000 * 2),
          coverLetter: 'Strong fundamentals in backend APIs, SQL databases, and cloud workflows.',
          resumeUrl: 'https://example.com/priya-resume.pdf',
          matchScore: 92,
          matchedSkills: ['Java', 'SQL', 'Git'],
          missingSkills: ['Spring Boot'],
          assessmentSummary: 'Java: 95% (Passed), SQL: 90% (Passed)',
        },
      ],
    };
  }

  opportunity = await Opportunity.findById(opportunityId).lean();
  if (!opportunity) {
    const error = new Error('Opportunity not found.');
    error.statusCode = 404;
    throw error;
  }

  applications = await Application.find({ opportunity: opportunityId })
    .populate('student', 'name email')
    .sort({ appliedAt: -1 })
    .lean();

  // Hydrate candidate profiles & match scores
  const applicantsWithDetails = await Promise.all(
    applications.map(async (app) => {
      let degree = 'Undergraduate Degree';
      let verifiedSkills = [];
      let assessmentSummary = 'Pending assessment';

      if (app.student?._id) {
        const studentDoc = await Student.findOne({ userId: app.student._id }).lean();
        if (studentDoc) {
          degree = `${studentDoc.education?.[0]?.degree || 'B.Tech'} (${studentDoc.education?.[0]?.cgpa ? `CGPA ${studentDoc.education[0].cgpa}` : 'Final Year'})`;
          verifiedSkills = (studentDoc.technicalSkills || []).map((s) => s.name);
        }

        const attempts = await AssessmentAttempt.find({ student: app.student._id, status: 'completed' })
          .populate('assessment', 'skill')
          .lean();

        if (attempts.length > 0) {
          assessmentSummary = attempts.map((a) => `${a.assessment?.skill || 'Skill'}: ${a.percentage}%`).join(', ');
        }
      }

      const matchAnalysis = calculateOpportunityMatch(
        opportunity,
        { technicalSkills: verifiedSkills.map((v) => ({ name: v, proficiency: 'Advanced' })) },
        new Map()
      );

      return {
        _id: app._id,
        studentId: app.student?._id,
        candidateName: app.student?.name || 'Student Candidate',
        candidateEmail: app.student?.email || '',
        degree,
        status: app.status,
        appliedAt: app.appliedAt,
        coverLetter: app.coverLetter,
        resumeUrl: app.resumeUrl,
        contactPhone: app.contactPhone,
        matchScore: matchAnalysis.matchScore || 80,
        matchedSkills: matchAnalysis.matchedSkills || [],
        missingSkills: matchAnalysis.missingSkills || [],
        assessmentSummary,
      };
    })
  );

  return {
    opportunity,
    applicants: applicantsWithDetails,
  };
}

/**
 * Update candidate application status
 */
async function updateApplicationStatus(applicationId, newStatus, note = '') {
  const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
  if (!validStatuses.includes(newStatus)) {
    const error = new Error(`Invalid status '${newStatus}'. Allowed: ${validStatuses.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (mongoose.connection.readyState !== 1) {
    return {
      _id: applicationId,
      status: newStatus,
      updatedAt: new Date(),
      note: note || `Status updated to ${newStatus} by recruiter.`,
    };
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    const error = new Error('Application not found.');
    error.statusCode = 404;
    throw error;
  }

  application.status = newStatus;
  application.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    note: note || `Application status updated to ${newStatus} by recruiter.`,
  });

  await application.save();
  return application;
}

/**
 * Create a new opportunity posted by industry recruiter
 */
async function createOpportunity(userId, oppData) {
  const org = await getOrganizationProfile(userId);

  const newOppData = {
    title: oppData.title,
    organization: org.name || 'Partner Company',
    type: oppData.type || 'Internship',
    description: oppData.description,
    requiredSkills: Array.isArray(oppData.requiredSkills)
      ? oppData.requiredSkills
      : String(oppData.requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
    preferredSkills: Array.isArray(oppData.preferredSkills)
      ? oppData.preferredSkills
      : String(oppData.preferredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
    location: oppData.location || 'Remote',
    workMode: oppData.workMode || 'Remote',
    experienceLevel: oppData.experienceLevel || 'Beginner',
    stipend: oppData.stipend || 'Competitive',
    duration: oppData.duration || '3 Months',
    openings: parseInt(oppData.openings, 10) || 1,
    deadline: oppData.deadline ? new Date(oppData.deadline) : new Date(Date.now() + 86400000 * 30),
    category: oppData.category || 'Software Development',
    status: 'Active',
  };

  if (mongoose.connection.readyState !== 1) {
    const mockCreated = {
      ...newOppData,
      _id: new mongoose.Types.ObjectId(),
      createdAt: new Date(),
    };
    mockOrgOpportunities.unshift(mockCreated);
    return mockCreated;
  }

  const created = await Opportunity.create(newOppData);
  return created;
}

module.exports = {
  getOrganizationProfile,
  updateOrganizationProfile,
  getIndustryDashboardStats,
  getOpportunityApplicants,
  updateApplicationStatus,
  createOpportunity,
};
