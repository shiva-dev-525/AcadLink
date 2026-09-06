import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Send,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function AssessmentQuiz() {
  const { assessmentId, attemptId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [assessmentInfo, setAssessmentInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timing
  const [timeLeft, setTimeLeft] = useState(null);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  // Initialize Quiz: fetch questions via start endpoint (resumes if in progress)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    assessmentService
      .startAssessment(assessmentId)
      .then((res) => {
        if (isMounted && res.success) {
          const qList = res.data.questions || [];
          setQuestions(qList);
          setAssessmentInfo(res.data.assessment);

          // If resuming previous answers
          if (res.data.attempt?.answers?.length > 0) {
            const initialAns = {};
            res.data.attempt.answers.forEach((a) => {
              if (a.questionId && a.selectedOption !== null && a.selectedOption !== undefined) {
                initialAns[a.questionId] = a.selectedOption;
              }
            });
            setAnswers(initialAns);
          }

          // Setup countdown timer
          const duration = res.data.assessment?.durationMinutes || 15;
          setTimeLeft(duration * 60);
        } else if (isMounted) {
          setError(res.message || 'Unable to load quiz session.');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Error initializing quiz.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [assessmentId]);

  // Timer Tick
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft !== null]);

  // Handle auto-submit on timer expiry
  const handleAutoSubmit = () => {
    if (submitting) return;
    executeSubmission();
  };

  const handleSelectOption = (qId, optionIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const executeSubmission = async () => {
    setSubmitting(true);
    setShowConfirmModal(false);
    setError(null);

    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    // Format answers array
    const formattedAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedOption: answers[q._id] !== undefined ? answers[q._id] : null,
    }));

    try {
      const res = await assessmentService.submitAssessment(
        attemptId,
        formattedAnswers,
        timeTakenSeconds
      );

      if (res.success) {
        navigate(`/student/assessments/attempts/${attemptId}/result`);
      } else {
        setError(res.message || 'Submission failed.');
        setSubmitting(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Preparing assessment session...</span>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white mb-2">Unable to Load Quiz</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'No questions found for this assessment.'}</p>
          <button
            onClick={() => navigate('/student/assessments')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors"
          >
            Return to Assessments
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentQId = currentQ?._id;
  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;

  const formatTimer = (seconds) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 min-h-[90vh] flex flex-col justify-between">
      <div>
        {/* Top Header: Title, Live Timer, Question Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              {assessmentInfo?.skill || 'Assessment'}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {assessmentInfo?.title || 'Skill Assessment'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Badge */}
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-300">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {answeredCount} of {totalCount} Answered
              </span>
            </div>

            {/* Timer */}
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold ${
                timeLeft !== null && timeLeft < 120
                  ? 'bg-rose-950/50 border-rose-800/80 text-rose-300 animate-pulse'
                  : 'bg-indigo-950/50 border-indigo-800/60 text-cyan-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-6 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>

        {/* Main Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question {currentIndex + 1} of {totalCount}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              {currentQ.difficulty || 'Intermediate'}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed mb-6">
            {currentQ.questionText}
          </h2>

          {/* MCQ Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQId] === idx;
              const letter = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(currentQId, idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-indigo-950/60 border-cyan-500 text-white shadow-md shadow-indigo-950/50'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {letter}
                  </div>
                  <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Navigation Controls */}
      <div>
        {/* Question Selector Quick Dots */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
          {questions.map((q, idx) => {
            const isAnswered = answers[q._id] !== undefined;
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'ring-2 ring-cyan-400 bg-indigo-600 text-white'
                    : isAnswered
                    ? 'bg-indigo-950 border border-indigo-700 text-cyan-300'
                    : 'bg-slate-800/60 border border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex === totalCount - 1 ? (
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Assessment</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1))}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in-fast">
            <h3 className="text-base font-bold text-white mb-2">Ready to Submit?</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              You have answered <span className="text-cyan-400 font-bold">{answeredCount}</span> of{' '}
              <span className="text-white font-bold">{totalCount}</span> questions.
              {answeredCount < totalCount && (
                <span className="block mt-2 text-amber-400 font-semibold">
                  ⚠️ Note: {totalCount - answeredCount} unanswered questions will be marked as 0 points.
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition-colors"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={executeSubmission}
                disabled={submitting}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
