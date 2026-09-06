import React, { useState, useEffect } from 'react';
import aiService from '../../services/aiService';
import {
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  Compass,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIGapModal({ skillName, targetCareer, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await aiService.getSkillGapExplanation(skillName, targetCareer);
        if (isMounted) {
          if (res.success && res.data) {
            setData(res.data);
          } else {
            setError(res.message || 'Unable to retrieve AI analysis.');
          }
        }
      } catch {
        if (isMounted) setError('Network connection error.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExplanation();
    return () => {
      isMounted = false;
    };
  }, [skillName, targetCareer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-cyan-300 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Skill Gap Analysis</h3>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                  Gemini
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Understanding industry demand for <strong className="text-slate-200">{skillName}</strong>
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

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span className="text-xs font-medium text-slate-400">
                Consulting Gemini for industry relevance and bridging strategy...
              </span>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-amber-950/40 border border-amber-800/50 text-amber-300 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          {data && !loading && (
            <>
              {/* Industry Relevance */}
              <div className="space-y-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Industry Relevance
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {data.industryRelevance}
                </p>
              </div>

              {/* Bridge Strategy */}
              {data.bridgeStrategy && (
                <div className="space-y-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
                    Bridge Strategy
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.bridgeStrategy}
                  </p>
                </div>
              )}

              {/* Learning Milestones */}
              {data.learningMilestones && data.learningMilestones.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Recommended Bridging Milestones
                  </span>
                  <div className="space-y-2">
                    {data.learningMilestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-start gap-2.5"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="text-xs text-slate-200 leading-relaxed">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estimated Effort */}
              {data.estimatedEffort && (
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Estimated commitment: <strong className="text-slate-200">{data.estimatedEffort}</strong></span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/60">
          <span className="text-[10px] text-slate-500">
            {data?.source === 'gemini' ? 'AI generated advisory' : 'Curated platform guidance'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <Link
              to="/student/learning"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
