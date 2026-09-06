const jwt = require('jsonwebtoken');

/**
 * Generate a signed JSON Web Token
 * @param {Object} payload - Data to embed in token (userId, role)
 * @param {string} expiresIn - Token validity duration (default: 7d)
 * @returns {string} Signed JWT
 */
const generateToken = (payload, expiresIn = '7d') => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined.');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify and decode a JSON Web Token
 * @param {string} token - JWT string
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined.');
  }

  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
