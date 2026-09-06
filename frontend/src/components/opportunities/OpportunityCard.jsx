import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  Bookmark,
  ArrowRight,
  Sparkles,
  DollarSign,
  Briefcase,
  Layers,
  GraduationCap,
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

export default function OpportunityCard({
  opportunity,
  onSaveToggle,
  isSavedControlled,
  compact = false,
}) {
  const [saved, setSaved] = useState(
    isSavedControlled !== undefined ? isSavedControlled : Boolean(opportunity.isSaved)
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdating) return;

    const nextState = !saved;
    setSaved(nextState);
    setIsUpdating(true);

    try {
      if (onSaveToggle) {
        await onSaveToggle(opportunity._id, nextState);
      }
    } catch {
      // Revert on failure
      setSaved(!nextState);
    } finally {
      setIsUpdating(false);
    }
  };

  const deadlineText = formatDeadline(opportunity.deadline);
  const isUrgent = deadlineText.includes('days left') || deadlineText.includes('today') || deadlineText.includes('tomorrow');

  // Type-specific badge colors
  const typeBadgeStyles = {
    Internship: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
    Job: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
    Training: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
  }[opportunity.type] || 'bg-slate-800 text-slate-300 border-slate-700';

  // Work Mode badge styles
  const workModeStyles = {
    Remote: 'bg-violet-950/50 text-violet-300 border-violet-800/50',
    Hybrid: 'bg-sky-950/50 text-sky-300 border-sky-800/50',
    'On-site': 'bg-slate-800/70 text-slate-300 border-slate-700/60',
  }[opportunity.workMode] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-md hover:border-slate-700 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Banner: Organization & Save Toggle */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 font-bold text-sm shadow-inner flex-shrink-0 group-hover:border-cyan-800/60 transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-400 block truncate group-hover:text-slate-300 transition-colors">
                {opportunity.organization}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{opportunity.location}</span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleSave}
            disabled={isUpdating}
            title={saved ? 'Remove from saved' : 'Save opportunity'}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark opportunity'}
            className={`p-2 rounded-xl border transition-all duration-150 flex-shrink-0 ${
              saved
                ? 'bg-amber-950/50 text-amber-400 border-amber-800/60 shadow-xs'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Opportunity Title */}
        <Link to={`/student/opportunities/${opportunity._id}`} className="block mb-3 group/link">
          <h3 className="text-base font-bold text-slate-100 group-hover/link:text-cyan-300 transition-colors leading-snug line-clamp-2">
            {opportunity.title}
          </h3>
        </Link>

        {/* Badges Bar: Type, Work Mode, Experience */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${typeBadgeStyles}`}>
            {opportunity.type}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${workModeStyles}`}>
            {opportunity.workMode}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 text-slate-400 border border-slate-800">
            {opportunity.experienceLevel}
          </span>
          {opportunity.category && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 text-slate-500 border border-slate-800/80">
              {opportunity.category}
            </span>
          )}
        </div>

        {/* Brief Description (hidden on ultra-compact mode) */}
        {!compact && opportunity.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed font-normal">
            {opportunity.description}
          </p>
        )}

        {/* Required Skills Badges */}
        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
              Required Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.requiredSkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 text-[11px] font-medium"
                >
                  {skill}
                </span>
              ))}
              {opportunity.requiredSkills.length > 4 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-950 text-slate-500 border border-slate-800 text-[10px] font-medium">
                  +{opportunity.requiredSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Compensation, Deadline & Action Button */}
      <div className="pt-3.5 border-t border-slate-800/80 mt-auto">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3.5">
          <div className="flex items-center gap-1.5">
            {opportunity.stipend || opportunity.salary ? (
              <span className="font-semibold text-slate-200 text-xs">
                {opportunity.stipend || opportunity.salary}
              </span>
            ) : (
              <span className="text-slate-500 text-[11px]">Unpaid / Volunteer</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span
              className={`text-[11px] font-medium ${
                isUrgent ? 'text-amber-400 font-semibold' : 'text-slate-400'
              }`}
            >
              {deadlineText}
            </span>
          </div>
        </div>

        <Link
          to={`/student/opportunities/${opportunity._id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 hover:border-cyan-700 rounded-xl transition-all duration-150 group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
