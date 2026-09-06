import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  Award, 
  Building2,
  X 
} from 'lucide-react';

export default function StudentEducation() {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: new Date().getFullYear() - 2,
    endYear: new Date().getFullYear() + 2,
    grade: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const fetchEducation = async () => {
    try {
      const res = await studentService.getEducation();
      if (res.success && res.data) {
        setEducationList(res.data.education || []);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load education history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startYear: new Date().getFullYear() - 2,
      endYear: new Date().getFullYear() + 2,
      grade: '',
    });
    setFormErrors({});
    setShowForm(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const openEditForm = (item) => {
    setEditingId(item._id);
    setFormData({
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy,
      startYear: item.startYear,
      endYear: item.endYear || '',
      grade: item.grade || '',
    });
    setFormErrors({});
    setShowForm(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const validate = () => {
    const errors = {};
    if (!formData.institution.trim()) errors.institution = 'Institution is required.';
    if (!formData.degree.trim()) errors.degree = 'Degree is required (e.g. B.Tech, B.S.).';
    if (!formData.fieldOfStudy.trim()) errors.fieldOfStudy = 'Field of study is required (e.g. Computer Science).';
    if (!formData.startYear || isNaN(formData.startYear)) errors.startYear = 'Valid start year is required.';
    if (formData.endYear && Number(formData.endYear) < Number(formData.startYear)) {
      errors.endYear = 'End year cannot be earlier than start year.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload = {
        institution: formData.institution.trim(),
        degree: formData.degree.trim(),
        fieldOfStudy: formData.fieldOfStudy.trim(),
        startYear: Number(formData.startYear),
        endYear: formData.endYear ? Number(formData.endYear) : undefined,
        grade: formData.grade.trim(),
      };

      let res;
      if (editingId) {
        res = await studentService.updateEducation(editingId, payload);
      } else {
        res = await studentService.addEducation(payload);
      }

      if (res.success && res.data) {
        setEducationList(res.data.education);
        setShowForm(false);
        setSuccessMessage(editingId ? 'Education record updated!' : 'Education record added successfully!');
      } else {
        setErrorMessage(res.message || 'Action failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save education record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (eduId) => {
    if (!window.confirm('Are you sure you want to remove this education record?')) return;

    try {
      const res = await studentService.deleteEducation(eduId);
      if (res.success && res.data) {
        setEducationList(res.data.education);
        setSuccessMessage('Education record removed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete record.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-900 rounded-xl w-1/4"></div>
          <div className="h-32 bg-slate-900 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6 animate-fade-in bg-[#0B0F19] text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Academic History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain your college qualifications, degrees, majors, and graduation dates.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-950 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        )}
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

      {/* Add / Edit Form Modal/Card */}
      {showForm && (
        <div className="bg-slate-900/95 rounded-2xl border border-indigo-900/70 p-6 md:p-8 shadow-2xl space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">
              {editingId ? 'Edit Academic Record' : 'Add New Academic Record'}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institution / College Name *
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              {formErrors.institution && (
                <p className="mt-1 text-xs text-rose-400">{formErrors.institution}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Degree *
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.Tech / B.S. / B.E."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                {formErrors.degree && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.degree}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Field of Study / Major *
                </label>
                <input
                  type="text"
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  placeholder="e.g. Computer Science and Engineering"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                {formErrors.fieldOfStudy && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.fieldOfStudy}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Start Year *
                </label>
                <input
                  type="number"
                  value={formData.startYear}
                  onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                  placeholder="2023"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                {formErrors.startYear && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.startYear}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  End Year (or Expected)
                </label>
                <input
                  type="number"
                  value={formData.endYear}
                  onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                  placeholder="2027"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                {formErrors.endYear && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.endYear}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Grade / CGPA
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="e.g. 8.5 CGPA or 85%"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-950 transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingId ? 'Update Record' : 'Save Record'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-4">
        {educationList.length > 0 ? (
          educationList.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 card-hover group"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <GraduationCap className="w-5 h-5 transition-transform group-hover:scale-105" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {item.degree} in {item.fieldOfStudy}
                    </h3>
                    {item.grade && (
                      <span className="text-[11px] font-mono font-bold bg-slate-950 text-cyan-300 px-2 py-0.5 rounded-md border border-slate-800">
                        {item.grade}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-300 mt-1">{item.institution}</p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.startYear} – {item.endYear || 'Present'}</span>
                  </p>
                </div>
              </div>

              {/* Edit / Delete Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => openEditForm(item)}
                  className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition-colors"
                  title="Edit Record"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          !showForm && (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-12 text-center shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Education Records Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
                Add your academic background to unlock verified eligibility for industry opportunities.
              </p>
              <button
                onClick={openAddForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-950 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Your First Degree</span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
