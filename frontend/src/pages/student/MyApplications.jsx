import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import applicationService from '../../services/applicationService';
import {
  FileText,
  Building2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Briefcase,
  XCircle,
  Eye,
  Filter,
  ChevronDown,
  Send,
  RotateCcw,
  Award,
  Search,
} from 'lucide-react';

/**
 * Status badge styling
 */
const getStatusStyles = (status) => {
  const map = {
    Applied: { bg: 'bg-indigo-950/60', text: 'text-indigo-300', border: 'border-indigo-800/50', icon: Send },
    'Under Review': { bg: 'bg-cyan-950/60', text: 'text-cyan-300', border: 'border-cyan-800/50', icon: Eye },
    Shortlisted: { bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-800/50', icon: Award },
    Interview: { bg: 'bg-violet-950/60', text: 'text-violet-300', border: 'border-violet-800/50', icon: Calendar },
    Selected: { bg: 'bg-emerald-950/70', text: 'text-emerald-300', border: 'border-emerald-700/60', icon: CheckCircle2 },
    Rejected: { bg: 'bg-rose-950/50', text: 'text-rose-300', border: 'border-rose-800/50', icon: XCircle },
    Withdrawn: { bg: 'bg-slate-800/70', text: 'text-slate-400', border: 'border-slate-700/60', icon: RotateCcw },
  };
  return map[status] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700', icon: FileText };
};

/**
 * Format date as relative or absolute
 */
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Withdraw confirmation
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await applicationService.getMyApplications();
      if (res.success) {
        setApplications(res.data || []);
      } else {
        setError(res.message || 'Failed to load applications.');
      }
    } catch (err) {
      setError(err.message || 'Unable to load your applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleWithdraw = async (applicationId) => {
    setWithdrawing(true);
    try {
      const res = await applicationService.withdrawApplication(applicationId);
      if (res.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId
              ? { ...app, status: 'Withdrawn', statusHistory: [...(app.statusHistory || []), { status: 'Withdrawn', changedAt: new Date().toISOString(), note: 'Application withdrawn by candidate.' }] }
              : app
          )
        );
        showToast('Application withdrawn successfully.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawing(false);
      setWithdrawTarget(null);
    }
  };

  // Filtered applications
  const filteredApps = statusFilter === 'All'
    ? applications
    : applications.filter((app) => app.status === statusFilter);

  // Status counts for summary
  const statusCounts = {
    total: applications.length,
    active: applications.filter((a) => ['Applied', 'Under Review', 'Shortlisted', 'Interview'].includes(a.status)).length,
    selected: applications.filter((a) => a.status === 'Selected').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6 animate-fade-in bg-[#0B0F19] text-slate-100">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      {withdrawTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={() => setWithdrawTarget(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-amber-950/50 text-amber-400 border border-amber-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Withdraw Application?</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              This action cannot be undone. Your application for this opportunity will be marked as withdrawn.
            </p>
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => handleWithdraw(withdrawTarget)}
                disabled={withdrawing}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {withdrawing ? 'Withdrawing...' : 'Withdraw'}
              </button>
              <button
                onClick={() => setWithdrawTarget(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-950/40">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              My Applications
            </h1>
          </div>
          <p className="text-xs text-slate-400 pl-[46px]">
            Track and manage all your submitted applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/student/recommended"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-950/40 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find More</span>
          </Link>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showFilters
                ? 'bg-indigo-950/50 text-indigo-300 border-indigo-800/60'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl animate-fade-in">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-700 min-w-[180px]"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && !error && applications.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-lg font-extrabold text-white">{statusCounts.total}</span>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Total</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-lg font-extrabold text-cyan-300">{statusCounts.active}</span>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Active</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-lg font-extrabold text-emerald-300">{statusCounts.selected}</span>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Selected</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-lg font-extrabold text-rose-300">{statusCounts.rejected}</span>
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">Rejected</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">Loading your applications...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-16 space-y-4">
          <div className="w-12 h-12 bg-rose-950/60 text-rose-400 border border-rose-800/50 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Unable to Load Applications</h3>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-12 h-12 bg-indigo-950/50 text-indigo-400 border border-indigo-800/40 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Applications Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't applied to any opportunities. Browse recommended opportunities to find your best matches.
          </p>
          <Link
            to="/student/recommended"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-950/40 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Opportunities</span>
          </Link>
        </div>
      )}

      {/* Empty Filter Result */}
      {!loading && !error && applications.length > 0 && filteredApps.length === 0 && (
        <div className="text-center py-12 space-y-3">
          <p className="text-xs text-slate-400">No applications match the selected filter.</p>
          <button
            onClick={() => setStatusFilter('All')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Application Cards */}
      {!loading && !error && filteredApps.length > 0 && (
        <div className="space-y-3">
          {filteredApps.map((app) => {
            const opp = app.opportunity || {};
            const statusStyle = getStatusStyles(app.status);
            const StatusIcon = statusStyle.icon;
            const canWithdraw = ['Applied', 'Under Review'].includes(app.status);

            // Type badge
            const typeBadge = {
              Internship: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
              Job: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
              Training: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
            }[opp.type] || 'bg-slate-800 text-slate-300 border-slate-700';

            return (
              <div
                key={app._id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-md hover:border-slate-700 hover:shadow-xl transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Status Badge (Left) */}
                  <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${statusStyle.bg} border ${statusStyle.border} flex flex-col items-center justify-center self-center sm:self-start`}>
                    <StatusIcon className={`w-5 h-5 ${statusStyle.text} mb-0.5`} />
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${statusStyle.text} text-center leading-tight`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Title */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/student/opportunities/${opp._id}`}
                          className="text-sm font-bold text-slate-100 hover:text-cyan-300 transition-colors block truncate"
                        >
                          {opp.title || 'Opportunity'}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-medium text-slate-300">
                            <Building2 className="w-3.5 h-3.5 text-cyan-500" />
                            {opp.organization || 'Organization'}
                          </span>
                          {opp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {opp.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Type Badge */}
                      {opp.type && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0 ${typeBadge}`}>
                          {opp.type}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Applied {formatDate(app.appliedAt)}
                      </span>
                      {app.statusHistory && app.statusHistory.length > 1 && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Last updated {formatDate(app.statusHistory[app.statusHistory.length - 1]?.changedAt)}
                        </span>
                      )}
                    </div>

                    {/* Status Timeline (compact) */}
                    {app.statusHistory && app.statusHistory.length > 1 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {app.statusHistory.map((entry, idx) => {
                          const entryStyle = getStatusStyles(entry.status);
                          return (
                            <React.Fragment key={idx}>
                              {idx > 0 && (
                                <div className="w-4 h-px bg-slate-700" />
                              )}
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${entryStyle.bg} ${entryStyle.text} border ${entryStyle.border}`}
                                title={entry.note || ''}
                              >
                                {entry.status}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        to={`/student/opportunities/${opp._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Opportunity</span>
                      </Link>
                      {canWithdraw && (
                        <button
                          onClick={() => setWithdrawTarget(app._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-rose-400 hover:text-rose-300 text-xs font-semibold rounded-xl border border-slate-800 hover:border-rose-800/50 hover:bg-rose-950/30 transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Withdraw</span>
                        </button>
                      )}
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
