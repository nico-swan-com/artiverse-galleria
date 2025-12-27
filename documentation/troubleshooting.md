# Troubleshooting Guide

Common issues and solutions for Artiverse Galleria.

## Table of Contents

1. [Database Issues](#database-issues)
2. [Build Errors](#build-errors)
3. [Test Failures](#test-failures)
4. [Authentication Issues](#authentication-issues)
5. [Media Upload Issues](#media-upload-issues)
6. [Performance Issues](#performance-issues)
7. [Deployment Issues](#deployment-issues)

## Database Issues

### Connection Refused

**Symptoms:**

- Error: `ECONNREFUSED` or `Connection refused`
- Application fails to start

**Solutions:**

1. Verify PostgreSQL is running:

   ```bash
   # Linux/Mac
   sudo systemctl status postgresql
   # Or
   pg_isready
   ```

2. Check connection settings in `.env`:

   ```bash
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

3. Verify database exists:

   ```bash
   psql -U artiverse -d artiverse_galleria -c "SELECT 1;"
   ```

4. Check firewall rules if using remote database

### Authentication Failed

**Symptoms:**

- Error: `password authentication failed`

**Solutions:**

1. Verify credentials in `.env`
2. Reset database user password if needed
3. Check `pg_hba.conf` for authentication method

### Migration Errors

**Symptoms:**

- Migration fails to apply
- Schema mismatch errors

**Solutions:**

1. Check current database schema:

   ```bash
   npm run db:studio
   ```

2. Review migration files for conflicts

3. Reset database (development only):

   ```bash
   # WARNING: This deletes all data
   dropdb artiverse_galleria
   createdb artiverse_galleria
   npm run db:push
   ```

4. Apply migrations manually if needed

## Build Errors

### TypeScript Errors

**Symptoms:**

- Type errors during build
- `tsc` fails

**Solutions:**

1. Check TypeScript version compatibility
2. Clear build cache:

   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   ```

3. Verify `tsconfig.json` settings

4. Check for type errors:
   ```bash
   npm run lint
   ```

### Module Not Found

**Symptoms:**

- Error: `Cannot find module`
- Import errors

**Solutions:**

1. Reinstall dependencies:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check import paths (should use `@/` alias)

3. Verify file exists at path

4. Check `tsconfig.json` path mappings

### Out of Memory

**Symptoms:**

- Build fails with memory error
- Process killed

**Solutions:**

1. Increase Node.js memory:

   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

2. Build in production mode only

3. Disable source maps if not needed

## Test Failures

### Tests Timeout

**Symptoms:**

- Tests hang or timeout
- Jest timeout errors

**Solutions:**

1. Increase timeout in `jest.config.ts`:

   ```typescript
   testTimeout: 10000
   ```

2. Check for unclosed connections (database, etc.)

3. Verify mocks are properly set up

### Mock Errors

**Symptoms:**

- Mock not working
- `Cannot read property of undefined`

**Solutions:**

1. Verify mock setup in test file
2. Check mock implementation matches actual
3. Clear mocks between tests:
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks()
   })
   ```

### Database Test Issues

**Symptoms:**

- Tests fail with database errors
- Connection issues in tests

**Solutions:**

1. Use test database or mocks
2. Ensure database is mocked in tests
3. Check test environment variables

## Authentication Issues

### Session Not Persisting

**Symptoms:**

- User logged out on refresh
- Session cookie not set

**Solutions:**

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches actual URL
3. Verify cookie settings in NextAuth config
4. Check browser cookie settings

### Login Fails

**Symptoms:**

- "Invalid credentials" error
- Cannot log in

**Solutions:**

1. Verify user exists in database
2. Check password hashing (bcrypt)
3. Verify credentials in database
4. Check authentication logs

### Authorization Errors

**Symptoms:**

- "Unauthorized" errors
- Cannot access protected routes

**Solutions:**

1. Verify user role in database
2. Check `requireAuth()` calls
3. Verify middleware configuration
4. Check role-based access control logic

## Media Upload Issues

### Upload Fails

**Symptoms:**

- File upload error
- "File too large" error

**Solutions:**

1. Check file size limits:
   - Next.js: `SERVER_ACTIONS_BODY_SIZE_LIMIT`
   - Database: bytea size limits

2. Verify file type is allowed:
   - Check `VALIDATION_CONSTANTS.ALLOWED_IMAGE_TYPES`

3. Check database storage capacity

4. Verify media service is working

### Image Processing Errors

**Symptoms:**

- Sharp processing fails
- Image not displaying

**Solutions:**

1. Verify Sharp is installed:

   ```bash
   npm list sharp
   ```

2. Check image format support

3. Verify image buffer is valid

4. Check Sharp version compatibility

## Performance Issues

### Slow Page Loads

**Symptoms:**

- Pages load slowly
- Timeout errors

**Solutions:**

1. Check database query performance
2. Add database indexes
3. Enable caching
4. Optimize images
5. Check network latency

### High Memory Usage

**Symptoms:**

- Application uses too much memory
- Server crashes

**Solutions:**

1. Check for memory leaks
2. Limit concurrent requests
3. Optimize image processing
4. Use streaming for large files
5. Monitor memory usage

### Database Slow Queries

**Symptoms:**

- Database queries are slow
- Timeout errors

**Solutions:**

1. Add indexes on frequently queried columns
2. Optimize query patterns
3. Use connection pooling
4. Check database server resources
5. Analyze slow queries

## Deployment Issues

### Build Fails in Production

**Symptoms:**

- Build works locally but fails in CI/CD
- Environment-specific errors

**Solutions:**

1. Verify environment variables are set
2. Check Node.js version matches
3. Verify all dependencies are in `package.json`
4. Check build logs for specific errors

### Application Won't Start

**Symptoms:**

- Container/process exits immediately
- Port already in use

**Solutions:**

1. Check application logs
2. Verify port is available:

   ```bash
   lsof -i :3000
   ```

3. Check environment variables
4. Verify database connection
5. Check for startup errors in logs

### Static Assets Not Loading

**Symptoms:**

- Images/CSS not loading
- 404 errors for assets

**Solutions:**

1. Verify build output includes assets
2. Check `public/` directory
3. Verify asset paths
4. Check CDN configuration if used

## Debugging Tips

### Enable Debug Logging

Set environment variable:

```bash
DEBUG=*
```

Or for specific modules:

```bash
DEBUG=next:* npm run dev
```

### Check Application Logs

```bash
# Docker
docker logs artiverse-galleria

# PM2
pm2 logs

# Systemd
journalctl -u artiverse-galleria
```

### Database Debugging

```bash
# Connect to database
psql -U artiverse -d artiverse_galleria

# Check connections
SELECT * FROM pg_stat_activity;

# Check table sizes
SELECT pg_size_pretty(pg_total_relation_size('artiverse.users'));
```

### Network Debugging

```bash
# Check if port is listening
netstat -tulpn | grep 3000

# Test database connection
psql -h localhost -U artiverse -d artiverse_galleria
```

## Getting Help

If issues persist:

1. Check application logs
2. Review error messages carefully
3. Search for similar issues in:
   - Next.js documentation
   - Drizzle ORM documentation
   - NextAuth.js documentation
4. Check GitHub issues
5. Review code changes that might have caused issue

## Common Error Messages

### "Module not found: Can't resolve '@/...'"

**Solution:** Check `tsconfig.json` path mappings and file exists

### "Invalid credentials"

**Solution:** Verify user exists and password is correct

### "Rate limit exceeded"

**Solution:** Wait for rate limit window to reset or adjust limits

### "Database connection timeout"

**Solution:** Check database is running and network connectivity

### "Cannot read property of undefined"

**Solution:** Check for null/undefined values, add null checks
