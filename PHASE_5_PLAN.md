# Phase 5 Implementation Plan
## Skill Gap Analysis & Learning Recommendations

**Project:** Academia–Industry Collaboration Portal  
**Phase:** 5 (Skill Gap Analysis & Learning Recommendations)  
**Date:** September 2026  
**Status:** Completed  

---

### 1. Existing Data Available from Phase 3 (Student Core)
From `backend/src/models/Student.js`:
- `careerInterests`: Array of strings representing target roles (e.g. `'Frontend Developer'`, `'Backend Developer'`, `'Data Analyst'`, `'Full Stack Developer'`).
- `technicalSkills`: Array of `{ name: String, proficiency: 'Beginner' | 'Intermediate' | 'Advanced', verificationType: 'Self-reported' | 'Assessment-verified' | 'Certification-verified' }`.
- `softSkills`: Array of strings.
- `education`: Array of degree, institution, fieldOfStudy, startYear, endYear.

### 2. Existing Assessment Data from Phase 4 (Skill Assessment)
From `backend/src/models/AssessmentAttempt.js` and `backend/src/models/Assessment.js`:
- `student`: ObjectId referencing `User`.
- `assessment`: ObjectId referencing `Assessment` (which contains `title`, `skill`, `difficulty`).
- `score`, `totalScore`, `percentage`, `skillLevel` ('Beginner', 'Intermediate', 'Advanced', 'Expert').
- `status`: `'completed' | 'in-progress' | 'expired'`.
- `submittedAt`: Timestamp of completion.

### 3. Skill-Gap Calculation Strategy
Create a centralized, deterministic engine in `backend/src/services/skillGapService.js`:
1. **Career Target Skill Taxonomy:**
   Structured mapping of career roles to expected skills with target proficiencies:
   - `Frontend Developer`: React (Intermediate), JavaScript (Advanced), HTML/CSS (Advanced), Git (Intermediate), REST APIs (Intermediate).
   - `Backend Developer`: Node.js (Intermediate), Java (Intermediate), SQL (Intermediate), REST APIs (Intermediate), Git (Intermediate).
   - `Data Analyst`: Python (Intermediate), SQL (Advanced), Excel (Intermediate), Statistics (Intermediate), Data Visualization (Intermediate).
   - `Full Stack Developer`: React (Intermediate), Node.js (Intermediate), JavaScript (Advanced), SQL (Intermediate), Git (Intermediate), REST APIs (Intermediate).
   - `AI/ML Engineer`: Python (Advanced), Statistics (Intermediate), Machine Learning (Intermediate), Data Visualization (Intermediate), SQL (Intermediate).
2. **Signal Disambiguation (Self-Reported vs. Assessment-Verified):**
   - We query the student's latest completed `AssessmentAttempt` for each skill.
   - We inspect the student's self-reported `technicalSkills`.
   - Priority & Transparency: If verified assessment exists, assessment score dictates the empirical proficiency, but self-reported proficiency is preserved and presented alongside for full transparency.
3. **Categorization Rules:**
   - **Strong:** Assessment $\ge 70\%$ (Advanced/Expert) OR (no assessment and self-reported is Advanced).
   - **Developing:** Assessment between $40\%$ and $69\%$ (Intermediate) OR (no assessment and self-reported is Intermediate).
   - **Needs Improvement:** Assessment $< 40\%$ (Beginner) OR (no assessment and self-reported is Beginner).
   - **Missing:** Required for the target career, but absent from both technicalSkills and assessment attempts.
4. **Overall Readiness Score:**
   Weighted calculation based on status:
   - Strong = 100%
   - Developing = 65%
   - Needs Improvement = 30%
   - Missing = 0%
   Readiness % = $\text{round}\left(\frac{\sum \text{Status Scores}}{\text{Total Required Skills}}\right)$.

### 4. Learning Recommendation Strategy
Create `backend/src/services/learningService.js`:
1. Mapped to skill gaps:
   - Skills categorized as `Needs Improvement` or `Missing` receive highest recommendation priority (Priority 1).
   - Skills categorized as `Developing` receive secondary priority (Priority 2).
   - Resources include transparent justification: e.g. *"Recommended because your assessment indicates REST APIs needs improvement (Score: 35%) for your target role: Frontend Developer."*
2. Student Learning Progress:
   - Track per-student status: `Not Started` $\to$ `In Progress` $\to$ `Completed`.
   - Updateable via `PATCH /api/learning/progress/:resourceId`.

