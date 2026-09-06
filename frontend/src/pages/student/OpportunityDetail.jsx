import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import opportunityService from '../../services/opportunityService';
import matchingService from '../../services/matchingService';
import applicationService from '../../services/applicationService';
import ApplyModal from '../../components/opportunities/ApplyModal';
import AIOpportunityCard from '../../components/ai/AIOpportunityCard';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  DollarSign,
  GraduationCap,
  Sparkles,
  Info,
  ShieldCheck,
  Send,
  TrendingUp,
  Award,
  Target,
  Loader2,
} from 'lucide-react';

/**
 * Match score color helpers
 */
const getScoreStyles = (score) => {
  if (score >= 85) return { bg: 'bg-emerald-950/50', text: 'text-emerald-300', border: 'border-emerald-800/50', label: 'Excellent Match' };
  if (score >= 70) return { bg: 'bg-cyan-950/50', text: 'text-cyan-300', border: 'border-cyan-800/50', label: 'Good Match' };
  if (score >= 50) return { bg: 'bg-amber-950/50', text: 'text-amber-300', border: 'border-amber-800/50', label: 'Potential Match' };
  return { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700', label: 'Growth Opportunity' };
};

export default function OpportunityDetail() {
  const { opportunityId } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Phase 7: Match data
  const [matchData, setMatchData] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // Phase 7: Application status
  const [applicationStatus, setApplicationStatus] = useState(null); // null = not applied
  const [hasApplied, setHasApplied] = useState(false);
  const [appCheckDone, setAppCheckDone] = useState(false);

  // Apply modal
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await opportunityService.getOpportunityById(opportunityId);
        if (isMounted) {
          if (res.success && res.data) {
            setOpportunity(res.data);
            setIsSaved(Boolean(res.data.isSaved));
          } else {
            setError(res.message || 'Opportunity not found.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load opportunity details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [opportunityId]);

  // Fetch match score once opportunity is loaded
  useEffect(() => {
    if (!opportunity) return;
    let isMounted = true;

    const fetchMatch = async () => {
      setMatchLoading(true);
      try {
        const res = await matchingService.getRecommendedOpportunities({ limit: 50 });
        if (isMounted && res.success && res.data?.recommendations) {
          const match = res.data.recommendations.find(
            (r) => r._id === opportunityId || r._id?.toString() === opportunityId
          );
          if (match) {
            setMatchData({
              matchScore: match.matchScore,
              matchCategory: match.matchCategory,
              breakdown: match.breakdown,
              matchedSkills: match.matchedSkills,
              developingSkills: match.developingSkills,
              missingSkills: match.missingSkills,
              explanation: match.explanation,
            });
          }
        }
      } catch {
        // Non-critical — match data is optional enhancement
      } finally {
        if (isMounted) setMatchLoading(false);
      }
    };

    fetchMatch();
    return () => { isMounted = false; };
  }, [opportunity, opportunityId]);

  // Check application status
  useEffect(() => {
    if (!opportunity) return;
    let isMounted = true;

    const checkApp = async () => {
      try {
        const res = await applicationService.checkApplicationStatus(opportunityId);
        if (isMounted && res.success) {
          setHasApplied(res.data?.hasApplied || false);
          setApplicationStatus(res.data?.application?.status || null);
        }
      } catch {
        // Non-critical
      } finally {
        if (isMounted) setAppCheckDone(true);
      }
    };

    checkApp();
    return () => { isMounted = false; };
  }, [opportunity, opportunityId]);

  const handleToggleSave = async () => {
    if (!opportunity || isSaving) return;

    const nextState = !isSaved;
    setIsSaved(nextState);
    setIsSaving(true);

    try {
      if (nextState) {
        await opportunityService.saveOpportunity(opportunity._id);
        showToast('Saved to your bookmarked opportunities');
      } else {
        await opportunityService.unsaveOpportunity(opportunity._id);
        showToast('Removed from your bookmarked opportunities');
      }
    } catch {
      setIsSaved(!nextState);
      showToast('Action failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplySubmit = async (data) => {
    const res = await applicationService.submitApplication(data);
    if (res.success) {
      setHasApplied(true);
      setApplicationStatus('Applied');
    }
    return res;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6 animate-pulse bg-[#0B0F19] text-slate-100">
        <div className="w-32 h-4 bg-slate-800 rounded" />
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-8 space-y-4">
          <div className="w-3/4 h-8 bg-slate-800 rounded" />
          <div className="w-1/2 h-4 bg-slate-800/70 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-800/50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="p-6 md:p-10 max-w-lg mx-auto text-center space-y-4 mt-12 bg-[#0B0F19] text-slate-100">
        <div className="w-12 h-12 bg-rose-950/60 text-rose-400 border border-rose-800/50 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Opportunity Unavailable</h2>
        <p className="text-xs text-slate-400">{error || 'This opportunity could not be found or has expired.'}</p>
        <Link
          to="/student/opportunities"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  // Type & Work Mode styles
  const typeBadgeStyles = {
    Internship: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
    Job: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
    Training: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
  }[opportunity.type] || 'bg-slate-800 text-slate-300 border-slate-700';

  const workModeStyles = {
    Remote: 'bg-violet-950/50 text-violet-300 border-violet-800/50',
    Hybrid: 'bg-sky-950/50 text-sky-300 border-sky-800/50',
    'On-site': 'bg-slate-800/70 text-slate-300 border-slate-700/60',
  }[opportunity.workMode] || 'bg-slate-800 text-slate-300 border-slate-700';

  const deadlineFormatted = new Date(opportunity.deadline).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const scoreStyles = matchData ? getScoreStyles(matchData.matchScore) : null;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6 animate-fade-in bg-[#0B0F19] text-slate-100">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          opportunity={opportunity}
          matchScore={matchData?.matchScore}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApplySubmit}
        />
      )}

      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/opportunities"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>

        <button
          onClick={handleToggleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
            isSaved
              ? 'bg-amber-950/50 text-amber-400 border-amber-800/60 shadow-xs'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
          <span>{isSaved ? 'Saved to Bookmarks' : 'Bookmark Role'}</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeBadgeStyles}`}>
                {opportunity.type}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${workModeStyles}`}>
                {opportunity.workMode}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-950 text-slate-400 border border-slate-800">
                {opportunity.experienceLevel} Level
              </span>
              {opportunity.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-950 text-slate-400 border border-slate-800">
                  {opportunity.category}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {opportunity.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>{opportunity.organization}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{opportunity.location}</span>
              </div>
            </div>
          </div>

          {/* Apply / Status Action Button */}
          <div className="flex flex-col items-end gap-3 flex-shrink-0 self-start">
            {appCheckDone && hasApplied ? (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 rounded-xl text-xs font-semibold shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Applied{applicationStatus ? ` · ${applicationStatus}` : ''}</span>
              </div>
            ) : appCheckDone ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-950/40 transition-all duration-150"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply Now</span>
              </button>
            ) : null}

            {/* Match Score Badge */}
            {matchData && scoreStyles && (
              <div className={`text-center px-4 py-2 rounded-xl border ${scoreStyles.bg} ${scoreStyles.border}`}>
                <span className={`text-xl font-extrabold ${scoreStyles.text} block leading-tight`}>
                  {matchData.matchScore}%
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${scoreStyles.text} opacity-80`}>
                  {scoreStyles.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Key Metrics Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Compensation
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-100">
              {opportunity.stipend || opportunity.salary || 'Unpaid / Sponsored'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Duration
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-100">
              {opportunity.duration || 'Flexible'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Deadline
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-100">
              {deadlineFormatted}
            </span>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Openings
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-100">
              {opportunity.openings} {opportunity.openings === 1 ? 'Position' : 'Positions'}
            </span>
          </div>
        </div>
      </div>

      {/* Compatibility Analysis Card (Phase 7) */}
      {matchData && scoreStyles && (
        <div className={`rounded-2xl border p-5 shadow-xl ${scoreStyles.bg} ${scoreStyles.border}`}>
          <div className="flex items-center gap-2.5 mb-4">
            <Target className={`w-5 h-5 ${scoreStyles.text}`} />
            <h2 className={`text-sm font-bold uppercase tracking-wider ${scoreStyles.text}`}>
              Your Compatibility Analysis
            </h2>
          </div>

          {/* Score Breakdown */}
          {matchData.breakdown && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {[
                { label: 'Skill Match', value: matchData.breakdown.skillScore, max: 50 },
                { label: 'Career Fit', value: matchData.breakdown.careerScore, max: 20 },
                { label: 'Eligibility', value: matchData.breakdown.eligibilityScore, max: 15 },
                { label: 'Experience', value: matchData.breakdown.experienceScore, max: 10 },
                { label: 'Work Mode', value: matchData.breakdown.workModeScore, max: 5 },
              ].map((item) => (
                <div key={item.label} className="bg-slate-950/40 border border-slate-800/40 rounded-xl p-2.5 text-center">
                  <span className="text-sm font-extrabold text-white block">{item.value}/{item.max}</span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Skill Match Details */}
          <div className="space-y-2">
            {matchData.matchedSkills && matchData.matchedSkills.length > 0 && (
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400">Strong alignment: </span>
                  <span className="text-emerald-300 font-medium">{matchData.matchedSkills.join(', ')}</span>
                </div>
              </div>
            )}
            {matchData.developingSkills && matchData.developingSkills.length > 0 && (
              <div className="flex items-start gap-2 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400">Developing: </span>
                  <span className="text-cyan-300 font-medium">{matchData.developingSkills.join(', ')}</span>
                </div>
              </div>
            )}
            {matchData.missingSkills && matchData.missingSkills.length > 0 && (
              <div className="flex items-start gap-2 text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400">Skills to develop: </span>
                  <span className="text-amber-300 font-medium">{matchData.missingSkills.join(', ')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Explanation */}
          {matchData.explanation && (
            <div className="mt-3 pt-3 border-t border-slate-800/40">
              <p className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{matchData.explanation}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* AI Match Intelligence & Preparation Card (Phase 9) */}
      <AIOpportunityCard
        opportunityId={opportunity._id}
        matchScore={matchData?.matchScore}
      />

      {/* Match loading indicator */}
      {matchLoading && !matchData && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Calculating your compatibility score...</span>
        </div>
      )}

      {/* Main Breakdown Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Overview, Requirements, Eligibility */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Role Overview */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Role Overview & Responsibilities</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Section 2: Technical Competencies */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Required & Preferred Competencies</span>
            </h2>

            {/* Required Skills */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Mandatory Skills:
              </span>
              <div className="flex flex-wrap gap-2">
                {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 ? (
                  opportunity.requiredSkills.map((skill) => {
                    const isMatched = matchData?.matchedSkills?.includes(skill);
                    const isDeveloping = matchData?.developingSkills?.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold border ${
                          isMatched
                            ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50'
                            : isDeveloping
                            ? 'bg-cyan-950/50 text-cyan-300 border-cyan-800/50'
                            : 'bg-indigo-950/70 text-cyan-300 border-indigo-800/60'
                        }`}
                      >
                        {isMatched && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {skill}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-500">None specified</span>
                )}
              </div>
            </div>

            {/* Preferred Skills */}
            {opportunity.preferredSkills && opportunity.preferredSkills.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Preferred / Nice-to-Have:
                </span>
                <div className="flex flex-wrap gap-2">
                  {opportunity.preferredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Eligibility */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Eligibility & Academic Criteria</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {opportunity.eligibility}
            </p>
          </div>
        </div>

        {/* Right 1 Col: Organization Info & Actions */}
        <div className="space-y-6">
          {/* Organization Details */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              About the Organization
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-slate-100 text-sm block">
                  {opportunity.organization}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Industry Partner
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-200">{opportunity.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Work Mode:</span>
                <span className="font-medium text-slate-200">{opportunity.workMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-medium text-emerald-400">Actively Hiring</span>
              </div>
            </div>
          </div>

          {/* Apply, Bookmark & Navigation Actions */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
            {/* Apply Button */}
            {appCheckDone && !hasApplied && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-950/40 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Application</span>
              </button>
            )}

            {appCheckDone && hasApplied && (
              <div className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-emerald-950/50 text-emerald-300 border border-emerald-800/50">
                <CheckCircle2 className="w-4 h-4" />
                <span>Applied{applicationStatus ? ` · ${applicationStatus}` : ''}</span>
              </div>
            )}

            {hasApplied && (
              <Link
                to="/student/applications"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center block text-cyan-400 hover:text-cyan-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                Track Your Applications
              </Link>
            )}

            <button
              onClick={handleToggleSave}
              disabled={isSaving}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all duration-150 ${
                isSaved
                  ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
              <span>{isSaved ? 'Bookmarked' : 'Bookmark This Opportunity'}</span>
            </button>

            <Link
              to="/student/opportunities"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center block text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              Explore More Roles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
