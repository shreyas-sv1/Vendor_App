// src/controllers/dashboardController.js
// Dashboard Analytics HTTP Request Handlers

const dashboardService = require('../services/dashboardService');
const { successResponse } = require('../utils/helpers');

/**
 * GET /v1/dashboard/stats
 * Get dashboard statistics
 */
async function getDashboardStatsController(req, res, next) {
  try {
    const userId = req.user.userId;

    const stats = await dashboardService.getDashboardStats({ userId });

    res.status(200).json(
      successResponse(stats, 'Dashboard stats retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * GET /v1/dashboard/earnings
 * Get earnings chart data
 */
async function getEarningsController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { period } = req.query;

    const earnings = await dashboardService.getEarnings({ userId, period });

    res.status(200).json(
      successResponse(earnings, 'Earnings data retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * GET /v1/dashboard/recent-orders
 * Get recent orders for quick view
 */
async function getRecentOrdersController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { limit } = req.query;

    const orders = await dashboardService.getRecentOrders({
      userId,
      limit: parseInt(limit) || 5,
    });

    res.status(200).json(
      successResponse(orders, 'Recent orders retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * GET /v1/dashboard/notifications
 * Get recent notifications
 */
async function getRecentNotificationsController(req, res, next) {
  try {
    const userId = req.user.userId;
    const { limit } = req.query;

    const result = await dashboardService.getRecentNotifications({
      userId,
      limit: parseInt(limit) || 10,
    });

    res.status(200).json(
      successResponse(result, 'Recent notifications retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStatsController,
  getEarningsController,
  getRecentOrdersController,
  getRecentNotificationsController,
};
