# 🔒 CyberShield Security Guide

This document outlines security best practices and configurations for the CyberShield incident reporting system.

## 🛡️ Environment Variables & Secrets Management

### ✅ Protected Files
The following files are automatically ignored by Git and should **NEVER** be committed:

```bash
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
backend/.env
backend/.env.*

# Secrets and credentials
jwt-secret.txt
api-keys.json
credentials.json
service-account.json
secrets/

# SSL certificates
*.key
*.pem
*.p12
*.pfx
*.crt
ssl/

# Database files
*.db
*.sqlite
database.json

# Logs (may contain sensitive data)
logs/
*.log
```

### 🔑 Required Environment Variables

#### Backend (`backend/.env`)
```bash
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:19006

# Supabase Configuration (NEVER commit these!)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# JWT Secrets (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_256_bit_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_here

# Database Connection (if using direct PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/cybershield

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# Law Enforcement API (if integrating)
LE_API_ENDPOINT=https://api.lawenforcement.gov
LE_API_KEY=your_le_api_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin Configuration
ADMIN_EMAIL=admin@cybershield.gov
ADMIN_BADGE_PREFIX=CS
```

## 🔐 Security Best Practices

### 1. Environment Setup
```bash
# ✅ DO: Use .env files for secrets
echo "SUPABASE_URL=your_url" >> backend/.env

# ❌ DON'T: Hardcode secrets in source code
const supabaseUrl = "https://hardcoded-url.supabase.co"; // NEVER DO THIS!
```

### 2. JWT Token Security
```bash
# Generate secure JWT secrets (run these commands)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Database Security
- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Parameterized queries** prevent SQL injection
- ✅ **Admin service role** for bypassing RLS when needed
- ✅ **Regular backups** of critical data

### 4. API Security
- ✅ **Rate limiting** prevents abuse
- ✅ **CORS** configured for specific domains
- ✅ **Helmet** adds security headers
- ✅ **Input validation** on all endpoints
- ✅ **JWT tokens** expire after 7 days

### 5. File Upload Security
- ✅ **File type validation** (only allowed types)
- ✅ **File size limits** (10MB max)
- ✅ **Virus scanning** (implement in production)
- ✅ **Secure storage** in Supabase Storage

## 🚨 Security Checklist

### Pre-Development
- [ ] Environment variables configured in `backend/.env`
- [ ] JWT secrets generated and stored securely
- [ ] Supabase project created with strong database password
- [ ] `.gitignore` files properly configured

### Development
- [ ] Never commit `.env` files
- [ ] Use environment variables for all sensitive data
- [ ] Test with non-production data
- [ ] Regular security updates for dependencies

### Pre-Production
- [ ] Change all default passwords
- [ ] Use production-grade secrets
- [ ] Enable SSL/HTTPS everywhere
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Test authentication and authorization
- [ ] Verify RLS policies work correctly

### Production
- [ ] Use managed database (Supabase/Railway/AWS RDS)
- [ ] Set up automated backups
- [ ] Configure monitoring and alerting
- [ ] Set up log rotation and retention
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use CDN for static assets
- [ ] Implement proper error handling (don't leak info)

## 🔧 Secure Configuration Examples

### Strong CORS Configuration
```javascript
// backend/src/index.ts
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://admin.yourdomain.com']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Secure Headers
```javascript
// backend/src/index.ts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Rate Limiting
```javascript
// backend/src/index.ts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);
```

## 🛠️ Tools & Commands

### Generate Secure Secrets
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate database password
openssl rand -base64 32

# Generate API key
uuidgen | tr '[:upper:]' '[:lower:]'
```

### Check for Exposed Secrets
```bash
# Scan for potential secrets in code
grep -r "password\|secret\|key\|token" src/ --exclude-dir=node_modules

# Check git history for accidentally committed secrets
git log -p --all -S "password" --source --all
```

### Environment Variable Validation
```bash
# Check if required environment variables are set
node -e "
const required = ['SUPABASE_URL', 'JWT_SECRET', 'SUPABASE_SERVICE_KEY'];
required.forEach(key => {
  if (!process.env[key]) console.log('❌ Missing:', key);
  else console.log('✅ Set:', key);
});
"
```

## 🚨 Incident Response

If secrets are accidentally committed:

1. **Immediately rotate all exposed secrets**
2. **Force push to remove from history** (if caught early)
3. **Notify team members**
4. **Check for unauthorized access**
5. **Update all environments with new secrets**

### Remove secrets from Git history
```bash
# Use git-filter-branch to remove sensitive files
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch backend/.env' \
  --prune-empty --tag-name-filter cat -- --all

# Force push to remote
git push origin --force --all
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🆘 Emergency Contacts

For security incidents:
- Development Team: `dev-security@yourdomain.com`
- Infrastructure Team: `infra@yourdomain.com`
- Legal/Compliance: `legal@yourdomain.com`

---

**Remember: Security is everyone's responsibility. When in doubt, err on the side of caution!** 🛡️
