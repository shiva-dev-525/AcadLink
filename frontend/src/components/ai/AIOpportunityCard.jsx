import React, { useState, useEffect } from 'react';
import aiService from '../../services/aiService';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Award,
} from 'lucide-react';

export default function AIOpportunityCard({ opportunityId, matchScore }) {
  const [activeTab, setActiveTab] = useState('match'); // 'match' | 'prep'
  const [matchAI, setMatchAI] = useState(null);
  const [prepAI, setPrepAI] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Fetch match intelligence
  useEffect(() => {
    let isMounted = true;
    const fetchAI = async () => {
      setLoading(true);
      setError(null);
      try {
        const [matchRes, prepRes] = await Promise.all([
          aiService.getOpportunityExplanation(opportunityId),
          aiService.getApplicationGuidance(opportunityId),
        ]);

        if (isMounted) {
          if (matchRes.success && matchRes.data) {
            setMatchAI(matchRes.data);
          }
          if (prepRes.success && prepRes.data) {
            setPrepAI(prepRes.data);
          }
        }
      } catch {
        if (isMounted) setError('AI insights temporarily unavailable.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAI();
    return () => {
      isMounted = false;
    };
  }, [opportunityId]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-cyan-300 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">AI Opportunity Intelligence</h3>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                Gemini
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized fit analysis and application preparation guide
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('match')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'match'
                  ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-800/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Why You Fit</span>
            </button>
            <button
              onClick={() => setActiveTab('prep')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'prep'
                  ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-800/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Application & Interview Prep</span>
            </button>
          </div>

          {loading && (
            <div className="py-8 flex flex-col items-center justify-center gap-2.5">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-medium">
                Synthesizing AI fit analysis & interview guidance...
              </span>
            </div>
          )}

          {error && !loading && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/50 text-amber-300 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tab 1: Match Analysis */}
          {!loading && activeTab === 'match' && matchAI && (
            <div className="space-y-4">
              {matchAI.matchOverview && (
                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {matchAI.matchOverview}
                  </p>
                </div>
              )}

              {matchAI.primaryStrengths && matchAI.primaryStrengths.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Key Strengths for this Position:
                  </span>
                  <ul className="space-y-1.5">
                    {matchAI.primaryStrengths.map((st, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {matchAI.areasToAddress && matchAI.areasToAddress.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    Areas to Highlight or Elevate:
                  </span>
                  <ul className="space-y-1.5">
                    {matchAI.areasToAddress.map((ar, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{ar}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Application Prep */}
          {!loading && activeTab === 'prep' && prepAI && (
            <div className="space-y-4">
              {prepAI.preApplicationChecklist && prepAI.preApplicationChecklist.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                    Pre-Submission Checklist:
                  </span>
                  <div className="space-y-1.5">
                    {prepAI.preApplicationChecklist.map((ch, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-2 text-xs text-slate-300"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {prepAI.sampleInterviewQuestions && prepAI.sampleInterviewQuestions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Likely Technical Interview Topics:
                  </span>
                  <div className="space-y-2">
                    {prepAI.sampleInterviewQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1"
                      >
                        <span className="text-xs font-semibold text-slate-200 block">
                          Q{i + 1}: {q.question}
                        </span>
                        {q.whatInterviewerLooksFor && (
                          <span className="text-[11px] text-slate-400 block italic">
                            Focus area: {q.whatInterviewerLooksFor}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <span>
              {matchAI?.source === 'gemini' ? 'Synthesized using Google Gemini' : 'Curated platform intelligence'}
            </span>
            <span>Deterministic match score remains authoritative</span>
          </div>
        </div>
      )}
    </div>
  );
}
