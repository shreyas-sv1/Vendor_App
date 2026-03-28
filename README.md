# Vendor App - Full Stack Application

A complete **vendor management PWA** with React frontend and Node.js backend API.

## 📁 Project Structure

```
Vendor_App/
├── frontend/          # React PWA (Vite + React 18)
│   ├── src/          # React components & pages
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── vite.config.js # Vite configuration
│
├── backend/          # Node.js API Server
│   ├── src/          # Express app, routes, controllers
│   ├── prisma/       # Database schema & migrations
│   ├── package.json  # Backend dependencies
│   └── README.md     # Backend documentation
│
├── .env             # Backend environment variables
└── README.md        # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Setup Backend Database

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Starts on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Starts on http://localhost:5173
```

## ✨ Features

### Frontend (React PWA)
- 📱 **Mobile-first design** - Optimized for vendor mobile usage
- 🗺️ **Interactive maps** - Leaflet integration for location tracking
- 📊 **Real-time dashboard** - Earnings, orders, analytics
- 🔐 **Complete authentication** - Login, register, password reset
- 🛒 **Order management** - Accept, track, complete orders
- 📸 **Cart uploads** - Camera integration for inventory photos
- 🔔 **Notifications** - Push notification support
- ⚙️ **Settings & profile** - Dark mode, preferences

### Backend (Node.js API)
- 🔑 **JWT Authentication** - Secure login with refresh tokens
- 📊 **Orders API** - Complete CRUD with status tracking
- 📈 **Dashboard Analytics** - Revenue, earnings, order stats
- 🗄️ **SQLite Database** - Prisma ORM, zero-config development
- 🛡️ **Security** - Rate limiting, validation, CORS
- 📝 **API Documentation** - Comprehensive endpoint docs
- 🚀 **Production ready** - Error handling, logging

## 📚 Documentation

- **Frontend Setup**: See `frontend/README.md`
- **Backend API**: See `backend/README.md`
- **API Endpoints**: Full documentation in backend README

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- React Router (routing)
- Leaflet (maps)
- PWA capabilities

**Backend:**
- Node.js + Express
- Prisma ORM + SQLite
- JWT authentication
- Zod validation
- Rate limiting

## 🌐 API Endpoints

Base URL: `http://localhost:3000/v1`

### Auth
- `POST /auth/register` - Register vendor
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh-token` - Refresh token

### Orders (Auth Required)
- `GET /orders` - List orders with filters
- `PATCH /orders/:id/status` - Update order status
- `GET /orders/pending` - Pending orders

### Dashboard (Auth Required)
- `GET /dashboard/stats` - Today's revenue & order count
- `GET /dashboard/earnings` - Earnings chart data
- `GET /dashboard/recent-orders` - Recent orders

## 🧪 Testing

```bash
# Test backend API health
curl http://localhost:3000/health

# Register a test vendor
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","phone":"9876543210","password":"test123"}'
```

## 🚀 Deployment

**Frontend**: Deploy to Vercel/Netlify
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

**Backend**: Deploy to Railway/Render
```bash
cd backend
# Deploy with auto-detected Node.js
```

## 🔧 Environment Setup

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="file:./dev.db"          # SQLite for development
JWT_SECRET="your-secret-key"          # Change in production
FRONTEND_URL="http://localhost:5173"  # For CORS
PORT=3000
```

## 📞 Support

- **Frontend Issues**: Check `frontend/src/pages/` for component code
- **API Issues**: Check `backend/src/routes/` for endpoint logic
- **Database**: Use `npm run prisma:studio` to view data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ using React + Node.js**
*Ready for production deployment* 🚀