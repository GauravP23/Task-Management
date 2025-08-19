#!/bin/bash

# Task Management Services Startup Script
echo "🚀 Starting Task Management Services..."

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Kill any existing processes on the ports
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
sleep 2

# Start Backend Server
echo -e "${BLUE}🔧 Starting Backend Server (Port 5000)...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

# Start backend in background
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 3

# Check if backend started successfully
if check_port 5000; then
    echo -e "${GREEN}✅ Backend server started successfully on http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Backend server failed to start${NC}"
    echo -e "${YELLOW}Check logs/backend.log for details${NC}"
fi

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend (Port 3000)...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Create logs directory if it doesn't exist
mkdir -p ../logs

# Start frontend in background
PORT=3000 npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to compile and start
echo -e "${YELLOW}⏳ Waiting for frontend to compile...${NC}"
sleep 10

# Check if frontend started successfully
if check_port 3000; then
    echo -e "${GREEN}✅ Frontend started successfully on http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    echo -e "${YELLOW}Check logs/frontend.log for details${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Services Status:${NC}"
echo -e "${BLUE}Backend API:${NC} http://localhost:5000"
echo -e "${BLUE}Frontend App:${NC} http://localhost:3000"
echo ""
echo -e "${YELLOW}📋 Useful Commands:${NC}"
echo "- View backend logs: tail -f logs/backend.log"
echo "- View frontend logs: tail -f logs/frontend.log"
echo "- Stop all services: ./stop-services.sh"
echo ""
echo -e "${GREEN}🔥 All services are running! Happy coding!${NC}"

# Save PIDs for stopping later
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid
