// src/middleware/auth.js
// JWT Authentication Middleware

const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/helpers');

/**
 * Authenticate JWT token from Authorization header
 * Adds decoded user data to req.user
 */
async function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        errorResponse('UNAUTHORIZED', 'No token provided. Please login.')
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = verifyAccessToken(token);

    // Add user data to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'vendor',
    };

    next();
  } catch (error) {
    if (error.message === 'ACCESS_TOKEN_EXPIRED') {
      return res.status(401).json(
        errorResponse('TOKEN_EXPIRED', 'Access token has expired. Please refresh your token.')
      );
    }

    return res.status(401).json(
      errorResponse('INVALID_TOKEN', 'Invalid access token. Please login again.')
    );
  }
}

/**
 * Optional authentication - doesn't fail if token is missing
 * Used for endpoints that work both with/without auth
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role || 'vendor',
      };
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user data
    next();
  }
}

module.exports = {
  authenticate,
  optionalAuth,
};
