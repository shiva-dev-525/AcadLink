import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assessmentService } from '../../services/assessmentService';
import {
  ClipboardList,
  Clock,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  BarChart2,
  Zap,
} from 'lucide-react';

const DIFFICULTY_COLORS = {
  Beginner: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60',
  Intermediate: 'bg-amber-950/50 text-amber-300 border-amber-800/60',
  Advanced: 'bg-rose-950/50 text-rose-300 border-rose-800/60',
};

const LEVEL_COLORS = {
  Beginner: 'text-emerald-300',
  Intermediate: 'text-amber-300',
  Advanced: 'text-indigo-300',
  Expert: 'text-cyan-300',
};

export default function AssessmentList() {
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [aRes, attRes] = await Promise.all([
        assessmentService.getAssessments(),
        assessmentService.getMyAttempts().catch(() => ({ data: { attempts: [] } })),
      ]);

      if (aRes.success) setAssessments(aRes.data.assessments || []);
      if (attRes.success) setAttempts(attRes.data.attempts || []);
    } catch (err) {
      setError(err.message || 'Unable to load assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Build a map: assessmentId → best completed attempt
  const bestAttemptMap = {};
  attempts.forEach((att) => {
    if (att.status === 'completed' && att.assessment?._id) {
      const id = att.assessment._id;
      if (!bestAttemptMap[id] || att.percentage > bestAttemptMap[id].percentage) {
        bestAttemptMap[id] = att;
      }
    }
  });

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-900 rounded-xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-52 bg-slate-900 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center animate-fade-in">
        <div className="bg-slate-900 rounded-2xl border border-rose-900/60 p-8 shadow-xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Unable to Load Assessments</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">{error}</p>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/70 border border-indigo-700/50 text-cyan-400 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Skill Assessments</h1>
          </div>
          <p className="text-xs text-slate-400">
            Take objective MCQ assessments to benchmark your skills. Results are evaluated server-side.
          </p>
        </div>
        <Link
          to="/student/assessments/history"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all self-start sm:self-auto"
        >
          <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
          View History
        </Link>
      </div>

      {/* Assessments Grid */}
      {assessments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No assessments available right now.</p>
          <p className="text-xs text-slate-500 mt-1">Check back later or contact your administrator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assessments.map((assessment) => {
            const best = bestAttemptMap[assessment._id];
            return (
              <AssessmentCard
                key={assessment._id}
                assessment={assessment}
                bestAttempt={best}
                onStart={() => navigate(`/student/assessments/${assessment._id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function AssessmentCard({ assessment, bestAttempt, onStart }) {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between card-hover group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[assessment.difficulty] || DIFFICULTY_COLORS.Beginner}`}>
            {assessment.difficulty}
          </span>
        </div>

        {/* Title & Skill */}
        <h3 className="text-sm font-bold text-white mb-0.5">{assessment.title}</h3>
        <p className="text-[11px] text-cyan-400 font-semibold mb-3">{assessment.skill}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {assessment.questionCount || assessment.questions?.length || 0} Questions
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {assessment.durationMinutes} min
          </span>
        </div>

        {/* Previous best attempt */}
        {bestAttempt && (
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/80 rounded-xl border border-slate-800 mb-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <div className="text-[11px]">
              <span className="text-slate-400">Best: </span>
              <span className="font-bold text-white">{bestAttempt.percentage}%</span>
              <span className={`ml-1.5 font-semibold ${LEVEL_COLORS[bestAttempt.skillLevel] || 'text-slate-300'}`}>
                — {bestAttempt.skillLevel}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full inline-flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-700/60 rounded-xl transition-all duration-150 group"
      >
        <span>{bestAttempt ? 'Retake Assessment' : 'Start Assessment'}</span>
        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
