import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import opportunityService from '../../services/opportunityService';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import {
  Briefcase,
  Search,
  Filter,
  X,
  RotateCcw,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Building2,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Software Development',
  'Data',
  'AI/ML',
  'Cloud',
  'Cybersecurity',
  'Design',
];

const TYPES = ['All', 'Internship', 'Job', 'Training'];
const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'];
const EXPERIENCES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function OpportunityList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedWorkMode, setSelectedWorkMode] = useState(searchParams.get('workMode') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedExperience, setSelectedExperience] = useState(searchParams.get('experience') || 'All');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Data states
  const [opportunities, setOpportunities] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Debounce search typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedType !== 'All') params.set('type', selectedType);
    if (selectedWorkMode !== 'All') params.set('workMode', selectedWorkMode);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedExperience !== 'All') params.set('experience', selectedExperience);
    if (selectedSort !== 'newest') params.set('sort', selectedSort);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    selectedType,
    selectedWorkMode,
    selectedCategory,
    selectedExperience,
    selectedSort,
    currentPage,
    setSearchParams,
  ]);

  // Fetch opportunities catalog
  const loadOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query = {
        search: debouncedSearch || undefined,
        type: selectedType !== 'All' ? selectedType : undefined,
        workMode: selectedWorkMode !== 'All' ? selectedWorkMode : undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        experience: selectedExperience !== 'All' ? selectedExperience : undefined,
        sort: selectedSort,
        page: currentPage,
        limit: 9,
      };

      const res = await opportunityService.getOpportunities(query);
      if (res.success && res.data) {
        setOpportunities(res.data.opportunities || []);
        setPagination(
          res.data.pagination || {
            total: 0,
            page: 1,
            limit: 9,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      } else {
        setError(res.message || 'Unable to retrieve opportunities.');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to the opportunity catalog.');
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    selectedType,
    selectedWorkMode,
    selectedCategory,
    selectedExperience,
    selectedSort,
    currentPage,
  ]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // Handle bookmark toggle
  const handleSaveToggle = async (opportunityId, nextSavedState) => {
    try {
      if (nextSavedState) {
        await opportunityService.saveOpportunity(opportunityId);
        showToast('Opportunity bookmarked to your saved list');
      } else {
        await opportunityService.unsaveOpportunity(opportunityId);
        showToast('Removed from your saved list');
      }

      // Locally update state without full re-fetch
      setOpportunities((prev) =>
        prev.map((opp) => (opp._id === opportunityId ? { ...opp, isSaved: nextSavedState } : opp))
      );
    } catch (err) {
      showToast(err.message || 'Action could not be completed');
      throw err;
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedType('All');
    setSelectedWorkMode('All');
    setSelectedCategory('All');
    setSelectedExperience('All');
    setSelectedSort('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedType !== 'All' ||
    selectedWorkMode !== 'All' ||
    selectedCategory !== 'All' ||
    selectedExperience !== 'All' ||
    selectedSort !== 'newest';

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in bg-[#0B0F19] text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Opportunities Catalog
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Discover active internships, full-time engineering roles, and technical training programs.
          </p>
        </div>

        <Link
          to="/student/opportunities/saved"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span>Saved Opportunities</span>
        </Link>
      </div>

      {/* Search and Filter Control Panel */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-5">
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role title, company, skill (e.g. React, Python), or domain..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500/70 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="deadline">Deadline (Soonest)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Facet Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 border-t border-slate-800/80 text-xs">
          {/* 1. Opportunity Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
              Opportunity Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/70 cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Work Mode */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
              Work Mode
            </label>
            <select
              value={selectedWorkMode}
              onChange={(e) => {
                setSelectedWorkMode(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/70 cursor-pointer"
            >
              {WORK_MODES.map((w) => (
                <option key={w} value={w}>
                  {w === 'All' ? 'All Work Modes' : w}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/70 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Experience Level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => {
                setSelectedExperience(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/70 cursor-pointer"
            >
              {EXPERIENCES.map((ex) => (
                <option key={ex} value={ex}>
                  {ex === 'All' ? 'All Experience Levels' : ex}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Action */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <span className="text-slate-400 font-medium">
            Showing{' '}
            <strong className="text-white font-semibold">{opportunities.length}</strong> of{' '}
            <strong className="text-white font-semibold">{pagination.total}</strong> active opportunities
          </span>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-24 h-3 bg-slate-800 rounded" />
                  <div className="w-32 h-2.5 bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="w-3/4 h-5 bg-slate-800 rounded" />
              <div className="flex gap-2">
                <div className="w-16 h-4 bg-slate-800 rounded-full" />
                <div className="w-14 h-4 bg-slate-800 rounded-full" />
              </div>
              <div className="w-full h-12 bg-slate-800/40 rounded-xl" />
              <div className="w-full h-9 bg-slate-800 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        // Error State
        <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-8 text-center max-w-lg mx-auto shadow-xl">
          <div className="w-12 h-12 bg-rose-950/60 text-rose-400 border border-rose-800/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">Unable to Load Opportunities</h3>
          <p className="text-xs text-slate-400 mb-5">{error}</p>
          <button
            onClick={loadOpportunities}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : opportunities.length === 0 ? (
        // Empty State
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-10 text-center max-w-md mx-auto shadow-xl">
          <div className="w-12 h-12 bg-slate-950 text-slate-500 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">No Opportunities Found</h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            No opportunities match your current filter and search query. Try broadening your keywords or resetting filters.
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-950/70 hover:bg-indigo-900 text-cyan-300 border border-indigo-800/60 text-xs font-semibold rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filter Criteria</span>
            </button>
          )}
        </div>
      ) : (
        // Opportunity Cards Grid
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-slate-400 font-medium">
                Page <strong className="text-white">{pagination.page}</strong> of{' '}
                <strong className="text-white">{pagination.totalPages}</strong>
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
