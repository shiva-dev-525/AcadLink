import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Core Components
import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentEducation from './pages/student/StudentEducation';
import StudentSkills from './pages/student/StudentSkills';
import StudentInterests from './pages/student/StudentInterests';

// Phase 4: Skill Assessments
import AssessmentList from './pages/student/AssessmentList';
import AssessmentDetail from './pages/student/AssessmentDetail';
import AssessmentQuiz from './pages/student/AssessmentQuiz';
import AssessmentResult from './pages/student/AssessmentResult';
import AssessmentHistory from './pages/student/AssessmentHistory';

// Phase 5: Skill Gap & Learning Recommendations
import SkillGapPage from './pages/student/SkillGapPage';
import LearningPage from './pages/student/LearningPage';

// Phase 6: Opportunities Discovery
import OpportunityList from './pages/student/OpportunityList';
import OpportunityDetail from './pages/student/OpportunityDetail';
import SavedOpportunities from './pages/student/SavedOpportunities';

// Phase 7: Matching & Applications
import RecommendedOpportunities from './pages/student/RecommendedOpportunities';
import MyApplications from './pages/student/MyApplications';

// Phase 9: AI Intelligence Layer
import CareerAssistant from './pages/student/CareerAssistant';

// Role Dashboards
import IndustryDashboard from './pages/industry/IndustryDashboard';
import AcademicianDashboard from './pages/academician/AcademicianDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import { AlertCircle, ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg max-w-sm">
        <div className="w-12 h-12 bg-amber-950/50 text-amber-400 border border-amber-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Page Not Found</h2>
        <p className="mt-2 text-xs text-slate-400">The requested resource could not be found.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to AcadLink Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#0B0F19] text-[#F8FAFC] selection:bg-indigo-600 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Student Experience (Phases 3–7) */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <StudentLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="education" element={<StudentEducation />} />
                <Route path="skills" element={<StudentSkills />} />
                <Route path="interests" element={<StudentInterests />} />

                {/* Phase 4: Assessments */}
                <Route path="assessments" element={<AssessmentList />} />
                <Route path="assessments/history" element={<AssessmentHistory />} />
                <Route path="assessments/:assessmentId" element={<AssessmentDetail />} />
                <Route path="assessments/:assessmentId/attempt/:attemptId" element={<AssessmentQuiz />} />
                <Route path="assessments/attempts/:attemptId/result" element={<AssessmentResult />} />

                {/* Phase 5: Skill Gap & Learning */}
                <Route path="skill-gaps" element={<SkillGapPage />} />
                <Route path="learning" element={<LearningPage />} />

                {/* Phase 6: Opportunities Discovery */}
                <Route path="opportunities" element={<OpportunityList />} />
                <Route path="opportunities/saved" element={<SavedOpportunities />} />
                <Route path="opportunities/:opportunityId" element={<OpportunityDetail />} />

                {/* Phase 7: Matching & Applications */}
                <Route path="recommended" element={<RecommendedOpportunities />} />
                <Route path="applications" element={<MyApplications />} />

                {/* Phase 9: AI Intelligence Layer */}
                <Route path="career-assistant" element={<CareerAssistant />} />
              </Route>

              {/* Role Dashboards */}
              <Route
                path="/industry"
                element={
                  <ProtectedRoute allowedRoles={['industry', 'admin']}>
                    <IndustryDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/academician"
                element={
                  <ProtectedRoute allowedRoles={['academician', 'admin']}>
                    <AcademicianDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/institution"
                element={
                  <ProtectedRoute allowedRoles={['institution', 'admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
