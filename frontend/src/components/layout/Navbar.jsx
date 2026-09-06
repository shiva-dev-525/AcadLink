import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, getDashboardPath } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-2.5 sm:top-3.5 z-40 w-full px-3 sm:px-6 lg:px-8 transition-all pointer-events-none">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between rounded-2xl border border-slate-800/80 bg-[#0B0F19]/85 backdrop-blur-md shadow-lg shadow-black/30 pointer-events-auto">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-indigo-950 transition-all duration-200 group-hover:scale-105 group-hover:shadow-indigo-500/25">
            <GraduationCap className="w-5 h-5 transition-transform duration-200 group-hover:-rotate-3" />
          </div>
          <div>
            <span className="font-bold text-slate-100 text-[17px] tracking-tight block leading-tight">
              Acad<span className="text-indigo-400">Link</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider block uppercase">
              Academia–Industry Platform
            </span>
          </div>
        </Link>

        {/* Navigation / Auth State */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated && user ? (
            /* Authenticated State */
            <div className="flex items-center gap-2.5 animate-fade-in">
              <Link
                to={getDashboardPath(user.role)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-150 ${
                  location.pathname.startsWith(getDashboardPath(user.role))
                    ? 'bg-indigo-950/70 text-indigo-300 border-indigo-500/50 shadow-xs'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span className="capitalize">{user.role} Workspace</span>
              </Link>

              <div className="hidden md:flex items-center gap-2 border-l border-slate-800 pl-3">
                <div className="w-7 h-7 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 flex items-center justify-center font-bold text-xs shadow-inner">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-medium text-slate-300 max-w-[120px] truncate">
                  {user.name}
                </span>
              </div>

              <button
                onClick={logout}
                title="Sign out of your account"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-rose-950/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            /* Unauthenticated State */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition-colors hover:bg-slate-800/80"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl shadow-sm shadow-indigo-950 transition-all duration-150 hover:shadow-md hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
