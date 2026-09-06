import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import opportunityService from '../../services/opportunityService';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import {
  Bookmark,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  Clock,
  Trash2,
  Calendar,
  Building2,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function SavedOpportunities() {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadSavedOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await opportunityService.getSavedOpportunities();
      if (res.success && Array.isArray(res.data)) {
        setSavedList(res.data);
      } else {
        setError(res.message || 'Unable to load saved opportunities.');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to saved opportunities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedOpportunities();
  }, []);

  const handleUnsave = async (opportunityId) => {
    try {
      await opportunityService.unsaveOpportunity(opportunityId);
      setSavedList((prev) => prev.filter((opp) => opp._id !== opportunityId));
      showToast('Opportunity removed from saved list');
    } catch (err) {
      showToast('Unable to remove bookmark');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in bg-[#0B0F19] text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link
            to="/student/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Opportunities Catalog</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 shadow-xs">
              <Bookmark className="w-4 h-4 fill-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Saved Opportunities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Track and revisit bookmarked internships, job openings, and industrial programs.
          </p>
        </div>

        <Link
          to="/student/opportunities"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-xl transition-colors self-start sm:self-auto"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Explore All Opportunities</span>
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 space-y-4 animate-pulse"
            >
              <div className="w-1/2 h-5 bg-slate-800 rounded" />
              <div className="w-3/4 h-6 bg-slate-800 rounded" />
              <div className="w-full h-12 bg-slate-800/40 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-8 text-center max-w-md mx-auto shadow-xl">
          <div className="w-12 h-12 bg-rose-950/60 text-rose-400 border border-rose-800/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">Unable to Load Saved Items</h3>
          <p className="text-xs text-slate-400 mb-5">{error}</p>
          <button
            onClick={loadSavedOpportunities}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      ) : savedList.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xl space-y-4">
          <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Opportunities Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            As you browse through internships, jobs, and training programs, click the bookmark icon on any opportunity card to save it for quick review.
          </p>
          <div className="pt-2">
            <Link
              to="/student/opportunities"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Opportunities</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              You have <strong className="text-white font-semibold">{savedList.length}</strong> saved {savedList.length === 1 ? 'opportunity' : 'opportunities'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedList.map((opp) => {
              const isExpired = opp.isExpired;

              return (
                <div
                  key={opp._id}
                  className={`bg-slate-900/90 rounded-2xl border ${
                    isExpired ? 'border-rose-900/40 opacity-80' : 'border-slate-800'
                  } p-5 md:p-6 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between relative`}
                >
                  {/* Expired / Closed Notice */}
                  {isExpired && (
                    <div className="mb-3 px-3 py-1.5 bg-rose-950/50 border border-rose-800/60 rounded-xl flex items-center gap-2 text-[11px] text-rose-300 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Application Deadline Expired</span>
                    </div>
                  )}

                  <div>
                    {/* Top Row: Org & Unsave Button */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-300 block truncate">
                            {opp.organization}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {opp.location} · {opp.workMode}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnsave(opp._id)}
                        title="Remove bookmark"
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title */}
                    <Link to={`/student/opportunities/${opp._id}`} className="block mb-2 group">
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {opp.title}
                      </h3>
                    </Link>

                    {/* Type & Level Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
                        {opp.type}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 text-slate-400 border border-slate-800">
                        {opp.experienceLevel}
                      </span>
                    </div>

                    {/* Required Skills */}
                    {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {opp.requiredSkills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-3.5 border-t border-slate-800/80 mt-auto">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="font-semibold text-slate-200">
                        {opp.stipend || opp.salary || 'Sponsored'}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {opp.deadline
                            ? new Date(opp.deadline).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'No deadline'}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/student/opportunities/${opp._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-xl transition-colors"
                    >
                      <span>View Full Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
