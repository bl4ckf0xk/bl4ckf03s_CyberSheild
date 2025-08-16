#!/bin/bash

# CyberShield Project Setup Script
# This script helps you set up the entire CyberShield project with backend and frontend

set -e  # Exit on any error

echo "🚀 CyberShield Project Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_step "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) is installed"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm"
    exit 1
fi

print_success "npm $(npm --version) is installed"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the root directory (where package.json is located)"
    exit 1
fi

# Backend setup
print_step "Setting up backend..."

cd backend

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_step "Creating backend environment file..."
    cp .env.example .env
    print_warning "Please edit backend/.env with your Supabase credentials before starting the server"
fi

print_success "Backend setup completed"

# Return to root directory
cd ..

# Frontend setup
print_step "Setting up React Native frontend..."

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    print_step "Installing frontend dependencies..."
    npm install
fi

print_success "Frontend setup completed"

# Generate JWT secrets
print_step "Generating JWT secrets..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

echo ""
print_success "Setup completed successfully!"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "==============="
echo ""
echo "1. 🗄️  Set up Supabase:"
echo "   - Go to https://supabase.com and create a new project"
echo "   - Get your Project URL, Anon Key, and Service Role Key"
echo "   - Run the SQL schema from backend/src/database/schema.sql"
echo ""
echo "2. ⚙️  Configure environment variables:"
echo "   - Edit backend/.env with your Supabase credentials:"
echo "   - SUPABASE_URL=your_project_url"
echo "   - SUPABASE_ANON_KEY=your_anon_key"
echo "   - SUPABASE_SERVICE_KEY=your_service_role_key"
echo ""
echo "   - Use these generated JWT secrets:"
echo -e "   - JWT_SECRET=${GREEN}${JWT_SECRET}${NC}"
echo -e "   - JWT_REFRESH_SECRET=${GREEN}${JWT_REFRESH_SECRET}${NC}"
echo ""
echo "3. 🚀 Start the servers:"
echo "   Backend:  cd backend && npm run dev"
echo "   Frontend: npm run start (in a new terminal)"
echo ""
echo "4. 📱 Test the application:"
echo "   - Backend API: http://localhost:3000"
echo "   - Health Check: http://localhost:3000/health"
echo "   - API Docs: http://localhost:3000/api/docs"
echo "   - React Native: Follow Expo dev tools instructions"
echo ""
echo "5. 👨‍💼 Test admin functionality:"
echo "   - Use any email containing 'admin' (e.g., admin@test.com)"
echo "   - Use any password and badge number"
echo ""

# Create a helpful start script
cat > start-dev.sh << 'EOF'
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
EOF

chmod +x start-dev.sh

echo -e "📝 Created ${GREEN}start-dev.sh${NC} - run this to start both servers at once!"
echo ""
echo -e "${GREEN}🎉 CyberShield setup is complete!${NC}"
echo "Follow the next steps above to finish configuration and start developing."
echo ""
