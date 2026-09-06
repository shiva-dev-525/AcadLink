const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');
const SavedOpportunity = require('../models/SavedOpportunity');
const { opportunitiesData } = require('../data/seedOpportunities');

/**
 * Opportunity Service
 *
 * Implements deterministic query parsing, multi-field regex/text filtering,
 * server-side pagination, sorting, and student bookmark management.
 */

// Generate deterministic in-memory fallback catalog from the full 14-opportunity seed dataset
const mockOpportunities = opportunitiesData.map((item, index) => ({
  ...item,
  _id: new mongoose.Types.ObjectId(`66d0000000000000000000${(index + 1).toString(16).padStart(2, '0')}`),
  createdAt: new Date(Date.now() - (14 - index) * 3600000),
}));

// In-memory mock bookmarks: Map<userId, Set<opportunityId>>
const mockSavedMap = new Map();

/**
 * Escapes regex special characters to prevent ReDoS / injection
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Query active opportunities with search, filters, deterministic sorting, and pagination
 */
const listOpportunities = async (queryParams = {}, userId = null) => {
  const {
    search,
    type,
    workMode,
    experience,
    category,
    location,
    sort = 'newest',
    page = 1,
    limit = 9,
  } = queryParams;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
  const skip = (parsedPage - 1) * parsedLimit;

  // If MongoDB is offline, use mock fallback with complete catalog
  if (mongoose.connection.readyState !== 1) {
    let filtered = [...mockOpportunities];

    // Filter by active and not expired
    const now = new Date();
    filtered = filtered.filter((o) => o.status === 'Active' && new Date(o.deadline) >= now);

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.organization.toLowerCase().includes(q) ||
          o.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
          o.category.toLowerCase().includes(q)
      );
    }
    if (type && type !== 'All') {
      filtered = filtered.filter((o) => o.type === type);
    }
    if (workMode && workMode !== 'All') {
      filtered = filtered.filter((o) => o.workMode === workMode);
    }
    if (experience && experience !== 'All') {
      filtered = filtered.filter((o) => o.experienceLevel === experience);
    }
    if (category && category !== 'All') {
      filtered = filtered.filter((o) => o.category === category);
    }
    if (location && location.trim() && location !== 'All') {
      const loc = location.trim().toLowerCase();
      filtered = filtered.filter((o) => o.location.toLowerCase().includes(loc));
    }

    // Deterministic sorting
    if (sort === 'deadline') {
      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // newest
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + parsedLimit);

    const userSavedSet = userId && mockSavedMap.has(userId.toString())
      ? mockSavedMap.get(userId.toString())
      : new Set();

    const totalPages = Math.ceil(total / parsedLimit) || 1;

    return {
      opportunities: paginated.map((item) => ({
        ...item,
        isSaved: userSavedSet.has(item._id.toString()),
      })),
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
    };
  }

  // Build MongoDB query filter
  const filter = {
    status: 'Active',
    deadline: { $gte: new Date() }, // Exclude expired opportunities from active discovery
  };

  // Case-insensitive Search across Title, Organization, Required Skills, and Category
  if (search && search.trim()) {
    const cleanSearch = escapeRegex(search.trim());
    const searchRegex = new RegExp(cleanSearch, 'i');
    filter.$or = [
      { title: searchRegex },
      { organization: searchRegex },
      { requiredSkills: { $in: [searchRegex] } },
      { category: searchRegex },
    ];
  }

  // Facet Filters
  if (type && type !== 'All') {
    filter.type = type;
  }
  if (workMode && workMode !== 'All') {
    filter.workMode = workMode;
  }
  if (experience && experience !== 'All') {
    filter.experienceLevel = experience;
  }
  if (category && category !== 'All') {
    filter.category = category;
  }
  if (location && location.trim() && location !== 'All') {
    filter.location = new RegExp(escapeRegex(location.trim()), 'i');
  }

  // Deterministic Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'deadline') {
    sortOption = { deadline: 1, createdAt: -1 };
  } else if (sort === 'title') {
    sortOption = { title: 1 };
  } else {
    sortOption = { createdAt: -1 };
  }

  const [total, rawOpportunities] = await Promise.all([
    Opportunity.countDocuments(filter),
    Opportunity.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
  ]);

  // Determine which opportunities the student has saved (if authenticated)
  let savedOpportunityIds = new Set();
  if (userId && rawOpportunities.length > 0) {
    const oppIds = rawOpportunities.map((o) => o._id);
    const savedRecords = await SavedOpportunity.find({
      student: userId,
      opportunity: { $in: oppIds },
    })
      .select('opportunity')
      .lean();
    savedOpportunityIds = new Set(savedRecords.map((r) => r.opportunity.toString()));
  }

  const opportunities = rawOpportunities.map((opp) => ({
    ...opp,
    isSaved: savedOpportunityIds.has(opp._id.toString()),
  }));

  const totalPages = Math.ceil(total / parsedLimit) || 1;

  return {
    opportunities,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages,
      hasNextPage: parsedPage < totalPages,
      hasPrevPage: parsedPage > 1,
    },
  };
};

