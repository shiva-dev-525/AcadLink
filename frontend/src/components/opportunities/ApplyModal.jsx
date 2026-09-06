import React, { useState } from 'react';
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Building2,
  Briefcase,
} from 'lucide-react';

/**
 * ApplyModal
 *
 * A focused modal for submitting an application to an opportunity.
 * Collects optional cover letter, resume URL, and contact phone.
 *
 * Props:
 *  - opportunity: The opportunity object being applied to
 *  - matchScore: Optional match score to display
 *  - onClose: Function to close the modal
 *  - onSubmit: Async function(data) that handles submission
 */
export default function ApplyModal({ opportunity, matchScore, onClose, onSubmit }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { success, message }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      await onSubmit({
        opportunityId: opportunity._id,
        coverLetter: coverLetter.trim(),
        resumeUrl: resumeUrl.trim(),
        contactPhone: contactPhone.trim(),
      });

      setSubmitResult({
        success: true,
        message: 'Application submitted successfully! You can track its status in My Applications.',
      });
    } catch (err) {
      setSubmitResult({
        success: false,
        message: err.message || 'Failed to submit application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Success state — show confirmation
  if (submitResult?.success) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
          <div className="w-14 h-14 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Application Submitted</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">{submitResult.message}</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center flex-shrink-0">
              <Send className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate">Apply for Position</h2>
              <p className="text-[11px] text-slate-500 truncate">{opportunity.organization}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Opportunity Summary */}
        <div className="px-5 py-4 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-100 truncate">{opportunity.title}</h3>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {opportunity.organization}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {opportunity.type}
                </span>
              </div>
            </div>
            {matchScore !== undefined && matchScore !== null && (
              <div className={`text-center px-3 py-1.5 rounded-xl border flex-shrink-0 ${
                matchScore >= 85
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50'
                  : matchScore >= 70
                  ? 'bg-cyan-950/50 text-cyan-300 border-cyan-800/50'
                  : matchScore >= 50
                  ? 'bg-amber-950/50 text-amber-300 border-amber-800/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                <span className="text-base font-extrabold block leading-tight">{matchScore}%</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider">Match</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {submitResult && !submitResult.success && (
          <div className="mx-5 mt-4 p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{submitResult.message}</span>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Cover Letter */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5" htmlFor="apply-cover-letter">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Cover Letter
              <span className="text-slate-600 font-normal">(Optional)</span>
            </label>
            <textarea
              id="apply-cover-letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Briefly introduce yourself and explain your interest in this role..."
              maxLength={2000}
              rows={5}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700/30 resize-none transition-colors"
            />
            <div className="text-right text-[10px] text-slate-600 mt-1">
              {coverLetter.length}/2000
            </div>
          </div>

          {/* Resume URL */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5" htmlFor="apply-resume-url">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Resume / Portfolio URL
              <span className="text-slate-600 font-normal">(Optional)</span>
            </label>
            <input
              id="apply-resume-url"
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/your-resume"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700/30 transition-colors"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5" htmlFor="apply-phone">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              Contact Phone
              <span className="text-slate-600 font-normal">(Optional)</span>
            </label>
            <input
              id="apply-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700/30 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-950/40 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
