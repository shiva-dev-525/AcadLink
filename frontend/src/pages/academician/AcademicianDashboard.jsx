import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  FlaskConical,
  Briefcase,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';

const SAMPLE_PROGRAMS = [
  {
    id: 'fdp-1',
    title: 'Advanced Cloud-Native Architecture & Microservices FDP',
    provider: 'Nexis Cloud Technologies',
    type: 'Faculty Development Program',
    duration: '2 Weeks (Virtual)',
    deadline: 'Oct 15, 2026',
    domain: 'Cloud Computing & Distributed Systems',
    description: 'Immersion into production Kubernetes, service mesh, and zero-trust security patterns for computer science faculty.',
    eligibility: 'Faculty with teaching experience in Operating Systems or Networking',
  },
  {
    id: 'res-1',
    title: 'Collaborative AI Research: Edge LLM Optimization',
    provider: 'TechNova Applied Labs',
    type: 'Collaborative Research',
    duration: '6 Months',
    deadline: 'Nov 01, 2026',
    domain: 'Machine Learning & Embedded AI',
    description: 'Joint research initiative exploring quantised transformer inference on low-power IoT microcontrollers with publication co-authorship.',
    eligibility: 'Ph.D. / M.Tech in CSE or ECE with published research in ML',
  },
  {
    id: 'train-1',
    title: 'Industrial Full-Stack Immersion for Educators',
    provider: 'CloudScale Technologies',
    type: 'Industrial Training',
    duration: '4 Weeks',
    deadline: 'Oct 30, 2026',
    domain: 'Full Stack Engineering',
    description: 'Real-world software development lifecycle training: CI/CD pipelines, automated regression testing, and agile team workflows.',
    eligibility: 'Open to all engineering faculty',
  },
];

export default function AcademicianDashboard() {
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [proposalNote, setProposalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    if (!selectedProgram) return;
    setSubmitting(true);
    setTimeout(() => {
      setAppliedIds((prev) => new Set([...prev, selectedProgram.id]));
      setSubmitting(false);
      setSelectedProgram(null);
      setProposalNote('');
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Academician & Faculty Exchange
              </h1>
              <span className="text-xs text-slate-400 font-medium">
                Faculty Development, Industrial Training & Joint Research
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Connect directly with leading technology enterprises for industrial sabbaticals, sponsored FDPs, and collaborative applied research.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
              Dept. of Computer Science & Engineering
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
              Research Focus: Distributed Systems & AI
            </span>
          </div>
        </div>
      </div>

      {/* Collaboration Opportunities Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Active Faculty Collaboration Programs</h2>
            <p className="text-xs text-slate-400">Sponsored by verified industry partners for higher education faculty</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLE_PROGRAMS.map((prog) => {
            const hasApplied = appliedIds.has(prog.id);
            return (
              <div
                key={prog.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/60 text-cyan-300">
                      {prog.type}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {prog.duration}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight">{prog.title}</h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{prog.provider}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>

                  <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Eligibility:</span>
                    <span className="text-xs text-slate-300 block">{prog.eligibility}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Deadline: {prog.deadline}</span>

                  {hasApplied ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Interest Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedProgram(prog)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors"
                    >
                      Express Interest
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Express Interest Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Express Interest</h3>
            <p className="text-xs text-slate-400">
              Submitting interest for <strong>{selectedProgram.title}</strong> with {selectedProgram.provider}.
            </p>

            <form onSubmit={handleApply} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Brief Note on Relevant Research / Teaching Focus
                </label>
                <textarea
                  rows={4}
                  required
                  value={proposalNote}
                  onChange={(e) => setProposalNote(e.target.value)}
                  placeholder="Outline your courses taught, relevant publications, or collaboration goals..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="px-3.5 py-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                >
                  {submitting ? 'Submitting...' : 'Submit Interest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