/**
 * Fetch a single opportunity by ID, annotating isSaved for authenticated student
 */
const getOpportunityById = async (opportunityId, userId = null) => {
  if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
    return null;
  }

  if (mongoose.connection.readyState !== 1) {
    const found = mockOpportunities.find((o) => o._id.toString() === opportunityId.toString());
    if (!found) return null;

    const userSavedSet = userId && mockSavedMap.has(userId.toString())
      ? mockSavedMap.get(userId.toString())
      : new Set();

    const isExpired = new Date(found.deadline) < new Date() || found.status !== 'Active';

    return {
      ...found,
      isSaved: userSavedSet.has(found._id.toString()),
      isExpired,
    };
  }

  const opp = await Opportunity.findById(opportunityId).lean();
  if (!opp) {
    return null;
  }

  const isExpired = opp.deadline < new Date() || opp.status !== 'Active';

  let isSaved = false;
  if (userId) {
    const saved = await SavedOpportunity.findOne({
      student: userId,
      opportunity: opportunityId,
    }).lean();
    isSaved = Boolean(saved);
  }

  return {
    ...opp,
    isSaved,
    isExpired,
  };
};

/**
 * Retrieve all opportunities saved/bookmarked by the student
 */
const getSavedOpportunities = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to retrieve saved opportunities');
  }

  if (mongoose.connection.readyState !== 1) {
    const userSavedSet = mockSavedMap.has(userId.toString())
      ? mockSavedMap.get(userId.toString())
      : new Set();

    const now = new Date();
    return mockOpportunities
      .filter((o) => userSavedSet.has(o._id.toString()))
      .map((opp) => {
        const isExpired = new Date(opp.deadline) < now || opp.status !== 'Active';
        return {
          ...opp,
          savedAt: new Date(),
          savedId: opp._id,
          isSaved: true,
          isExpired,
        };
      });
  }

  const savedRecords = await SavedOpportunity.find({ student: userId })
    .populate('opportunity')
    .sort({ savedAt: -1 })
    .lean();

  const now = new Date();

  // Filter out any orphaned references and format
  return savedRecords
    .filter((record) => record.opportunity !== null)
    .map((record) => {
      const opp = record.opportunity;
      const isExpired = opp.deadline ? opp.deadline < now : false;
      const isClosed = opp.status !== 'Active';

      return {
        ...opp,
        savedAt: record.savedAt,
        savedId: record._id,
        isSaved: true,
        isExpired: isExpired || isClosed,
      };
    });
};

/**
 * Save / Bookmark an opportunity for an authenticated student
 */
const saveOpportunity = async (opportunityId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
    throw new Error('Invalid Opportunity ID format');
  }

  if (mongoose.connection.readyState !== 1) {
    const found = mockOpportunities.find((o) => o._id.toString() === opportunityId.toString());
    if (!found) {
      const error = new Error('Opportunity not found');
      error.statusCode = 404;
      throw error;
    }
    const uid = userId.toString();
    if (!mockSavedMap.has(uid)) {
      mockSavedMap.set(uid, new Set());
    }
    mockSavedMap.get(uid).add(opportunityId.toString());
    return { success: true, savedId: opportunityId, isSaved: true };
  }

  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    const error = new Error('Opportunity not found');
    error.statusCode = 404;
    throw error;
  }

  const record = await SavedOpportunity.findOneAndUpdate(
    { student: userId, opportunity: opportunityId },
    { $set: { savedAt: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    success: true,
    savedId: record._id,
    isSaved: true,
  };
};

/**
 * Unsave / Remove Bookmark for an authenticated student
 */
const unsaveOpportunity = async (opportunityId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
    throw new Error('Invalid Opportunity ID format');
  }

  if (mongoose.connection.readyState !== 1) {
    const uid = userId.toString();
    if (mockSavedMap.has(uid)) {
      mockSavedMap.get(uid).delete(opportunityId.toString());
    }
    return { success: true, isSaved: false };
  }

  await SavedOpportunity.findOneAndDelete({
    student: userId,
    opportunity: opportunityId,
  });

  return {
    success: true,
    isSaved: false,
  };
};

module.exports = {
  listOpportunities,
  getOpportunityById,
  getSavedOpportunities,
  saveOpportunity,
  unsaveOpportunity,
};
