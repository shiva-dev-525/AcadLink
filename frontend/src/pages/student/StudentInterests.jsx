import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { CAREER_INTERESTS } from '../../utils/constants';
import { 
  Compass, 
  CheckCircle2, 
  Save, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  Info,
  Check 
} from 'lucide-react';

export default function StudentInterests() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [availableOptions, setAvailableOptions] = useState(CAREER_INTERESTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    studentService.getCareerInterests()
      .then((res) => {
        if (res.success && res.data) {
          setSelectedInterests(res.data.careerInterests || []);
          if (res.data.availableOptions && res.data.availableOptions.length > 0) {
            setAvailableOptions(res.data.availableOptions);
          }
        }
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Failed to load career interests.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleInterest = (interest) => {
    setSuccessMessage('');
    setErrorMessage('');
    setSelectedInterests((prev) =>
      prev.includes(interest) 
        ? prev.filter((i) => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await studentService.updateCareerInterests(selectedInterests);
      if (res.success) {
        setSuccessMessage('Career interests synchronized with backend!');
      } else {
        setErrorMessage(res.message || 'Failed to update interests.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save career interests.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-900 rounded-xl w-1/4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-slate-900 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in bg-[#0B0F19] text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Career Interests</h1>
          <p className="text-xs text-slate-400 mt-1">
            Select the domains and tracks you aspire to pursue. This directs your upcoming skill assessments and internship recommendations.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-950 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Interests ({selectedInterests.length})</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 animate-fade-in-fast">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-2.5 text-xs text-rose-300 animate-fade-in-fast">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Info Notice */}
      <div className="p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-2xl flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-200 leading-relaxed">
          <span className="font-bold block mb-0.5 text-cyan-300">Career Guidance Engine Calibration:</span>
          Your chosen career interests directly calibrate the benchmark skill expectations used in the <span className="font-semibold text-cyan-300">Phase 6 Skill-Gap Analysis</span> and the <span className="font-semibold text-cyan-300">Phase 9 Deterministic Matching Engine</span>.
        </div>
      </div>

      {/* Selectable Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available Career Tracks (Click to Toggle)
          </span>
          <span className="text-xs font-mono bg-slate-950 text-cyan-300 px-2.5 py-0.5 rounded-md border border-slate-800">
            {selectedInterests.length} selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {availableOptions.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all duration-200 card-hover ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-950/30'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-xs font-bold leading-tight block ${
                      isSelected ? 'text-cyan-200' : 'text-slate-200'
                    }`}>
                      {interest}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Career Track
                    </span>
                  </div>
                </div>

                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 bg-slate-900'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
