# CyberShield Backend API

A robust Node.js backend API for the CyberShield incident reporting system, built with TypeScript, Express.js, and Supabase.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-time Updates**: WebSocket support for live incident updates
- **Secure Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **File Management**: Secure evidence file uploads with Supabase Storage
- **Admin Dashboard**: Comprehensive admin APIs for incident management
- **Law Enforcement Integration**: APIs for forwarding cases to law enforcement
- **Audit Logging**: Complete audit trail for all administrative actions
- **Rate Limiting**: Built-in protection against API abuse
- **Comprehensive Logging**: Structured logging with Winston
- **Error Handling**: Standardized error responses and monitoring

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **File Storage**: Supabase Storage
- **Real-time**: Socket.IO
- **Logging**: Winston
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

Before setting up the backend, ensure you have:

1. **Node.js 18+** installed
2. **npm or yarn** package manager
3. **Supabase account** (free tier available)
4. **Git** for version control

## 🔧 Setup Instructions

### Step 1: Supabase Project Setup

1. **Create a Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new account or sign in
   - Click "New Project"
   - Choose your organization
   - Enter project name: `cybershield`
   - Set a database password (remember this!)
   - Select a region closest to your users
   - Click "Create new project"

2. **Get Your Project Credentials**:
   - Once your project is created, go to Settings → API
   - Copy the following values:
     - **Project URL**: Your unique Supabase URL
     - **Anon Public Key**: For client-side operations
     - **Service Role Key**: For admin operations (keep this secret!)

3. **Set Up the Database Schema**:
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `src/database/schema.sql`
   - Paste and execute the SQL to create all tables and policies

### Step 2: Backend Installation

1. **Clone and Install Dependencies**:
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Install dependencies
   npm install
   
   # Or with yarn
   yarn install
   ```

2. **Environment Configuration**:
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit the .env file with your Supabase credentials
   nano .env  # or use your preferred editor
   ```

3. **Configure Environment Variables**:
   Update `.env` with your actual values:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:19006
   
   # Supabase Configuration (from Step 1)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   
   # JWT Configuration (generate secure secrets)
   JWT_SECRET=your_super_secure_jwt_secret_256_bits
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
   
   # Generate secrets with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### Step 3: Start the Development Server

```bash
# Start development server with hot reload
npm run dev

# Or with yarn
yarn dev
```

The server will start on `http://localhost:3000` and display:
- 🚀 Server running confirmation
- 📚 API Documentation link
- 🏥 Health check endpoint
- Database connection status

### Step 4: Test the Setup

1. **Health Check**:
   ```bash
   curl http://localhost:3000/health
   ```

2. **API Documentation**:
   Visit `http://localhost:3000/api/docs` in your browser

3. **Test User Registration**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'
   ```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── supabase.ts   # Supabase client setup
│   ├── controllers/      # Route controllers
│   │   ├── auth.ts       # Authentication logic
│   │   ├── incidents.ts  # Incident management
│   │   └── admin.ts      # Admin operations
│   ├── database/         # Database schemas and migrations
│   │   └── schema.sql    # PostgreSQL schema
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # JWT authentication
│   │   ├── errorHandler.ts # Global error handling
│   │   └── requestLogger.ts # Request logging
│   ├── models/           # Data models and services
│   ├── routes/           # API route definitions
│   │   ├── auth.ts       # Authentication routes
│   │   ├── incidents.ts  # Incident routes
│   │   ├── admin.ts      # Admin routes
│   │   └── users.ts      # User management routes
│   ├── services/         # Business logic services
│   ├── types/            # TypeScript type definitions
│   │   └── database.ts   # Database types
│   ├── utils/            # Utility functions
│   │   └── logger.ts     # Logging configuration
│   └── index.ts          # Main application entry point
├── logs/                 # Application logs
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## 📚 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh JWT token

### User Incident Endpoints
- `GET /api/incidents` - List user's incidents
- `POST /api/incidents` - Create new incident
- `GET /api/incidents/:id` - Get incident details
- `PUT /api/incidents/:id` - Update incident
- `POST /api/incidents/:id/escalate` - Escalate incident

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/incidents` - List all incidents
- `GET /api/admin/incidents/:id` - Get incident details (admin view)
- `PUT /api/admin/incidents/:id/status` - Update incident status
- `POST /api/admin/incidents/:id/forward-le` - Forward to law enforcement
- `PUT /api/admin/incidents/:id/assign` - Assign to admin
- `GET /api/admin/law-enforcement` - List LE cases
- `PUT /api/admin/law-enforcement/:id/status` - Update LE case status

### User Profile Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Notification Endpoints
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/:id/read` - Mark as read

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **User Registration/Login**: Receive JWT token
2. **Token Usage**: Include in `Authorization: Bearer <token>` header
3. **Token Refresh**: Use refresh token to get new access token
4. **Role-based Access**: Different permissions for users vs admins

### Example Authentication Flow:
```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    full_name: 'John Doe'
  })
});

// Use token in subsequent requests
const { token } = await response.json();
fetch('/api/incidents', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 📊 Database Schema

### Core Tables:
- **users**: User profiles and authentication data
- **admin_users**: Admin-specific information
- **incidents**: Incident reports with full details
- **incident_updates**: History of all incident changes
- **law_enforcement_cases**: Cases forwarded to law enforcement
- **notifications**: User notifications
- **audit_logs**: Complete audit trail

### Key Features:
- **Row Level Security (RLS)**: Users can only access their own data
- **Audit Logging**: All changes are tracked automatically
- **Full-text Search**: Search incidents by content
- **Triggers**: Automatic timestamp updates and notifications

## 🚀 Deployment

### Production Environment Setup:

1. **Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=3000
   SUPABASE_URL=your_production_supabase_url
   # ... other production values
   ```

2. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

3. **Recommended Hosting Platforms**:
   - **Railway**: Easy deployment with built-in PostgreSQL
   - **Render**: Free tier with automatic deploys
   - **DigitalOcean App Platform**: Managed container hosting
   - **AWS/GCP/Azure**: Full cloud infrastructure

### Docker Deployment:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 🔧 Development

### Available Scripts:
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run test` - Run test suite
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with test data

### Code Quality:
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Jest**: Unit and integration testing

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Row Level Security**: Database-level access control
- **Rate Limiting**: Prevent API abuse
- **Helmet**: Security headers
- **CORS**: Cross-origin request security
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Output sanitization

## 📝 Logging

Logs are written to:
- **Console**: Colored output for development
- **Files**: Structured logs in `logs/` directory
  - `error.log`: Error-level logs only
  - `combined.log`: All logs
  - `exceptions.log`: Uncaught exceptions
  - `rejections.log`: Unhandled promise rejections

Log levels: `error`, `warn`, `info`, `http`, `debug`

## 🚨 Error Handling

Standardized error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": { "field": "email is required" },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/auth/login",
    "method": "POST",
    "requestId": "uuid-here"
  }
}
```

## 📞 Support

For issues, questions, or contributions:
1. Check the [API Documentation](http://localhost:3000/api/docs)
2. Review server logs in the `logs/` directory
3. Test the [Health Check](http://localhost:3000/health) endpoint
4. Verify Supabase connection and credentials

## 🔄 Next Steps

After setting up the backend:
1. **Test all endpoints** using the provided examples
2. **Set up the React Native frontend** to connect to this API
3. **Configure real-time notifications** for incident updates
4. **Set up law enforcement integration** if needed
5. **Deploy to production** environment

---

**🎉 Congratulations!** Your CyberShield backend API is now ready for development and testing!
