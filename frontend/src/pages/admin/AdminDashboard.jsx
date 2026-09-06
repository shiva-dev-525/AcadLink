import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  BarChart3,
  Award,
} from 'lucide-react';

const ROLE_FILTERS = [
  { id: 'all', label: 'All', role: 'all' },
  { id: 'student', label: 'Students', role: 'student' },
  { id: 'industry', label: 'Industry', role: 'industry' },
  { id: 'academician', label: 'Academicians', role: 'academician' },
  { id: 'admin', label: 'Admins', role: 'admin' },
];

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);

  // Normalize role comparison (handles 'student' vs 'students', etc.)
  const filterUsersByRole = (userList, role) => {
    if (!role || role === 'all') return userList;
    const target = role.toLowerCase().replace(/s$/, '');
    return userList.filter((u) => {
      const uRole = (u.role || '').toLowerCase().replace(/s$/, '');
      return uRole === target;
    });
  };

  useEffect(() => {
    let isMounted = true;
    const loadOverview = async () => {
      try {
        const res = await api.get('/admin/overview');
        if (isMounted && res.data?.success) {
          setOverview(res.data.data);
        }
      } catch (err) {
        console.warn('Overview fetch error:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const query = roleFilter !== 'all' ? `?role=${encodeURIComponent(roleFilter)}` : '';
        const res = await api.get(`/admin/users${query}`);
        if (isMounted && res.data?.success) {
          const fetchedUsers = res.data.data || [];
          setUsers(fetchedUsers);
          // If we fetched the unfiltered list, keep as base cache
          if (roleFilter === 'all') {
            setAllUsers(fetchedUsers);
          }
        }
      } catch (err) {
        console.warn('Users fetch error:', err.message);
      } finally {
        if (isMounted) setUsersLoading(false);
      }
    };

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [roleFilter]);

  const handleRoleFilterChange = (selectedRole) => {
    if (selectedRole === roleFilter) return;
    setRoleFilter(selectedRole);
    // Instant client-side response if cache is available
    if (allUsers.length > 0) {
      setUsers(filterUsersByRole(allUsers, selectedRole));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading Institutional & Platform Governance...</span>
        </div>
      </div>
    );
  }

  const metrics = overview?.metrics || {
    totalUsers: 0,
    studentsCount: 0,
    industryPartners: 0,
    academiciansCount: 0,
    totalOpportunities: 0,
    totalApplications: 0,
  };

  const readiness = overview?.placementReadiness || { ready: 50, underTraining: 35, needsImprovement: 15 };
  const skills = overview?.topDemandedSkills || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/60 text-cyan-300 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Institutional Analytics & Administration
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/60 text-cyan-300">
              Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time cohort readiness monitoring, market skill demand, and platform user directory.
          </p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total Users
          </span>
          <span className="text-2xl font-extrabold text-white block">{metrics.totalUsers}</span>
          <span className="text-[10px] text-slate-500">Registered platform-wide</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Students
          </span>
          <span className="text-2xl font-extrabold text-cyan-400 block">{metrics.studentsCount}</span>
          <span className="text-[10px] text-slate-500">Active learners</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Industry Partners
          </span>
          <span className="text-2xl font-extrabold text-indigo-400 block">{metrics.industryPartners}</span>
          <span className="text-[10px] text-slate-500">Hiring organizations</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Faculty / Academics
          </span>
          <span className="text-2xl font-extrabold text-emerald-400 block">{metrics.academiciansCount}</span>
          <span className="text-[10px] text-slate-500">Mentors & educators</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Opportunities
          </span>
          <span className="text-2xl font-extrabold text-white block">{metrics.totalOpportunities}</span>
          <span className="text-[10px] text-slate-500">Internships & Jobs</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Applications
          </span>
          <span className="text-2xl font-extrabold text-cyan-300 block">{metrics.totalApplications}</span>
          <span className="text-[10px] text-slate-500">Pipeline submissions</span>
        </div>
      </div>

      {/* Cohort Placement Readiness & Market Skill Demand Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Student Cohort Placement Readiness
              </h2>
            </div>
            <span className="text-xs text-slate-400">Class of 2026</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Ready */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-emerald-400">Placement Ready (Assessed Competency $\ge$ 75%)</span>
                <span className="text-white font-bold">{readiness.ready}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${readiness.ready}%` }}
                />
              </div>
            </div>

            {/* Under Training */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-cyan-400">Under Active Training (Competency 50–74%)</span>
                <span className="text-white font-bold">{readiness.underTraining}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${readiness.underTraining}%` }}
                />
              </div>
            </div>

            {/* Needs Improvement */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-amber-400">Needs Curriculum Intervention (&lt; 50%)</span>
                <span className="text-white font-bold">{readiness.needsImprovement}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${readiness.needsImprovement}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skill Demand vs Deficit Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Industry Skill Demand vs Student Deficit
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5">Key Skill</th>
                  <th className="py-2.5 text-center">Industry Postings</th>
                  <th className="py-2.5 text-right">Student Gap %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {skills.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-semibold text-slate-200">{item.skill}</td>
                    <td className="py-2.5 text-center text-slate-300 font-bold">{item.demandCount} roles</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          item.studentGapPct > 30
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {item.studentGapPct}% Deficit
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Platform User Directory</h2>
            <p className="text-xs text-slate-400">Authenticated student, recruiter, faculty, and administrator accounts</p>
          </div>

          {/* Role Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filter users by role">
            {ROLE_FILTERS.map((item) => {
              const isActive = roleFilter === item.role;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`role-filter-${item.id}`}
                  onClick={() => handleRoleFilterChange(item.role)}
                  aria-pressed={isActive}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/50 ring-2 ring-indigo-500/40'
                      : 'bg-slate-800/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">User Name</th>
                <th className="py-3.5 px-5">Email Address</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {usersLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No users found for selected role.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id || u.email} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-100">{u.name}</td>
                    <td className="py-3.5 px-5 text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wide inline-block ${
                          u.role === 'admin'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                            : u.role === 'industry'
                            ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                            : u.role === 'academician'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right text-slate-400 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
