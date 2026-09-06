const mongoose = require('mongoose');
const { scoreAttempt } = require('../services/assessmentService');

// Static assessment definitions with stable ObjectIds
const rawAssessments = [
  {
    _id: new mongoose.Types.ObjectId('65b000000000000000000001'),
    title: 'Java Fundamentals',
    skill: 'Java',
    description: 'Tests understanding of core Java concepts including OOP principles, data types, control flow, and basic data structures.',
    difficulty: 'Beginner',
    durationMinutes: 15,
    questions: [
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000101'),
        questionText: 'Which keyword is used to define a class in Java?',
        options: ['define', 'class', 'struct', 'object'],
        correctAnswer: 1,
        explanation: 'The "class" keyword is used to define a class in Java.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000102'),
        questionText: 'What is the default value of an int variable in Java?',
        options: ['null', '1', '0', '-1'],
        correctAnswer: 2,
        explanation: 'Primitive int fields are initialized to 0 by default in Java.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000103'),
        questionText: 'Which of the following is NOT a primitive data type in Java?',
        options: ['int', 'boolean', 'String', 'char'],
        correctAnswer: 2,
        explanation: 'String is a class (reference type), not a primitive data type.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000104'),
        questionText: 'What does JVM stand for?',
        options: ['Java Variable Machine', 'Java Virtual Machine', 'Java Verified Module', 'Java Visual Manager'],
        correctAnswer: 1,
        explanation: 'JVM stands for Java Virtual Machine — it executes Java bytecode.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000105'),
        questionText: 'Which OOP concept allows a class to inherit properties from another class?',
        options: ['Encapsulation', 'Polymorphism', 'Abstraction', 'Inheritance'],
        correctAnswer: 3,
        explanation: 'Inheritance allows a subclass to inherit fields and methods from a superclass.',
        points: 1,
        difficulty: 'Beginner'
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId('65b000000000000000000002'),
    title: 'JavaScript Fundamentals',
    skill: 'JavaScript',
    description: 'Covers core JavaScript concepts: variables, data types, functions, closures, async patterns, and DOM basics.',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    questions: [
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000201'),
        questionText: 'Which keyword declares a block-scoped variable in JavaScript?',
        options: ['var', 'let', 'def', 'dim'],
        correctAnswer: 1,
        explanation: '"let" declares a block-scoped variable. "var" is function-scoped.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000202'),
        questionText: 'What does "===" check in JavaScript?',
        options: ['Only value equality', 'Only type equality', 'Both value and type equality', 'Reference equality only'],
        correctAnswer: 2,
        explanation: '=== (strict equality) checks both value and type without type coercion.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000203'),
        questionText: 'Which method adds an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0,
        explanation: 'push() adds one or more elements to the end of an array.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000204'),
        questionText: 'What is a closure in JavaScript?',
        options: [
          'A way to close the browser',
          'A function that remembers its lexical scope even when executed outside that scope',
          'A method to terminate a loop',
          'A type of conditional statement'
        ],
        correctAnswer: 1,
        explanation: 'A closure is a function bundled together with its lexical scope.',
        points: 1,
        difficulty: 'Intermediate'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000205'),
        questionText: 'What does "async/await" help with in JavaScript?',
        options: [
          'Synchronous loops',
          'Writing asynchronous code in a synchronous style',
          'Declaring global variables',
          'Handling CSS animations'
        ],
        correctAnswer: 1,
        explanation: 'async/await makes asynchronous (Promise-based) code easier to read and write.',
        points: 1,
        difficulty: 'Beginner'
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId('65b000000000000000000003'),
    title: 'SQL Fundamentals',
    skill: 'SQL',
    description: 'Evaluates knowledge of SQL basics: SELECT queries, WHERE clauses, JOINs, aggregation, and database concepts.',
    difficulty: 'Beginner',
    durationMinutes: 15,
    questions: [
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000301'),
        questionText: 'Which SQL clause is used to filter rows in a query?',
        options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'],
        correctAnswer: 2,
        explanation: 'WHERE filters individual rows before grouping or aggregation.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000302'),
        questionText: 'What does SELECT * FROM students; return?',
        options: ['Only student IDs', 'All columns and rows from the students table', 'A count of students', 'Only the first row'],
        correctAnswer: 1,
        explanation: 'SELECT * returns all columns, and without WHERE it returns all rows.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000303'),
        questionText: 'Which JOIN returns only matching rows from both tables?',
        options: ['LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'INNER JOIN'],
        correctAnswer: 3,
        explanation: 'INNER JOIN returns rows that have matching values in both tables.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000304'),
        questionText: 'What does PRIMARY KEY do in a table?',
        options: [
          'Allows duplicate values',
          'Uniquely identifies each row and prevents NULLs',
          'Automatically sorts the table',
          'Creates a foreign key relationship'
        ],
        correctAnswer: 1,
        explanation: 'A PRIMARY KEY uniquely identifies each record and cannot be NULL or duplicate.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000305'),
        questionText: 'Which SQL statement is used to add a new row to a table?',
        options: ['UPDATE', 'INSERT INTO', 'ADD ROW', 'CREATE'],
        correctAnswer: 1,
        explanation: 'INSERT INTO is used to add new rows/records to a table.',
        points: 1,
        difficulty: 'Beginner'
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId('65b000000000000000000004'),
    title: 'React Fundamentals',
    skill: 'React',
    description: 'Tests understanding of React core concepts: components, props, state, hooks, and the virtual DOM.',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    questions: [
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000401'),
        questionText: 'What is JSX in React?',
        options: [
          'A JavaScript extension for type checking',
          'A syntax extension that allows writing HTML-like code in JavaScript',
          'A CSS-in-JS library',
          'A testing framework'
        ],
        correctAnswer: 1,
        explanation: 'JSX is a syntax extension to JavaScript that looks like HTML and gets compiled to React.createElement calls.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000402'),
        questionText: 'Which hook is used to manage local state in a functional component?',
        options: ['useEffect', 'useContext', 'useState', 'useRef'],
        correctAnswer: 2,
        explanation: 'useState is the primary hook for managing local component state in functional components.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000403'),
        questionText: 'What does the useEffect hook do?',
        options: [
          'Manages state',
          'Runs side effects after rendering (e.g., data fetching, subscriptions)',
          'Creates context',
          'Memoizes values'
        ],
        correctAnswer: 1,
        explanation: 'useEffect runs after each render and is used for side effects like API calls or subscriptions.',
        points: 1,
        difficulty: 'Intermediate'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000404'),
        questionText: 'How do you pass data from a parent component to a child component in React?',
        options: ['Through state', 'Through props', 'Through context only', 'Through the DOM'],
        correctAnswer: 1,
        explanation: 'Props (properties) are the standard way to pass data from parent to child components.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000405'),
        questionText: 'What is the virtual DOM in React?',
        options: [
          'A database for React state',
          'The real DOM of the browser',
          'A lightweight in-memory representation of the actual DOM',
          'A server-side rendering technique'
        ],
        correctAnswer: 2,
        explanation: 'React maintains a virtual DOM in memory to efficiently diff and update the actual browser DOM.',
        points: 1,
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId('65b000000000000000000005'),
    title: 'Git Version Control',
    skill: 'Git',
    description: 'Evaluates proficiency with Git version control: branches, commits, merges, remotes, and pull requests.',
    difficulty: 'Beginner',
    durationMinutes: 15,
    questions: [
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000501'),
        questionText: 'Which command initializes a new Git repository in the current folder?',
        options: ['git start', 'git create', 'git init', 'git new'],
        correctAnswer: 2,
        explanation: 'git init creates a new Git repository in the current directory.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000502'),
        questionText: 'Which command stages all modified and new files for commit?',
        options: ['git stage all', 'git add .', 'git commit -a', 'git push'],
        correctAnswer: 1,
        explanation: 'git add . stages all changes in the current directory tree.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000503'),
        questionText: 'Which command creates and switches to a new branch in Git?',
        options: ['git branch new <name>', 'git checkout -b <name>', 'git switch new <name>', 'git fork <name>'],
        correctAnswer: 1,
        explanation: 'git checkout -b <name> (or git switch -c <name>) creates and switches to the new branch.',
        points: 1,
        difficulty: 'Beginner'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000504'),
        questionText: 'What is a merge conflict in Git?',
        options: [
          'A corrupted git repository',
          'Competing changes to the same line of code in different branches that cannot be automatically resolved',
          'An invalid git credentials error',
          'A network error during git push'
        ],
        correctAnswer: 1,
        explanation: 'A merge conflict occurs when two branches modify the same line differently.',
        points: 1,
        difficulty: 'Intermediate'
      },
      {
        _id: new mongoose.Types.ObjectId('65b000000000000000000505'),
        questionText: 'Which command downloads commits from a remote and merges them into the current branch?',
        options: ['git fetch', 'git pull', 'git sync', 'git download'],
        correctAnswer: 1,
        explanation: 'git pull fetches changes from the remote tracking branch and merges them into the current local branch.',
        points: 1,
        difficulty: 'Beginner'
      }
    ]
  }
];

