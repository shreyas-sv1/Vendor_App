// src/routes/orders.routes.js
// Order Management Routes

const express = require('express');
const router = express.Router();

const {
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  getPendingOrdersController,
  getOrderHistoryController,
  createOrderController,
} = require('../controllers/orderController');

const { authenticate } = require('../middleware/auth');
const { validateBody, validateParams, schemas } = require('../middleware/validation');

// All order routes require authentication
router.use(authenticate);

// GET /v1/orders - Get orders list with filters
router.get('/', getOrdersController);

// GET /v1/orders/pending - Get pending orders
router.get('/pending', getPendingOrdersController);

// GET /v1/orders/history - Get order history
router.get('/history', getOrderHistoryController);

// GET /v1/orders/:id - Get single order
router.get('/:id', getOrderByIdController);

// PATCH /v1/orders/:id/status - Update order status
router.patch(
  '/:id/status',
  validateBody(schemas.updateOrderStatusSchema),
  updateOrderStatusController
);

// POST /v1/orders - Create order (admin/test only)
router.post('/', createOrderController);

module.exports = router;
