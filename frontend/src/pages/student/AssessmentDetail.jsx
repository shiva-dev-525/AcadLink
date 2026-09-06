import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import {
  Clock,
  Award,
  HelpCircle,
  ArrowLeft,
  Play,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export default function AssessmentDetail() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    assessmentService
      .getAssessmentById(assessmentId)
      .then((res) => {
        if (isMounted) {
          if (res.success) {
            setAssessment(res.data.assessment);
          } else {
            setError(res.message || 'Failed to load assessment details.');
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
  }, [assessmentId]);

  const handleStart = async () => {
    setStarting(true);
    setError(null);

    try {
      const res = await assessmentService.startAssessment(assessmentId);
      if (res.success && res.data?.attempt) {
        const attemptId = res.data.attempt._id;
        navigate(`/student/assessments/${assessmentId}/attempt/${attemptId}`);
      } else {
        setError(res.message || 'Unable to begin attempt.');
        setStarting(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start assessment. Please try again.');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading assessment overview...</span>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white mb-2">Assessment Unavailable</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'The requested assessment could not be found.'}</p>
          <Link
            to="/student/assessments"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Assessments</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Back button */}
      <Link
        to="/student/assessments"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Assessments</span>
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
            {assessment.skill}
          </span>
          <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-lg">
            {assessment.difficulty} Difficulty
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          {assessment.title}
        </h1>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {assessment.description ||
            'Verify your technical competency in this subject. Assessment results directly update your skill readiness profile and calibrate your learning recommendations.'}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Time Limit</span>
              <span className="text-xs font-bold text-white">
                {assessment.durationMinutes > 0 ? `${assessment.durationMinutes} Minutes` : 'Untimed'}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Total Questions</span>
              <span className="text-xs font-bold text-white">{assessment.questionCount || 10} MCQs</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Verification</span>
              <span className="text-xs font-bold text-white">Official Score</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-5 mb-8">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Assessment Instructions & Rules</span>
          </h2>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>Each question presents 4 choices with exactly one correct answer.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>Scoring is executed server-side. Unanswered questions earn 0 points.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>
                {assessment.durationMinutes > 0
                  ? `The timer begins immediately upon starting. If time expires, answers are auto-submitted.`
                  : 'Take your time to thoroughly understand each problem.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>You can retake this assessment at any time to demonstrate improved proficiency.</span>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            Clicking below will create an active attempt session.
          </span>
          <button
            onClick={handleStart}
            disabled={starting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-950 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
          >
            {starting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Initializing Session...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Begin Assessment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
