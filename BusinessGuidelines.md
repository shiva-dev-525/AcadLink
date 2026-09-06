# Business Guidelines

## 1. Platform Objective

The platform connects:

* Students
* Industries
* Academicians
* Institutions

The platform exists to reduce the gap between academic skills and industry requirements.

The core business cycle is:

**Assess → Map → Learn → Match → Apply → Track → Improve**

---

# 2. User Roles

## Student

A student is an individual looking for:

* Skill development.
* Internships.
* Jobs.
* Industry training.
* Projects.
* Mentorship.
* Career guidance.

## Industry

An industry represents a company or organization that provides:

* Jobs.
* Internships.
* Projects.
* Training.
* Workshops.
* Mentorship.
* Industry challenges.

## Academician

An academician represents faculty or academic professionals looking for:

* Faculty internships.
* Industrial training.
* FDPs.
* Research collaboration.
* Consultancy.
* Industry projects.

## Institution

An institution represents a college/university/organization responsible for monitoring students and industry collaboration.

---

# 3. Student Profile

A student profile may contain:

* Name.
* Profile photo.
* Email.
* Phone.
* Institution.
* Degree.
* Department.
* Graduation year.
* CGPA/academic information.
* Technical skills.
* Soft skills.
* Career interests.
* Projects.
* Certifications.
* Internships.
* Achievements.
* Resume.
* Portfolio links.

Students should be able to update their profiles.

---

# 4. Skill System

Skills should be represented as structured entities.

Examples:

Technical:

* Java
* Python
* JavaScript
* React
* Node.js
* SQL
* MongoDB
* Git
* DSA
* Cloud
* Machine Learning

Soft skills:

* Communication
* Teamwork
* Leadership
* Problem Solving
* Time Management

Each skill may have a proficiency level.

Example:

```text
Beginner
Intermediate
Advanced
Expert
```

---

# 5. Skill Assessment

Students can take assessments to estimate their skill levels.

An assessment can contain:

* Multiple-choice questions.
* Aptitude questions.
* Technical questions.
* Soft-skill questions.

Assessment results should produce:

* Overall score.
* Skill-wise scores.
* Strengths.
* Weaknesses.
* Skill gaps.

---

# 6. Skill Gap

A skill gap exists when:

```text
Required proficiency > Student proficiency
```

Example:

Industry requirement:

```text
Java = Advanced
Spring Boot = Intermediate
SQL = Intermediate
Git = Intermediate
```

Student profile:

```text
Java = Advanced
Spring Boot = Beginner
SQL = Intermediate
Git = Beginner
```

Skill gaps:

```text
Spring Boot
Git
```

---

# 7. Career Goals

Students should be able to select one or more career goals.

Examples:

* Software Developer
* Backend Developer
* Frontend Developer
* Full Stack Developer
* Data Analyst
* Data Scientist
* AI/ML Engineer
* Cloud Engineer
* Cybersecurity Analyst

Career goals influence:

* Skill recommendations.
* Learning recommendations.
* Opportunity recommendations.

---

# 8. Learning Recommendations

Learning recommendations should be based on:

* Career goal.
* Current skills.
* Skill gaps.
* Industry demand.
* Previous learning activity.

Example:

```text
Career Goal:
Backend Developer

Skill Gap:
Spring Boot

Recommendation:
Spring Boot Fundamentals
```

Recommendations should prioritize skills that improve employability.

---

# 9. Internship

An internship opportunity should contain:

* Company.
* Position.
* Description.
* Duration.
* Location.
* Work mode.
* Eligibility.
* Required skills.
* Preferred skills.
* Application deadline.
* Stipend information where applicable.
* Number of openings.
* Application status.

---

# 10. Job

A job opportunity should contain:

* Company.
* Job title.
* Description.
* Location.
* Work mode.
* Eligibility.
* Required skills.
* Preferred skills.
* Experience requirement.
* Application deadline.
* Salary information where appropriate.
* Number of openings.

---

# 11. Opportunity Matching

The system should calculate a compatibility score.

Primary factors:

```text
Skill compatibility
Eligibility
Career interest
Experience
Education
Location/work-mode preference
```

A simple prototype score may be:

```text
Skill Match        50%
Career Interest    20%
Eligibility        15%
Experience         10%
Other               5%
```

The exact weights should remain configurable.

The match score should be presented as an estimate.

It must not guarantee selection.

---

# 12. Match Explanation

Every recommendation should explain the score.

Example:

```text
87% Match

Strong matches:
✓ Java
✓ SQL
✓ Git

Skill gaps:
• Spring Boot

Eligibility:
✓ Eligible
```

This is more useful than showing only a percentage.

---

# 13. Application Lifecycle

