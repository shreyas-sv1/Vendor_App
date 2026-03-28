// src/server.js
// HTTP + WebSocket Server Entry Point

require('dotenv').config();
const http = require('http');
const app = require('./app');
const prisma = require('./config/database');
const redisClient = require('./config/redis');

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// TODO: Initialize Socket.io for real-time features
// const io = require('socket.io')(server);
// require('./websocket/socket')(io);

// Start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Test Redis connection
    await redisClient.ping();
    console.log('✅ Redis connected successfully');

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/v1`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');

  server.close(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');

  server.close(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
