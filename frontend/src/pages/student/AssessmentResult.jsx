import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ChevronRight,
  HelpCircle,
  ArrowUpRight,
  Compass,
} from 'lucide-react';

export default function AssessmentResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questionReview, setQuestionReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    assessmentService
      .getAttemptById(attemptId)
      .then((res) => {
        if (isMounted) {
          if (res.success) {
            setAttempt(res.data.attempt);
            setQuestionReview(res.data.questionReview || []);
          } else {
            setError(res.message || 'Failed to load assessment result.');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Unable to retrieve results.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading verified results...</span>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <h2 className="text-base font-bold text-white mb-2">Results Unavailable</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'Attempt result could not be retrieved.'}</p>
          <Link
            to="/student/assessments"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors"
          >
            Return to Assessments
          </Link>
        </div>
      </div>
    );
  }

  const assessment = attempt.assessment || {};
  const correctCount = questionReview.filter((q) => q.isCorrect).length;
  const totalCount = questionReview.length;

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-950/60 border-purple-700/60 text-purple-300';
      case 'Advanced':
        return 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300';
      case 'Intermediate':
        return 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300';
      default:
        return 'bg-amber-950/60 border-amber-700/60 text-amber-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/student/assessments"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Assessments</span>
        </Link>
        <Link
          to="/student/assessments/history"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View Full History →
        </Link>
      </div>

      {/* Hero Score Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                {assessment.skill || 'Verified Skill'}
              </span>
              <span className={`px-2.5 py-1 border text-xs font-bold rounded-lg ${getLevelBadgeClass(attempt.skillLevel)}`}>
                {attempt.skillLevel} Level
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              {assessment.title || 'Assessment Complete'}
            </h1>
            <p className="text-xs text-slate-400">
              Submitted on {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : 'Today'}
              {attempt.timeTakenSeconds ? ` · Completed in ${Math.round(attempt.timeTakenSeconds / 60)} min` : ''}
            </p>
          </div>

          {/* Large Circular / Number Score Gauge */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 border border-slate-800 rounded-2xl min-w-[160px] text-center shadow-inner">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {attempt.percentage}%
            </span>
            <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Overall Score
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold mt-0.5">
              {correctCount} / {totalCount} Correct
            </span>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-800">
          <Link
            to="/student/skill-gaps"
            className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 hover:border-cyan-500 text-slate-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-900/60 text-cyan-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-white group-hover:text-cyan-300">
                  Analyze Skill Gaps
                </span>
                <span className="text-[10px] text-slate-400">
                  See how this score impacts your career readiness
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            to="/student/learning"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-white group-hover:text-cyan-300">
                  View Recommended Learning
                </span>
                <span className="text-[10px] text-slate-400">
                  Targeted tutorials based on weak spots
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Detailed Question Review Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">
            Question-by-Question Review
          </h2>
          <span className="text-xs text-slate-400">
            {correctCount} correct out of {totalCount}
          </span>
        </div>

        <div className="space-y-4">
          {questionReview.map((q, idx) => {
            const isCorrect = q.isCorrect;
            return (
              <div
                key={q._id || idx}
                className={`bg-slate-900 border rounded-2xl p-5 transition-all ${
                  isCorrect ? 'border-slate-800/80' : 'border-rose-950/50 bg-rose-950/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q{idx + 1}.</span>
                    <span className="text-xs font-semibold text-slate-200">{q.questionText}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/60 text-rose-400 text-[11px] font-bold">
                        <XCircle className="w-3 h-3" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                {/* Choices summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, optIdx) => {
                    const isStudentChoice = q.selectedOption === optIdx;
                    const isCorrectAnswer = q.correctAnswer === optIdx;

                    let optStyle = 'bg-slate-950/30 border-slate-800/60 text-slate-400';
                    if (isCorrectAnswer) {
                      optStyle = 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200 font-semibold';
                    } else if (isStudentChoice && !isCorrectAnswer) {
                      optStyle = 'bg-rose-950/40 border-rose-800/60 text-rose-300 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between ${optStyle}`}
                      >
                        <span className="leading-snug">{opt}</span>
                        {isCorrectAnswer && (
                          <span className="text-[10px] font-bold text-emerald-400 ml-2">✓ Correct</span>
                        )}
                        {isStudentChoice && !isCorrectAnswer && (
                          <span className="text-[10px] font-bold text-rose-400 ml-2">Your Answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-300 font-bold block mb-0.5">Explanation:</span>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Retake Footer */}
      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Want to improve your score? Retakes are saved as new attempts.
        </span>
        <button
          onClick={() => navigate(`/student/assessments/${assessment._id || ''}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retake Assessment</span>
        </button>
      </div>
    </div>
  );
}
