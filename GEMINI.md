# Academia–Industry Collaboration Portal

## 1. Project Identity

Project Name:

Academia–Industry Collaboration Portal

Purpose:

Build a centralized web platform that connects students, industries, academicians, and institutions for skill development, skill mapping, internships, placements, learning, mentorship, projects, and industry–academia collaboration.

The platform should solve the gap between skills acquired by students and skills expected by industries.

The primary product philosophy is:

**Assess → Analyze → Learn → Match → Apply → Track → Grow**

---

# 2. Primary Users

The platform has four primary user roles.

## Student

Students should be able to:

* Create and maintain professional profiles.
* Add education details.
* Add technical skills.
* Add soft skills.
* Add projects.
* Add certifications.
* Add internships.
* Take skill assessments.
* View skill scores.
* Identify skill gaps.
* Receive personalized learning recommendations.
* Discover internships.
* Discover entry-level jobs.
* Apply for opportunities.
* Track application status.
* Maintain a digital portfolio.
* Discover industry training programs.
* Participate in mentorship, workshops, challenges, and live projects.

## Industry

Industries should be able to:

* Create company profiles.
* Post internships.
* Post entry-level jobs.
* Post live projects.
* Post apprenticeships.
* Define required skills.
* Publish training programs.
* Publish workshops.
* Publish mentorship programs.
* View relevant candidates.
* Shortlist candidates.
* Manage applications.
* Participate in academia–industry collaboration.

## Academician

Academicians should be able to:

* Create professional faculty profiles.
* Discover faculty internships.
* Discover industrial training.
* Discover Faculty Development Programs.
* Discover consultancy opportunities.
* Discover collaborative research opportunities.
* Discover industry projects.
* Participate in mentorship and knowledge-sharing programs.

## Institution / Admin

Institutions should be able to:

* Monitor student skill development.
* Monitor student skill gaps.
* Monitor internship participation.
* Monitor placement progress.
* Analyze industry skill demand.
* Monitor recruitment outcomes.
* View institutional analytics.
* Manage users and platform data.
* Manage industry partnerships.

---

# 3. Technology Stack

Use the following technology stack unless a strong technical reason requires a change.

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Recharts
* Axios

## Backend

* Node.js
* Express.js
* REST API architecture
* JWT authentication
* bcrypt for password hashing

## Database

* MongoDB
* Mongoose

## AI

* Gemini API

Use AI for:

* Skill-gap analysis.
* Career recommendations.
* Learning recommendations.
* Opportunity matching assistance.
* Resume/profile analysis where appropriate.

## Development

Use:

* Git
* GitHub
* ESLint
* Environment variables
* Clear error handling
* Modular architecture

---

# 4. Overall Architecture

Use a clear separation between frontend and backend.

```text
                    FRONTEND
                 React + Vite
                      │
                      │ REST API
                      ↓
                    BACKEND
                Node.js + Express
                      │
            ┌─────────┴─────────┐
            ↓                   ↓
        MongoDB             Gemini API
        Database                AI
```

The frontend must never directly access MongoDB.

The frontend communicates with the backend through APIs.

The backend is responsible for:

* Authentication.
* Authorization.
* Business logic.
* Validation.
* Database operations.
* AI service communication.
* Application processing.
* Matching logic.

---

# 5. Design Philosophy

The interface must feel like a real professional product, not a generic hackathon template.

The UI should communicate:

* Trust
* Simplicity
* Career growth
* Professionalism
* Clarity
* Modern technology

Avoid visual noise.

Do not make every section colorful.

Use color intentionally.

---

# 6. Visual Design System

## Overall Style

Use:

* Minimal
* Modern
* Professional
* Clean
* Spacious
* Responsive
* Accessible

Avoid:

* Excessive gradients
* Neon colors
* Excessive glassmorphism
* Heavy shadows
* Excessive animations
* Huge decorative illustrations
* Overly rounded interfaces
* Random colors for different cards
* Excessive emojis
* Visually noisy dashboards

---

# 7. Color System

Use a restrained color palette.

## Primary

Primary brand color:

Indigo / deep blue.

Use it for:

* Primary buttons
* Active navigation
* Links
* Important actions
* Focus states
* Selected elements

## Background

Use a very light neutral background.

Main application background:

```text
#F8FAFC
```

Cards:

```text
#FFFFFF
```

## Text

Primary text:

```text
#0F172A
```

Secondary text:

```text
#64748B
```

Muted text:

```text
#94A3B8
```

Borders:

```text
#E2E8F0
```

## Semantic colors

Success:

Use a restrained green.

Warning:

Use amber/orange only when necessary.

Danger:

Use red only for errors, rejection, or critical warnings.

Do not use semantic colors as decoration.

---

# 8. Typography

Use a clean modern sans-serif font.

Preferred:

* Inter
* system-ui
* sans-serif

Typography hierarchy:

```text
Page title
↓
Section title
↓
Card title
↓
Body
↓
Supporting text
```

Do not use excessive font sizes.

Headings should be strong but compact.

---

# 9. Layout System

Authenticated dashboards should generally use:

