import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  GraduationCap,
  Building2,
  BookOpen,
  Landmark,
  Check
} from 'lucide-react';

const ROLES = [
  { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Assess skills & apply to internships' },
  { id: 'industry', label: 'Industry', icon: Building2, desc: 'Post opportunities & hire candidates' },
  { id: 'academician', label: 'Academician', icon: BookOpen, desc: 'Industrial training & research' },
  { id: 'institution', label: 'Institution', icon: Landmark, desc: 'Monitor cohort readiness & analytics' },
];

export default function Register() {
  const { register, getDashboardPath, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect to role dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate, getDashboardPath]);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.role) {
      errors.role = 'Please select a role.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleRoleSelect = (roleId) => {
    setFormData((prev) => ({ ...prev, role: roleId }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    });

    setSubmitting(false);

    if (result.success) {
      navigate(getDashboardPath(result.user.role), { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in bg-[#0B0F19]">
      <div className="max-w-lg w-full bg-slate-900/95 rounded-2xl border border-slate-800 p-8 shadow-2xl transition-all hover:border-slate-700">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-950/80 border border-indigo-800/50 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
          <p className="text-xs text-slate-400 mt-1">
            Join the AcadLink Ecosystem
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 animate-fade-in-fast">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{serverError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Your Stakeholder Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = formData.role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 relative ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500/50 shadow-md shadow-cyan-950/30'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/70 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-cyan-200' : 'text-slate-300'}`}>
                          {r.label}
                        </span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 leading-tight block">
                      {r.desc}
                    </span>
                  </button>
                );
              })}
            </div>
            {formErrors.role && <p className="mt-1 text-xs text-rose-400">{formErrors.role}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aarav Sharma"
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 pl-10 text-sm bg-slate-950 border rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                  formErrors.name 
                    ? 'border-rose-500 focus:ring-rose-500/20' 
                    : 'border-slate-800 focus:ring-indigo-500/30 focus:border-indigo-500'
                }`}
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
            {formErrors.name && <p className="mt-1 text-xs text-rose-400">{formErrors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 pl-10 text-sm bg-slate-950 border rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                  formErrors.email 
                    ? 'border-rose-500 focus:ring-rose-500/20' 
                    : 'border-slate-800 focus:ring-indigo-500/30 focus:border-indigo-500'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
            {formErrors.email && <p className="mt-1 text-xs text-rose-400">{formErrors.email}</p>}
          </div>

          {/* Passwords (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  disabled={submitting}
                  className={`w-full px-3 py-2 pl-9 text-sm bg-slate-950 border rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.password 
                      ? 'border-rose-500 focus:ring-rose-500/20' 
                      : 'border-slate-800 focus:ring-indigo-500/30 focus:border-indigo-500'
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
              {formErrors.password && (
                <p className="mt-1 text-[11px] text-rose-400">{formErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  disabled={submitting}
                  className={`w-full px-3 py-2 pl-9 text-sm bg-slate-950 border rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.confirmPassword 
                      ? 'border-rose-500 focus:ring-rose-500/20' 
                      : 'border-slate-800 focus:ring-indigo-500/30 focus:border-indigo-500'
                  }`}
                />
                <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-[11px] text-rose-400">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-950 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Register & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
