import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { 
  LayoutDashboard, 
  User, 
  GraduationCap, 
  Wrench, 
  Compass, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  ClipboardList,
  Target,
  BookOpen,
  Briefcase,
  Bookmark,
  Zap,
  FileText
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/student', icon: LayoutDashboard, exact: true },
  { name: 'Profile', path: '/student/profile', icon: User },
  { name: 'Education', path: '/student/education', icon: GraduationCap },
  { name: 'Skills', path: '/student/skills', icon: Wrench },
  { name: 'Career Interests', path: '/student/interests', icon: Compass },
  { name: 'Assessments', path: '/student/assessments', icon: ClipboardList },
  { name: 'Skill Gaps', path: '/student/skill-gaps', icon: Target },
  { name: 'Learning Path', path: '/student/learning', icon: BookOpen },
  { name: 'Opportunities', path: '/student/opportunities', icon: Briefcase },
  { name: 'Saved', path: '/student/opportunities/saved', icon: Bookmark },
  { name: 'Recommended', path: '/student/recommended', icon: Zap },
  { name: 'My Applications', path: '/student/applications', icon: FileText },
  { name: 'AI Assistant', path: '/student/career-assistant', icon: Sparkles, badge: 'AI' },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Load completion percentage for sidebar gauge
  useEffect(() => {
    let isMounted = true;
    studentService.getProfile()
      .then((res) => {
        if (isMounted && res.success && res.data?.completion) {
          setCompletionPercentage(res.data.completion.percentage);
        }
      })
      .catch(() => {
        // Silently fail if offline or initial load
      });

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Workspace Navigation Subheader - Placed with clean spacing below floating Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 mx-3 mt-3 mb-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800/90 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-white block leading-tight">Student Workspace</span>
            <span className="text-[10px] text-cyan-400 font-medium">Quick Navigation</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop Floating Sticky & Mobile Clean Drawer) */}
      <aside
        className={`fixed top-24 bottom-4 left-3 z-50 w-64 max-w-[calc(100vw-24px)] bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl transform transition-all duration-200 ease-in-out md:static md:translate-x-0 md:top-24 md:sticky md:h-[calc(100vh-7rem)] md:my-3 md:ml-4 md:mr-1 flex flex-col justify-between shadow-2xl md:shadow-xl overflow-hidden flex-shrink-0 ${
          mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-[115%] opacity-0 md:translate-x-0 md:opacity-100'
        }`}
      >
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Sidebar Brand Header */}
          <div className="p-4 border-b border-slate-800/80 hidden md:block">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-indigo-950 transition-all duration-200 group-hover:scale-105 group-hover:shadow-cyan-500/20">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs tracking-tight block">
                  AcadLink <span className="text-cyan-400">Student</span>
                </span>
                <span className="text-[9px] text-slate-400 font-medium tracking-wider block uppercase">
                  Workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">
              Navigation
            </span>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-indigo-950/70 text-cyan-300 border border-indigo-700/60 font-bold shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform duration-150 group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                        {item.badge}
                      </span>
                    )}
                    {isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 animate-fade-in-fast" />
                    ) : null}
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Profile Readiness Gauge & User Account */}
        <div className="p-4 border-t border-slate-800 space-y-4 bg-slate-950/60">
          {/* Profile Completion Mini Card */}
          {completionPercentage !== null && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-xs transition-all hover:border-slate-700">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-200 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Profile Readiness</span>
                </div>
                <span className="text-cyan-400 font-mono font-extrabold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    completionPercentage === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              {completionPercentage < 100 && (
                <Link
                  to="/student/profile"
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline mt-2 block font-semibold transition-colors"
                >
                  Complete all sections →
                </Link>
              )}
            </div>
          )}

          {/* User Account Info */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-cyan-300 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-slate-200 block truncate leading-tight">
                  {user?.name || 'Student'}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {user?.email}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-20 bg-slate-950/80 z-40 md:hidden backdrop-blur-xs animate-fade-in-fast"
        />
      )}

      {/* Main Scrollable Content */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#0B0F19]">
        <Outlet />
      </main>
    </div>
  );
}
