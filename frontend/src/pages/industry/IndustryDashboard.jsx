import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Building2,
  Briefcase,
  Users,
  FileCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  ExternalLink,
  Plus,
  Edit,
  Save,
  X,
  Sparkles,
  MapPin,
  Globe,
  Mail,
  Phone,
  AlertCircle,
  Award,
} from 'lucide-react';

export default function IndustryDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedAppForReview, setSelectedAppForReview] = useState(null);

  // New Opportunity Form State
  const [newOpp, setNewOpp] = useState({
    title: '',
    type: 'Internship',
    description: '',
    requiredSkills: '',
    preferredSkills: '',
    location: 'Remote',
    workMode: 'Remote',
    experienceLevel: 'Beginner',
    stipend: 'Competitive',
    duration: '3 Months',
    openings: 1,
    category: 'Software Development',
  });
  const [postingLoading, setPostingLoading] = useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: '',
    category: '',
    description: '',
    website: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Status updating state
  const [statusUpdating, setStatusUpdating] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/industry/dashboard');
      if (res.data?.success) {
        setData(res.data.data);
        if (res.data.data?.organization) {
          setProfileForm({
            name: res.data.data.organization.name || '',
            category: res.data.data.organization.category || '',
            description: res.data.data.organization.description || '',
            website: res.data.data.organization.website || '',
            location: res.data.data.organization.location || '',
            contactEmail: res.data.data.organization.contactEmail || '',
            contactPhone: res.data.data.organization.contactPhone || '',
          });
        }
      } else {
        setError(res.data?.message || 'Failed to load dashboard data.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error to recruiter services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handlePostOpportunity = async (e) => {
    e.preventDefault();
    setPostingLoading(true);
    try {
      const payload = {
        ...newOpp,
        requiredSkills: newOpp.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        preferredSkills: newOpp.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await api.post('/industry/opportunities', payload);
      if (res.data?.success) {
        setShowPostModal(false);
        setNewOpp({
          title: '',
          type: 'Internship',
          description: '',
          requiredSkills: '',
          preferredSkills: '',
          location: 'Remote',
          workMode: 'Remote',
          experienceLevel: 'Beginner',
          stipend: 'Competitive',
          duration: '3 Months',
          openings: 1,
          category: 'Software Development',
        });
        loadDashboard();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting opportunity');
    } finally {
      setPostingLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.put('/industry/profile', profileForm);
      if (res.data?.success) {
        setShowProfileModal(false);
        loadDashboard();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await api.patch(`/industry/applications/${appId}/status`, { status: newStatus });
      if (res.data?.success) {
        // Optimistically update recent list
        setData((prev) => {
          if (!prev) return prev;
          const updated = (prev.recentApplications || []).map((app) =>
            app._id === appId ? { ...app, status: newStatus } : app
          );
          return { ...prev, recentApplications: updated };
        });
        if (selectedAppForReview) {
          setSelectedAppForReview((prev) => (prev ? { ...prev, status: newStatus } : prev));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating candidate status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading Recruiter Command Center...</span>
        </div>
      </div>
    );
  }

  const org = data?.organization || {};
  const stats = data?.stats || {
    activeOpportunities: 0,
    totalApplications: 0,
    underReview: 0,
    shortlisted: 0,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Organization Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-700/60 text-cyan-300 flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{org.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/60 text-emerald-300">
                  Verified Partner
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">{org.category}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {org.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            {org.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {org.location}
              </span>
            )}
            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {org.website}
              </a>
            )}
            {org.contactEmail && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {org.contactEmail}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 self-start md:self-center">
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setShowPostModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-indigo-950/40 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Postings</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white block">
            {stats.activeOpportunities}
          </span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Live & Accepting
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Applications</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white block">
            {stats.totalApplications}
          </span>
          <span className="text-[11px] text-slate-400">Across all active postings</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Under Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white block">
            {stats.underReview}
          </span>
          <span className="text-[11px] text-amber-400 font-medium">Awaiting evaluation</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white block">
            {stats.shortlisted}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">Interview stage candidate pool</span>
        </div>
      </div>

      {/* Candidate Pipeline / Recent Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Candidate Pipeline & Recent Applications</h2>
            <p className="text-xs text-slate-400">Review student competencies, match scores, and update candidate stages</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Candidate</th>
                <th className="py-3.5 px-5">Applied Position</th>
                <th className="py-3.5 px-5">Compatibility</th>
                <th className="py-3.5 px-5">Applied On</th>
                <th className="py-3.5 px-5">Current Status</th>
                <th className="py-3.5 px-5 text-right">Recruiter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {(data?.recentApplications || []).map((app) => (
                <tr key={app._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-100">{app.candidateName}</div>
                    <span className="text-[11px] text-slate-400">{app.candidateEmail}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-semibold text-slate-200 block">{app.opportunityTitle}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 font-bold text-xs">
                      {app.matchScore}% Match
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-400 text-xs">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide inline-block ${
                        app.status === 'Shortlisted'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : app.status === 'Under Review'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          : app.status === 'Interview'
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                          : app.status === 'Selected'
                          ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    {/* Status Dropdown Action */}
                    <select
                      value={app.status}
                      disabled={statusUpdating}
                      onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold py-1.5 px-2.5 rounded-xl cursor-pointer hover:border-indigo-500 focus:outline-none"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Opportunity Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Post New Opportunity</h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostOpportunity} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Position Title *</label>
                <input
                  type="text"
                  required
                  value={newOpp.title}
                  onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                  placeholder="e.g. Java Backend Intern"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Type</label>
                  <select
                    value={newOpp.type}
                    onChange={(e) => setNewOpp({ ...newOpp, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Job">Entry-level Job</option>
                    <option value="Training">Industrial Training</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Work Mode</label>
                  <select
                    value={newOpp.workMode}
                    onChange={(e) => setNewOpp({ ...newOpp, workMode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Required Skills (comma separated) *</label>
                <input
                  type="text"
                  required
                  value={newOpp.requiredSkills}
                  onChange={(e) => setNewOpp({ ...newOpp, requiredSkills: e.target.value })}
                  placeholder="e.g. Java, Spring Boot, SQL, Git"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newOpp.description}
                  onChange={(e) => setNewOpp({ ...newOpp, description: e.target.value })}
                  placeholder="Outline key responsibilities and expectations..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Compensation / Stipend</label>
                  <input
                    type="text"
                    value={newOpp.stipend}
                    onChange={(e) => setNewOpp({ ...newOpp, stipend: e.target.value })}
                    placeholder="e.g. ₹25,000/month"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newOpp.duration}
                    onChange={(e) => setNewOpp({ ...newOpp, duration: e.target.value })}
                    placeholder="e.g. 3 Months"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                >
                  {postingLoading ? 'Publishing...' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Organization Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Industry Category</label>
                <input
                  type="text"
                  value={profileForm.category}
                  onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">About Organization</label>
                <textarea
                  rows={3}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Website</label>
                <input
                  type="text"
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Location</label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                >
                  {profileLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
