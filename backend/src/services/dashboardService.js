// src/services/dashboardService.js
// Dashboard Analytics Business Logic

const prisma = require('../config/database');

/**
 * Get dashboard statistics
 * Returns today's revenue, order counts, etc.
 */
async function getDashboardStats({ userId }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Today's revenue
  const todayEarnings = await prisma.earning.aggregate({
    where: {
      vendorId: userId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Total orders count (all time)
  const totalOrders = await prisma.order.count({
    where: { vendorId: userId },
  });

  // Pending orders count
  const pendingOrders = await prisma.order.count({
    where: {
      vendorId: userId,
      status: 'PENDING',
    },
  });

  // Completed orders count (today)
  const completedToday = await prisma.order.count({
    where: {
      vendorId: userId,
      status: 'DELIVERED',
      deliveredAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Get vendor's online status
  const vendor = await prisma.user.findUnique({
    where: { id: userId },
    select: { isOnline: true, firstName: true, lastName: true },
  });

  return {
    todaysRevenue: todayEarnings._sum.amount || 0,
    totalOrders,
    pendingOrders,
    completedToday,
    isOnline: vendor?.isOnline || false,
    vendorName: vendor ? `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim() : 'Vendor',
  };
}

/**
 * Get earnings chart data
 * Returns array of daily earnings for specified period
 */
async function getEarnings({ userId, period = 'week' }) {
  const now = new Date();
  let daysBack = 7; // Default: last 7 days

  if (period === 'month') {
    daysBack = 30;
  } else if (period === 'year') {
    daysBack = 365;
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);
  startDate.setHours(0, 0, 0, 0);

  // Get all earnings in the period
  const earnings = await prisma.earning.findMany({
    where: {
      vendorId: userId,
      date: {
        gte: startDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Group by date and sum amounts
  const earningsMap = new Map();

  for (let i = 0; i < daysBack; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    earningsMap.set(dateKey, 0);
  }

  earnings.forEach(earning => {
    const dateKey = earning.date.toISOString().split('T')[0];
    earningsMap.set(dateKey, (earningsMap.get(dateKey) || 0) + earning.amount);
  });

  // Convert to array
  const earningsArray = Array.from(earningsMap.values());

  // Calculate total
  const total = earningsArray.reduce((sum, amount) => sum + amount, 0);

  return {
    earnings: earningsArray,
    total,
    period,
    daysCount: daysBack,
  };
}

/**
 * Get recent orders for dashboard quick view
 */
async function getRecentOrders({ userId, limit = 5 }) {
  const orders = await prisma.order.findMany({
    where: {
      vendorId: userId,
    },
    orderBy: {
      placedAt: 'desc',
    },
    take: limit,
  });

  return orders;
}

/**
 * Get recent notifications
 */
async function getRecentNotifications({ userId, limit = 10 }) {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  const unreadCount = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  return {
    notifications,
    unreadCount,
  };
}

module.exports = {
  getDashboardStats,
  getEarnings,
  getRecentOrders,
  getRecentNotifications,
};
