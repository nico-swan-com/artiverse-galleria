# Security Documentation

This document outlines the security measures implemented in the Artiverse Galleria application.

## Security Headers

The application includes the following security headers configured in `next.config.ts`:

- **X-Frame-Options: DENY** - Prevents the page from being displayed in a frame, iframe, or embed, protecting against clickjacking attacks.
- **X-Content-Type-Options: nosniff** - Prevents browsers from MIME-sniffing a response away from the declared content-type, reducing exposure to drive-by download attacks.
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls how much referrer information is sent with requests, protecting user privacy.
- **Permissions-Policy: camera=(), microphone=(), geolocation=()** - Restricts access to browser features, preventing unauthorized access to sensitive device capabilities.
- **X-DNS-Prefetch-Control: on** - Enables DNS prefetching for improved performance.
- **Strict-Transport-Security** - Enforces secure (HTTPS) connections to the server (only for server-side rendered builds).

## Rate Limiting

Rate limiting is implemented to prevent abuse and protect against brute force attacks. The application uses an in-memory rate limiter based on LRU cache for development and small deployments.

### Rate Limit Configurations

- **Authentication endpoints** (`/login`, `/register`): 5 attempts per 15 minutes per IP
- **Media upload endpoints** (`/api/media`, `/api/media/upload`): 10 requests per minute per IP
- **Contact form submissions**: 3 submissions per hour per IP
- **Webhook endpoints** (`/api/billing/webhook`): 200 requests per minute per IP
- **General API routes**: 100 requests per minute per IP

### Implementation

Rate limiting is implemented using:

- `src/lib/security/rate-limiter.ts` - Core rate limiting logic
- `src/lib/security/rate-limit-config.ts` - Configuration definitions
- `src/lib/security/with-rate-limit.ts` - Helper functions for applying rate limits

API routes are wrapped with `withRateLimit()` higher-order function, and server actions use `checkRateLimit()` at the start of the action.

### Rate Limit Response

When a rate limit is exceeded, the API returns:

- HTTP Status: 429 (Too Many Requests)
- Response body includes error message and retry information
- Headers include `Retry-After` indicating when to retry

## CSRF Protection

The Next.js App Router provides built-in CSRF (Cross-Site Request Forgery) protection for server actions and API routes.

### Server Actions Protection

Next.js automatically protects server actions (functions marked with `'use server'`) by:

- Validating the `Origin` header on requests
- Checking that requests originate from the same origin
- Rejecting requests from unauthorized origins

This protection is enabled by default and requires no additional configuration.

### API Routes Protection

For API routes, CSRF protection should be implemented manually if needed. The application uses:

- **Same-Origin Policy** - API routes should only be called from the same origin
- **CORS Configuration** - Configured in `next.config.ts` if cross-origin requests are needed
- **Origin Validation** - Can be added manually for sensitive endpoints

### Best Practices

1. **Server Actions**: Use server actions for form submissions instead of API routes when possible
2. **API Routes**: Validate `Origin` header for sensitive operations
3. **CORS**: Only enable CORS for trusted origins
4. **Tokens**: Consider adding CSRF tokens for additional protection if needed

## Authentication & Authorization

- **NextAuth.js v5** - Handles authentication with JWT session strategy
- **Password Hashing** - Uses bcrypt for secure password storage
- **Role-Based Access Control (RBAC)** - Implements role-based permissions via `requireAuth()` function
- **Session Management** - Secure session handling with configurable expiration

## Input Validation

- **Zod Schemas** - All user inputs are validated using Zod schemas
- **Environment Variables** - Validated at startup using Zod
- **Type Safety** - TypeScript strict mode enabled for compile-time safety

## Database Security

- **Parameterized Queries** - All database queries use parameterized statements via Drizzle ORM, preventing SQL injection
- **Transaction Support** - Database operations use transactions where appropriate to maintain data integrity
- **Soft Deletes** - Implements soft delete pattern to maintain data history

## Error Handling

- **Centralized Error Handling** - Custom error classes and centralized error handler
- **Error Logging** - All errors are logged with appropriate context
- **User-Friendly Messages** - Generic error messages returned to clients to prevent information leakage

## Security Best Practices

1. **Never log sensitive data** - Passwords, tokens, and other sensitive information are never logged
2. **HTTPS in production** - All production deployments should use HTTPS
3. **Environment variables** - Sensitive configuration stored in environment variables, never committed to source control
4. **Dependencies** - Regular dependency updates and security audits
5. **CORS** - Configured appropriately for API endpoints

## Known Limitations

- **Rate Limiting Storage** - Currently uses in-memory storage (LRU cache). For production at scale, consider using Redis-based rate limiting.
- **IP Detection** - IP detection relies on headers (`x-forwarded-for`, `x-real-ip`). Ensure your reverse proxy/load balancer forwards these headers correctly.
- **Session Storage** - Sessions are stored in JWT tokens. For enhanced security, consider database-backed sessions for sensitive operations.

## Security Audit Checklist

Before deploying to production:

- [ ] All environment variables properly configured
- [ ] HTTPS/SSL certificates configured
- [ ] Rate limiting thresholds reviewed for production load
- [ ] Database credentials secured
- [ ] SMTP credentials secured
- [ ] NextAuth secret is strong and unique
- [ ] Error logging configured to capture security events
- [ ] Regular dependency updates scheduled
- [ ] Security headers verified using security header testing tools
- [ ] Rate limiting tested under load

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly. Do not open public issues.

Contact: [hi@nicoswan.com](mailto:hi@nicoswan.com)

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
