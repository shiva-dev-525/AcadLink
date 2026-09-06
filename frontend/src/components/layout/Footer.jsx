import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0B0F19] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <GraduationCap className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold text-sm text-slate-200">AcadLink</span>
        </div>
        <p className="text-xs text-slate-500 text-center sm:text-right">
          Engineered for continuous skill mapping, objective assessments, and placement readiness.
        </p>
      </div>
    </footer>
  );
}
