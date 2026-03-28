// src/routes/auth.routes.js
// Authentication Routes

const express = require('express');
const router = express.Router();

const {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  sendOTPController,
  verifyOTPController,
  resetPasswordController,
} = require('../controllers/authController');

const { validateBody, schemas } = require('../middleware/validation');
const { loginLimiter, otpLimiter } = require('../middleware/rateLimit');

// POST /v1/auth/register - Register new vendor
router.post(
  '/register',
  validateBody(schemas.registerSchema),
  registerController
);

// POST /v1/auth/login - Login user
router.post(
  '/login',
  loginLimiter, // Rate limit: 5 attempts per 15 minutes
  validateBody(schemas.loginSchema),
  loginController
);

// POST /v1/auth/logout - Logout user
router.post('/logout', logoutController);

// POST /v1/auth/refresh-token - Refresh access token
router.post('/refresh-token', refreshTokenController);

// POST /v1/auth/send-otp - Send OTP to phone
router.post(
  '/send-otp',
  otpLimiter, // Rate limit: 3 OTP per hour
  validateBody(schemas.sendOTPSchema),
  sendOTPController
);

// POST /v1/auth/verify-otp - Verify OTP code
router.post(
  '/verify-otp',
  validateBody(schemas.verifyOTPSchema),
  verifyOTPController
);

// POST /v1/auth/reset-password - Reset password with token
router.post(
  '/reset-password',
  validateBody(schemas.resetPasswordSchema),
  resetPasswordController
);

module.exports = router;
