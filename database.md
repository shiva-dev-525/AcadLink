# Backend Development Rules

## Framework

Use:

* Node.js
* Express.js
* Mongoose

Use REST APIs.

---

# Architecture

Use:

```text
routes
controllers
services
models
middleware
utils
config
```

Responsibilities must remain separated.

Routes define endpoints.

Controllers handle requests.

Services contain business logic.

Models define database structures.

Middleware handles cross-cutting concerns.

---

# API Structure

Use:

```text
/api/auth
/api/students
/api/industries
/api/academicians
/api/institutions
/api/skills
/api/assessments
/api/internships
/api/jobs
/api/courses
/api/applications
/api/portfolio
/api/matching
/api/analytics
```

Use appropriate HTTP methods:

```text
GET
POST
PUT/PATCH
DELETE
```

---

# Authentication

Use JWT authentication.

Passwords must be hashed.

Never store plain-text passwords.

---

# Authorization

Implement role-based authorization.

Roles:

```text
student
industry
academician
institution
admin
```

Every protected endpoint must verify authorization where required.

---

# Validation

Validate:

* Request body.
* Parameters.
* Query parameters.
* IDs.
* Required fields.

Return meaningful validation errors.

---

# Error Handling

Use centralized error handling.

Do not expose:

* Database internals.
* Passwords.
* API keys.
* Stack traces in production responses.

---

# Environment Variables

Use `.env`.

Examples:

```text
PORT=
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
```

Never commit `.env`.

Maintain `.env.example`.

---

# Database

Use Mongoose models.

Avoid unnecessary duplicate data.

Use references where appropriate.

Validate required fields at the schema level.

---

# Business Logic

Business logic belongs in services where practical.

Examples:

```text
matchingService
skillGapService
applicationService
assessmentService
aiService
```

Do not put complex business logic directly inside route definitions.

---

# AI

Gemini API calls must happen on the backend.

Never expose the Gemini API key to the browser.

AI results must be validated before being used by application logic.

---

# API Response Style

Use consistent response structures.

Successful response:

```json
{
  "success": true,
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Useful error message"
}
```

---

# Security

Implement:

* Password hashing.
* JWT verification.
* Authorization.
* Input validation.
* Environment variables.
* Safe error responses.

Do not trust client-provided role information.

Always verify permissions on the server.

---

# Code Quality

Avoid:

* Duplicate APIs.
* Duplicate business logic.
* Unused code.
* Hardcoded credentials.
* Unhandled promises.
* Silent errors.

Keep services modular and testable.
