# Vendor App Backend API

Backend API for the Vendor Management PWA - built with Node.js, Express, PostgreSQL, and Redis.

## Features

- ✅ **JWT Authentication** - Secure login with access & refresh tokens
- ✅ **Order Management** - List, filter, and update orders with status tracking
- ✅ **Dashboard Analytics** - Revenue stats, earnings charts, order counts
- ✅ **Rate Limiting** - Redis-powered rate limiting for API protection
- ✅ **Input Validation** - Zod schema validation for all requests
- ✅ **Error Handling** - Centralized error handling with consistent responses
- ✅ **Database ORM** - Prisma for type-safe database access
- 🚧 **Profile Management** - Coming soon
- 🚧 **Real-time Notifications** - Socket.io integration (coming soon)
- 🚧 **Cart Uploads** - Cloudinary image uploads (coming soon)

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 15 (via Prisma ORM)
- **Cache**: Redis 7
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit

## Prerequisites

- Node.js 20 or higher
- Docker & Docker Compose (for local PostgreSQL and Redis)
- npm or yarn

## Quick Start

### 1. Clone and Install

```bash
cd /c/projects/vendor-app-backend
npm install
```

### 2. Start Database Services

```bash
# Start PostgreSQL and Redis with Docker Compose
docker-compose up -d

# Check services are running
docker-compose ps
```

### 3. Configure Environment

Update `.env` file with your settings (or use defaults for development):

```env
DATABASE_URL="postgresql://vendoruser:vendorpass123@localhost:5432/vendordb?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-change-in-production"
PORT=3000
NODE_ENV="development"
```

### 4. Run Database Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create database tables
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 5. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Documentation

### Base URL

```
http://localhost:3000/v1
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new vendor |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/send-otp` | Send OTP to phone |
| POST | `/auth/verify-otp` | Verify OTP code |
| POST | `/auth/reset-password` | Reset password |

### Orders Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders` | List orders with filters | ✅ |
| GET | `/orders/:id` | Get single order | ✅ |
| PATCH | `/orders/:id/status` | Update order status | ✅ |
| GET | `/orders/pending` | Get pending orders | ✅ |
| GET | `/orders/history` | Get order history | ✅ |
| POST | `/orders` | Create order (test only) | ✅ |

### Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard/stats` | Get dashboard statistics | ✅ |
| GET | `/dashboard/earnings` | Get earnings chart data | ✅ |
| GET | `/dashboard/recent-orders` | Get recent orders | ✅ |
| GET | `/dashboard/notifications` | Get notifications | ✅ |

## Example API Requests

### Register

```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_vendor",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "remember": true
  }'
```

### Get Orders (with authentication)

```bash
curl -X GET "http://localhost:3000/v1/orders?status=All&search=&page=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Order Status

```bash
curl -X PATCH http://localhost:3000/v1/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACCEPTED"}'
```

### Get Dashboard Stats

```bash
curl -X GET http://localhost:3000/v1/dashboard/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-03-28T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      { "field": "email", "issue": "must be a valid email" }
    ]
  },
  "timestamp": "2026-03-28T10:30:00Z"
}
```

## Scripts

```bash
npm run dev              # Start development server with nodemon
npm start                # Start production server
npm run prisma:migrate   # Run database migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open Prisma Studio GUI
```

## Project Structure

```
vendor-app-backend/
├── src/
│   ├── config/          # Configuration (database, Redis, Cloudinary)
│   ├── middleware/      # Express middleware (auth, validation, rate limiting)
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions (JWT, helpers)
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── .env                 # Environment variables
├── docker-compose.yml   # Docker services (PostgreSQL, Redis)
└── package.json
```

## Environment Variables

See `.env.example` for all available configuration options.

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret key for access tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens

**Optional (for production):**
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `FCM_PROJECT_ID`, `FCM_PRIVATE_KEY`, `FCM_CLIENT_EMAIL`

## Testing

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-28T...",
  "environment": "development"
}
```

## Troubleshooting

### Port 3000 already in use

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Cannot connect to PostgreSQL

```bash
# Check if Docker containers are running
docker-compose ps

# Restart containers
docker-compose restart

# Check PostgreSQL logs
docker-compose logs postgres
```

### Prisma migration errors

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually drop database and recreate
docker-compose down -v
docker-compose up -d
npm run prisma:migrate
```

## Next Steps

- [ ] Implement profile management endpoints
- [ ] Add WebSocket support for real-time order notifications
- [ ] Integrate Cloudinary for image uploads
- [ ] Add SMS OTP integration (Twilio)
- [ ] Add push notifications (Firebase FCM)
- [ ] Write unit and integration tests
- [ ] Deploy to Railway/Render

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
