import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import learningService from '../../services/learningService';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Filter,
  Award,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Compass,
} from 'lucide-react';
import AILearningModal from '../../components/ai/AILearningModal';

export default function LearningPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in-progress' | 'completed'
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedResourceForAI, setSelectedResourceForAI] = useState(null);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await learningService.getRecommendations();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.message || 'Unable to load recommendations.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleStatusChange = async (resourceId, newStatus) => {
    try {
      setUpdatingId(resourceId);
      const res = await learningService.updateProgress(resourceId, newStatus);
      if (res.success) {
        // Optimistically update local state
        setData((prev) => {
          if (!prev) return prev;
          const updatedRecs = (prev.recommended || []).map((r) =>
            r._id === resourceId ? { ...r, studentStatus: newStatus } : r
          );
          const updatedAll = (prev.allResources || []).map((r) =>
            r._id === resourceId ? { ...r, studentStatus: newStatus } : r
          );

          const completedCount = updatedRecs.filter((r) => r.studentStatus === 'Completed').length;
          const inProgressCount = updatedRecs.filter((r) => r.studentStatus === 'In Progress').length;
          const total = updatedRecs.length;

          return {
            ...prev,
            recommended: updatedRecs,
            allResources: updatedAll,
            stats: {
              ...prev.stats,
              completedCount,
              inProgressCount,
              completionRate: total > 0 ? Math.round((completedCount / total) * 100) : 0,
            },
          };
        });
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading personalized learning path...</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <h2 className="text-base font-bold text-white mb-2">Learning Hub Unavailable</h2>
          <p className="text-xs text-slate-400 mb-6">{error}</p>
          <button
            onClick={loadRecommendations}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { targetCareer = 'Software Developer', stats = {}, recommended = [], allResources = [] } = data || {};

  // Extract distinct skills from resources
  const availableSkills = Array.from(new Set(recommended.map((r) => r.skill))).filter(Boolean);

  // Filter resources
  const filteredResources = recommended.filter((r) => {
    // Status filter
    if (activeTab === 'in-progress' && r.studentStatus !== 'In Progress') return false;
    if (activeTab === 'completed' && r.studentStatus !== 'Completed') return false;
    // Skill filter
    if (selectedSkill !== 'all' && r.skill !== selectedSkill) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              Remedial & Growth Modules
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Personalized Learning Plan
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Targeted tutorials and courses mapped directly to your diagnosed skill gaps for{' '}
            <strong className="text-cyan-300">{targetCareer}</strong>.
          </p>
        </div>

        <Link
          to="/student/skill-gaps"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition-colors self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>View Skill Gap Matrix</span>
        </Link>
      </div>

      {/* Progress Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="w-full sm:w-2/3">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Curriculum Progression
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Completing these recommended resources prepares you for verified skill reassessments and recruitment matching.
            </p>

            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
                style={{ width: `${stats.completionRate || 0}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 sm:border-l sm:border-slate-800 sm:pl-8 flex-shrink-0">
            <div className="text-center">
              <span className="text-2xl font-extrabold text-white font-mono block">
                {stats.completedCount || 0} / {stats.totalRecommended || 0}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Completed
              </span>
            </div>

            <div className="text-center">
              <span className="text-2xl font-extrabold text-cyan-400 font-mono block">
                {stats.completionRate || 0}%
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Mastery Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Recommended ({recommended.length})
          </button>
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'in-progress'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            In Progress ({stats.inProgressCount || 0})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'completed'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({stats.completedCount || 0})
          </button>
        </div>

        {/* Filter by Skill */}
        {availableSkills.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">Skill:</span>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 py-1.5 px-2.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="all">All Skills</option>
              {availableSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Recommendations Feed */}
      {filteredResources.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">No Matching Resources Found</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
            {activeTab === 'completed'
              ? 'You have not marked any recommended resource as completed yet.'
              : activeTab === 'in-progress'
              ? 'No courses are currently in progress.'
              : 'Try clearing your active filters.'}
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedSkill('all');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((item) => {
            const isUpdating = updatingId === item._id;
            const status = item.studentStatus || 'Not Started';

            let priorityBadgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
            if (item.recommendationPriority === 'Critical') {
              priorityBadgeClass = 'bg-rose-950/70 border-rose-800/80 text-rose-300';
            } else if (item.recommendationPriority === 'High') {
              priorityBadgeClass = 'bg-amber-950/70 border-amber-800/80 text-amber-300';
            } else if (item.recommendationPriority === 'Medium') {
              priorityBadgeClass = 'bg-indigo-950/70 border-indigo-800/80 text-cyan-300';
            }

            return (
              <div
                key={item._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 transition-all hover:border-slate-700 shadow-md"
              >
                {/* Header: Skill Tag, Priority & Status Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {item.skill}
                    </span>
                    <span className={`px-2 py-0.5 border text-[10px] font-bold rounded uppercase ${priorityBadgeClass}`}>
                      {item.recommendationPriority} Priority
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {item.difficulty} · {item.resourceType}
                    </span>
                  </div>

                  {/* Student Status Select Button Group */}
                  <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
                    {['Not Started', 'In Progress', 'Completed'].map((st) => {
                      const isCurrent = status === st;
                      let activeStyle = '';
                      if (st === 'Completed') activeStyle = 'bg-emerald-600 text-white font-bold';
                      else if (st === 'In Progress') activeStyle = 'bg-indigo-600 text-white font-bold';
                      else activeStyle = 'bg-slate-800 text-slate-300';

                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(item._id, st)}
                          disabled={isUpdating}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                            isCurrent
                              ? activeStyle
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Resource Title */}
                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Transparent "Why Recommended" Explanation Callout */}
                {item.whyRecommended && (
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 mb-4 flex items-start gap-2.5 text-xs text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-300 font-bold block mb-0.5">
                        Diagnostic Rationale:
                      </span>
                      <span>{item.whyRecommended}</span>
                    </div>
                  </div>
                )}

                {/* Footer: Topics, Duration, External Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.estimatedDuration}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[10px] text-slate-400">
                      By <strong className="text-slate-300">{item.provider}</strong>
                    </span>

                    {item.topics?.length > 0 && (
                      <div className="hidden sm:flex items-center gap-1.5 ml-2">
                        {item.topics.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-800/50 text-[10px] text-slate-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <button
                      onClick={() => setSelectedResourceForAI(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Roadmap</span>
                    </button>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>Access Material</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Learning Roadmap Modal */}
      {selectedResourceForAI && (
        <AILearningModal
          skillName={selectedResourceForAI.skill}
          resourceTitle={selectedResourceForAI.title}
          targetCareer={data?.studentGoal}
          onClose={() => setSelectedResourceForAI(null)}
        />
      )}
    </div>
  );
}
