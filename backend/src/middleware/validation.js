// src/middleware/validation.js
// Request Validation Middleware using Zod

const { z } = require('zod');
const { errorResponse } = require('../utils/helpers');

/**
 * Validate request body against Zod schema
 * @param {z.ZodSchema} schema - Zod validation schema
 * @returns {Function} Express middleware
 */
function validateBody(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated; // Replace body with validated data
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json(
          errorResponse('VALIDATION_ERROR', 'Invalid request data', details)
        );
      }

      next(error);
    }
  };
}

/**
 * Validate request query parameters against Zod schema
 * @param {z.ZodSchema} schema - Zod validation schema
 * @returns {Function} Express middleware
 */
function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json(
          errorResponse('VALIDATION_ERROR', 'Invalid query parameters', details)
        );
      }

      next(error);
    }
  };
}

/**
 * Validate request params against Zod schema
 * @param {z.ZodSchema} schema - Zod validation schema
 * @returns {Function} Express middleware
 */
function validateParams(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json(
          errorResponse('VALIDATION_ERROR', 'Invalid URL parameters', details)
        );
      }

      next(error);
    }
  };
}

// Common Validation Schemas
const schemas = {
  // Auth Schemas
  registerSchema: z.object({
    username: z.string().min(3).max(30),
    email: z.string().email('Invalid email format'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),

  loginSchema: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
    remember: z.boolean().optional(),
  }),

  sendOTPSchema: z.object({
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  }),

  verifyOTPSchema: z.object({
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
    code: z.string().length(6, 'OTP must be 6 digits'),
  }),

  resetPasswordSchema: z.object({
    resetToken: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),

  // Profile Schemas
  updateProfileSchema: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z.string().regex(/^[0-9]{10}$/).optional(),
    email: z.string().email().optional(),
    dob: z.string().optional(),
    category: z.enum(['Grocery', 'Food', 'Vegetables', 'Clothes']).optional(),
  }),

  // Order Schemas
  updateOrderStatusSchema: z.object({
    status: z.enum(['ACCEPTED', 'DELIVERED', 'CANCELLED']),
  }),

  // Location Schemas
  updateLocationSchema: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
    city: z.string().optional(),
  }),

  // Support Schemas
  createTicketSchema: z.object({
    subject: z.string().max(200).optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  }),
};

module.exports = {
  validateBody,
  validateQuery,
  validateParams,
  schemas,
};
