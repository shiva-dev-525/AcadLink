const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const learningRoutes = require('./routes/learningRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const industryRoutes = require('./routes/industryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AcadLink API Server',
    version: '1.0.0',
    phase: 'Phase 7 - Opportunity Matching & Applications',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      students: {
        profile: 'GET /api/students/me',
        updateProfile: 'PUT /api/students/me',
        skills: 'GET|PUT /api/students/me/skills',
        education: 'GET|POST|PUT|DELETE /api/students/me/education',
        interests: 'GET|PUT /api/students/me/interests',
        taxonomy: 'GET /api/students/taxonomy'
      },
      assessments: {
        list: 'GET /api/assessments',
        detail: 'GET /api/assessments/:id',
        start: 'POST /api/assessments/:id/start',
        submit: 'POST /api/assessments/attempts/:attemptId/submit',
        myAttempts: 'GET /api/assessments/attempts',
        attemptResult: 'GET /api/assessments/attempts/:attemptId'
      },
      skillGaps: {
        me: 'GET /api/skill-gaps/me',
        careers: 'GET /api/skill-gaps/careers'
      },
      learning: {
        recommendations: 'GET /api/learning/recommendations',
        resources: 'GET /api/learning/resources',
        progress: 'GET /api/learning/progress',
        updateProgress: 'PATCH /api/learning/progress/:resourceId'
      },
      opportunities: {
        list: 'GET /api/opportunities',
        detail: 'GET /api/opportunities/:id',
        saved: 'GET /api/opportunities/saved',
        save: 'POST /api/opportunities/:id/save',
        unsave: 'DELETE /api/opportunities/:id/save'
      },
      matching: {
        recommendations: 'GET /api/matching/opportunities'
      },
      applications: {
        submit: 'POST /api/applications',
        myApplications: 'GET /api/applications',
        detail: 'GET /api/applications/:applicationId',
        withdraw: 'PATCH /api/applications/:applicationId/withdraw',
        check: 'GET /api/applications/check/:opportunityId'
      }
    }
  });
});

// Mount Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/skill-gaps', skillGapRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/institution', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
