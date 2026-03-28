// src/middleware/rateLimit.js
// Rate Limiting Middleware using express-rate-limit (+ Redis if available)

const rateLimit = require('express-rate-limit');
const redisClient = require('../config/redis');
const { errorResponse } = require('../utils/helpers');

// Use Redis store if available, otherwise use in-memory store
let storeConfig = {};
if (redisClient) {
  const RedisStore = require('rate-limit-redis').default;
  storeConfig = {
    store: new RedisStore({
      // @ts-ignore - Known issue with types
      client: redisClient,
      prefix: 'rl:',
    }),
  };
} else {
  console.log('⚠️  Using in-memory rate limiting (not recommended for production)');
}

/**
 * Rate limiter for login attempts
 * Max 5 attempts per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  ...storeConfig,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: errorResponse(
    'TOO_MANY_REQUESTS',
    'Too many login attempts. Please try again after 15 minutes.'
  ),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for cart uploads
 * Max 1 upload per hour per user
 */
const cartUploadLimiter = rateLimit({
  ...storeConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1, // 1 upload
  message: errorResponse(
    'UPLOAD_LIMIT_EXCEEDED',
    'Cart upload limit: 1 per hour. Please try again later.'
  ),
  standardHeaders: true,
  legacyHeaders: false,
  // Use user ID as key (requires authentication middleware before this)
  keyGenerator: (req) => {
    return req.user ? req.user.userId : req.ip;
  },
});

/**
 * General API rate limiter
 * Max 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  ...storeConfig,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  message: errorResponse(
    'TOO_MANY_REQUESTS',
    'Too many requests. Please slow down.'
  ),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * OTP sending rate limiter
 * Max 3 OTP requests per hour per phone number
 */
const otpLimiter = rateLimit({
  ...storeConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 OTP requests
  message: errorResponse(
    'OTP_LIMIT_EXCEEDED',
    'Too many OTP requests. Please try again after 1 hour.'
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body.phone || req.ip;
  },
});

module.exports = {
  loginLimiter,
  cartUploadLimiter,
  apiLimiter,
  otpLimiter,
};
