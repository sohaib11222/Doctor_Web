# Docker Troubleshooting Guide

## Common Issues and Solutions

### 502 Bad Gateway Error

A 502 Bad Gateway typically means nginx is running but can't serve the files, or there's a connection issue.

#### 1. Check Build Logs
```bash
docker build -t mydoctor-web . 2>&1 | tee build.log
```
Look for:
- "Build successful" message
- Any errors during `npm run build`
- Verification that `index.html` exists in `/app/dist`

#### 2. Check Container Logs
```bash
docker logs <container-name-or-id>
```
Look for nginx errors or startup issues.

#### 3. Verify Files in Container
```bash
# Enter the container
docker exec -it <container-name-or-id> sh

# Check if files exist
ls -la /usr/share/nginx/html
cat /usr/share/nginx/html/index.html | head -20

# Check nginx config
nginx -t

# Check nginx error logs
cat /var/log/nginx/error.log
```

#### 4. Test Nginx Directly
```bash
# From inside container
wget http://localhost/health
# Should return "healthy"
```

#### 5. Check Container Health
```bash
docker ps
# Check the STATUS column for health status
```

### Build Issues

#### Build Fails with "dist directory not found"
- Check if `vite.config.js` has correct output directory
- Verify `package.json` has `"build": "vite build"` script
- Check build logs for Vite errors

#### Environment Variables Not Working
- Ensure `.env` file exists (or pass via build args)
- For Docker build: `docker build --build-arg VITE_API_BASE_URL=https://api.example.com/api -t mydoctor-web .`
- For docker-compose: Set in `.env` file or environment

### Traefik Integration Issues

If using Traefik and getting 502:

1. **Check Traefik Configuration**
   - Ensure service is properly labeled
   - Verify port mapping (should be port 80)
   - Check Traefik logs: `docker logs <traefik-container>`

2. **Verify Container is Running**
   ```bash
   docker ps | grep mydoctor
   ```

3. **Test Direct Connection**
   ```bash
   # Test container directly (bypass Traefik)
   docker run -p 8080:80 mydoctor-web
   # Then visit http://localhost:8080
   ```

4. **Check Network**
   - Ensure container is on the same Docker network as Traefik
   - Verify Traefik can reach the container

### Quick Diagnostic Commands

```bash
# Rebuild and check
docker build -t mydoctor-web . --no-cache

# Run with verbose output
docker run -p 8080:80 --name mydoctor-test mydoctor-web

# Check what's actually in the container
docker exec mydoctor-test ls -la /usr/share/nginx/html
docker exec mydoctor-test cat /etc/nginx/conf.d/default.conf

# Test health endpoint
docker exec mydoctor-test wget -O- http://localhost/health
```

### Common Fixes

1. **Clear Docker cache and rebuild**
   ```bash
   docker system prune -a
   docker build -t mydoctor-web . --no-cache
   ```

2. **Verify nginx is running**
   ```bash
   docker exec <container> ps aux | grep nginx
   ```

3. **Check file permissions**
   ```bash
   docker exec <container> ls -la /usr/share/nginx/html
   # Should show nginx:nginx ownership
   ```

4. **Restart container**
   ```bash
   docker restart <container-name>
   ```
