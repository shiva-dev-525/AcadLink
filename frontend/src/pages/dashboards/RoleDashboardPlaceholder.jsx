import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  User, 
  Mail, 
  Tag, 
  Server,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';

export default function RoleDashboardPlaceholder({ 
  roleKey, 
  roleTitle, 
  phaseNumber, 
  phaseTitle, 
  upcomingFeatures = [],
  Icon 
}) {
  const { user, logout } = useAuth();
  const [roleCheckResult, setRoleCheckResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const testBackendRoleVerification = async () => {
    setChecking(true);
    try {
      const response = await api.get(`/auth/role-check/${roleKey}`);
      setRoleCheckResult({ success: true, data: response.data });
    } catch (err) {
      setRoleCheckResult({ 
        success: false, 
        message: err.message || 'Authorization check failed' 
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            {Icon ? <Icon className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{roleTitle} AcadLink Workspace</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                Role Verified: {user?.role}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Authenticated session established. Role-based route protection active.
            </p>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={logout}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors self-start md:self-auto"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User Session Details & Phase Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Identity Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs mb-4 text-slate-500">
            Current Authenticated User
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-800">{user?.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                User ID: {user?.id}
              </span>
            </div>
          </div>
        </div>

        {/* Phase Roadmap Status Card */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Upcoming: Phase {phaseNumber} ({phaseTitle})
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {roleTitle} Dashboard Scheduled for Implementation
          </h2>
          <p className="text-xs text-slate-600 mb-4">
            Phase 2 establishes authentication, JWT issuance, and RBAC route gating. The dedicated workspace features for this role will be built in Phase {phaseNumber}:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {upcomingFeatures.map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backend RBAC Verification Widget */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Backend RBAC Endpoint Verification</h3>
              <p className="text-xs text-slate-500">
                Tests server-side authorization middleware (<code className="text-indigo-600">requireRole(&apos;{roleKey}&apos;)</code>) with your current token
              </p>
            </div>
          </div>

          <button
            onClick={testBackendRoleVerification}
            disabled={checking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Verifying...' : `Verify /api/auth/role-check/${roleKey}`}</span>
          </button>
        </div>

        {roleCheckResult && (
          <div className="mt-3 bg-slate-50 rounded-lg p-3 font-mono text-xs border border-slate-200">
            <pre className={roleCheckResult.success ? 'text-emerald-700' : 'text-rose-600'}>
              {JSON.stringify(roleCheckResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
