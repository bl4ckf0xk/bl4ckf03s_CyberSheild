#!/bin/bash
# Development startup script

echo "🚀 Starting CyberShield Development Servers"
echo "==========================================="

# Function to kill background processes on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "📡 Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Return to root and start frontend
cd ..
echo "📱 Starting React Native frontend..."
npm run start &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting up!"
echo "📡 Backend: http://localhost:3000"
echo "📱 Frontend: Follow Expo dev tools instructions"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait
