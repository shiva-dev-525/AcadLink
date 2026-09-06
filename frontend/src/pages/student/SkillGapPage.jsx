import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import skillGapService from '../../services/skillGapService';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  ChevronDown,
  Info,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import AIGapModal from '../../components/ai/AIGapModal';

export default function SkillGapPage() {
  const [analysis, setAnalysis] = useState(null);
  const [availableCareers, setAvailableCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');
  const [selectedGapForAI, setSelectedGapForAI] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async (career = null) => {
    try {
      if (!analysis) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const res = await skillGapService.getMySkillGaps(career);
      if (res.success && res.data) {
        setAnalysis(res.data);
        setAvailableCareers(res.data.availableCareers || []);
        setSelectedCareer(res.data.targetCareer);
      } else {
        setError(res.message || 'Unable to load skill gap data.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server connection error.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCareerChange = (e) => {
    const newCareer = e.target.value;
    setSelectedCareer(newCareer);
    loadData(newCareer);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Analyzing career readiness & skill gaps...</span>
        </div>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <h2 className="text-base font-bold text-white mb-2">Analysis Unavailable</h2>
          <p className="text-xs text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl transition-colors"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  const {
    targetCareer,
    overallReadiness = 0,
    summary = {},
    strengths = [],
    developingSkills = [],
    needsImprovement = [],
    missingSkills = [],
    nextSteps = [],
  } = analysis || {};

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              Diagnostic Matrix
            </span>
            {refreshing && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Recalculating...
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Skill Gap Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Compare your current verified abilities against industry benchmark requirements for your target career role.
          </p>
        </div>

        {/* Target Career Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          <Compass className="w-4 h-4 text-cyan-400 ml-1 flex-shrink-0" />
          <div className="text-left">
            <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider">
              Target Career Role
            </span>
            <select
              value={selectedCareer}
              onChange={handleCareerChange}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-4"
            >
              {availableCareers.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hero: Career Readiness KPI Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-2/3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-400">Target Role:</span>
              <span className="text-xs font-extrabold text-cyan-300 px-2.5 py-0.5 rounded-lg bg-indigo-950/70 border border-indigo-800/60">
                {targetCareer}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Overall Skill Readiness
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your profile is evaluated by combining both your self-reported competencies and verified assessment scores.
              {summary.attentionRequiredCount > 0 ? (
                <span className="text-amber-400 font-semibold block mt-1">
                  ⚠️ {summary.attentionRequiredCount} skill{summary.attentionRequiredCount > 1 ? 's' : ''} require attention to achieve placement readiness.
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold block mt-1">
                  ✓ Outstanding! You meet industry benchmark criteria for this role.
                </span>
              )}
            </p>

            {/* Visual Readiness Bar */}
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-700 ease-out rounded-full ${
                  overallReadiness >= 75
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : overallReadiness >= 50
                    ? 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                    : 'bg-gradient-to-r from-amber-500 to-rose-500'
                }`}
                style={{ width: `${overallReadiness}%` }}
              />
            </div>
          </div>

          {/* Big Circular Metric */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 border border-slate-800 rounded-2xl min-w-[170px] text-center shadow-inner flex-shrink-0">
            <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
              {overallReadiness}%
            </span>
            <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Readiness Score
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              {summary.strongCount} of {summary.totalRequired} Matched
            </span>
          </div>
        </div>

        {/* 4 Quadrant Mini Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800 text-center">
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-xs font-mono font-bold text-emerald-400 block">
              {summary.strongCount || 0}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Strong Skills
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-xs font-mono font-bold text-cyan-400 block">
              {summary.developingCount || 0}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Developing
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-xs font-mono font-bold text-amber-400 block">
              {summary.needsImprovementCount || 0}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Needs Attention
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-xs font-mono font-bold text-rose-400 block">
              {summary.missingCount || 0}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Missing Skills
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Next Steps Action Banner */}
      {nextSteps.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-950/50 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Recommended Next Steps</span>
            </h2>
            <Link
              to="/student/learning"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>Explore Learning Resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {nextSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Step {idx + 1}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        step.priority === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : step.priority === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-indigo-950 text-cyan-300 border border-indigo-800'
                      }`}
                    >
                      {step.priority}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 leading-snug mb-3">
                    {step.text}
                  </p>
                </div>

                <Link
                  to="/student/learning"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors pt-2 border-t border-slate-800/80"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categorized Detailed Breakdown Cards */}
      <div className="space-y-8">
        {/* 1. Missing Skills (Highest Urgency) */}
        {missingSkills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Missing Skills ({missingSkills.length})
              </h3>
              <span className="text-xs text-slate-500">
                — Essential skills required by industry not found on your profile
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missingSkills.map((item) => (
                <div
                  key={item.skill}
                  className="bg-slate-900 border border-rose-950/40 rounded-2xl p-5 hover:border-rose-900/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.skill}</h4>
                      <span className="text-[10px] text-slate-400">
                        Target benchmark: <strong className="text-slate-200">{item.requiredLevel}</strong>
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-[10px] font-bold uppercase">
                      Missing
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {item.gapReason}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedGapForAI(item.skill)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Insights</span>
                    </button>
                    <Link
                      to="/student/learning"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Learn {item.skill}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Needs Improvement */}
        {needsImprovement.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Needs Improvement ({needsImprovement.length})
              </h3>
              <span className="text-xs text-slate-500">
                — Assessment score or proficiency below target benchmark
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {needsImprovement.map((item) => (
                <div
                  key={item.skill}
                  className="bg-slate-900 border border-amber-950/40 rounded-2xl p-5 hover:border-amber-900/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.skill}</h4>
                      <span className="text-[10px] text-slate-400">
                        Target benchmark: <strong className="text-slate-200">{item.requiredLevel}</strong>
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[10px] font-bold uppercase">
                      Needs Attention
                    </span>
                  </div>

                  {/* Signal Indicators */}
                  <div className="flex flex-wrap gap-2 my-2.5">
                    {item.assessment ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-[10px] text-cyan-300 font-mono">
                        <Award className="w-3 h-3 text-cyan-400" />
                        Verified: {item.assessment.percentage}% ({item.assessment.skillLevel})
                      </span>
                    ) : item.selfReported ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                        Self-Reported: {item.selfReported.proficiency}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {item.gapReason}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedGapForAI(item.skill)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Insights</span>
                    </button>
                    <Link
                      to="/student/learning"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Review Fundamentals</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Developing Skills */}
        {developingSkills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Developing Skills ({developingSkills.length})
              </h3>
              <span className="text-xs text-slate-500">
                — Good foundation, advancing towards target standard
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {developingSkills.map((item) => (
                <div
                  key={item.skill}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.skill}</h4>
                      <span className="text-[10px] text-slate-400">
                        Target benchmark: <strong className="text-slate-200">{item.requiredLevel}</strong>
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-[10px] font-bold uppercase">
                      Developing
                    </span>
                  </div>

                  {/* Signal Indicators */}
                  <div className="flex flex-wrap gap-2 my-2.5">
                    {item.assessment ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-[10px] text-cyan-300 font-mono">
                        <Award className="w-3 h-3 text-cyan-400" />
                        Verified: {item.assessment.percentage}% ({item.assessment.skillLevel})
                      </span>
                    ) : item.selfReported ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                        Self-Reported: {item.selfReported.proficiency}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {item.gapReason}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <Link
                      to="/student/assessments"
                      className="text-[11px] text-slate-400 hover:text-white transition-colors"
                    >
                      Assessment
                    </Link>
                    <Link
                      to="/student/learning"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Advanced Topics</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Strengths (Strong Skills) */}
        {strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Strong Skills ({strengths.length})
              </h3>
              <span className="text-xs text-slate-500">
                — Meets or exceeds required industry competency
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {strengths.map((item) => (
                <div
                  key={item.skill}
                  className="bg-slate-900 border border-emerald-950/40 rounded-2xl p-5 hover:border-emerald-900/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.skill}</h4>
                      <span className="text-[10px] text-slate-400">
                        Target benchmark: <strong className="text-slate-200">{item.requiredLevel}</strong>
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[10px] font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Strong
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 my-2.5">
                    {item.assessment ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[10px] text-emerald-300 font-mono">
                        <Award className="w-3 h-3 text-emerald-400" />
                        Verified: {item.assessment.percentage}% ({item.assessment.skillLevel})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                        Self-Reported: {item.selfReported?.proficiency || 'Advanced'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.gapReason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Gap Analysis Modal */}
      {selectedGapForAI && (
        <AIGapModal
          skillName={selectedGapForAI}
          targetCareer={selectedCareer}
          onClose={() => setSelectedGapForAI(null)}
        />
      )}
    </div>
  );
}
