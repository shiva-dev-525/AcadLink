import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import matchingService from '../../services/matchingService';
import applicationService from '../../services/applicationService';
import opportunityService from '../../services/opportunityService';
import ApplyModal from '../../components/opportunities/ApplyModal';
import {
  Sparkles,
  Target,
  Building2,
  MapPin,
  Calendar,
  Bookmark,
  ArrowRight,
  Briefcase,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Award,
  ChevronDown,
  Send,
  Clock,
  Info,
} from 'lucide-react';

/**
 * Format relative deadline days
 */
const formatDeadline = (dateString) => {
  if (!dateString) return 'No deadline';
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Closes today';
  if (diffDays === 1) return 'Closes tomorrow';
  if (diffDays <= 7) return `${diffDays} days left`;
  return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Match score color helper
 */
const getScoreStyles = (score) => {
  if (score >= 85) return { bg: 'bg-emerald-950/50', text: 'text-emerald-300', border: 'border-emerald-800/50', ring: 'ring-emerald-700/30', label: 'Excellent Match' };
  if (score >= 70) return { bg: 'bg-cyan-950/50', text: 'text-cyan-300', border: 'border-cyan-800/50', ring: 'ring-cyan-700/30', label: 'Good Match' };
  if (score >= 50) return { bg: 'bg-amber-950/50', text: 'text-amber-300', border: 'border-amber-800/50', ring: 'ring-amber-700/30', label: 'Potential Match' };
  return { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700', ring: 'ring-slate-600/30', label: 'Growth Opportunity' };
};

export default function RecommendedOpportunities() {
  const [recommendations, setRecommendations] = useState([]);
  const [totalMatched, setTotalMatched] = useState(0);
  const [studentGoal, setStudentGoal] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [minScore, setMinScore] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Apply Modal
  const [applyModalOpp, setApplyModalOpp] = useState(null);
  const [applyModalScore, setApplyModalScore] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (typeFilter !== 'All') params.type = typeFilter;
      if (workModeFilter !== 'All') params.workMode = workModeFilter;
      if (experienceFilter !== 'All') params.experience = experienceFilter;
      if (minScore > 0) params.minScore = minScore;

      const res = await matchingService.getRecommendedOpportunities(params);
      if (res.success && res.data) {
        setRecommendations(res.data.recommendations || []);
        setTotalMatched(res.data.totalMatched || 0);
        setStudentGoal(res.data.studentTargetGoal || '');
      } else {
        setError(res.message || 'Failed to load recommendations.');
      }
    } catch (err) {
      setError(err.message || 'Unable to load recommendations.');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, workModeFilter, experienceFilter, minScore]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleSaveToggle = async (oppId, nextState) => {
    try {
      if (nextState) {
        await opportunityService.saveOpportunity(oppId);
        showToast('Saved to bookmarks');
      } else {
        await opportunityService.unsaveOpportunity(oppId);
        showToast('Removed from bookmarks');
      }
      // Update local state
      setRecommendations((prev) =>
        prev.map((r) => (r._id === oppId ? { ...r, isSaved: nextState } : r))
      );
    } catch {
      showToast('Bookmark action failed.');
    }
  };

  const handleApplyClick = (opp) => {
    setApplyModalOpp(opp);
    setApplyModalScore(opp.matchScore);
  };

  const handleApplySubmit = async (data) => {
    const res = await applicationService.submitApplication(data);
    if (res.success) {
      // Update local state to reflect applied status
      setRecommendations((prev) =>
        prev.map((r) =>
          r._id === data.opportunityId ? { ...r, hasApplied: true, applicationStatus: 'Applied' } : r
        )
      );
    }
    return res;
  };

  // Type badge styles
  const getTypeBadge = (type) => {
    const styles = {
      Internship: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
      Job: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
      Training: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    };
    return styles[type] || 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in bg-[#0B0F19] text-slate-100">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Apply Modal */}
      {applyModalOpp && (
        <ApplyModal
          opportunity={applyModalOpp}
          matchScore={applyModalScore}
          onClose={() => {
            setApplyModalOpp(null);
            setApplyModalScore(null);
          }}
          onSubmit={handleApplySubmit}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-950/40">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Recommended for You
            </h1>
          </div>
          <p className="text-xs text-slate-400 pl-[46px]">
            {studentGoal && (
              <>
                Personalized opportunities aligned with your goal:{' '}
                <span className="text-cyan-400 font-semibold">{studentGoal}</span>
              </>
            )}
            {!studentGoal && 'Opportunities ranked by your skill profile, career interests, and eligibility.'}
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            showFilters
              ? 'bg-indigo-950/50 text-indigo-300 border-indigo-800/60'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-700"
              >
                <option value="All">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Job">Job</option>
                <option value="Training">Training</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Work Mode
              </label>
              <select
                value={workModeFilter}
                onChange={(e) => setWorkModeFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-700"
              >
                <option value="All">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Experience
              </label>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-700"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Min Match Score
              </label>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-700"
              >
                <option value={0}>No Minimum</option>
                <option value={50}>50%+</option>
                <option value={70}>70%+</option>
                <option value={85}>85%+</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats Bar */}
      {!loading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-lg font-extrabold text-white">{totalMatched}</span>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Matched</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-lg font-extrabold text-emerald-300">
              {recommendations.filter((r) => r.matchScore >= 85).length}
            </span>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Excellent</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-lg font-extrabold text-cyan-300">
              {recommendations.filter((r) => r.matchScore >= 70 && r.matchScore < 85).length}
            </span>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Good</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-lg font-extrabold text-amber-300">
              {recommendations.filter((r) => r.hasApplied).length}
            </span>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Applied</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">Calculating personalized compatibility scores...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-16 space-y-4">
          <div className="w-12 h-12 bg-rose-950/60 text-rose-400 border border-rose-800/50 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Unable to Load Recommendations</h3>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && recommendations.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-12 h-12 bg-indigo-950/50 text-indigo-400 border border-indigo-800/40 rounded-2xl flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Matching Opportunities Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {minScore > 0
              ? `No opportunities match your current filters with a score above ${minScore}%. Try lowering the minimum score.`
              : 'Complete your profile, skills, and assessments to receive personalized recommendations.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/student/skills"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Update Skills
            </Link>
            <Link
              to="/student/opportunities"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Browse All
            </Link>
          </div>
        </div>
      )}

      {/* Recommendation Cards */}
      {!loading && !error && recommendations.length > 0 && (
        <div className="space-y-4">
          {recommendations.map((opp, idx) => {
            const scoreStyles = getScoreStyles(opp.matchScore);
            const deadlineText = formatDeadline(opp.deadline);
            const isUrgent =
              deadlineText.includes('days left') ||
              deadlineText.includes('today') ||
              deadlineText.includes('tomorrow');

            return (
              <div
                key={opp._id || idx}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-md hover:border-slate-700 hover:shadow-xl transition-all duration-200 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                  {/* Match Score Badge (Left) */}
                  <div className={`flex-shrink-0 w-20 h-20 rounded-2xl ${scoreStyles.bg} border ${scoreStyles.border} flex flex-col items-center justify-center self-center lg:self-start`}>
                    <span className={`text-2xl font-extrabold ${scoreStyles.text} leading-tight`}>
                      {opp.matchScore}%
                    </span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${scoreStyles.text} opacity-80`}>
                      Match
                    </span>
                  </div>

                  {/* Main Content (Center) */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Title Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/student/opportunities/${opp._id}`}
                          className="text-base font-bold text-slate-100 hover:text-cyan-300 transition-colors block truncate"
                        >
                          {opp.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-medium text-slate-300">
                            <Building2 className="w-3.5 h-3.5 text-cyan-500" />
                            {opp.organization}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {opp.location}
                          </span>
                        </div>
                      </div>

                      {/* Bookmark */}
                      <button
                        onClick={() => handleSaveToggle(opp._id, !opp.isSaved)}
                        title={opp.isSaved ? 'Remove bookmark' : 'Bookmark'}
                        className={`p-2 rounded-xl border transition-all flex-shrink-0 ${
                          opp.isSaved
                            ? 'bg-amber-950/50 text-amber-400 border-amber-800/60'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${opp.isSaved ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getTypeBadge(opp.type)}`}>
                        {opp.type}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 text-slate-400 border border-slate-800">
                        {opp.workMode}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 text-slate-400 border border-slate-800">
                        {opp.experienceLevel}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${scoreStyles.bg} ${scoreStyles.text} ${scoreStyles.border}`}>
                        <Award className="w-3 h-3 mr-1" />
                        {scoreStyles.label}
                      </span>
                    </div>

                    {/* Match Explanation */}
                    {opp.explanation && (
                      <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{opp.explanation}</span>
                      </div>
                    )}

                    {/* Skill Match Breakdown */}
                    <div className="flex flex-wrap gap-4 text-[11px]">
                      {opp.matchedSkills && opp.matchedSkills.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-slate-400">Strong:</span>
                          <span className="text-emerald-300 font-medium">{opp.matchedSkills.join(', ')}</span>
                        </div>
                      )}
                      {opp.missingSkills && opp.missingSkills.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-slate-400">To develop:</span>
                          <span className="text-amber-300 font-medium">{opp.missingSkills.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer: Compensation, Deadline, Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="font-semibold text-slate-200">
                          {opp.stipend || opp.salary || 'Unpaid'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span className={isUrgent ? 'text-amber-400 font-semibold' : ''}>
                            {deadlineText}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {opp.hasApplied ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 rounded-xl text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Applied{opp.applicationStatus ? ` · ${opp.applicationStatus}` : ''}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApplyClick(opp)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-950/40 transition-all duration-150"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Apply Now</span>
                          </button>
                        )}
                        <Link
                          to={`/student/opportunities/${opp._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
