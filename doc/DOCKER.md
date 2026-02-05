# 🐳 Docker Deployment Guide

This guide will help you deploy the Valentine App using Docker on any Linux machine.

## Prerequisites

- Docker installed on your Linux server
- Docker Compose (optional, but recommended)
- PostgreSQL database (Aiven, Supabase, Railway, or self-hosted)
- Google OAuth credentials

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Create/Update `.env` file** with your environment variables:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   NEXTAUTH_URL="http://your-domain.com"
   NEXTAUTH_SECRET="your-secret-key-here"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

2. **Build and run**:
   ```bash
   docker-compose up -d
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Stop the container**:
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker Commands

1. **Build the image**:
   ```bash
   docker build -t valentine-app .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name valentine-app \
     -p 3000:3000 \
     --env-file .env \
     --restart unless-stopped \
     valentine-app
   ```

3. **View logs**:
   ```bash
   docker logs -f valentine-app
   ```

4. **Stop the container**:
   ```bash
   docker stop valentine-app
   docker rm valentine-app
   ```

## Deploying to a Linux Server

### Step 1: Transfer Files to Server

```bash
# Using SCP
scp -r . user@your-server:/opt/valentine-app

# Or use rsync
rsync -avz --exclude 'node_modules' --exclude '.next' . user@your-server:/opt/valentine-app
```

### Step 2: SSH into Server

```bash
ssh user@your-server
cd /opt/valentine-app
```

### Step 3: Set Up Environment Variables

```bash
# Create .env file
nano .env

# Add your environment variables (see Quick Start section)
```

### Step 4: Build and Run

```bash
# Using Docker Compose
docker-compose up -d

# Or using Docker directly
docker build -t valentine-app .
docker run -d --name valentine-app -p 3000:3000 --env-file .env --restart unless-stopped valentine-app
```

### Step 5: Set Up Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/valentine-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/valentine-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Updating the Application

### Using Docker Compose

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Using Docker Commands

```bash
# Stop container
docker stop valentine-app
docker rm valentine-app

# Rebuild image
docker build -t valentine-app .

# Run new container
docker run -d --name valentine-app -p 3000:3000 --env-file .env --restart unless-stopped valentine-app
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs valentine-app
# or
docker-compose logs
```

### Database connection errors

- Verify `DATABASE_URL` is correct
- Check database allows connections from your server IP
- Ensure SSL mode is correct (`sslmode=require`)

### Port already in use

Change the port mapping:
```bash
docker run -p 8080:3000 ...
```

Or stop the process using port 3000:
```bash
sudo lsof -ti:3000 | xargs kill
```

### Prisma Client errors

The Dockerfile automatically generates Prisma Client during build. If you see errors:
1. Rebuild the image: `docker build -t valentine-app .`
2. Ensure Prisma schema is correct

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Base URL of your application | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` for self-signed SSL certs | Optional |

## Production Tips

1. **Use environment variables**: Never commit `.env` file
2. **Set up monitoring**: Use Docker healthchecks or external monitoring
3. **Backup database**: Set up regular PostgreSQL backups
4. **Use Docker secrets**: For production, consider using Docker secrets instead of env files
5. **Resource limits**: Set memory/CPU limits in docker-compose.yml
6. **Log rotation**: Configure log rotation for Docker logs

## Example docker-compose.yml with Resource Limits

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Support

For issues:
- Check Docker logs: `docker logs valentine-app`
- Verify environment variables are set correctly
- Ensure database is accessible from your server
