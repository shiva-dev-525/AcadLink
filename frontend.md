# Frontend Development Rules

## Framework

Use:

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts

Do not introduce another frontend framework unless explicitly requested.

---

# Component Rules

Create reusable components.

Prefer:

```text
components/
pages/
layouts/
hooks/
services/
context/
utils/
```

Do not put the entire application inside a single component.

Avoid components larger than necessary.

---

# Styling Rules

Use Tailwind CSS consistently.

Use the project design system defined in GEMINI.md.

Primary visual style:

* White cards.
* Light neutral backgrounds.
* Indigo/deep blue primary actions.
* Slate text.
* Subtle borders.
* Minimal shadows.
* Moderate border radius.
* Generous whitespace.

Avoid:

* Neon colors.
* Excessive gradients.
* Excessive glass effects.
* Huge rounded cards.
* Excessive animations.
* Random colors.

---

# Buttons

Primary button:

Use the primary brand color.

Secondary button:

Use neutral styling.

Danger button:

Use red only for destructive actions.

Buttons should clearly communicate their action.

Avoid multiple competing primary buttons in the same section.

---

# Cards

Cards should:

* Have a clear purpose.
* Use subtle borders.
* Use minimal shadows.
* Have consistent padding.
* Avoid excessive decoration.

---

# Forms

Forms should:

* Have clear labels.
* Show validation errors.
* Have appropriate input types.
* Show loading states.
* Disable submission when necessary.
* Provide useful error messages.

---

# Navigation

Authenticated pages should use:

* Sidebar.
* Top header.
* Role-specific navigation.

Navigation must change according to the user's role.

---

# Dashboard

Do not fill dashboards with unnecessary cards.

Prioritize:

1. Most important KPI.
2. Main action.
3. Important analytics.
4. Recommendations.
5. Recent activity.

---

# Charts

Use Recharts where appropriate.

Charts should communicate information.

Do not add charts simply to make the dashboard look impressive.

Use accessible labels and legends.

---

# Responsive Design

Every page must work on:

* Desktop.
* Tablet.
* Mobile.

Use responsive Tailwind breakpoints.

Do not create fixed-width layouts that break on small screens.

---

# Accessibility

Use:

* Semantic HTML.
* Labels.
* Keyboard-accessible controls.
* Appropriate contrast.
* Focus states.
* Accessible buttons.

Do not rely solely on color to communicate status.

---

# Loading States

Every API-driven page should have a loading state.

Prefer skeletons for larger dashboard sections.

---

# Empty States

When no data exists, show a useful message.

Example:

```text
No internships found.

Try changing your filters.
```

---

# Error States

Never leave a blank page after an API error.

Show:

* What happened.
* A useful recovery action.

---

# UX Principle

The interface should feel calm and professional.

The user should immediately understand:

* Where they are.
* What they can do.
* What needs attention.
* What action they should take next.
