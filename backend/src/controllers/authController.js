const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const ALLOWED_ROLES = ['student', 'industry', 'academician', 'institution', 'admin'];
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

// In-memory fallback user repository for offline/development mode when MongoDB daemon is not running
const inMemoryUserStore = new Map();

// Seed standard demo users with hashed passwords for seamless offline preview
const seedDemoUsers = async () => {
  const hash = await bcrypt.hash('Password123!', 10);
  const demoUsers = [
    {
      _id: new mongoose.Types.ObjectId('65a000000000000000000001'),
      name: 'Aarav Sharma',
      email: 'aarav.student@academia.edu',
      password: hash,
      role: 'student',
      createdAt: new Date('2026-01-10T10:00:00.000Z'),
    },
    {
      _id: new mongoose.Types.ObjectId('65a000000000000000000002'),
      name: 'Priya Mehta',
      email: 'recruiter@nexiscloud.io',
      password: hash,
      role: 'industry',
      createdAt: new Date('2026-01-12T14:30:00.000Z'),
    },
    {
      _id: new mongoose.Types.ObjectId('65a000000000000000000003'),
      name: 'Dr. Ramesh Kulkarni',
      email: 'faculty@academia.edu',
      password: hash,
      role: 'academician',
      createdAt: new Date('2026-01-08T09:15:00.000Z'),
    },
    {
      _id: new mongoose.Types.ObjectId('65a000000000000000000004'),
      name: 'System Administrator',
      email: 'admin@academia.edu',
      password: hash,
      role: 'admin',
      createdAt: new Date('2026-01-01T08:00:00.000Z'),
    },
  ];

  for (const u of demoUsers) {
    if (!inMemoryUserStore.has(u.email)) {
      inMemoryUserStore.set(u.email, u);
    }
  }
};

seedDemoUsers();

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1. Input Validation
  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your full name.',
    });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email address.',
    });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  const selectedRole = (role || 'student').toLowerCase();
  if (!ALLOWED_ROLES.includes(selectedRole)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role '${role}'. Supported roles are: ${ALLOWED_ROLES.join(', ')}.`,
    });
  }

  try {
    let user;

    if (mongoose.connection.readyState === 1) {
      // 2. Check for Duplicate Email in MongoDB
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      // 3. Create User in MongoDB (password hashed in pre-save hook)
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: selectedRole,
      });
    } else {
      // Offline fallback: In-memory store
      const normalizedEmail = email.toLowerCase().trim();
      if (inMemoryUserStore.has(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = {
        _id: new mongoose.Types.ObjectId(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: selectedRole,
      };
      inMemoryUserStore.set(normalizedEmail, user);
    }

    // 4. Issue JWT
    const token = generateToken({
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * Log in an existing user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Input Validation
  if (!email || !email.trim() || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
    });
  }

  try {
    let user;
    let isMatch = false;

    if (mongoose.connection.readyState === 1) {
      // Find User in MongoDB (explicitly select password for comparison)
      user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
      if (user) {
        isMatch = await user.matchPassword(password);
      }
    } else {
      // Offline fallback: In-memory store
      const normalizedEmail = email.toLowerCase().trim();
      user = inMemoryUserStore.get(normalizedEmail);
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Issue JWT
    const token = generateToken({
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
};

/**
 * Reusable test endpoint to verify role authorization
 * GET /api/auth/test-role/:role
 */
const testRoleAccess = (req, res) => {
  return res.status(200).json({
    success: true,
    message: `Authorization verified: user with role '${req.user.role}' successfully accessed protected route.`,
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
};

module.exports = {
  register,
  login,
  getMe,
  testRoleAccess,
  inMemoryUserStore,
};
