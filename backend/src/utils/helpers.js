// src/utils/helpers.js
// Helper Utility Functions

const bcrypt = require('bcryptjs');
const { BCRYPT_ROUNDS, OTP_LENGTH } = require('../config/constants');

/**
 * Hash password using bcrypt
 * @param {String} password - Plain text password
 * @returns {Promise<String>} Hashed password
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare password with hash
 * @param {String} password - Plain text password
 * @param {String} hash - Hashed password
 * @returns {Promise<Boolean>} True if password matches
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate random OTP code
 * @param {Number} length - Length of OTP (default: 6)
 * @returns {String} OTP code
 */
function generateOTP(length = OTP_LENGTH) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Generate unique order ID
 * @param {Number} orderNumber - Sequential order number
 * @returns {String} Order ID in format "#ORD1001"
 */
function generateOrderId(orderNumber) {
  return `#ORD${String(orderNumber).padStart(4, '0')}`;
}

/**
 * Format success response
 * @param {*} data - Response data
 * @param {String} message - Success message
 * @returns {Object} Formatted success response
 */
function successResponse(data, message = 'Operation successful') {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format error response
 * @param {String} code - Error code
 * @param {String} message - Error message
 * @param {Array} details - Error details (optional)
 * @returns {Object} Formatted error response
 */
function errorResponse(code, message, details = null) {
  const response = {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  };

  if (details) {
    response.error.details = details;
  }

  return response;
}

/**
 * Validate email format
 * @param {String} email - Email address
 * @returns {Boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (10 digits)
 * @param {String} phone - Phone number
 * @returns {Boolean} True if valid phone format
 */
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize user object (remove sensitive fields)
 * @param {Object} user - User object
 * @returns {Object} Sanitized user object
 */
function sanitizeUser(user) {
  const { password, ...sanitized } = user;
  return sanitized;
}

/**
 * Calculate pagination metadata
 * @param {Number} total - Total items count
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
function paginationMeta(total, page, limit) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  generateOTP,
  generateOrderId,
  successResponse,
  errorResponse,
  isValidEmail,
  isValidPhone,
  sanitizeUser,
  paginationMeta,
};
