/**
 * Seed Script — Phase 4 Demo Assessments
 *
 * Creates 5 assessments with 10 MCQs each for development/demo purposes.
 * Run with: node src/data/seedAssessments.js
 *
 * This script is idempotent — it skips assessments that already exist
 * (matched by title). Safe to run multiple times.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');

// ─── Seed Data ────────────────────────────────────────────────────────────────

const assessmentData = [
  // ── 1. Java Fundamentals ────────────────────────────────────────────────────
  {
    title: 'Java Fundamentals',
    skill: 'Java',
    description:
      'Tests understanding of core Java concepts including OOP principles, data types, control flow, and basic data structures.',
    difficulty: 'Beginner',
    durationMinutes: 15,
    questions: [
      {
        questionText: 'Which keyword is used to define a class in Java?',
        options: ['define', 'class', 'struct', 'object'],
        correctAnswer: 1,
        explanation: 'The "class" keyword is used to define a class in Java.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is the default value of an int variable in Java?',
        options: ['null', '1', '0', '-1'],
        correctAnswer: 2,
        explanation: 'Primitive int fields are initialized to 0 by default in Java.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which of the following is NOT a primitive data type in Java?',
        options: ['int', 'boolean', 'String', 'char'],
        correctAnswer: 2,
        explanation: 'String is a class (reference type), not a primitive data type.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does JVM stand for?',
        options: ['Java Variable Machine', 'Java Virtual Machine', 'Java Verified Module', 'Java Visual Manager'],
        correctAnswer: 1,
        explanation: 'JVM stands for Java Virtual Machine — it executes Java bytecode.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which OOP concept allows a class to inherit properties from another class?',
        options: ['Encapsulation', 'Polymorphism', 'Abstraction', 'Inheritance'],
        correctAnswer: 3,
        explanation: 'Inheritance allows a subclass to inherit fields and methods from a superclass.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which data structure in Java follows the FIFO (First-In-First-Out) principle?',
        options: ['Stack', 'Queue', 'Array', 'Tree'],
        correctAnswer: 1,
        explanation: 'Queue follows First-In-First-Out — elements are added at the tail and removed from the head.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is the correct way to start the main method in Java?',
        options: [
          'public void main(String args)',
          'static void main(String[] args)',
          'public static void main(String[] args)',
          'void static main()',
        ],
        correctAnswer: 2,
        explanation: 'The entry point of a Java application is: public static void main(String[] args).',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which keyword prevents a class from being subclassed in Java?',
        options: ['static', 'abstract', 'final', 'private'],
        correctAnswer: 2,
        explanation: 'The "final" keyword on a class prevents it from being extended.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which of the following is used to handle exceptions in Java?',
        options: ['try-catch', 'if-else', 'switch-case', 'do-while'],
        correctAnswer: 0,
        explanation: 'try-catch blocks are used to handle exceptions in Java.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is the size of an int in Java?',
        options: ['8 bits', '16 bits', '32 bits', '64 bits'],
        correctAnswer: 2,
        explanation: 'An int in Java is always 32 bits (4 bytes), regardless of platform.',
        points: 1,
        difficulty: 'Beginner',
      },
    ],
  },

  // ── 2. JavaScript Fundamentals ──────────────────────────────────────────────
  {
    title: 'JavaScript Fundamentals',
    skill: 'JavaScript',
    description:
      'Covers core JavaScript concepts: variables, data types, functions, closures, async patterns, and DOM basics.',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    questions: [
      {
        questionText: 'Which keyword declares a block-scoped variable in JavaScript?',
        options: ['var', 'let', 'def', 'dim'],
        correctAnswer: 1,
        explanation: '"let" declares a block-scoped variable. "var" is function-scoped.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does "===" check in JavaScript?',
        options: ['Only value equality', 'Only type equality', 'Both value and type equality', 'Reference equality only'],
        correctAnswer: 2,
        explanation: '=== (strict equality) checks both value and type without type coercion.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which method adds an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0,
        explanation: 'push() adds one or more elements to the end of an array.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is a closure in JavaScript?',
        options: [
          'A way to close the browser',
          'A function that remembers its lexical scope even when executed outside that scope',
          'A method to terminate a loop',
          'A type of conditional statement',
        ],
        correctAnswer: 1,
        explanation: 'A closure is a function bundled together with its lexical scope.',
        points: 1,
        difficulty: 'Intermediate',
      },
      {
        questionText: 'Which of the following is NOT a JavaScript data type?',
        options: ['undefined', 'boolean', 'float', 'symbol'],
        correctAnswer: 2,
        explanation: 'JavaScript does not have a "float" type. Numbers are of type "number".',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does "async/await" help with in JavaScript?',
        options: [
          'Synchronous loops',
          'Writing asynchronous code in a synchronous style',
          'Declaring global variables',
          'Handling CSS animations',
        ],
        correctAnswer: 1,
        explanation: 'async/await makes asynchronous (Promise-based) code easier to read and write.',
        points: 1,
        difficulty: 'Intermediate',
      },
      {
        questionText: 'Which method is used to convert a JSON string to a JavaScript object?',
        options: ['JSON.stringify()', 'JSON.parse()', 'JSON.decode()', 'JSON.convert()'],
        correctAnswer: 1,
        explanation: 'JSON.parse() converts a JSON string into a JavaScript object.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is the output of: typeof null?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correctAnswer: 2,
        explanation: 'typeof null returns "object" — this is a known JavaScript quirk/bug.',
        points: 1,
        difficulty: 'Intermediate',
      },
      {
        questionText: 'Which array method creates a new array with elements that pass a test?',
        options: ['map()', 'filter()', 'reduce()', 'find()'],
        correctAnswer: 1,
        explanation: 'filter() creates a new array with elements that pass the provided test function.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is event bubbling in JavaScript?',
        options: [
          'When an event is created inside a bubble element',
          'When an event on a child propagates up to its parent elements',
          'When multiple events fire simultaneously',
          'A CSS animation triggered by JavaScript',
        ],
        correctAnswer: 1,
        explanation: 'Event bubbling means an event triggered on a child element propagates up through its ancestors.',
        points: 1,
        difficulty: 'Intermediate',
      },
    ],
  },

  // ── 3. SQL Fundamentals ─────────────────────────────────────────────────────
  {
    title: 'SQL Fundamentals',
    skill: 'SQL',
    description:
      'Evaluates knowledge of SQL basics: SELECT queries, WHERE clauses, JOINs, aggregation, and database concepts.',
    difficulty: 'Beginner',
    durationMinutes: 15,
    questions: [
      {
        questionText: 'Which SQL clause is used to filter rows in a query?',
        options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'],
        correctAnswer: 2,
        explanation: 'WHERE filters individual rows before grouping or aggregation.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does SELECT * FROM students; return?',
        options: ['Only student IDs', 'All columns and rows from the students table', 'A count of students', 'Only the first row'],
        correctAnswer: 1,
        explanation: 'SELECT * returns all columns, and without WHERE it returns all rows.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which JOIN returns only matching rows from both tables?',
        options: ['LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'INNER JOIN'],
        correctAnswer: 3,
        explanation: 'INNER JOIN returns rows that have matching values in both tables.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which aggregate function returns the total sum of a column?',
        options: ['COUNT()', 'AVG()', 'SUM()', 'MAX()'],
        correctAnswer: 2,
        explanation: 'SUM() calculates the total sum of a numeric column.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which keyword is used to sort query results in descending order?',
        options: ['ORDER BY ASC', 'ORDER BY DESC', 'SORT DESC', 'GROUP DESC'],
        correctAnswer: 1,
        explanation: 'ORDER BY column DESC sorts results from highest to lowest.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does PRIMARY KEY do in a table?',
        options: [
          'Allows duplicate values',
          'Uniquely identifies each row and prevents NULLs',
          'Automatically sorts the table',
          'Creates a foreign key relationship',
        ],
        correctAnswer: 1,
        explanation: 'A PRIMARY KEY uniquely identifies each record and cannot be NULL or duplicate.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which SQL statement is used to add a new row to a table?',
        options: ['UPDATE', 'INSERT INTO', 'ADD ROW', 'CREATE'],
        correctAnswer: 1,
        explanation: 'INSERT INTO is used to add new rows/records to a table.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does the HAVING clause do?',
        options: [
          'Filters rows before grouping',
          'Filters grouped results after GROUP BY',
          'Joins two tables',
          'Sorts results',
        ],
        correctAnswer: 1,
        explanation: 'HAVING filters the results of GROUP BY aggregations (like WHERE but for groups).',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is a FOREIGN KEY?',
        options: [
          'The primary key of the same table',
          'A key that is never used',
          'A field that references the PRIMARY KEY of another table',
          'An index used for sorting',
        ],
        correctAnswer: 2,
        explanation: 'A FOREIGN KEY creates a relational link between two tables.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which command removes all data from a table without deleting the table structure?',
        options: ['DROP TABLE', 'DELETE FROM', 'TRUNCATE TABLE', 'REMOVE DATA'],
        correctAnswer: 2,
        explanation: 'TRUNCATE TABLE removes all rows quickly while keeping the table structure intact.',
        points: 1,
        difficulty: 'Beginner',
      },
    ],
  },

  // ── 4. Python Fundamentals ──────────────────────────────────────────────────
  {
    title: 'Python Fundamentals',
    skill: 'Python',
    description:
      'Assesses core Python skills: syntax, data structures, functions, OOP basics, and standard library usage.',
    difficulty: 'Beginner',
    durationMinutes: 15,
    questions: [
      {
        questionText: 'Which of the following is the correct way to define a function in Python?',
        options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'],
        correctAnswer: 1,
        explanation: 'Python uses the "def" keyword to define functions.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is the output of len([1, 2, 3, 4])?',
        options: ['3', '4', '5', 'Error'],
        correctAnswer: 1,
        explanation: 'len() returns the number of elements. The list has 4 elements.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which Python data type is immutable and ordered?',
        options: ['List', 'Dictionary', 'Set', 'Tuple'],
        correctAnswer: 3,
        explanation: 'Tuples are ordered, indexed, and immutable (cannot be changed after creation).',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does the "self" parameter represent in a Python class method?',
        options: ['A global variable', 'The class itself', 'The current instance of the class', 'A static reference'],
        correctAnswer: 2,
        explanation: '"self" refers to the current instance of the class, allowing access to its attributes.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which operator is used for integer division in Python 3?',
        options: ['/', '//', '%', '**'],
        correctAnswer: 1,
        explanation: '// performs floor division (integer division) in Python 3.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'How do you start a comment in Python?',
        options: ['//', '/* */', '#', '--'],
        correctAnswer: 2,
        explanation: 'Python uses the # symbol to start a single-line comment.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which Python keyword is used to handle exceptions?',
        options: ['handle', 'catch', 'except', 'error'],
        correctAnswer: 2,
        explanation: 'Python uses try/except to handle exceptions.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does the range(5) function produce?',
        options: ['[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[0, 1, 2, 3, 4, 5]', '[1, 2, 3, 4]'],
        correctAnswer: 1,
        explanation: 'range(5) generates numbers from 0 to 4 (exclusive of 5).',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which of the following correctly creates a dictionary in Python?',
        options: ["['key': 'value']", "{'key': 'value'}", "('key', 'value')", '"key" = "value"'],
        correctAnswer: 1,
        explanation: 'Dictionaries use curly braces {} with key: value pairs.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is the purpose of the __init__ method in Python?',
        options: [
          'To delete an object',
          'To initialize attributes when a new object is created',
          'To import modules',
          'To end the program',
        ],
        correctAnswer: 1,
        explanation: '__init__ is the constructor method called automatically when a new object is instantiated.',
        points: 1,
        difficulty: 'Beginner',
      },
    ],
  },

  // ── 5. React Fundamentals ───────────────────────────────────────────────────
  {
    title: 'React Fundamentals',
    skill: 'React',
    description:
      'Tests understanding of React core concepts: components, props, state, hooks, and the virtual DOM.',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    questions: [
      {
        questionText: 'What is JSX in React?',
        options: [
          'A JavaScript extension for type checking',
          'A syntax extension that allows writing HTML-like code in JavaScript',
          'A CSS-in-JS library',
          'A testing framework',
        ],
        correctAnswer: 1,
        explanation: 'JSX is a syntax extension to JavaScript that looks like HTML and gets compiled to React.createElement calls.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'Which hook is used to manage local state in a functional component?',
        options: ['useEffect', 'useContext', 'useState', 'useRef'],
        correctAnswer: 2,
        explanation: 'useState is the primary hook for managing local component state in functional components.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does the useEffect hook do?',
        options: [
          'Manages state',
          'Runs side effects after rendering (e.g., data fetching, subscriptions)',
          'Creates context',
          'Memoizes values',
        ],
        correctAnswer: 1,
        explanation: 'useEffect runs after each render and is used for side effects like API calls or subscriptions.',
        points: 1,
        difficulty: 'Intermediate',
      },
      {
        questionText: 'How do you pass data from a parent component to a child component in React?',
        options: ['Through state', 'Through props', 'Through context only', 'Through the DOM'],
        correctAnswer: 1,
        explanation: 'Props (properties) are the standard way to pass data from parent to child components.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What is the virtual DOM in React?',
        options: [
          'A database for React state',
          'The real DOM of the browser',
          'A lightweight in-memory representation of the actual DOM',
          'A server-side rendering technique',
        ],
        correctAnswer: 2,
        explanation: 'React maintains a virtual DOM in memory to efficiently diff and update the actual browser DOM.',
        points: 1,
        difficulty: 'Intermediate',
      },
      {
        questionText: 'Which method is called when a React component is removed from the DOM?',
        options: ['componentDidMount', 'componentWillUnmount', 'componentDidUpdate', 'componentWillMount'],
        correctAnswer: 1,
        explanation: 'componentWillUnmount is called just before a component is removed from the DOM (cleanup).',
        points: 1,
        difficulty: 'Intermediate',
      },
      {
        questionText: 'What is the correct way to conditionally render content in JSX?',
        options: [
          'if-else inside JSX directly',
          'Using ternary operator: condition ? <A/> : <B/>',
          'Using switch statements inside JSX',
          'Only using CSS display:none',
        ],
        correctAnswer: 1,
        explanation: 'The ternary operator is the most common way to conditionally render JSX.',
        points: 1,
        difficulty: 'Beginner',
      },
      {
        questionText: 'What does React.memo do?',
        options: [
          'Stores component state permanently',
          'Prevents re-renders if props have not changed',
          'Memoizes asynchronous functions',
          'Creates a context provider',
        ],
        correctAnswer: 1,
        explanation: 'React.memo is a higher-order component that skips re-rendering if props are unchanged.',
        points: 1,
        difficulty: 'Intermediate',
      },
      {
        questionText: 'Which hook allows accessing context values in functional components?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 2,
        explanation: 'useContext accesses the nearest matching context value in a functional component.',
        points: 1,
        difficulty: 'Intermediate',
      },
      {
        questionText: 'What is the "key" prop used for in React lists?',
        options: [
          'Styling list items',
          'Helping React identify which items have changed for efficient re-rendering',
          'Defining the order of list items',
          'It is purely optional and has no effect',
        ],
        correctAnswer: 1,
        explanation: 'Keys help React efficiently identify and re-render only the changed list items.',
        points: 1,
        difficulty: 'Beginner',
      },
    ],
  },
];

// ─── Seed Function ────────────────────────────────────────────────────────────

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set in .env');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected.\n');

    let created = 0;
    let skipped = 0;

    for (const data of assessmentData) {
      // Check if assessment already exists (idempotent)
      const existing = await Assessment.findOne({ title: data.title });
      if (existing) {
        console.log(`SKIP  "${data.title}" — already exists`);
        skipped++;
        continue;
      }

      // Create questions first
      const questionDocs = await Question.insertMany(data.questions);
      console.log(`      Created ${questionDocs.length} questions for "${data.title}"`);

      // Create assessment referencing those questions
      await Assessment.create({
        title: data.title,
        skill: data.skill,
        description: data.description,
        difficulty: data.difficulty,
        durationMinutes: data.durationMinutes,
        questions: questionDocs.map((q) => q._id),
        isActive: true,
      });

      console.log(`✓     Created assessment: "${data.title}"`);
      created++;
    }

    console.log(`\nSeed complete. Created: ${created} | Skipped: ${skipped}`);
  } catch (err) {
    console.error('\nSeed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
