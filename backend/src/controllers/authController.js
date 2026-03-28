// src/controllers/authController.js
// Authentication HTTP Request Handlers

const authService = require('../services/authService');
const { successResponse } = require('../utils/helpers');

/**
 * POST /v1/auth/register
 * Register new vendor
 */
async function registerController(req, res, next) {
  try {
    const { username, email, phone, password } = req.body;

    const result = await authService.register({ username, email, phone, password });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json(
      successResponse(
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Registration successful'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /v1/auth/login
 * Login user
 */
async function loginController(req, res, next) {
  try {
    const { email, password, remember } = req.body;

    const result = await authService.login({ email, password, remember });

    // Set refresh token in HTTP-only cookie
    const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    });

    res.status(200).json(
      successResponse(
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /v1/auth/logout
 * Logout user
 */
async function logoutController(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    // Clear cookie
    res.clearCookie('refreshToken');

    res.status(200).json(
      successResponse(null, 'Logout successful')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /v1/auth/refresh-token
 * Refresh access token
 */
async function refreshTokenController(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token provided' },
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    // Set new refresh token in cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
      successResponse(
        { accessToken: result.accessToken },
        'Token refreshed successfully'
      )
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /v1/auth/send-otp
 * Send OTP to phone number
 */
async function sendOTPController(req, res, next) {
  try {
    const { phone } = req.body;

    const result = await authService.sendOTP({ phone, type: 'PASSWORD_RESET' });

    res.status(200).json(
      successResponse(result, 'OTP sent successfully')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /v1/auth/verify-otp
 * Verify OTP code
 */
async function verifyOTPController(req, res, next) {
  try {
    const { phone, code } = req.body;

    const result = await authService.verifyOTP({ phone, code });

    res.status(200).json(
      successResponse(result, 'OTP verified successfully')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /v1/auth/reset-password
 * Reset password with reset token
 */
async function resetPasswordController(req, res, next) {
  try {
    const { resetToken, newPassword } = req.body;

    const result = await authService.resetPassword({ resetToken, newPassword });

    res.status(200).json(
      successResponse(result, 'Password reset successfully')
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  sendOTPController,
  verifyOTPController,
  resetPasswordController,
};
