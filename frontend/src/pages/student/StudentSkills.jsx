import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { 
  COMMON_TECH_SKILLS, 
  SOFT_SKILLS, 
  PROFICIENCY_LEVELS 
} from '../../utils/constants';
import { 
  Wrench, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  AlertCircle, 
  ShieldAlert,
  Info,
  Sparkles
} from 'lucide-react';

export default function StudentSkills() {
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  
  // New skill inputs
  const [newTechName, setNewTechName] = useState('');
  const [newTechProficiency, setNewTechProficiency] = useState('Beginner');
  const [newSoftName, setNewSoftName] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    studentService.getSkills()
      .then((res) => {
        if (res.success && res.data) {
          setTechnicalSkills(res.data.technicalSkills || []);
          setSoftSkills(res.data.softSkills || []);
        }
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Failed to load skills.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Add Technical Skill
  const handleAddTechnical = (e) => {
    e.preventDefault();
    if (!newTechName.trim()) return;

    const trimmed = newTechName.trim();
    if (technicalSkills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage(`Technical skill "${trimmed}" is already declared.`);
      return;
    }

    setTechnicalSkills((prev) => [
      ...prev,
      {
        name: trimmed,
        proficiency: newTechProficiency,
        verificationType: 'Self-reported',
      },
    ]);
    setNewTechName('');
    setNewTechProficiency('Beginner');
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Remove Technical Skill
  const handleRemoveTechnical = (skillName) => {
    setTechnicalSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  // Add Soft Skill
  const handleAddSoft = (e) => {
    e?.preventDefault();
    if (!newSoftName.trim()) return;

    const trimmed = newSoftName.trim();
    if (softSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage(`Soft skill "${trimmed}" is already declared.`);
      return;
    }

    setSoftSkills((prev) => [...prev, trimmed]);
    setNewSoftName('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Add Soft Skill from quick tag
  const handleQuickAddSoft = (skillName) => {
    if (!softSkills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      setSoftSkills((prev) => [...prev, skillName]);
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  // Remove Soft Skill
  const handleRemoveSoft = (skillName) => {
    setSoftSkills((prev) => prev.filter((s) => s !== skillName));
  };

  // Save All Skills to Backend
  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await studentService.updateSkills({
        technicalSkills,
        softSkills,
      });

      if (res.success) {
        setSuccessMessage('Skills profile synchronized with backend!');
      } else {
        setErrorMessage(res.message || 'Failed to save skills.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save skills.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-900 rounded-xl w-1/4"></div>
          <div className="h-48 bg-slate-900 rounded-2xl"></div>
          <div className="h-48 bg-slate-900 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in bg-[#0B0F19] text-slate-100">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Skills Profile</h1>
          <p className="text-xs text-slate-400 mt-1">
            Declare your current technical competencies and interpersonal strengths.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-950 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Skills...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Skills ({technicalSkills.length + softSkills.length})</span>
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

      {/* Verification Notice Banner */}
      <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-2xl flex items-start gap-3.5">
        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <span className="font-bold block mb-0.5 text-amber-300">Self-Reported Skill Distinction:</span>
          Skills declared in Phase 3 are marked as <span className="font-semibold underline text-amber-100">Self-reported</span>. In Phase 5, you will be able to take distraction-free MCQ assessments to earn official <span className="font-semibold text-emerald-400">Assessment-verified</span> badges that carry full weight in opportunity matching.
        </div>
      </div>

      {/* Section 1: Technical Skills */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Technical Skills</h2>
              <span className="text-[11px] text-slate-400 block">Programming languages, frameworks, & tools</span>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-950 text-cyan-300 px-2.5 py-0.5 rounded-md border border-slate-800">
            {technicalSkills.length} declared
          </span>
        </div>

        {/* Add Technical Skill Form */}
        <form onSubmit={handleAddTechnical} className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1">
            <input
              type="text"
              list="tech-suggestions"
              value={newTechName}
              onChange={(e) => setNewTechName(e.target.value)}
              placeholder="Skill name (e.g. React, Python, SQL, Docker)"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <datalist id="tech-suggestions">
              {COMMON_TECH_SKILLS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div className="sm:w-44">
            <select
              value={newTechProficiency}
              onChange={(e) => setNewTechProficiency(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              {PROFICIENCY_LEVELS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </form>

        {/* Technical Skills List */}
        {technicalSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {technicalSkills.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-900 hover:border-slate-700 transition-all card-hover group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{tech.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                      tech.proficiency === 'Advanced' 
                        ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-800/60'
                        : tech.proficiency === 'Intermediate'
                        ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tech.proficiency}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {tech.verificationType || 'Self-reported'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTechnical(tech.name)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                  title="Remove Skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-400 font-medium">No technical skills added yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Add programming languages, frameworks, databases, or developer tools.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Soft Skills */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Soft Skills</h2>
              <span className="text-[11px] text-slate-400 block">Communication, teamwork, & leadership competencies</span>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-950 text-cyan-300 px-2.5 py-0.5 rounded-md border border-slate-800">
            {softSkills.length} declared
          </span>
        </div>

        {/* Add Soft Skill Form */}
        <form onSubmit={handleAddSoft} className="flex gap-2.5">
          <input
            type="text"
            value={newSoftName}
            onChange={(e) => setNewSoftName(e.target.value)}
            placeholder="Add custom soft skill (e.g. Conflict Resolution, Stakeholder Management)"
            className="flex-1 px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Quick Pick Soft Skills */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
            Suggested Soft Skills (Click to Add):
          </span>
          <div className="flex flex-wrap gap-2">
            {SOFT_SKILLS.map((skill) => {
              const isAdded = softSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleQuickAddSoft(skill)}
                  disabled={isAdded}
                  className={`text-xs px-3 py-1 rounded-full border transition-all duration-150 ${
                    isAdded
                      ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-default line-through'
                      : 'bg-slate-950 hover:bg-indigo-950/60 text-slate-300 hover:text-cyan-300 border-slate-800 hover:border-cyan-500/50 hover:-translate-y-0.5'
                  }`}
                >
                  + {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Soft Skills Pills */}
        {softSkills.length > 0 ? (
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Declared Soft Skills:
            </span>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((soft) => (
                <span
                  key={soft}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 text-slate-200 border border-slate-800 text-xs font-semibold hover:border-slate-700 transition-colors"
                >
                  <span>{soft}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSoft(soft)}
                    className="text-slate-500 hover:text-rose-400 rounded-full font-bold"
                    title="Remove Soft Skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-500">No soft skills added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
