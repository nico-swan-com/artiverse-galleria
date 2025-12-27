# Deployment Guide

This guide covers deploying Artiverse Galleria to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Docker Deployment](#docker-deployment)
5. [Production Checklist](#production-checklist)
6. [Build and Start Commands](#build-and-start-commands)
7. [Database Migrations](#database-migrations)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18.17.0 or higher
- PostgreSQL 12 or higher
- Docker (optional, for containerized deployment)
- Environment variables configured

## Environment Setup

### 1. Copy Environment File

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and set all required variables:

```bash
# Database
POSTGRES_HOST=your-db-host
POSTGRES_PORT=5432
POSTGRES_USER=artiverse
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DATABASE=artiverse_galleria

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# SMTP
SMTP_SERVER_HOST=smtp.example.com
SMTP_SERVER_PORT=587
SMTP_SERVER_USERNAME=your-username
SMTP_SERVER_PASSWORD=your-password
SITE_MAIL_RECEIVER=admin@example.com
```

### 3. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

## Database Setup

### 1. Create Database

```sql
CREATE DATABASE artiverse_galleria;
CREATE USER artiverse WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE artiverse_galleria TO artiverse;
```

### 2. Run Migrations

```bash
# Generate migration files (if schema changed)
npm run db:generate

# Apply migrations
npm run db:push

# Or use Drizzle Studio to manage migrations
npm run db:studio
```

### 3. Seed Database (Optional)

```bash
npm run db:seed
```

## Docker Deployment

### 1. Build Docker Image

```bash
docker build -t artiverse-galleria:latest .
```

### 2. Run Container

```bash
docker run -d \
  --name artiverse-galleria \
  -p 3000:3000 \
  --env-file .env \
  artiverse-galleria:latest
```

### 3. Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    env_file:
      - .env
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: artiverse
      POSTGRES_PASSWORD: your-password
      POSTGRES_DB: artiverse_galleria
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    restart: unless-stopped

volumes:
  postgres_data:
```

Start services:

```bash
docker-compose up -d
```

## Production Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Database backups configured
- [ ] SSL/TLS certificates installed
- [ ] Domain DNS configured
- [ ] SMTP server configured and tested
- [ ] NextAuth secret generated
- [ ] Security headers verified
- [ ] Rate limiting configured
- [ ] Error tracking set up (optional)

### Application

- [ ] Production build tested locally
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Performance optimized
- [ ] Images optimized
- [ ] Static assets cached

### Security

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Authentication working
- [ ] Authorization checks in place
- [ ] Input validation on all forms
- [ ] SQL injection protection (ORM)
- [ ] XSS protection verified

### Monitoring

- [ ] Application logs configured
- [ ] Error tracking active (optional)
- [ ] Performance monitoring (optional)
- [ ] Database monitoring (optional)
- [ ] Uptime monitoring (optional)

## Build and Start Commands

### Development

```bash
npm run dev
```

### Production Build

```bash
# Standard build
npm run build

# Standalone build (for Docker)
npm run build:standalone

# Static build (for static hosting)
npm run build:static
```

### Start Production Server

```bash
# Standard start
npm start

# Or with Next.js directly
npm run start:next
```

### Standalone Server

If using standalone build:

```bash
node server.js
```

## Database Migrations

### Generate Migration

After schema changes:

```bash
npm run db:generate
```

This creates migration files in `src/lib/database/migrations-drizzle/`

### Apply Migrations

```bash
# Push schema changes directly (development)
npm run db:push

# Or use migration files (production recommended)
# Review migration files, then apply
```

### Migration Strategy for Production

1. **Test migrations locally** first
2. **Backup database** before applying
3. **Apply during maintenance window** if breaking changes
4. **Monitor** for errors during migration
5. **Rollback plan** ready if needed

### Rollback

If using migration files, create reverse migrations or restore from backup.

## Environment-Specific Configuration

### Development

- `NODE_ENV=development`
- `SMTP_SIMULATOR=true` (don't send real emails)
- Local PostgreSQL or Docker
- Debug logging enabled

### Production

- `NODE_ENV=production`
- `SMTP_SIMULATOR=false`
- Production PostgreSQL
- Error logging only
- `POSTGRES_SSL=true` if using managed database

## Reverse Proxy Setup (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Scaling Considerations

### Horizontal Scaling

- Use Redis for shared rate limiting
- Use shared session store (Redis)
- Load balancer with sticky sessions
- Database connection pooling (PgBouncer)

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Add database indexes
- Use CDN for static assets

## Backup Strategy

### Database Backups

```bash
# Manual backup
pg_dump -h localhost -U artiverse artiverse_galleria > backup.sql

# Automated backups (cron job)
0 2 * * * pg_dump -h localhost -U artiverse artiverse_galleria > /backups/db-$(date +\%Y\%m\%d).sql
```

### Media Files

- Backup media files separately (stored in database as bytea)
- Consider moving to object storage (S3, etc.) for large deployments

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check PostgreSQL is running
   - Verify connection credentials
   - Check firewall rules
   - Verify SSL settings

2. **Build Failures**
   - Clear `.next` directory: `rm -rf .next`
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version

3. **Environment Variable Issues**
   - Verify all required variables are set
   - Check for typos in variable names
   - Restart application after changes

4. **Migration Errors**
   - Check database permissions
   - Verify schema matches migrations
   - Review migration files for errors

See [Troubleshooting Guide](./troubleshooting.md) for more details.

## Support

For deployment issues, check:

- Application logs
- Database logs
- Server logs
- Error tracking (if configured)