// In-memory attempt store
const mockAttemptsMap = new Map();

// Pre-seed demo attempts for student Aarav Sharma (65a000000000000000000001)
const demoStudentId = '65a000000000000000000001';
const preSeededAttempt1 = {
  _id: new mongoose.Types.ObjectId('65d000000000000000000001'),
  student: new mongoose.Types.ObjectId(demoStudentId),
  assessment: rawAssessments[3], // React Fundamentals
  status: 'completed',
  score: 4,
  totalScore: 5,
  percentage: 80,
  skillLevel: 'Advanced',
  startedAt: new Date(Date.now() - 86400000 * 2),
  submittedAt: new Date(Date.now() - 86400000 * 2 + 1000 * 600),
  timeTakenSeconds: 600,
  answers: [
    { questionId: rawAssessments[3].questions[0]._id, selectedOption: 1, isCorrect: true, pointsEarned: 1 },
    { questionId: rawAssessments[3].questions[1]._id, selectedOption: 2, isCorrect: true, pointsEarned: 1 },
    { questionId: rawAssessments[3].questions[2]._id, selectedOption: 1, isCorrect: true, pointsEarned: 1 },
    { questionId: rawAssessments[3].questions[3]._id, selectedOption: 1, isCorrect: true, pointsEarned: 1 },
    { questionId: rawAssessments[3].questions[4]._id, selectedOption: 0, isCorrect: false, pointsEarned: 0 }
  ]
};

