#!/bin/bash

# Task Management Services Stop Script
echo "🛑 Stopping Task Management Services..."

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill processes by PID if available
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${YELLOW}🔧 Stopping backend server (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID
    fi
    rm .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${YELLOW}🎨 Stopping frontend server (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID
    fi
    rm .frontend.pid
fi

# Fallback: Kill by process name
echo -e "${YELLOW}🧹 Cleaning up any remaining processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 2

echo -e "${GREEN}✅ All services stopped successfully!${NC}"
