# Build Feature Workflow

## Purpose

Use this workflow whenever implementing a new feature.

---

## Step 1 — Understand

Read:

* GEMINI.md
* businessGuidelines.md
* Relevant rules
* Existing implementation

Understand how the new feature fits the existing architecture.

---

## Step 2 — Inspect

Inspect:

* Existing pages.
* Existing components.
* Existing APIs.
* Existing models.
* Existing services.
* Existing routes.

Do not create duplicate functionality.

---

## Step 3 — Plan

Before coding, produce a short implementation plan containing:

```text
Frontend changes
Backend changes
Database changes
API changes
Testing requirements
```

---

## Step 4 — Implement Database

If required:

1. Create/update model.
2. Add validation.
3. Add indexes where useful.
4. Maintain relationships.

---

## Step 5 — Implement Backend

If required:

1. Create service.
2. Create controller.
3. Create route.
4. Add validation.
5. Add authorization.
6. Add error handling.

---

## Step 6 — Implement Frontend

If required:

1. Create/update page.
2. Create reusable components.
3. Connect API.
4. Add loading state.
5. Add error state.
6. Add empty state.
7. Add success feedback.
8. Ensure responsive design.

---

## Step 7 — Test

Run:

* Lint.
* Build.
* Backend tests where available.
* Relevant frontend tests.

Then run the application.

---

## Step 8 — Browser Verification

Open the application in the browser.

Test the actual user flow.

Check:

* Navigation.
* Forms.
* API requests.
* Loading states.
* Error states.
* Responsive behavior.
* Console errors.

---

## Step 9 — Fix

Fix errors discovered during testing.

Do not stop at the first successful compilation.

---

## Step 10 — Final Review

Confirm:

* Requirement implemented.
* UI matches design system.
* Backend works.
* Database works.
* Authorization works.
* No obvious console errors.
* No secrets exposed.

Then provide a concise summary of:

```text
What changed
Files changed
How it works
How it was tested
Any remaining limitations
```
