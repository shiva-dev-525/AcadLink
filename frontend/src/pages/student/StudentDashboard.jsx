import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import skillGapService from '../../services/skillGapService';
import learningService from '../../services/learningService';
import opportunityService from '../../services/opportunityService';
import { assessmentService } from '../../services/assessmentService';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  GraduationCap, 
  Wrench, 
  Compass, 
  User, 
  Sparkles,
  Plus,
  RefreshCw,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Target,
  BookOpen,
  ClipboardList,
  Briefcase,
  Building2,
  MapPin,
  Check
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);
  const [learningData, setLearningData] = useState(null);
  const [assessmentData, setAssessmentData] = useState({ count: 5, latestAttempt: null });
  const [latestOpportunities, setLatestOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await studentService.getProfile();
      if (res.success && res.data) {
        setProfileData(res.data);
      } else {
        setError(res.message || 'Failed to load profile.');
      }

      // Concurrently fetch skill gap, learning recommendations, assessments, and opportunities
      skillGapService.getMySkillGaps()
        .then((res) => {
          if (res.success && res.data) setSkillGapData(res.data);
        })
        .catch(() => {});

      learningService.getRecommendations()
        .then((res) => {
          if (res.success && res.data) setLearningData(res.data);
        })
        .catch(() => {});

      assessmentService.getAssessments()
        .then((res) => {
          if (res.success && res.data?.assessments) {
            setAssessmentData((prev) => ({ ...prev, count: res.data.assessments.length }));
          }
        })
        .catch(() => {});

      assessmentService.getMyAttempts()
        .then((res) => {
          if (res.success && res.data?.attempts && res.data.attempts.length > 0) {
            setAssessmentData((prev) => ({ ...prev, latestAttempt: res.data.attempts[0] }));
          }
        })
        .catch(() => {});

      opportunityService.getOpportunities({ limit: 3, sort: 'newest' })
        .then((res) => {
          if (res.success && res.data?.opportunities) {
            setLatestOpportunities(res.data.opportunities);
          }
        })
        .catch(() => {});
    } catch (err) {
      setError(err.message || 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-900 rounded-xl w-1/3"></div>
          <div className="h-32 bg-slate-900 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-52 bg-slate-900 rounded-2xl"></div>
            <div className="h-52 bg-slate-900 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center animate-fade-in">
        <div className="bg-slate-900 rounded-2xl border border-rose-900/60 p-8 shadow-xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Failed to Load Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  const student = profileData?.student || {};
  const completion = profileData?.completion || { percentage: 0, incompleteSections: [] };
  const latestEducation = student.education && student.education.length > 0
    ? student.education[student.education.length - 1]
    : null;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-fade-in bg-[#0B0F19] text-slate-100">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <span className="text-[11px] font-bold bg-cyan-950/50 text-cyan-300 border border-cyan-800/60 px-2.5 py-0.5 rounded-full shadow-xs">
              Verified Candidate
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Refine your declared competencies and academic credentials to prepare for skill mapping and opportunity matching.
          </p>
        </div>

        <Link
          to="/student/profile"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl shadow-xs transition-all duration-150 hover:border-slate-700 self-start sm:self-auto"
        >
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Profile Readiness & Completion Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Profile Readiness Status</h2>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                completion.isComplete 
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60' 
                  : 'bg-amber-950/50 text-amber-300 border-amber-800/60'
              }`}>
                {completion.isComplete ? 'Profile Complete (100%)' : `${completion.percentage}% Ready`}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {completion.isComplete 
                ? 'Your student profile is fully populated and verified for upcoming skill assessment benchmarks!' 
                : 'Complete all 5 foundational dimensions to unlock verified candidate badges for recruiters.'}
            </p>
          </div>

          <div className="flex items-center md:flex-col md:items-end gap-1.5 flex-shrink-0">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {completion.percentage}%
            </span>
            <span className="text-[11px] font-medium text-slate-500">Readiness Score</span>
          </div>
        </div>

        {/* Progress Bar with smooth cyan/indigo gradient */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden mb-5 border border-slate-800/80">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              completion.percentage === 100 
                ? 'bg-emerald-400' 
                : 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400'
            }`}
            style={{ width: `${completion.percentage}%` }}
          />
        </div>

        {/* Action Items to reach 100% */}
        {completion.incompleteSections && completion.incompleteSections.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Action Items to Reach 100%:
            </span>
            <div className="flex flex-wrap gap-2">
              {completion.incompleteSections.map((item) => (
                <Link
                  key={item}
                  to={
                    item.includes('education') 
                      ? '/student/education' 
                      : item.includes('technical') || item.includes('soft') 
                      ? '/student/skills' 
                      : item.includes('career') 
                      ? '/student/interests' 
                      : '/student/profile'
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/60 text-xs font-semibold transition-colors group"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item}</span>
                  <ChevronRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Competency Readiness: Assessments, Skill Gaps & Learning Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Skill Assessments Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl card-hover flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Skill Assessments
                  </span>
                  <span className="text-xs font-bold text-white">
                    Verified Competencies
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
                {assessmentData.count} Available
              </span>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 mb-4 text-xs">
              {assessmentData.latestAttempt ? (
                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="text-[11px] text-slate-400">Latest Completed:</span>
                    <span className="font-bold text-cyan-300">
                      {assessmentData.latestAttempt.assessment?.title || 'Assessment'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-[11px] text-slate-400">Score & Level:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {assessmentData.latestAttempt.percentage}% ({assessmentData.latestAttempt.skillLevel})
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Take timed technical MCQs to test your competencies and earn verified badges for your recruiter portfolio.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to="/student/assessments"
              className="inline-flex items-center justify-center gap-2 w-full py-2 bg-indigo-950/80 hover:bg-indigo-900 text-cyan-300 hover:text-white border border-indigo-800/70 rounded-xl text-xs font-semibold transition-all group shadow-xs"
            >
              <ClipboardList className="w-3.5 h-3.5 text-cyan-400" />
              <span>Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <div className="text-center">
              <Link
                to="/student/assessments/history"
                className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
              >
                View Assessment History →
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Career Readiness & Skill Gaps Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl card-hover flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Career Readiness
                  </span>
                  <span className="text-xs font-bold text-white">
                    {skillGapData?.targetCareer || 'Target Role'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-white font-mono leading-none">
                  {skillGapData?.overallReadiness ?? 0}%
                </span>
                <span className="text-[9px] text-slate-500 block font-semibold uppercase">Readiness</span>
              </div>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-3 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${skillGapData?.overallReadiness ?? 0}%` }}
              />
            </div>

            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4 text-xs">
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span>Attention Required:</span>
                <span className="font-bold text-amber-400">
                  {skillGapData?.summary?.attentionRequiredCount ?? 0} skill{(skillGapData?.summary?.attentionRequiredCount ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Top Skill Gap:</span>
                <span className="font-bold text-cyan-300">
                  {skillGapData?.missingSkills?.[0]?.skill || skillGapData?.needsImprovement?.[0]?.skill || 'None diagnosed'}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/student/skill-gaps"
            className="inline-flex items-center justify-center gap-2 w-full py-2 bg-indigo-950/70 hover:bg-indigo-900/80 text-cyan-300 hover:text-white border border-indigo-800/60 rounded-xl text-xs font-semibold transition-all group"
          >
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Skill Gaps</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 3. Recommended Learning Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl card-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-800/50 text-indigo-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Recommended Learning
                  </span>
                  <span className="text-xs font-bold text-white">
                    {learningData?.recommended?.[0]?.skill || 'Priority Resource'}
                  </span>
                </div>
              </div>

              {learningData?.recommended?.[0] && (
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-950/60 border border-amber-800/60 text-amber-300">
                  {learningData.recommended[0].recommendationPriority}
                </span>
              )}
            </div>

            {learningData?.recommended?.[0] ? (
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4">
                <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">
                  {learningData.recommended[0].title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{learningData.recommended[0].difficulty}</span>
                  <span>·</span>
                  <span>{learningData.recommended[0].estimatedDuration}</span>
                  <span>·</span>
                  <span className="text-slate-500">{learningData.recommended[0].provider}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4 text-xs text-slate-400">
                Explore curated tutorials to accelerate your target skill benchmarks.
              </div>
            )}
          </div>

          <Link
            to="/student/learning"
            className="inline-flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-950 transition-all hover:scale-[1.01]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Start Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* AI Career Assistant Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-cyan-950/70 rounded-2xl border border-indigo-800/60 p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-950 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-bold text-white tracking-tight">AI Career Assistant</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Get personalized roadmaps, interview prep suggestions, and strategic insights tailored to your verified skills.
            </p>
          </div>
        </div>

        <Link
          to="/student/career-assistant"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-950 transition-all hover:scale-[1.02] flex-shrink-0 self-start sm:self-auto"
        >
          <span>Launch Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4-Quadrant Summary Grid with Obsidian Card Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quadrant 1: Education Summary */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl card-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Education History</h3>
                  <span className="text-[11px] text-slate-400">
                    {student.education?.length || 0} record(s) on file
                  </span>
                </div>
              </div>
              <Link
                to="/student/education"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {latestEducation ? (
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {latestEducation.degree} in {latestEducation.fieldOfStudy}
                  </span>
                  {latestEducation.grade && (
                    <span className="text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 px-2 py-0.5 rounded-md border border-slate-800">
                      {latestEducation.grade}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium">{latestEducation.institution}</p>
                <p className="text-[11px] text-slate-500">
                  {latestEducation.startYear} – {latestEducation.endYear || 'Present'}
                </p>
              </div>
            ) : (
              <div className="text-center py-7 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-2">No education history added yet.</p>
                <Link
                  to="/student/education"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree or College</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quadrant 2: Technical Skills Summary */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl card-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center shadow-xs">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Technical Skills</h3>
                  <span className="text-[11px] text-slate-400">
                    {student.technicalSkills?.length || 0} declared competencies
                  </span>
                </div>
              </div>
              <Link
                to="/student/skills"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {student.technicalSkills && student.technicalSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {student.technicalSkills.map((tech) => (
                  <div
                    key={tech.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs transition-colors hover:border-slate-700"
                  >
                    <span className="font-semibold text-slate-200">{tech.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      tech.proficiency === 'Advanced' 
                        ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-800/60'
                        : tech.proficiency === 'Intermediate'
                        ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tech.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-7 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-2">No technical skills added yet.</p>
                <Link
                  to="/student/skills"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Technical Skills</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quadrant 3: Soft Skills Summary */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl card-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Soft Skills</h3>
                  <span className="text-[11px] text-slate-400">
                    {student.softSkills?.length || 0} interpersonal strengths
                  </span>
                </div>
              </div>
              <Link
                to="/student/skills"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {student.softSkills && student.softSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {student.softSkills.map((soft) => (
                  <span
                    key={soft}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800 text-xs font-medium"
                  >
                    {soft}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-7 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-2">No soft skills added yet.</p>
                <Link
                  to="/student/skills"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Soft Skills</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quadrant 4: Career Interests Summary */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl card-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/50 text-cyan-400 flex items-center justify-center shadow-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Career Interests</h3>
                  <span className="text-[11px] text-slate-400">
                    {student.careerInterests?.length || 0} chosen directions
                  </span>
                </div>
              </div>
              <Link
                to="/student/interests"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {student.careerInterests && student.careerInterests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {student.careerInterests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center px-3 py-1 rounded-xl bg-indigo-950/70 text-indigo-300 border border-indigo-800/50 text-xs font-semibold"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-7 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-2">No career interests chosen yet.</p>
                <Link
                  to="/student/interests"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Select Career Interests</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Latest Opportunities Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/70 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Latest Opportunities</h2>
              <p className="text-xs text-slate-400">Discover active internships and entry roles relevant to your career path</p>
            </div>
          </div>

          <Link
            to="/student/opportunities"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {latestOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {latestOpportunities.map((opp) => (
              <Link
                key={opp._id}
                to={`/student/opportunities/${opp._id}`}
                className="p-4 bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all duration-150 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                      {opp.type}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">{opp.workMode}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
                    {opp.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 block truncate mb-2.5">
                    {opp.organization}
                  </span>
                  {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {opp.requiredSkills.slice(0, 2).map((s) => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{opp.stipend || opp.salary || 'Sponsored'}</span>
                  <span className="text-cyan-400 font-semibold group-hover:underline">View →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-400 mb-2">No opportunities loaded.</p>
            <Link
              to="/student/opportunities"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-lg transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Setup Actions Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Quick Navigation & Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/student/profile"
            className="p-3 bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 rounded-xl transition-all duration-150 flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-indigo-700/60"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 shadow-xs flex items-center justify-center text-cyan-400 border border-slate-800 flex-shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">Basic Info</span>
          </Link>

          <Link
            to="/student/skills"
            className="p-3 bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 rounded-xl transition-all duration-150 flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-indigo-700/60"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 shadow-xs flex items-center justify-center text-cyan-400 border border-slate-800 flex-shrink-0">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">Manage Skills</span>
          </Link>

          <Link
            to="/student/assessments"
            className="p-3 bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 rounded-xl transition-all duration-150 flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-indigo-700/60"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 shadow-xs flex items-center justify-center text-cyan-400 border border-slate-800 flex-shrink-0">
              <ClipboardList className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">Assessments</span>
          </Link>

          <Link
            to="/student/skill-gaps"
            className="p-3 bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 rounded-xl transition-all duration-150 flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-indigo-700/60"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 shadow-xs flex items-center justify-center text-cyan-400 border border-slate-800 flex-shrink-0">
              <Target className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">Skill Gaps</span>
          </Link>

          <Link
            to="/student/learning"
            className="p-3 bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 rounded-xl transition-all duration-150 flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-indigo-700/60"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 shadow-xs flex items-center justify-center text-cyan-400 border border-slate-800 flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">Learning Path</span>
          </Link>

          <Link
            to="/student/interests"
            className="p-3 bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 rounded-xl transition-all duration-150 flex items-center gap-2.5 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-indigo-700/60"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 shadow-xs flex items-center justify-center text-cyan-400 border border-slate-800 flex-shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">Interests</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
