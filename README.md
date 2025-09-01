# AppHub API 🚀

A comprehensive application monitoring and management API built with Express.js, TypeScript, and MySQL. AppHub provides robust solutions for application tracking, logging, reviews, task management, and real-time analytics.

## ✨ Features

### 🔧 Core Functionality

- **Application Management**: Create, monitor, and manage applications with unique 6-character alphanumeric IDs
- **Advanced Logging**: Comprehensive logging system with support for complex JSON data structures
- **Task Management**: Full CRUD operations for application-related tasks with status tracking
- **Review System**: User review management with rating analytics and statistics
- **Real-time Analytics**: System health monitoring and application status tracking

### 🛡️ Technical Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Database**: MySQL with Sequelize ORM for robust data management
- **Validation**: Express-validator for comprehensive input validation
- **Security**: Helmet, CORS, and rate limiting for production security
- **Deployment**: Vercel-ready with environment-based configuration
- **Service Control**: Built-in maintenance mode and service management

## 🏗️ Architecture

### Database Models

- **Applications**: Core application data with unique alphanumeric IDs
- **Logs**: Advanced logging with JSON support for complex data structures
- **Tasks**: Task management with status tracking and deadlines
- **Reviews**: User reviews with rating analytics
- **Users**: User management system

### Model Relationships

```
Application (1) ←→ (N) Logs
Application (1) ←→ (N) Tasks
Application (1) ←→ (N) Reviews
```

## 🚀 Quick Start

### Prerequisites

- Node.js (>=18.0.0)
- npm (>=8.0.0)
- MySQL database
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/apphub-api.git
   cd apphub-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**

   ```bash
   # Create your MySQL database
   # Update .env with database credentials
   ```

5. **Run Setup (Optional)**

   ```bash
   npm run setup
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3903`

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3903
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=apphub_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Security
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# External Services (Optional)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:3903/api/v1`
- **Production**: `https://your-domain.vercel.app/api/v1`

### Core Endpoints

#### Applications

```http
GET    /api/v1/application           # Get all applications
GET    /api/v1/application/:id       # Get application by ID
POST   /api/v1/application           # Create application
PUT    /api/v1/application/:id       # Update application
DELETE /api/v1/application/:id       # Delete application
```

#### Logs

```http
GET    /api/v1/log                   # Get all logs
GET    /api/v1/log/:id               # Get log by ID
POST   /api/v1/log                   # Create log
PUT    /api/v1/log/:id               # Update log
DELETE /api/v1/log/:id               # Delete log
```

#### Tasks

```http
GET    /api/v1/task                  # Get all tasks
GET    /api/v1/task/:id              # Get task by ID
POST   /api/v1/task                  # Create task
PUT    /api/v1/task/:id              # Update task
DELETE /api/v1/task/:id              # Delete task
```

#### Reviews

```http
GET    /api/v1/review                # Get all reviews
GET    /api/v1/review/:id            # Get review by ID
POST   /api/v1/review                # Create review
PUT    /api/v1/review/:id            # Update review
DELETE /api/v1/review/:id            # Delete review
```

### Service Control

```http
GET    /health                       # Health check
POST   /start                        # Start service
POST   /stop                         # Stop service
POST   /maintenance                  # Toggle maintenance mode
```

## 📝 Usage Examples

### Create Application

```bash
curl -X POST http://localhost:3903/api/v1/application \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome App"
  }'
```

### Create Log with Additional Data

```bash
curl -X POST http://localhost:3903/api/v1/log \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "ABC123",
    "appName": "My Awesome App",
    "logType": "info",
    "message": "Application health check",
    "statusCode": 200,
    "responseTime": 150,
    "endpoint": "/health",
    "userAgent": "HealthMonitor/1.0",
    "ip": "192.168.1.1",
    "method": "GET",
    "additionalData": {
      "cpu": "45%",
      "memory": "2.1GB",
      "disk": "78%",
      "uptime": "5d 12h 30m"
    }
  }'
```

### Create Task

```bash
curl -X POST http://localhost:3903/api/v1/task \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "ABC123",
    "description": "Implement user authentication",
    "status": "pending",
    "dateToFinish": "2025-09-15T18:00:00.000Z"
  }'
```

## 🔗 Data Relationships

All logs, tasks, and reviews automatically include the associated application name:

```json
{
  "id": 1,
  "appId": "ABC123",
  "description": "Fix login bug",
  "status": "pending",
  "Application": {
    "name": "My Awesome App"
  }
}
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run watch        # Watch mode for TypeScript compilation
npm run clean        # Clean build directory
npm run setup        # Run setup wizard
npm run deploy       # Deploy to Vercel
```

## 📁 Project Structure

```
├── src/
│   ├── config/           # Database and app configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Sequelize models and associations
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── validations/     # Input validation schemas
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (auto-generated)
├── .env                 # Environment variables
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vercel.json          # Vercel deployment config
└── README.md            # This file
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   npm run deploy
   ```

### Manual Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Start the server**
   ```bash
   npm start
   ```

## 🔧 Development

### Adding New Features

1. **Model**: Create/update in `src/models/`
2. **Routes**: Add routes in `src/routes/`
3. **Controller**: Implement logic in `src/controllers/`
4. **Service**: Add business logic in `src/services/`
5. **Validation**: Add validation in `src/validations/`

### Database Changes

The application uses Sequelize with automatic synchronization in development mode. For production, consider using migrations.

## 📊 Monitoring

### Health Endpoints

- `GET /health` - Basic health check
- `GET /api/v1/system/health` - Detailed system health
- `GET /api/v1/system/stats` - System statistics

### Service Control

- `POST /start` - Start service
- `POST /stop` - Stop service
- `POST /maintenance` - Toggle maintenance mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: This README and inline code comments
- **Issues**: Create an issue on GitHub
- **Email**: your.email@example.com

## 🎯 Roadmap

- [ ] Add comprehensive testing suite
- [ ] Implement rate limiting per user
- [ ] Add WebSocket support for real-time updates
- [ ] Create admin dashboard
- [ ] Add Docker containerization
- [ ] Implement database migrations
- [ ] Add API documentation with Swagger/OpenAPI

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- Sequelize team for the robust ORM
- TypeScript team for type safety
- Vercel for easy deployment

---

**Built with ❤️ using TypeScript, Express.js, and MySQL**
