# Security Policy

## Overview

AutoArchitect implements defense-in-depth security with multiple layers of protection for data, authentication, and API access.

---

## Authentication & Authorization

### Multi-Factor Authentication
- **Email/Password**: Minimum 8 characters, complexity requirements
- **OAuth**: GitHub, Google (future) with PKCE flow
- **Session Management**: JWT tokens, auto-refresh, secure storage

### Role-Based Access Control (RBAC)
- **User Role**: Default for new accounts
  - Create/read/update/delete own blueprints
  - View public blueprints
  - Manage own preferences
- **Admin Role**: Elevated permissions
  - View all blueprints
  - Manage users
  - System configuration

### Row-Level Security (RLS)
All database tables enforce RLS policies ensuring users can only access their own data or explicitly public content.

---

## Data Security

### Encryption
- **In Transit**: HTTPS/TLS 1.3 for all connections
- **At Rest**: Supabase encrypts all database data
- **API Keys**: Stored as environment variables (never in code)
- **User Data**: Encrypted in Supabase vault

### Data Privacy
- **User Isolation**: RLS ensures data separation
- **Public Sharing**: Opt-in only (blueprints default to private)
- **Data Retention**: User controls their data lifecycle
- **GDPR Compliance**: Right to export and delete data

### Sensitive Data Handling
- **API Keys**: Never logged or exposed in errors
- **Passwords**: Hashed with bcrypt (handled by Supabase)
- **OAuth Tokens**: Stored securely in auth session
- **Personal Access Tokens**: Encrypted in user preferences

---

## API Security

### Rate Limiting
- **Gemini API**: Automatic retry with exponential backoff
- **Supabase**: Connection limits enforced per user
- **OAuth APIs**: Respect provider rate limits

### Input Validation
- **Client-Side**: Form validation with Zod schemas
- **Server-Side**: Supabase database constraints
- **SQL Injection**: Parameterized queries only (via Supabase)
- **XSS Prevention**: React auto-escaping + sanitization

---

## Security Headers

Configured in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

---

## Vulnerability Management

### Dependency Security
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix
```

### Security Scanning
- **GitHub Dependabot**: Auto-updates for security patches
- **CodeQL**: Static analysis on pull requests
- **npm audit**: Regular dependency checks

### Reporting Vulnerabilities
Create a private security advisory on GitHub or email security concerns.

**Response Timeline:**
- Acknowledgment: 24 hours
- Initial assessment: 72 hours
- Fix deployment: 7 days (depending on severity)

---

## Security Checklist

### Deployment
- [ ] All API keys stored as environment variables
- [ ] Supabase RLS policies enabled and tested
- [ ] CORS configured properly
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] XSS prevention tested
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Password requirements enforced (min 8 chars)
- [ ] OAuth redirect URIs whitelisted
- [ ] HTTPS enforced (no HTTP)
- [ ] Security headers configured
- [ ] Error messages don't expose sensitive data
- [ ] Audit logging enabled
- [ ] Backup strategy in place

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Vercel Security](https://vercel.com/docs/security)

**Last Updated**: 2025-01-08
