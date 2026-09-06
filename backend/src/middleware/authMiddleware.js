const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Authentication Middleware:
 * Validates Bearer token in Authorization header, decodes payload,
 * and attaches authenticated user context to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
  }

  try {
    const decoded = verifyToken(token);

    // If MongoDB is connected, verify user exists in DB
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.',
        });
      }
      req.user = user;
    } else {
      // Degraded / testing mode: construct user context from decoded JWT payload
      req.user = {
        _id: decoded.userId,
        role: decoded.role,
        name: decoded.name || 'Authenticated User',
        email: decoded.email || '',
      };
    }

    next();
  } catch (error) {
    let message = 'Invalid or expired authorization token.';
    if (error.name === 'TokenExpiredError') {
      message = 'Authorization token has expired. Please log in again.';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Malformed authorization token.';
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

module.exports = {
  protect,
};
