// src/config/constants.js
// Application Constants

module.exports = {
  // Rate Limiting
  CART_UPLOAD_LIMIT_HOURS: 1,
  LOGIN_ATTEMPTS_LIMIT: 5,
  LOGIN_ATTEMPTS_WINDOW_MINUTES: 15,

  // JWT
  JWT_ACCESS_EXPIRY: '15m',
  JWT_REFRESH_EXPIRY: '30d',

  // OTP
  OTP_EXPIRY_MINUTES: 10,
  OTP_LENGTH: 6,
  OTP_MAX_ATTEMPTS: 3,

  // Password
  BCRYPT_ROUNDS: 12,
  MIN_PASSWORD_LENGTH: 6,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Order Status Flow
  ORDER_STATUS_FLOW: {
    PENDING: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: []
  },

  // Cloudinary Folders
  CLOUDINARY_FOLDERS: {
    PROFILE_PHOTOS: 'vendor-app/profile-photos',
    CART_UPLOADS: 'vendor-app/cart-uploads',
  },

  // Image Sizes
  IMAGE_MAX_SIZE_MB: 10,
  PROFILE_IMAGE_SIZE: { width: 500, height: 500 },
  CART_IMAGE_MAX_SIZE: { width: 1920, height: 1080 },

  // Notification Types
  NOTIFICATION_TYPES: {
    NEW_ORDER: 'NEW_ORDER',
    ORDER_UPDATE: 'ORDER_UPDATE',
    SYSTEM_ALERT: 'SYSTEM_ALERT',
    PROMOTIONAL: 'PROMOTIONAL'
  },

  // Vendor Categories
  VENDOR_CATEGORIES: ['Grocery', 'Food', 'Vegetables', 'Clothes'],
};
