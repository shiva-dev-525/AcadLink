# Security Rules

## Credentials

Never hardcode:

* Passwords.
* JWT secrets.
* Gemini API keys.
* MongoDB credentials.
* Third-party credentials.

Use environment variables.

---

# Authentication

Use secure password hashing.

Use JWT for authenticated API requests.

---

# Authorization

Always verify the user's role and permissions on the backend.

Never trust:

```text
role
userId
ownership
```

provided by the frontend without verification.

---

# User Ownership

A student should only modify their own profile.

An industry should only modify its own opportunities.

An academician should only modify their own profile and authorized collaborations.

Institutions should only access permitted institutional data.

---

# Input Validation

Validate all user-controlled input.

Do not directly trust:

* Query parameters.
* Request bodies.
* URL parameters.
* Uploaded metadata.

---

# API Security

Protected APIs should require authentication.

Role-specific APIs should require authorization.

Return generic error messages where detailed internal information could create security risks.

---

# File Uploads

If file uploads are implemented:

* Validate file type.
* Validate file size.
* Do not execute uploaded files.
* Store files securely.
* Do not expose private files publicly without authorization.

---

# AI Security

Gemini API calls must be performed on the backend.

Never expose API credentials in frontend JavaScript.

Do not send unnecessary private user information to AI services.

---

# Production Safety

Never commit:

```text
.env
credentials
private keys
API keys
database passwords
```

Ensure `.gitignore` contains secret files.
