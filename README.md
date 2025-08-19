# Task Management Application

A modern, full-stack task management application with a beautiful Kanban board interface.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo-url>
   cd Task-Management
   npm run setup
   ```

2. **Start all services in development mode:**
   ```bash
   npm run dev
   # or
   ./dev.sh
   ```

3. **Or start services individually:**
   ```bash
   # Start both services
   npm start
   # or
   ./start-services.sh
   
   # Start only backend
   npm run backend:dev
   
   # Start only frontend
   npm run frontend:dev
   ```

## 🛠 Available Scripts

### Root Level Scripts
- `npm start` - Start both backend and frontend services
- `npm run dev` - Start in development mode with hot reload
- `npm run stop` - Stop all running services
- `npm run setup` - Install all dependencies and setup project
- `npm run build` - Build frontend for production
- `npm run test` - Run all tests
- `npm run clean` - Clean all node_modules and reinstall

### Backend Scripts
- `npm run backend` - Start backend server
- `npm run backend:dev` - Start backend with nodemon (hot reload)

### Frontend Scripts
- `npm run frontend` - Start frontend development server
- `npm run frontend:dev` - Start frontend with hot reload

### Utility Scripts
- `npm run logs:backend` - View backend logs
- `npm run logs:frontend` - View frontend logs
- `npm run install:all` - Install dependencies for both services

## 🌐 Service URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api

## 📁 Project Structure

```
Task-Management/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Server entry point
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   └── theme/          # Material-UI theme
│   └── public/             # Static assets
├── logs/                   # Application logs
├── start-services.sh       # Start all services
├── stop-services.sh        # Stop all services
├── dev.sh                  # Development mode
└── package.json            # Root package configuration
```

## 🔧 Development

### Environment Variables

Create `.env` files in the backend directory:

```bash
# backend/.env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Features
- 🎨 Modern UI with Material-UI
- 📋 Kanban board with drag & drop
- 👥 User authentication
- 🏗 Project management
- ✅ Task management
- 🔄 Real-time updates
- 📱 Responsive design

## 🚨 Troubleshooting

### Port Conflicts
If you encounter port conflicts:
```bash
# Kill existing processes
npm run stop

# Or manually kill processes
pkill -f "react-scripts"
pkill -f "node.*server.js"
```

### Clean Install
If you face dependency issues:
```bash
npm run clean
npm run setup
```

### View Logs
```bash
# Backend logs
npm run logs:backend

# Frontend logs
npm run logs:frontend
```

## 📊 Monitoring Services

The application creates log files in the `logs/` directory:
- `logs/backend.log` - Backend server logs
- `logs/frontend.log` - Frontend build/runtime logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