An application should move through controlled states:

```text
Applied
↓
Under Review
↓
Shortlisted
↓
Interview
↓
Selected
```

Alternative ending:

```text
Rejected
```

Students should be able to see the current status.

Industries should be able to update application status according to their permissions.

---

# 14. Application Rules

A student should not apply twice to the same opportunity.

A student should only be able to apply if:

* The opportunity is active.
* The deadline has not passed.
* The student satisfies mandatory eligibility requirements.

The backend must enforce these rules.

---

# 15. Industry Learning Programs

Industries may create:

* Courses.
* Workshops.
* Certification programs.
* Training programs.
* Mentorship programs.

Each program should contain:

* Title.
* Description.
* Provider.
* Duration.
* Skills covered.
* Eligibility.
* Enrollment information.
* Completion information.

---

# 16. Digital Portfolio

A student's portfolio should consolidate:

```text
Profile
+
Skills
+
Projects
+
Certifications
+
Internships
+
Achievements
```

The portfolio should be viewable as a professional profile.

---

# 17. Academician Opportunities

Academicians may discover:

* Faculty internships.
* Industrial training.
* FDPs.
* Consultancy opportunities.
* Research collaboration.
* Industry projects.

These opportunities should use a common opportunity model where possible, with role-specific metadata.

---

# 18. Academia–Industry Collaboration

The platform should support:

### Mentorship

Industry professionals can mentor students.

### Workshops

Companies can conduct workshops.

### Guest Lectures

Industry experts can share knowledge with institutions.

### Innovation Challenges

Industries can publish challenges for students.

### Live Projects

Industries can provide real-world project opportunities.

### Research Collaboration

Academicians and industries can collaborate on research.

---

# 19. Institution Analytics

Institutions should be able to monitor:

### Student Readiness

```text
Placement Ready
Needs Improvement
Under Training
```

### Skill Demand

Identify skills frequently requested by industries.

### Skill Gaps

Identify skills where students are collectively weak.

### Internship Participation

Track student participation.

### Placement Progress

Track:

* Eligible students.
* Applications.
* Shortlisted students.
* Interviews.
* Offers.
* Placements.

---

# 20. Admin Responsibilities

Admin should be able to:

* Manage users.
* Manage roles.
* Manage skills.
* Moderate opportunities.
* Manage institutions.
* Manage industries.
* Review reports.
* Monitor system activity.

---

# 21. AI Business Rules

AI may assist with:

* Skill-gap analysis.
* Career recommendations.
* Learning recommendations.
* Opportunity explanations.
* Resume/profile extraction.

AI should not make irreversible decisions.

Examples:

AI should NOT independently:

* Reject a candidate.
* Guarantee a job.
* Guarantee an internship.
* Claim that a student will be hired.
* Override mandatory eligibility rules.

---

# 22. Data Trust

User-provided information should be clearly distinguished from verified information.

For example:

```text
Java — Self reported
Java — Assessment verified
Java — Certification verified
```

Do not label information as verified unless the platform has a mechanism supporting that verification.

---

# 23. Privacy

Only show information to users who have appropriate permissions.

Students should control appropriate profile visibility.

Recruiters should only access candidate information required for recruitment.

Admin access should be role-controlled.

---

# 24. Prototype Simplification

For the hackathon prototype, the following may be simulated:

* Assessment scoring.
* AI recommendations.
* Match percentages.
* Course recommendations.
* Analytics data.
* Application status transitions.

However, the UI should make the simulated flow feel realistic.

Clearly separate mock/demo data from production functionality in the code.

---

# 25. Primary Demo Scenario

The primary demonstration should follow one student.

Example:

```text
Student registers
↓
Chooses Software Developer
↓
Completes skill assessment
↓
Receives skill profile
↓
Sees skill gaps
↓
Receives learning recommendations
↓
Skill readiness improves
↓
Receives internship recommendations
↓
Applies to internship
↓
Tracks application
↓
Portfolio is updated
```

This scenario should connect the major features into one coherent experience.

---

# 26. Business Success Metrics

Potential platform metrics include:

* Skill assessment completion.
* Skill gap reduction.
* Course completion.
* Internship applications.
* Internship placements.
* Job applications.
* Placement rate.
* Industry participation.
* Number of active industry partners.
* Faculty collaboration.
* Student placement readiness.

---

# 27. Core Product Promise

The platform should answer four questions:

### Student

**What skills do I have?**

### Student

**What skills am I missing?**

### Student

**What should I learn next?**

### Student

**Which opportunities are right for me?**

### Industry

**Which candidates match my requirements?**

### Institution

**What skills are our students missing and what does industry need?**

### Academician

**Where can I collaborate with industry?**
