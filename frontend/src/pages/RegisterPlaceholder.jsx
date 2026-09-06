import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function RegisterPlaceholder() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create an Account</h2>
        <p className="mt-2 text-sm text-slate-600">
          User registration and onboarding will be implemented in <span className="font-semibold text-indigo-600">Phase 2</span>.
        </p>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs text-slate-600 space-y-1">
          <span className="font-semibold text-slate-800 block">Upcoming in Phase 2:</span>
          <p>• Multi-role registration (Student, Industry, Academician, Institution)</p>
          <p>• Degree, Department, and CGPA profiling</p>
          <p>• Initial career goal and skill preferences selection</p>
        </div>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to AcadLink Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
