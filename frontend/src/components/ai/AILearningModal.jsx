import React, { useState, useEffect } from 'react';
import aiService from '../../services/aiService';
import {
  Sparkles,
  X,
  Calendar,
  CheckCircle2,
  FolderGit2,
  AlertTriangle,
  Lightbulb,
  Clock,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export default function AILearningModal({ skillName, resourceTitle, targetCareer, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchGuidance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await aiService.getLearningGuidance(skillName, resourceTitle, targetCareer);
        if (isMounted) {
          if (res.success && res.data) {
            setData(res.data);
          } else {
            setError(res.message || 'Unable to generate learning roadmap.');
          }
        }
      } catch {
        if (isMounted) setError('Network error fetching AI roadmap.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGuidance();
    return () => {
      isMounted = false;
    };
  }, [skillName, resourceTitle, targetCareer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-cyan-300 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Learning Roadmap</h3>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                  Gemini
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalized study plan for <strong className="text-slate-200">{skillName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span className="text-xs font-medium text-slate-400">
                Synthesizing practical milestones and portfolio project idea...
              </span>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-amber-950/40 border border-amber-800/50 text-amber-300 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          {data && !loading && (
            <>
              {/* Roadmap Summary */}
              {data.studyPlanSummary && (
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.studyPlanSummary}
                  </p>
                </div>
              )}

              {/* Weekly Milestones */}
              {data.weeklyMilestones && data.weeklyMilestones.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                    Weekly Learning Milestones
                  </span>
                  <div className="space-y-2">
                    {data.weeklyMilestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                            {m.week}: {m.focus}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Deliverable: <strong className="text-slate-200">{m.deliverable}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio Project Idea */}
              {data.portfolioProjectIdea && (
                <div className="p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                      Portfolio Project: {data.portfolioProjectIdea.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.portfolioProjectIdea.description}
                  </p>
                  {data.portfolioProjectIdea.recommendedStack && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {data.portfolioProjectIdea.recommendedStack.map((st, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/60 text-indigo-300 text-[10px]"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pitfalls to Avoid */}
              {data.pitfallsToAvoid && data.pitfallsToAvoid.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    Common Pitfalls to Avoid:
                  </span>
                  <ul className="space-y-1 text-slate-300 text-xs">
                    {data.pitfallsToAvoid.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/60">
          <span className="text-[10px] text-slate-500">
            {data?.source === 'gemini' ? 'AI synthesized learning plan' : 'Curated platform milestones'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
