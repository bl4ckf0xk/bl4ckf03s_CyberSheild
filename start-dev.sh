#!/bin/bash
# Development startup script

echo "🚀 Starting CyberShield Development Servers"
echo "==========================================="

# Function to kill background processes on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit
}

trap cleanup SIGINT SIGTERM

# Store the root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if backend is already running
if curl -s http://localhost:3000/health >/dev/null 2>&1; then
    echo "📡 Backend server is already running on port 3000"
    BACKEND_PID=""
else
    # Start backend
    echo "📡 Starting backend server..."
    cd "$SCRIPT_DIR/backend" && npm run dev &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 3
fi

# Start frontend from root directory
echo "📱 Starting React Native frontend..."
echo "   This will show a QR code for mobile development..."
cd "$SCRIPT_DIR" && npm start &
FRONTEND_PID=$!

# Wait a moment for frontend to start and show QR code
sleep 3

echo ""
echo "✅ Both servers are starting up!"
echo "📡 Backend: http://localhost:3000"
echo "📱 Frontend: Expo development server starting..."
echo ""
echo "🔍 To see the QR code:"
echo "   1. Check the terminal output above for the QR code"
echo "   2. Or open http://localhost:8081 in your browser"
echo "   3. Or run 'expo start' in a new terminal to see it directly"
echo ""
echo "📱 Mobile Development:"
echo "   - Install Expo Go app on your phone"
echo "   - Scan the QR code to open the app"
echo "   - Or press 'i' for iOS simulator or 'a' for Android emulator"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to show server status
show_status() {
    echo ""
    echo "📊 Server Status:"
    if curl -s http://localhost:3000/health >/dev/null 2>&1; then
        echo "   ✅ Backend: Running on http://localhost:3000"
    else
        echo "   ❌ Backend: Not responding"
    fi
    
    if curl -s http://localhost:8081 >/dev/null 2>&1; then
        echo "   ✅ Frontend: Running on http://localhost:8081"
    else
        echo "   ❌ Frontend: Not responding"
    fi
    echo ""
}

# Show initial status
show_status

# Wait for processes
wait
