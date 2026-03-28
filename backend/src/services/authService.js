// src/services/authService.js
// Authentication Business Logic

const prisma = require('../config/database');
const { hashPassword, comparePassword, generateOTP, sanitizeUser } = require('../utils/helpers');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { AppError } = require('../middleware/errorHandler');
const { OTP_EXPIRY_MINUTES, OTP_MAX_ATTEMPTS } = require('../config/constants');

/**
 * Register new vendor
 */
async function register({ username, email, phone, password }) {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }
    if (existingUser.phone === phone) {
      throw new AppError('Phone number already registered', 409, 'PHONE_EXISTS');
    }
    if (existingUser.username === username) {
      throw new AppError('Username already taken', 409, 'USERNAME_EXISTS');
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    },
  });

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: 'vendor',
  });

  const refreshToken = generateRefreshToken({ userId: user.id });

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt,
    },
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

/**
 * Login user
 */
async function login({ email, password, remember = false }) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Update last login timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: 'vendor',
  });

  const refreshToken = generateRefreshToken({ userId: user.id });

  // Store refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (remember ? 30 : 7)); // 30 days if remember, else 7 days

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt,
    },
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

/**
 * Logout user (invalidate refresh token)
 */
async function logout(refreshToken) {
  await prisma.session.deleteMany({
    where: { refreshToken },
  });

  return true;
}

/**
 * Refresh access token
 */
async function refreshAccessToken(refreshToken) {
  // Find session with this refresh token
  const session = await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: true },
  });

  if (!session) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  // Check if token expired
  if (new Date() > session.expiresAt) {
    // Delete expired session
    await prisma.session.delete({ where: { id: session.id } });
    throw new AppError('Refresh token expired', 401, 'REFRESH_TOKEN_EXPIRED');
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken({
    userId: session.user.id,
    email: session.user.email,
    role: 'vendor',
  });

  const newRefreshToken = generateRefreshToken({ userId: session.user.id });

  // Update session with new refresh token (token rotation)
  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 30);

  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: newRefreshToken,
      expiresAt: newExpiresAt,
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

/**
 * Send OTP to phone number
 */
async function sendOTP({ phone, type = 'PASSWORD_RESET' }) {
  // Generate 6-digit OTP
  const code = generateOTP();

  // Calculate expiry time (10 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES || 10);

  // Delete any existing OTPs for this phone and type
  await prisma.oTPCode.deleteMany({
    where: { phone, type },
  });

  // Create new OTP
  await prisma.oTPCode.create({
    data: {
      phone,
      code,
      type,
      expiresAt,
    },
  });

  // TODO: Send SMS via Twilio
  // For now, log it (in production, integrate Twilio)
  console.log(`📱 OTP for ${phone}: ${code} (expires in ${OTP_EXPIRY_MINUTES} min)`);

  return {
    success: true,
    expiresAt,
    // In development, return the OTP (remove in production!)
    ...(process.env.NODE_ENV === 'development' && { code }),
  };
}

/**
 * Verify OTP
 */
async function verifyOTP({ phone, code }) {
  // Find OTP
  const otpRecord = await prisma.oTPCode.findFirst({
    where: {
      phone,
      code,
      verified: false,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    throw new AppError('Invalid or expired OTP', 400, 'INVALID_OTP');
  }

  // Check if expired
  if (new Date() > otpRecord.expiresAt) {
    await prisma.oTPCode.delete({ where: { id: otpRecord.id } });
    throw new AppError('OTP has expired', 400, 'OTP_EXPIRED');
  }

  // Check max attempts
  if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
    await prisma.oTPCode.delete({ where: { id: otpRecord.id } });
    throw new AppError('Too many verification attempts', 429, 'TOO_MANY_ATTEMPTS');
  }

  // Increment attempts
  await prisma.oTPCode.update({
    where: { id: otpRecord.id },
    data: { attempts: otpRecord.attempts + 1 },
  });

  // Mark as verified
  await prisma.oTPCode.update({
    where: { id: otpRecord.id },
    data: { verified: true },
  });

  // Generate reset token (valid for 15 minutes)
  const resetToken = generateAccessToken({ phone, purpose: 'password-reset' });

  return {
    success: true,
    resetToken,
  };
}

/**
 * Reset password with reset token
 */
async function resetPassword({ resetToken, newPassword }) {
  // Verify reset token
  const { verifyAccessToken } = require('../utils/jwt');
  let decoded;

  try {
    decoded = verifyAccessToken(resetToken);
  } catch (error) {
    throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
  }

  if (decoded.purpose !== 'password-reset') {
    throw new AppError('Invalid reset token', 400, 'INVALID_RESET_TOKEN');
  }

  // Find user by phone
  const user = await prisma.user.findUnique({
    where: { phone: decoded.phone },
  });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  // Delete all sessions for this user (force re-login)
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  // Delete all OTPs for this user
  await prisma.oTPCode.deleteMany({
    where: { phone: decoded.phone },
  });

  return {
    success: true,
    message: 'Password reset successfully',
  };
}

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  sendOTP,
  verifyOTP,
  resetPassword,
};