### 5. Database Changes
1. **New Model:** `backend/src/models/LearningResource.js`
   - `title`: String
   - `skill`: String
   - `description`: String
   - `difficulty`: Enum `['Beginner', 'Intermediate', 'Advanced']`
   - `resourceType`: Enum `['Course', 'Article', 'Video', 'Documentation', 'Tutorial', 'Project']`
   - `estimatedDuration`: String
   - `provider`: String
   - `url`: String
   - `topics`: [String]
   - `order`: Number
   - `isActive`: Boolean
2. **New Model:** `backend/src/models/LearningProgress.js`
   - `student`: ObjectId ref `User`
   - `resource`: ObjectId ref `LearningResource`
   - `status`: Enum `['Not Started', 'In Progress', 'Completed']`
   - `startedAt`: Date
   - `completedAt`: Date
   - Compound unique index: `{ student: 1, resource: 1 }`

### 6. Backend APIs
- `GET /api/skill-gaps/me` (Protected, Student/Admin):
  Calculates and returns target career readiness, skill category breakdown, and gap explanations. Accepts optional query param `?career=...` to simulate other careers.
- `GET /api/learning/recommendations` (Protected, Student/Admin):
  Returns personalized recommendations based on the student's active skill gaps, merged with student's current completion status.
- `GET /api/learning/resources` (Protected/Public):
  Browse catalog of learning resources with optional skill/difficulty filters.
- `GET /api/learning/progress` (Protected, Student/Admin):
  Fetch student's current learning progress array.
- `PATCH /api/learning/progress/:resourceId` (Protected, Student/Admin):
  Update status of a resource (`'Not Started' | 'In Progress' | 'Completed'`).

### 7. Frontend Pages & Routes
1. **Phase 4 Missing Views Completion (Prerequisite for Assessment Flow):**
   - `frontend/src/pages/student/AssessmentDetail.jsx` (`/student/assessments/:assessmentId`)
   - `frontend/src/pages/student/AssessmentQuiz.jsx` (`/student/assessments/:assessmentId/attempt/:attemptId`)
   - `frontend/src/pages/student/AssessmentResult.jsx` (`/student/assessments/attempts/:attemptId/result`)
   - `frontend/src/pages/student/AssessmentHistory.jsx` (`/student/assessments/history`)
2. **Phase 5 Pages:**
   - `frontend/src/pages/student/SkillGapPage.jsx` (`/student/skill-gaps`):
     - Target career selector with career readiness percentage gauge.
     - Four distinct sections: Strong, Developing, Needs Improvement, Missing.
     - Clear badge distinction: Self-Reported vs. Assessment-Verified.
     - Actionable "Recommended Next Steps" with direct buttons to learn.
   - `frontend/src/pages/student/LearningPage.jsx` (`/student/learning`):
     - "Recommended for You" section sorted by urgency.
     - "Why recommended" callout banners.
     - Interactive status switches (`Not Started`, `In Progress`, `Completed`).
     - Progress counter and filtering by skill / status.
3. **Student Navigation & Layout Update:**
   - Add "Assessments", "Skill Gaps", and "Learning" to `StudentLayout.jsx`.

### 8. Student Dashboard Integration
Update `StudentDashboard.jsx` to display:
- **Career Readiness Widget:** Percentage bar, skills needing attention count, top skill gap, with link to `/student/skill-gaps`.
- **Recommended Learning Widget:** Top recommended resource with direct link to start learning.
- **Recent Assessment Card:** Quick access to assessment attempts and scores.

### 9. Demo/Seed Data
- `backend/src/data/seedLearning.js`:
  Populates 15+ curated learning resources across Frontend, Backend, and Data skills (React, JavaScript, HTML/CSS, Git, REST APIs, Node.js, SQL, Python).
- Combined seed runner to initialize both demo assessments and learning resources.

### 10. Security Considerations
- All student data endpoints extract the authenticated user identity strictly from `req.user._id` (JWT).
- No user/student ID accepted in URL params or body for "me" routes.
- Learning progress mutation checks ownership: student can only mutate their own records.
- Input validation on status updates and object IDs.
- Production-grade error messages without internal stack leakages.

### 11. Testing Strategy
- Seed database with demo assessments and learning resources.
- Verify health check `/api/health`.
- Test skill gap API with empty skills, partial skills, and assessment-verified skills.
- Test learning recommendations API and progress update.
- Verify Vite build produces 0 errors.
- Test responsive design across desktop and mobile.

### 12. What is Intentionally NOT Included (Strict Boundaries)
- No Gemini AI API calls (reserved for Phase 9).
- No Opportunity/Job/Internship matching or applications (reserved for Phase 6 & 7).
- No Industry/Institution dashboards (reserved for Phase 8).