const preSeededAttempt2 = {
  _id: new mongoose.Types.ObjectId('65d000000000000000000002'),
  student: new mongoose.Types.ObjectId(demoStudentId),
  assessment: rawAssessments[1], // JavaScript Fundamentals
  status: 'completed',
  score: 5,
  totalScore: 5,
  percentage: 100,
  skillLevel: 'Expert',
  startedAt: new Date(Date.now() - 86400000 * 5),
  submittedAt: new Date(Date.now() - 86400000 * 5 + 1000 * 540),
  timeTakenSeconds: 540,
  answers: [
    { questionId: rawAssessments[1].questions[0]._id, selectedOption: 1, isCorrect: true, pointsEarned: 1 },
    { questionId: rawAssessments[1].questions[1]._id, selectedOption: 2, isCorrect: true, pointsEarned: 1 },
    { questionId: rawAssessments[1].questions[2]._id, selectedOption: 0, isCorrect: true, pointsEarned: 1 },
    { questionId: rawAssessments[1].questions[3]._id, selectedOption: 1, isCorrect: true, pointsEarned: 1 },
    { questionId: rawAssessments[1].questions[4]._id, selectedOption: 1, isCorrect: true, pointsEarned: 1 }
  ]
};

mockAttemptsMap.set(preSeededAttempt1._id.toString(), preSeededAttempt1);
mockAttemptsMap.set(preSeededAttempt2._id.toString(), preSeededAttempt2);

function getMockAssessments() {
  return rawAssessments.map((a) => ({
    _id: a._id,
    title: a.title,
    skill: a.skill,
    description: a.description,
    difficulty: a.difficulty,
    durationMinutes: a.durationMinutes,
    questions: a.questions.map((q) => q._id),
    questionCount: a.questions.length,
    createdAt: new Date()
  }));
}

function getMockAssessmentById(id) {
  const found = rawAssessments.find((a) => a._id.toString() === id.toString());
  if (!found) return null;
  return {
    _id: found._id,
    title: found.title,
    skill: found.skill,
    description: found.description,
    difficulty: found.difficulty,
    durationMinutes: found.durationMinutes,
    questions: found.questions.map((q) => q._id),
    questionCount: found.questions.length,
    createdAt: new Date()
  };
}