```text
┌─────────────────────────────────────────────┐
│ Top Header                                  │
├────────────┬────────────────────────────────┤
│            │                                │
│ Sidebar    │ Main Content                   │
│            │                                │
│ Navigation │                                │
│            │                                │
└────────────┴────────────────────────────────┘
```

Desktop:

* Fixed/collapsible sidebar.
* Top header.
* Scrollable main content.

Mobile:

* Collapsible navigation.
* Mobile menu.
* Full-width content.

---

# 10. Sidebar Design

The sidebar should be minimal.

Include:

* Brand/logo.
* Role-specific navigation.
* Active navigation state.
* Profile/settings section.
* Logout.

Do not put every possible feature into the sidebar.

Group related functionality.

---

# 11. Dashboard Design

Dashboards should follow this pattern:

```text
Page Header
    ↓
Short description / action
    ↓
Important KPI cards
    ↓
Main analytical section
    ↓
Recommendations / activity
    ↓
Secondary information
```

Do not create dashboards containing dozens of cards.

Prioritize the most important information.

---

# 12. Student Dashboard

The student dashboard should prioritize career readiness.

Suggested structure:

```text
Welcome back

Career Goal
Software Developer

┌────────────┬────────────┬────────────┬────────────┐
│ Skill Score│ Skill Gaps │ Applications│ Matches    │
└────────────┴────────────┴────────────┴────────────┘

Skill Development
[Progress visualization]

Recommended Opportunities

Recommended Learning

Recent Applications
```

Important information should be visible without excessive scrolling.

---

# 13. Skill Assessment Interface

The assessment interface should be distraction-free.

Show:

* Assessment title.
* Progress indicator.
* Current question.
* Answer options.
* Navigation.
* Submit action.

Do not display unnecessary dashboard elements during an assessment.

Example:

```text
Skill Assessment

Question 4 of 20

[Question]

○ Option A
○ Option B
○ Option C
○ Option D

[Previous]              [Next]
```

---

# 14. Skill Gap Interface

This is one of the most important screens in the application.

It should clearly communicate:

```text
Your Current Skills
        ↓
Industry Requirements
        ↓
Skill Gap
        ↓
Recommended Learning
```

Use simple visualizations.

Example:

```text
Java
████████████████░░  82%

DSA
██████████░░░░░░░░  52%

Git
███████░░░░░░░░░░░  35%
```

Skill gaps should be visually distinguishable without making the interface alarming.

Provide actions such as:

* Learn this skill.
* View recommended courses.
* Practice.
* Reassess.

---

# 15. Opportunity Cards

Internship and job cards should be compact and informative.

Show:

* Company.
* Position.
* Opportunity type.
* Location/remote status.
* Required skills.
* Eligibility.
* Match percentage where available.
* Deadline.
* Apply button.

Example:

```text
Java Backend Intern

ABC Technologies

87% Match

Java · SQL · Git · Spring Boot

3 Months · Hybrid

[View Opportunity]
```

Do not overload cards with information.

---

# 16. Matching Score

Matching scores should be presented as supportive information rather than absolute truth.

Example:

```text
87% Match
```

The interface should also explain why.

Example:

```text
Strong matches:
✓ Java
✓ SQL
✓ Git

Skill to improve:
• Spring Boot
```

Do not imply that AI recommendations guarantee selection.

---

# 17. Learning Roadmap

Learning recommendations should form a clear progression.

Example:

```text
Git & GitHub
     ↓
Spring Boot
     ↓
REST APIs
     ↓
Backend Project
     ↓
Assessment
```

Use progress indicators and completion states.

---

# 18. Digital Portfolio

The student portfolio should feel like a professional profile.

Include:

* Profile summary.
* Education.
* Skills.
* Skill verification.
* Projects.
* Certifications.
* Internships.
* Achievements.
* Resume.
* Portfolio links.

Prioritize verified information.

---

# 19. Industry Dashboard

Industry dashboards should focus on recruitment and talent discovery.

Suggested structure:

```text
Company Overview

Active Opportunities
Applications
Shortlisted Candidates

Post Opportunity

Recommended Candidates

Recent Applications
```

Candidate cards should emphasize:

* Skills.
* Match score.
* Education.
* Projects.
* Certifications.
* Experience.

---

# 20. Academician Dashboard

Academician dashboards should prioritize:

* Faculty opportunities.
* FDPs.
* Industrial training.
* Research collaborations.
* Consultancy opportunities.
* Industry projects.
* Mentorship.

Use the same visual language as the student and industry dashboards.

---

# 21. Institution Dashboard

Institution dashboards should focus on analytics.

Include:

* Total students.
* Skill readiness.
* Internship participation.
* Placement progress.
* Industry partners.
* Most demanded skills.
* Most common skill gaps.
* Recruitment outcomes.

Charts should be simple.

Recommended charts:

* Bar charts.
* Line charts.
* Donut charts only when genuinely useful.

Do not create charts just for decoration.

---

# 22. Authentication

Implement role-based authentication.

Roles:

```text
student
industry
academician
institution
admin
```

