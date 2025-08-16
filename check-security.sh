#!/bin/bash

# CyberShield Security Check Script
# This script scans for potential security issues and exposed secrets

set -e

echo "🔒 CyberShield Security Check"
echo "============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ISSUES_FOUND=0

print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    ((ISSUES_FOUND++))
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((ISSUES_FOUND++))
}

# Check 1: Verify .gitignore files exist
print_check "Checking .gitignore files..."
if [ -f ".gitignore" ]; then
    print_pass "Root .gitignore exists"
else
    print_fail "Root .gitignore is missing"
fi

if [ -f "backend/.gitignore" ]; then
    print_pass "Backend .gitignore exists"
else
    print_warn "Backend .gitignore is missing"
fi

# Check 2: Verify .env files are not tracked
print_check "Checking if .env files are ignored..."
if git check-ignore .env >/dev/null 2>&1; then
    print_pass ".env files are properly ignored"
else
    print_fail ".env files are NOT ignored - this is a security risk!"
fi

if git check-ignore backend/.env >/dev/null 2>&1; then
    print_pass "backend/.env files are properly ignored"
else
    print_fail "backend/.env files are NOT ignored - this is a security risk!"
fi

# Check 3: Look for accidentally committed secrets
print_check "Scanning for potential secrets in tracked files..."
SECRET_PATTERNS=(
    "password"
    "secret"
    "api.?key"
    "token"
    "supabase.*key"
    "jwt.*secret"
    "database.*url"
    "smtp.*pass"
)

for pattern in "${SECRET_PATTERNS[@]}"; do
    if git grep -i "$pattern" -- '*.ts' '*.js' '*.json' '*.md' 2>/dev/null | grep -v -i -E "(example|placeholder|your_|<|template|README|SECURITY)" | head -1 >/dev/null; then
        print_warn "Potential secret found with pattern: $pattern"
        git grep -i "$pattern" -- '*.ts' '*.js' '*.json' '*.md' 2>/dev/null | grep -v -i -E "(example|placeholder|your_|<|template|README|SECURITY)" | head -3
    fi
done

# Check 4: Verify environment template exists
print_check "Checking for environment template..."
if [ -f "backend/.env.example" ]; then
    print_pass "backend/.env.example template exists"
else
    print_warn "backend/.env.example template is missing"
fi

# Check 5: Check for hardcoded URLs or keys in source files
print_check "Scanning for hardcoded secrets in source code..."
HARDCODED_PATTERNS=(
    "https://.*\.supabase\.co"
    "eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*"
    "sk_live_"
    "pk_live_"
    "AIza[0-9A-Za-z_-]{35}"
)

for pattern in "${HARDCODED_PATTERNS[@]}"; do
    if find src/ -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "$pattern" 2>/dev/null | head -1 >/dev/null; then
        print_fail "Hardcoded secret pattern found: $pattern"
    fi
done

# Check 6: Verify logs directory is ignored
print_check "Checking logs directory configuration..."
if [ -d "backend/logs" ]; then
    if git check-ignore backend/logs/ >/dev/null 2>&1; then
        print_pass "Logs directory is properly ignored"
    else
        print_warn "Logs directory is not ignored - may contain sensitive data"
    fi
fi

# Check 7: Check file permissions on sensitive files
print_check "Checking file permissions..."
if [ -f "backend/.env" ]; then
    PERMISSIONS=$(ls -l backend/.env | cut -d' ' -f1)
    if [[ "$PERMISSIONS" == *"------"* ]] || [[ "$PERMISSIONS" == *"rw-------"* ]]; then
        print_pass "backend/.env has secure permissions"
    else
        print_warn "backend/.env permissions are too open (consider chmod 600)"
    fi
fi

# Check 8: Look for backup files that might contain secrets
print_check "Scanning for backup files..."
BACKUP_FILES=$(find . -name "*.bak" -o -name "*.backup" -o -name "*.old" -o -name "*~" 2>/dev/null | head -5)
if [ -n "$BACKUP_FILES" ]; then
    print_warn "Backup files found (may contain secrets):"
    echo "$BACKUP_FILES"
fi

# Check 9: Verify node_modules is ignored
print_check "Checking node_modules ignore status..."
if git check-ignore node_modules/ >/dev/null 2>&1; then
    print_pass "node_modules is properly ignored"
else
    print_fail "node_modules is not ignored - this will cause issues"
fi

# Check 10: Look for TODO comments about security
print_check "Scanning for security TODOs..."
TODO_SECURITY=$(find src/ backend/src/ -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -i "TODO.*\(security\|auth\|password\|secret\)" 2>/dev/null || true)
if [ -n "$TODO_SECURITY" ]; then
    print_warn "Security-related TODOs found:"
    echo "$TODO_SECURITY"
fi

echo ""
echo "================================"
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ Security check passed! No issues found.${NC}"
else
    echo -e "${YELLOW}⚠️  Found $ISSUES_FOUND potential security issue(s).${NC}"
    echo "Please review the warnings and failures above."
fi

echo ""
echo "🛡️ Security Reminders:"
echo "- Never commit .env files or secrets"
echo "- Use environment variables for all sensitive data"
echo "- Regularly rotate JWT secrets and API keys"
echo "- Keep dependencies updated"
echo "- Review code changes for accidentally exposed secrets"
echo ""
echo "For more information, see SECURITY.md"

exit $ISSUES_FOUND
