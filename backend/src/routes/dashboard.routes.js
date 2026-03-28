// src/routes/dashboard.routes.js
// Dashboard Analytics Routes

const express = require('express');
const router = express.Router();

const {
  getDashboardStatsController,
  getEarningsController,
  getRecentOrdersController,
  getRecentNotificationsController,
} = require('../controllers/dashboardController');

const { authenticate } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(authenticate);

// GET /v1/dashboard/stats - Get dashboard statistics
router.get('/stats', getDashboardStatsController);

// GET /v1/dashboard/earnings - Get earnings chart data
router.get('/earnings', getEarningsController);

// GET /v1/dashboard/recent-orders - Get recent orders
router.get('/recent-orders', getRecentOrdersController);

// GET /v1/dashboard/notifications - Get recent notifications
router.get('/notifications', getRecentNotificationsController);

module.exports = router;