function startMockAttempt(assessmentId, studentId) {
  const assessment = rawAssessments.find((a) => a._id.toString() === assessmentId.toString());
  if (!assessment) return null;

  // Check for existing in-progress attempt
  for (const att of mockAttemptsMap.values()) {
    if (
      att.student.toString() === studentId.toString() &&
      att.assessment._id.toString() === assessment._id.toString() &&
      att.status === 'in-progress'
    ) {
      const safeQuestions = assessment.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        points: q.points,
        difficulty: q.difficulty
      }));
      return {
        attempt: att,
        questions: safeQuestions,
        assessment: {
          _id: assessment._id,
          title: assessment.title,
          skill: assessment.skill,
          durationMinutes: assessment.durationMinutes
        },
        resumed: true
      };
    }
  }

  const attemptId = new mongoose.Types.ObjectId();
  const newAttempt = {
    _id: attemptId,
    student: new mongoose.Types.ObjectId(studentId),
    assessment: {
      _id: assessment._id,
      title: assessment.title,
      skill: assessment.skill,
      difficulty: assessment.difficulty,
      durationMinutes: assessment.durationMinutes
    },
    answers: [],
    status: 'in-progress',
    startedAt: new Date()
  };

  mockAttemptsMap.set(attemptId.toString(), newAttempt);

  const safeQuestions = assessment.questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options,
    points: q.points,
    difficulty: q.difficulty
  }));

  return {
    attempt: newAttempt,
    questions: safeQuestions,
    assessment: {
      _id: assessment._id,
      title: assessment.title,
      skill: assessment.skill,
      durationMinutes: assessment.durationMinutes
    },
    resumed: false
  };
}

function submitMockAttempt(attemptId, studentId, submittedAnswers, timeTakenSeconds) {
  const attempt = mockAttemptsMap.get(attemptId.toString());
  if (!attempt) return { error: 'Assessment attempt not found.', code: 404 };
  if (attempt.student.toString() !== studentId.toString()) return { error: 'Forbidden.', code: 403 };
  if (attempt.status !== 'in-progress') {
    return { error: 'This attempt has already been submitted.', code: 400 };
  }

  const assessment = rawAssessments.find((a) => a._id.toString() === attempt.assessment._id.toString());
  if (!assessment) return { error: 'Assessment not found.', code: 404 };

  const { score, totalScore, percentage, skillLevel, answers } = scoreAttempt(
    assessment.questions,
    submittedAnswers || []
  );

  attempt.answers = answers;
  attempt.score = score;
  attempt.totalScore = totalScore;
  attempt.percentage = percentage;
  attempt.skillLevel = skillLevel;
  attempt.status = 'completed';
  attempt.submittedAt = new Date();
  attempt.timeTakenSeconds = timeTakenSeconds || 300;

  return {
    success: true,
    data: {
      attemptId: attempt._id,
      score,
      totalScore,
      percentage,
      skillLevel,
      submittedAt: attempt.submittedAt,
      assessmentId: assessment._id,
      assessmentTitle: assessment.title,
      skill: assessment.skill
    }
  };
}

function getMockMyAttempts(studentId) {
  const list = [];
  for (const att of mockAttemptsMap.values()) {
    if (att.student.toString() === studentId.toString()) {
      list.push({
        _id: att._id,
        assessment: att.assessment,
        score: att.score,
        totalScore: att.totalScore,
        percentage: att.percentage,
        skillLevel: att.skillLevel,
        status: att.status,
        startedAt: att.startedAt,
        submittedAt: att.submittedAt
      });
    }
  }
  list.sort((a, b) => new Date(b.startedAt || 0) - new Date(a.startedAt || 0));
  return list;
}

function getMockAttemptById(attemptId, studentId) {
  const attempt = mockAttemptsMap.get(attemptId.toString());
  if (!attempt) return null;
  if (attempt.student.toString() !== studentId.toString()) return null;

  const assessment = rawAssessments.find((a) => a._id.toString() === attempt.assessment._id.toString());
  const questionReview = (assessment?.questions || []).map((q) => {
    const answerRecord = (attempt.answers || []).find(
      (a) => a.questionId && a.questionId.toString() === q._id.toString()
    );
    return {
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      selectedOption: answerRecord ? answerRecord.selectedOption : null,
      isCorrect: answerRecord ? answerRecord.isCorrect : false,
      pointsEarned: answerRecord ? answerRecord.pointsEarned : 0,
      points: q.points
    };
  });

  return {
    attempt: {
      _id: attempt._id,
      assessment: attempt.assessment,
      score: attempt.score,
      totalScore: attempt.totalScore,
      percentage: attempt.percentage,
      skillLevel: attempt.skillLevel,
      status: attempt.status,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      timeTakenSeconds: attempt.timeTakenSeconds
    },
    questionReview
  };
}

module.exports = {
  rawAssessments,
  getMockAssessments,
  getMockAssessmentById,
  startMockAttempt,
  submitMockAttempt,
  getMockMyAttempts,
  getMockAttemptById
};
