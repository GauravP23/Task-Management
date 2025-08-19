#!/bin/bash

# Task Management Development Mode Script
echo "🔥 Starting Task Management in Development Mode..."

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if concurrently is installed globally
if ! command -v concurrently &> /dev/null; then
    echo -e "${YELLOW}📦 Installing concurrently globally for better development experience...${NC}"
    npm install -g concurrently
fi

# Create logs directory
mkdir -p logs

# Clean up any existing processes
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
sleep 2

# Install dependencies if needed
echo -e "${BLUE}📦 Checking dependencies...${NC}"
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

echo -e "${GREEN}🚀 Starting services in development mode...${NC}"
echo -e "${BLUE}Backend:${NC} http://localhost:5000"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Start both services with concurrently for better output
concurrently \
  --prefix "{name}" \
  --names "BACKEND,FRONTEND" \
  --prefix-colors "blue,green" \
  "cd backend && npm run dev" \
  "cd frontend && npm start"
