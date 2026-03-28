// src/utils/jwt.js
// JWT Token Generation and Verification

const jwt = require('jsonwebtoken');

/**
 * Generate JWT Access Token
 * @param {Object} payload - Token payload (userId, email, role)
 * @returns {String} JWT token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
}

/**
 * Generate JWT Refresh Token
 * @param {Object} payload - Token payload (userId)
 * @returns {String} JWT refresh token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
}

/**
 * Verify JWT Access Token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('ACCESS_TOKEN_EXPIRED');
    }
    throw new Error('INVALID_ACCESS_TOKEN');
  }
}

/**
 * Verify JWT Refresh Token
 * @param {String} token - JWT refresh token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }
    throw new Error('INVALID_REFRESH_TOKEN');
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