After login, users should be redirected to the correct dashboard.

Users must not be able to access unauthorized role-specific pages.

---

# 23. Security

Never:

* Hardcode passwords.
* Hardcode API keys.
* Commit `.env`.
* Expose database credentials.
* Store plain-text passwords.

Use:

* Environment variables.
* Password hashing.
* JWT authentication.
* Authorization middleware.
* Input validation.
* Proper error handling.

---

# 24. API Design

Use RESTful APIs.

Example:

```text
/api/auth
/api/students
/api/skills
/api/assessments
/api/internships
/api/jobs
/api/applications
/api/courses
/api/portfolio
/api/industries
/api/academicians
/api/institutions
/api/matching
/api/analytics
```

Keep controllers, routes, models and services separated.

---

# 25. Database Design

Use MongoDB with Mongoose.

Core entities:

```text
User
Student
Industry
Academician
Institution
Skill
Assessment
Internship
Job
Application
Course
Portfolio
Project
Collaboration
```

Use references between related entities where appropriate.

Avoid unnecessary duplication.

---

# 26. AI Architecture

AI functionality should be isolated into backend services.

Example:

```text
Frontend
   ↓
Backend API
   ↓
AI Service
   ↓
Gemini API
```

Never call the Gemini API directly from the frontend using a secret API key.

AI services may include:

```text
skillGapService
careerRecommendationService
learningRecommendationService
matchingService
resumeAnalysisService
```

---

# 27. Matching Logic

Do not depend entirely on an LLM for numerical matching.

Use deterministic logic for core scoring.

Example factors:

```text
Skill compatibility
Eligibility
Career interest
Experience
Education requirements
Location preference
```

AI can provide explanations and recommendations.

The backend should remain responsible for the actual application logic.

---

# 28. Error Handling

Every major page should support:

* Loading state.
* Empty state.
* Error state.
* Success feedback.

Example:

```text
No internships found.

Try changing your filters or career preferences.
```

Do not leave blank screens when data is unavailable.

---

# 29. Responsive Design

The application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Do not design desktop-only layouts.

Tables should become responsive cards or horizontally scrollable where appropriate.

---

# 30. Component Architecture

Prefer reusable components.

Examples:

```text
Button
Input
Modal
Badge
Card
ProgressBar
SkillBadge
OpportunityCard
ApplicationStatus
DashboardCard
ChartCard
Sidebar
Header
ProfileCard
```

Avoid duplicating the same UI in multiple pages.

---

# 31. Code Quality

Follow these principles:

* Small components.
* Meaningful variable names.
* Clear functions.
* Reusable utilities.
* No unnecessary duplication.
* No unused imports.
* No console errors.
* Proper API error handling.
* Proper loading states.
* Keep business logic out of presentation components where possible.

---

# 32. Development Strategy

Do not build the entire application in one step.

Build incrementally.

Recommended order:

1. Project architecture.
2. Authentication.
3. Role-based dashboards.
4. Student profile.
5. Skill system.
6. Skill assessment.
7. Skill-gap analysis.
8. Learning recommendations.
9. Internship module.
10. Job module.
11. Application tracking.
12. Industry dashboard.
13. Academician module.
14. Institution analytics.
15. Digital portfolio.
16. AI features.
17. Testing.
18. UI refinement.

---

# 33. Prototype Priority

For the hackathon prototype, prioritize the following flow:

```text
Student Registration
        ↓
Student Profile
        ↓
Skill Assessment
        ↓
Skill Analysis
        ↓
Skill Gap
        ↓
Learning Recommendation
        ↓
Recommended Internship
        ↓
Application
        ↓
Application Tracking
        ↓
Digital Portfolio
```

This should be the main demonstration flow.

Secondary modules should support this story rather than distract from it.

---

# 34. Product Quality Rule

When choosing between:

A large number of unfinished features

and

A smaller number of polished, connected features,

always choose the second option.

The prototype should feel like a coherent product.

---

# 35. Agent Behavior

Before modifying code:

1. Inspect the existing project.
2. Understand the architecture.
3. Read relevant rules.
4. Identify dependencies.
5. Create a concise implementation plan.
6. Implement incrementally.
7. Run the application.
8. Test the affected functionality.
9. Fix errors.
10. Report what changed.

Do not rewrite working parts of the application unnecessarily.

Do not create duplicate components or APIs.

Do not change the technology stack without a clear reason.

---

# 36. Definition of Done

A feature is not complete merely because the code compiles.

A feature is complete when:

* UI exists.
* Backend API exists where required.
* Database integration works where required.
* Loading state exists.
* Error handling exists.
* Authentication/authorization is respected.
* The feature works in the browser.
* No major console errors exist.
* The implementation matches the product requirements.

---

# 37. Final Product Principle

The platform should make the user's journey simple:

**Know your skills.**

↓

**Understand your gaps.**

↓

**Learn what matters.**

↓

**Find the right opportunity.**

↓

**Apply confidently.**

↓

**Track your progress.**

↓

**Build your career profile.**

The application should always communicate this purpose through its UX.
