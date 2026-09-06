import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import {
  ClipboardList,
  Calendar,
  Award,
  ArrowLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function AssessmentHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    assessmentService
      .getMyAttempts()
      .then((res) => {
        if (isMounted) {
          if (res.success) {
            setAttempts(res.data.attempts || []);
          } else {
            setError(res.message || 'Failed to load assessment history.');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Unable to connect to server.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/student/assessments"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Assessments</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Assessment History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review all past skill evaluation attempts and performance trends over time.
          </p>
        </div>

        <Link
          to="/student/assessments"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Take New Assessment</span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
          {error}
        </div>
      ) : attempts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">No Assessments Completed Yet</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
            Take your first skill assessment to calibrate your skill readiness and unlock personalized learning paths.
          </p>
          <Link
            to="/student/assessments"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold rounded-xl"
          >
            Browse Available Assessments
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((att) => {
            const assessment = att.assessment || {};
            const dateStr = att.submittedAt
              ? new Date(att.submittedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'In Progress';

            return (
              <div
                key={att._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white font-mono">{att.percentage}%</span>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">Score</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">
                        {assessment.title || 'Skill Assessment'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {assessment.skill || 'Skill'}
                      </span>
                      {att.skillLevel && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getLevelBadgeClass(att.skillLevel)}`}>
                          {att.skillLevel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {dateStr}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{att.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {att.status === 'completed' && (
                    <Link
                      to={`/student/assessments/attempts/${att._id}/result`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
                    >
                      <span>View Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
