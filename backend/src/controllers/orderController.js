// src/controllers/orderController.js
// Order Management HTTP Request Handlers

const orderService = require('../services/orderService');
const { successResponse } = require('../utils/helpers');

/**
 * GET /v1/orders
 * Get orders list with filters and pagination
 */
async function getOrdersController(req, res, next) {
  try {
    const { status, search, page, limit } = req.query;
    const userId = req.user.userId;

    const result = await orderService.getOrders({
      userId,
      status,
      search,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    res.status(200).json(
      successResponse(result, 'Orders retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * GET /v1/orders/:id
 * Get single order by ID
 */
async function getOrderByIdController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const order = await orderService.getOrderById({ userId, orderId: id });

    res.status(200).json(
      successResponse(order, 'Order retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /v1/orders/:id/status
 * Update order status
 */
async function updateOrderStatusController(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const updatedOrder = await orderService.updateOrderStatus({
      userId,
      orderId: id,
      newStatus: status,
    });

    res.status(200).json(
      successResponse(updatedOrder, `Order status updated to ${status}`)
    );
  } catch (error) {
    next(error);
  }
}

/**
 * GET /v1/orders/pending
 * Get pending orders (quick view)
 */
async function getPendingOrdersController(req, res, next) {
  try {
    const userId = req.user.userId;

    const orders = await orderService.getPendingOrders({ userId });

    res.status(200).json(
      successResponse(orders, 'Pending orders retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * GET /v1/orders/history
 * Get order history (delivered/cancelled)
 */
async function getOrderHistoryController(req, res, next) {
  try {
    const { page, limit } = req.query;
    const userId = req.user.userId;

    const result = await orderService.getOrderHistory({
      userId,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    res.status(200).json(
      successResponse(result, 'Order history retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /v1/orders
 * Create order (admin/test only)
 */
async function createOrderController(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);

    res.status(201).json(
      successResponse(order, 'Order created successfully')
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  getPendingOrdersController,
  getOrderHistoryController,
  createOrderController,
};
