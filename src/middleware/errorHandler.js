// src/middleware/errorHandler.js
// Global Error Handling Middleware

const { errorResponse } = require('../utils/helpers');

/**
 * Global error handler middleware
 * Catches all errors and returns consistent error responses
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  // Prisma errors
  if (err.code && err.code.startsWith('P')) {
    return handlePrismaError(err, res);
  }

  // Validation errors (Zod)
  if (err.name === 'ZodError') {
    return res.status(400).json(
      errorResponse('VALIDATION_ERROR', 'Invalid request data', err.errors)
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      errorResponse('INVALID_TOKEN', 'Invalid authentication token')
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      errorResponse('TOKEN_EXPIRED', 'Authentication token has expired')
    );
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(
        errorResponse('FILE_TOO_LARGE', 'File size exceeds limit (10MB)')
      );
    }
    return res.status(400).json(
      errorResponse('UPLOAD_ERROR', err.message)
    );
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json(
      errorResponse(err.code || 'APPLICATION_ERROR', err.message)
    );
  }

  // Default internal server error
  res.status(500).json(
    errorResponse(
      'INTERNAL_SERVER_ERROR',
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred. Please try again later.'
    )
  );
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(err, res) {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json(
        errorResponse('DUPLICATE_ENTRY', `${field} already exists`)
      );

    case 'P2025':
      // Record not found
      return res.status(404).json(
        errorResponse('NOT_FOUND', 'Record not found')
      );

    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json(
        errorResponse('INVALID_REFERENCE', 'Referenced record does not exist')
      );

    case 'P2014':
      // Invalid ID
      return res.status(400).json(
        errorResponse('INVALID_ID', 'The provided ID is invalid')
      );

    default:
      console.error('Unhandled Prisma Error:', err);
      return res.status(500).json(
        errorResponse('DATABASE_ERROR', 'A database error occurred')
      );
  }
}

/**
 * 404 Not Found handler
 * Place this after all routes
 */
function notFoundHandler(req, res) {
  res.status(404).json(
    errorResponse(
      'NOT_FOUND',
      `Endpoint ${req.method} ${req.path} not found`
    )
  );
}

/**
 * Create custom application error
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @param {String} code - Error code
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'APPLICATION_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError,
};
