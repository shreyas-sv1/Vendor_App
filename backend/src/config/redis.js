// src/config/redis.js
// Redis Client Configuration (Optional - for rate limiting)

const Redis = require('ioredis');

// Mock Redis client if REDIS_URL is not set
if (!process.env.REDIS_URL) {
  console.log('⚠️  Redis not configured - using in-memory rate limiting (reduced protection)');
  module.exports = null;
  return;
}

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) {
      console.log('⚠️  Redis connection failed - using in-memory rate limiting');
      return null; // Stop retrying
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  }
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.warn('⚠️  Redis connection error (non-critical):', err.message);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  try {
    await redisClient.quit();
  } catch (err) {
    // Ignore errors on shutdown
  }
});

module.exports = redisClient;
