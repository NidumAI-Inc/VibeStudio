# VibeStudio Backend API

A modern, high-performance backend service built with Hono.js, TypeScript, and MongoDB. This backend powers the VibeStudio platform, providing comprehensive user management, real-time usage tracking, multi-authentication support, and cost management features.

![VibeStudio Backend](https://via.placeholder.com/800x400?text=VibeStudio+Backend+API)

## 🚀 Features

- **Modern Architecture**: Built with Hono.js for exceptional performance and developer experience
- **Multi-Authentication**: Email/password, Google OAuth2, and cross-platform Nidum integration
- **Real-time Tracking**: WebSocket-based usage and bandwidth monitoring
- **Cost Management**: Per-user spending limits with real-time cost tracking
- **Email System**: Comprehensive email templates and SMTP integration
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Production Ready**: HTTPS support with Let's Encrypt certificates
- **RESTful APIs**: Clean, modular REST API design
- **Database Integration**: MongoDB with Mongoose ODM for robust data management

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn** package manager
- **Git**

### External Service Requirements
- **Google OAuth2 App** (for Google authentication)
- **Gmail Account** (for SMTP email services)
- **SSL Certificates** (for production HTTPS)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vibestudio

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
REFRESH_SECRET=your-refresh-token-secret

# Email Configuration (Gmail SMTP)
GMAIL_ID=your-gmail-address@gmail.com
GMAIL_PASS=your-gmail-app-password

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIECT_URI=http://localhost:5000/api/auth/google/callback

# Server Configuration
PORT=5000
NODE_ENV=development

# Production SSL (for HTTPS)
SSL_CERT_PATH=/etc/letsencrypt/live/your-domain/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/your-domain/privkey.pem
```

### 4. Database Setup

Ensure MongoDB is running and accessible:
```bash
# Start MongoDB (if using local installation)
mongod

# Or use MongoDB Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Development Server

Start the development server with hot reload:
```bash
npm run dev
# or
yarn dev
```

The API will be available at `http://localhost:5000`

## 🏗️ Building for Production

### Development Build
```bash
npm run build
# or
yarn build
```

### Production Start
```bash
npm start
# or
yarn start
```

### Production with SSL
The application automatically detects SSL certificates and enables HTTPS in production:
```bash
NODE_ENV=production npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/                 # Configuration files
│   │   └── google.ts          # Google OAuth configuration
│   ├── controllers/           # Business logic controllers
│   │   ├── user.ts           # User management
│   │   ├── google.ts         # Google OAuth flow
│   │   ├── usage.ts          # Usage tracking
│   │   └── faker.ts          # Development data
│   ├── lib/                   # Core libraries
│   │   └── connect-db.ts     # Database connection
│   ├── mail-templates/        # Email HTML templates
│   │   ├── welcome.html      # Welcome email
│   │   ├── otp.html          # OTP verification
│   │   ├── reset.html        # Password reset
│   │   └── delete.html       # Account deletion
│   ├── middlewares/           # Custom middleware
│   │   └── auth.ts           # JWT authentication
│   ├── models/                # Database models
│   │   ├── user.ts           # User schema
│   │   └── usage.ts          # Usage tracking schema
│   ├── routes/                # API route definitions
│   │   ├── user.ts           # User endpoints
│   │   ├── google.ts         # Google OAuth routes
│   │   ├── usage.ts          # Usage endpoints
│   │   └── faker.ts          # Development routes
│   ├── socket/                # WebSocket handlers
│   │   └── index.ts          # Socket event handlers
│   ├── utils/                 # Utility functions
│   │   ├── mail.ts           # Email utilities
│   │   └── pricing.ts        # Cost calculation
│   └── index.ts               # Main entry point
├── static/                    # Static assets
├── tests/                     # HTTP test files
│   ├── user.http             # User API tests
│   ├── auth.http             # Auth API tests
│   ├── usage.http            # Usage API tests
│   └── faker.http            # Development tests
├── dist/                      # Compiled JavaScript
├── package.json               # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## 🎨 Technology Stack

### Core Technologies
- **Hono.js** 4.6.18 - Modern web framework for edge computing
- **TypeScript** 5.7.3 - Type-safe JavaScript development
- **Node.js** - JavaScript runtime with ES Modules support
- **MongoDB** - NoSQL database for flexible data storage

### Database & ODM
- **Mongoose** 8.9.5 - MongoDB object modeling and validation
- **MongoDB** - Document-based database with indexing and aggregation

### Authentication & Security
- **JSON Web Tokens** - Secure authentication with Hono's JWT utilities
- **bcrypt** 5.1.1 - Password hashing and verification
- **Arctic** 3.2.1 - Google OAuth2 implementation
- **CORS** - Cross-origin request handling

### Communication
- **@hono/node-ws** 1.0.7 - WebSocket support for real-time features
- **Nodemailer** 6.9.17 - Email sending with Gmail SMTP

### Development Tools
- **tsx** 4.19.2 - TypeScript execution and hot reload
- **dotenv** 16.4.7 - Environment variable management
- **@ngneat/falso** 7.2.0 - Fake data generation for development

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (using HTTP test files)

## 🌐 API Endpoints

### Authentication Endpoints
```
POST   /api/user/register      # User registration
POST   /api/user/login         # User login
POST   /api/user/logout        # User logout
GET    /api/user/profile       # Get user profile
PUT    /api/user/profile       # Update user profile
POST   /api/user/reset         # Password reset request
POST   /api/user/verify-otp    # OTP verification
DELETE /api/user/delete        # Account deletion
```

### Google OAuth Endpoints
```
GET    /api/auth/google        # Initiate Google OAuth
GET    /api/auth/google/callback # Google OAuth callback
```

### Usage Tracking Endpoints
```
GET    /api/usage              # Get user usage statistics
POST   /api/usage/bulk         # Bulk usage data upload
GET    /api/usage/monthly      # Monthly usage aggregation
```

### Development Endpoints (Development Only)
```
POST   /api/faker/users        # Generate fake users
POST   /api/faker/usage        # Generate fake usage data
```

### System Endpoints
```
GET    /api/health             # Health check
WS     /api/ws                 # WebSocket connection
```

## 📊 Database Schema

### User Model
```typescript
{
  email: String (unique, required),
  password: String (conditional),
  token: [String],                    // JWT tokens array
  verified: Boolean (default: false),
  isGoogleAuth: Boolean (default: false),
  verifiyOtp: Number,
  totalUsage: Number (default: 0),    // Cost in USD
  streamCosts: Map<String, Number>,   // Per-stream costs
  createdAt: Date,
  updatedAt: Date
}
```

### Usage Model
```typescript
{
  userId: ObjectId (ref: 'User'),
  serverId: String (required),
  bandWidthIn: Number (default: 0),   // Incoming bandwidth
  bandWidthOut: Number (default: 0),  // Outgoing bandwidth
  month: Date (required),
  type: 'nativenode' | 'domain',
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Security

### JWT Authentication
- **Access Tokens**: 24-hour expiration with automatic refresh
- **Token Management**: Multiple active sessions per user
- **Middleware Protection**: Route-level authentication enforcement

### Password Security
- **bcrypt Hashing**: 16 rounds for secure password storage
- **Password Reset**: OTP-based reset with email verification
- **Account Verification**: Email-based account activation

### OAuth2 Integration
- **Google OAuth**: PKCE flow with state management
- **Cross-platform Auth**: Nidum fallback authentication
- **Automatic Registration**: First-time OAuth user creation

### API Security
- **CORS Configuration**: Secure cross-origin request handling
- **Input Validation**: Email format and data type validation
- **Rate Limiting**: Cost-based usage limits ($10 USD cap)
- **Environment Security**: Sensitive configuration via environment variables

## 💰 Cost Management

### Usage Tracking
- **Real-time Monitoring**: WebSocket-based bandwidth tracking
- **Monthly Aggregation**: Automated usage data compilation
- **Stream-based Costs**: Per-conversation cost tracking

### Budget Controls
- **Spending Limits**: $10 USD per user default limit
- **Real-time Updates**: Instant cost calculation and updates
- **Usage Analytics**: Detailed bandwidth and cost breakdowns

## 📧 Email System

### Email Templates
- **Welcome Email**: New user onboarding
- **OTP Verification**: Account verification and password reset
- **Account Management**: Deletion confirmations and updates

### SMTP Configuration
- **Gmail Integration**: App password authentication
- **HTML Templates**: Branded email communications
- **Error Handling**: Comprehensive email delivery error management

## 🔌 WebSocket Features

### Real-time Communication
- **Connection Management**: User session tracking
- **Usage Broadcasting**: Real-time usage data updates
- **Bulk Data Processing**: Efficient bandwidth data handling

### Socket Events
```typescript
// Client to Server
'bulk_usage_data'     // Send usage data in bulk
'user_connected'      // User connection notification

// Server to Client  
'usage_updated'       // Usage statistics updated
'cost_updated'        // Cost information updated
```

## 🚀 Deployment

### Production Environment
```bash
# Environment setup
NODE_ENV=production
PORT=443  # For HTTPS

# SSL certificate paths
SSL_CERT_PATH=/etc/letsencrypt/live/your-domain/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/your-domain/privkey.pem

# Start production server
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check MongoDB status
   mongod --version
   
   # Verify connection string
   echo $MONGODB_URI
   ```

2. **Authentication Errors**
   ```bash
   # Verify JWT secrets
   echo $JWT_SECRET
   echo $REFRESH_SECRET
   
   # Check Google OAuth configuration
   echo $GOOGLE_CLIENT_ID
   ```

3. **Email Not Sending**
   ```bash
   # Verify Gmail configuration
   echo $GMAIL_ID
   echo $GMAIL_PASS
   
   # Test SMTP connection
   telnet smtp.gmail.com 587
   ```

4. **SSL Certificate Issues**
   ```bash
   # Check certificate files
   ls -la /etc/letsencrypt/live/your-domain/
   
   # Verify certificate validity
   openssl x509 -in fullchain.pem -text -noout
   ```

### Debug Mode
Enable debug logging:
```bash
DEBUG=* npm run dev
```

### Health Check
Monitor application health:
```bash
curl http://localhost:5000/api/health
```

## 📝 Testing

### HTTP Test Files
The `tests/` directory contains HTTP files for manual API testing:

```bash
# Test user endpoints
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test authentication
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- **Email**: info@aivf.io
- **Issues**: Create an issue in this repository