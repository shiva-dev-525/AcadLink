/**
 * Seed Script — Phase 5 Curated Learning Resources
 *
 * Populates learning resources across core skills to support
 * personalized remedial and advancing recommendations.
 *
 * Run with: node src/data/seedLearning.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const LearningResource = require('../models/LearningResource');

const learningData = [
  // ─── REST APIs ──────────────────────────────────────────────────────────────
  {
    title: 'RESTful API Architecture & Design Fundamentals',
    skill: 'REST APIs',
    description:
      'Learn the core architectural principles of REST: client-server decoupling, statelessness, cacheability, and uniform interfaces.',
    difficulty: 'Beginner',
    resourceType: 'Tutorial',
    estimatedDuration: '45 min',
    provider: 'Portal Academy',
    url: 'https://developer.mozilla.org/en-US/docs/Glossary/REST',
    topics: ['HTTP Protocol', 'Stateless Architecture', 'Resource URIs', 'JSON Payloads'],
    order: 1,
  },
  {
    title: 'Mastering HTTP Methods, Status Codes & Headers',
    skill: 'REST APIs',
    description:
      'Deep dive into safe vs. idempotent methods (GET, POST, PUT, PATCH, DELETE) and standard HTTP status code ranges (2xx, 4xx, 5xx).',
    difficulty: 'Intermediate',
    resourceType: 'Article',
    estimatedDuration: '30 min',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods',
    topics: ['Idempotency', 'Status Codes', 'Request/Response Headers', 'CORS'],
    order: 2,
  },
  {
    title: 'API Authentication & Token Management (JWT)',
    skill: 'REST APIs',
    description:
      'Understand bearer token authentication, JSON Web Tokens (JWT) structure, signature verification, and secure cookie storage.',
    difficulty: 'Intermediate',
    resourceType: 'Course',
    estimatedDuration: '1.5 hours',
    provider: 'Portal Academy',
    url: 'https://jwt.io/introduction',
    topics: ['Bearer Tokens', 'JWT Claims', 'Secret Keys', 'Auth Middleware'],
    order: 3,
  },

  // ─── Git ───────────────────────────────────────────────────────────────────
  {
    title: 'Git Version Control Essentials',
    skill: 'Git',
    description:
      'Master the basic Git workflow: git init, staging with add, atomic commits, inspecting git log, and diff comparisons.',
    difficulty: 'Beginner',
    resourceType: 'Interactive Tutorial',
    estimatedDuration: '40 min',
    provider: 'Portal Academy',
    url: 'https://git-scm.com/docs/gittutorial',
    topics: ['Working Directory', 'Staging Area', 'Commit History', 'Diff Inspection'],
    order: 1,
  },
  {
    title: 'Git Branching Strategies & Collaboration Workflows',
    skill: 'Git',
    description:
      'Learn feature branching, conflict resolution, merge vs. rebase, and collaborative Pull Request best practices on GitHub.',
    difficulty: 'Intermediate',
    resourceType: 'Tutorial',
    estimatedDuration: '1 hour',
    provider: 'GitHub Guides',
    url: 'https://docs.github.com/en/get-started/quickstart/github-flow',
    topics: ['Feature Branches', 'Merge Conflicts', 'Pull Requests', 'Git Rebase'],
    order: 2,
  },

  // ─── React ─────────────────────────────────────────────────────────────────
  {
    title: 'React Fundamentals: JSX, Components & Props',
    skill: 'React',
    description:
      'Understand declarative UI composition, functional components, JSX syntax nuances, and unidirectional data flow via props.',
    difficulty: 'Beginner',
    resourceType: 'Documentation',
    estimatedDuration: '1 hour',
    provider: 'Official React Docs',
    url: 'https://react.dev/learn',
    topics: ['JSX Syntax', 'Component Hierarchy', 'Props Passing', 'Rendering Logic'],
    order: 1,
  },
  {
    title: 'State Management & Core React Hooks',
    skill: 'React',
    description:
      'Master useState for local state, useEffect for side-effects and cleanup, plus useRef for persistent mutable references.',
    difficulty: 'Intermediate',
    resourceType: 'Course',
    estimatedDuration: '2 hours',
    provider: 'Portal Academy',
    url: 'https://react.dev/reference/react',
    topics: ['useState', 'useEffect Dependency Array', 'useRef', 'Custom Hooks'],
    order: 2,
  },
  {
    title: 'Global State & Context Architecture in React',
    skill: 'React',
    description:
      'Avoid prop drilling by architecting clean Context providers and consuming state efficiently without unnecessary rerenders.',
    difficulty: 'Advanced',
    resourceType: 'Tutorial',
    estimatedDuration: '1.5 hours',
    provider: 'Portal Academy',
    url: 'https://react.dev/learn/passing-data-deeply-with-context',
    topics: ['Context API', 'Reducer Pattern', 'Provider Optimization', 'State Selectors'],
    order: 3,
  },

  // ─── JavaScript ────────────────────────────────────────────────────────────
  {
    title: 'Modern JavaScript (ES6+) Syntax & Features',
    skill: 'JavaScript',
    description:
      'Refresh essential ES6+ features: destructuring, rest/spread operators, template literals, arrow functions, and modules.',
    difficulty: 'Beginner',
    resourceType: 'Article',
    estimatedDuration: '45 min',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    topics: ['Destructuring', 'Arrow Functions', 'ES Modules', 'Array Methods'],
    order: 1,
  },
  {
    title: 'Asynchronous JavaScript: Event Loop & Promises',
    skill: 'JavaScript',
    description:
      'Understand the single-threaded event loop, call stack, microtask queue, Promise chaining, and clean async/await patterns.',
    difficulty: 'Intermediate',
    resourceType: 'Course',
    estimatedDuration: '1.5 hours',
    provider: 'Portal Academy',
    url: 'https://javascript.info/async',
    topics: ['Event Loop', 'Microtasks', 'Promises', 'async/await', 'Error Handling'],
    order: 2,
  },

  // ─── HTML/CSS ──────────────────────────────────────────────────────────────
  {
    title: 'Responsive Layouts with Flexbox and CSS Grid',
    skill: 'HTML/CSS',
    description:
      'Master 1D alignment with Flexbox and 2D modular layouts with CSS Grid, container queries, and mobile-first media queries.',
    difficulty: 'Beginner',
    resourceType: 'Interactive Tutorial',
    estimatedDuration: '1 hour',
    provider: 'Portal Academy',
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    topics: ['Flexbox Alignment', 'Grid Template Areas', 'Mobile First', 'Aspect Ratio'],
    order: 1,
  },
  {
    title: 'Semantic HTML & Web Accessibility (a11y)',
    skill: 'HTML/CSS',
    description:
      'Build accessible web experiences using semantic elements (main, nav, article), ARIA labels, and keyboard navigation.',
    difficulty: 'Intermediate',
    resourceType: 'Article',
    estimatedDuration: '45 min',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility',
    topics: ['Semantic Tags', 'ARIA Roles', 'Contrast Ratios', 'Keyboard Traps'],
    order: 2,
  },

  // ─── Node.js ───────────────────────────────────────────────────────────────
  {
    title: 'Node.js & Express REST Backend Architecture',
    skill: 'Node.js',
    description:
      'Construct scalable backend servers with Express, structuring controllers, route handlers, middleware, and environment variables.',
    difficulty: 'Intermediate',
    resourceType: 'Course',
    estimatedDuration: '2 hours',
    provider: 'Portal Academy',
    url: 'https://expressjs.com/en/starter/installing.html',
    topics: ['Routing', 'Middleware Chain', 'Error Handling', 'Environment Config'],
    order: 1,
  },

  // ─── SQL ───────────────────────────────────────────────────────────────────
  {
    title: 'Relational Database Design & SQL Querying Mastery',
    skill: 'SQL',
    description:
      'Learn relational schema design, primary & foreign keys, normalization, JOINs (INNER, LEFT, FULL), and aggregate functions.',
    difficulty: 'Intermediate',
    resourceType: 'Course',
    estimatedDuration: '2.5 hours',
    provider: 'Portal Academy',
    url: 'https://sqlbolt.com/',
    topics: ['Table Schema', 'JOIN Operations', 'GROUP BY & HAVING', 'Subqueries'],
    order: 1,
  },

  // ─── Python ────────────────────────────────────────────────────────────────
  {
    title: 'Python Essentials for Data & Backend Applications',
    skill: 'Python',
    description:
      'Master core Python programming: lists, dictionaries, list comprehensions, OOP in Python, and virtual environments.',
    difficulty: 'Beginner',
    resourceType: 'Tutorial',
    estimatedDuration: '1 hour',
    provider: 'Python Software Foundation',
    url: 'https://docs.python.org/3/tutorial/',
    topics: ['Data Structures', 'Functions & Scope', 'Modules', 'File I/O'],
    order: 1,
  },

  // ─── Java ──────────────────────────────────────────────────────────────────
  {
    title: 'Object-Oriented Programming with Java',
    skill: 'Java',
    description:
      'Understand encapsulation, inheritance, polymorphism, abstract classes, interfaces, and collection frameworks in Java.',
    difficulty: 'Intermediate',
    resourceType: 'Course',
    estimatedDuration: '2 hours',
    provider: 'Portal Academy',
    url: 'https://dev.java/learn/',
    topics: ['Encapsulation', 'Polymorphism', 'Interfaces', 'Collections Framework'],
    order: 1,
  },
];

const seedLearning = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/academia_portal';

  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected for seeding.');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of learningData) {
      const existing = await LearningResource.findOne({ title: item.title });
      if (!existing) {
        await LearningResource.create(item);
        insertedCount++;
      } else {
        await LearningResource.updateOne({ _id: existing._id }, { $set: item });
        updatedCount++;
      }
    }

    console.log(`\nSeed completed successfully:`);
    console.log(`- Inserted new: ${insertedCount}`);
    console.log(`- Updated existing: ${updatedCount}`);
    console.log(`- Total resources in catalog: ${learningData.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedLearning();
}

module.exports = { learningData, seedLearning };
