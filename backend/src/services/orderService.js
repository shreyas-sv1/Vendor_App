// src/services/orderService.js
// Order Management Business Logic

const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const { ORDER_STATUS_FLOW, DEFAULT_PAGE_SIZE } = require('../config/constants');
const { paginationMeta } = require('../utils/helpers');

/**
 * Get orders list with filters and pagination
 */
async function getOrders({ userId, status, search, page = 1, limit = DEFAULT_PAGE_SIZE }) {
  const skip = (page - 1) * limit;
  const where = {
    vendorId: userId,
  };

  // Apply status filter
  if (status && status !== 'All') {
    where.status = status.toUpperCase();
  }

  // Apply search filter
  if (search) {
    where.OR = [
      { id: { contains: search, mode: 'insensitive' } },
      { items: { contains: search, mode: 'insensitive' } },
      { customerName: { contains: search, mode: 'insensitive' } },
      { deliveryAddress: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Get total count for pagination
  const total = await prisma.order.count({ where });

  // Get orders
  const orders = await prisma.order.findMany({
    where,
    orderBy: { placedAt: 'desc' },
    skip,
    take: limit,
  });

  return {
    orders,
    pagination: paginationMeta(total, page, limit),
  };
}

/**
 * Get single order by ID
 */
async function getOrderById({ userId, orderId }) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      vendorId: userId,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }

  return order;
}

/**
 * Update order status
 * Validates state transitions (Pending → Accepted → Delivered)
 */
async function updateOrderStatus({ userId, orderId, newStatus }) {
  // Get current order
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      vendorId: userId,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }

  // Validate status transition
  const allowedTransitions = ORDER_STATUS_FLOW[order.status] || [];

  if (!allowedTransitions.includes(newStatus)) {
    throw new AppError(
      `Cannot change status from ${order.status} to ${newStatus}`,
      400,
      'INVALID_STATUS_TRANSITION'
    );
  }

  // Update order status
  const updateData = {
    status: newStatus,
  };

  // Set timestamp based on new status
  if (newStatus === 'ACCEPTED') {
    updateData.acceptedAt = new Date();
  } else if (newStatus === 'DELIVERED') {
    updateData.deliveredAt = new Date();

    // Create earning record when order is delivered
    await prisma.earning.create({
      data: {
        vendorId: userId,
        amount: order.price,
        orderId: order.id,
        date: new Date(),
      },
    });
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
  });

  // TODO: Send real-time notification via Socket.io
  // TODO: Send push notification to customer

  return updatedOrder;
}

/**
 * Get pending orders (quick view)
 */
async function getPendingOrders({ userId }) {
  const orders = await prisma.order.findMany({
    where: {
      vendorId: userId,
      status: 'PENDING',
    },
    orderBy: { placedAt: 'desc' },
    take: 10,
  });

  return orders;
}

/**
 * Get order history (delivered/cancelled)
 */
async function getOrderHistory({ userId, page = 1, limit = DEFAULT_PAGE_SIZE }) {
  const skip = (page - 1) * limit;

  const total = await prisma.order.count({
    where: {
      vendorId: userId,
      status: { in: ['DELIVERED', 'CANCELLED'] },
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      vendorId: userId,
      status: { in: ['DELIVERED', 'CANCELLED'] },
    },
    orderBy: { placedAt: 'desc' },
    skip,
    take: limit,
  });

  return {
    orders,
    pagination: paginationMeta(total, page, limit),
  };
}

/**
 * Create order (admin/test only)
 */
async function createOrder(orderData) {
  const order = await prisma.order.create({
    data: orderData,
  });

  // TODO: Send real-time notification to vendor via Socket.io
  // TODO: Send push notification to vendor

  return order;
}

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getPendingOrders,
  getOrderHistory,
  createOrder,
};
