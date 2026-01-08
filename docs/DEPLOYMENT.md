# Deployment Guide

This guide covers deploying AutoArchitect to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:

1. **Gemini API Key** (Required)
   - Get one at: https://makersuite.google.com/app/apikey
   
2. **Supabase Project** (Optional, for multi-user)
   - Create at: https://supabase.com
   
3. **GitHub OAuth App** (Optional)
   - Register at: https://github.com/settings/developers
   
4. **Notion Integration** (Optional)
   - Create at: https://www.notion.so/my-integrations

---

## Vercel Deployment

### Automatic Deployment (Recommended)

1. **Fork the repository**

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Select your forked repository
   - Click "Import"

3. **Configure Environment Variables**
   
   Add these in Vercel dashboard → Settings → Environment Variables:
   
   ```
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_GITHUB_CLIENT_ID=your_github_client_id
   VITE_NOTION_API_KEY=secret_xxxx
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your deployed site!

### Manual Deployment via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VITE_GEMINI_API_KEY
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### GitHub Actions (CI/CD)

The repository includes a GitHub Actions workflow that automatically:
- Runs tests on pull requests
- Deploys to Vercel on main branch pushes
- Builds and pushes Docker image

**Required Secrets:**
- `VERCEL_TOKEN` - Get from Vercel dashboard
- `VERCEL_ORG_ID` - Found in project settings
- `VERCEL_PROJECT_ID` - Found in project settings
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token

---

## Docker Deployment

### Local Docker

```bash
# Build image
docker build -t autoarchitect:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e VITE_GEMINI_API_KEY=your_key \
  -e VITE_SUPABASE_URL=https://xxxxx.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your_anon_key \
  --name autoarchitect \
  autoarchitect:latest

# View logs
docker logs -f autoarchitect

# Stop container
docker stop autoarchitect
```

### Docker Compose

```bash
# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Production Docker

For production deployments, consider:

1. **Use multi-stage builds** (already configured in Dockerfile)
2. **Health checks** (included in Dockerfile)
3. **Resource limits**:

```bash
docker run -d \
  -p 3000:3000 \
  --memory="512m" \
  --cpus="1.0" \
  -e VITE_GEMINI_API_KEY=your_key \
  autoarchitect:latest
```

### Kubernetes

Example deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: autoarchitect
spec:
  replicas: 3
  selector:
    matchLabels:
      app: autoarchitect
  template:
    metadata:
      labels:
        app: autoarchitect
    spec:
      containers:
      - name: autoarchitect
        image: your-registry/autoarchitect:latest
        ports:
        - containerPort: 3000
        env:
        - name: VITE_GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: autoarchitect-secrets
              key: gemini-key
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: autoarchitect
spec:
  selector:
    app: autoarchitect
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |

### Optional (Multi-User Features)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |

### Optional (Integrations)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth client ID | `Iv1.abcd1234` |
| `VITE_GITHUB_REDIRECT_URI` | OAuth callback URL | `https://yourdomain.com/auth/callback/github` |
| `VITE_NOTION_API_KEY` | Notion integration token | `secret_xxx` |
| `VITE_NOTION_DATABASE_ID` | Notion database ID | `abc123...` |

---

## Supabase Setup

### 1. Create Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization and region
4. Set database password
5. Wait for setup to complete

### 2. Run Database Migration

**Option A: Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push migration
supabase db push
```

**Option B: SQL Editor**
1. Open Supabase dashboard
2. Go to SQL Editor
3. Copy content from `supabase/migrations/001_initial_schema.sql`
4. Execute the SQL

### 3. Configure OAuth

**GitHub:**
1. In Supabase dashboard: Authentication → Providers → GitHub
2. Enable GitHub provider
3. Add your GitHub OAuth credentials
4. Set redirect URL: `https://yourdomain.com/auth/callback`

**Google:**
1. Create OAuth app in Google Cloud Console
2. Enable in Supabase: Authentication → Providers → Google
3. Add client ID and secret

### 4. Get API Credentials

1. Go to Project Settings → API
2. Copy Project URL → Use as `VITE_SUPABASE_URL`
3. Copy `anon` `public` key → Use as `VITE_SUPABASE_ANON_KEY`

### 5. Test Connection

```typescript
import { supabase } from './lib/supabase';

// Test query
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .limit(1);

console.log('Supabase connected:', !error);
```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Application loads correctly
- [ ] Authentication works (if configured)
- [ ] AI generation works (Gemini)
- [ ] Database queries work (if Supabase configured)
- [ ] OAuth login works (if configured)

### 2. Configure Integrations

**GitHub:**
1. Navigate to app settings
2. Connect GitHub account
3. Test Gist creation

**Notion:**
1. Add Notion credentials in settings
2. Test page export

### 3. Monitor Performance

**Vercel:**
- Check Analytics dashboard
- Monitor function invocations
- Review error logs

**Docker:**
```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' autoarchitect

# Monitor resource usage
docker stats autoarchitect
```

### 4. Security Checklist

- [ ] Environment variables are secure (not in code)
- [ ] OAuth redirect URLs are whitelisted
- [ ] Supabase RLS policies are active
- [ ] API keys are rotated regularly
- [ ] HTTPS is enabled
- [ ] Security headers are configured (see vercel.json)

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Supabase Connection Issues

1. Check URL and key are correct
2. Verify project is active in Supabase dashboard
3. Check RLS policies allow access
4. Test connection from local environment

### OAuth Not Working

1. Verify redirect URI matches exactly
2. Check OAuth app is approved/published
3. Ensure callback route exists
4. Check browser console for errors

### Docker Image Too Large

```bash
# Use .dockerignore properly
# Ensure node_modules not copied
# Use alpine base image (already done)

# Check image size
docker images autoarchitect
```

---

## Scaling

### Vercel (Auto-scales)
- Automatically scales based on traffic
- No configuration needed
- Monitor usage in dashboard

### Docker (Manual scaling)

```bash
# Horizontal scaling with Docker Swarm
docker swarm init
docker service create \
  --name autoarchitect \
  --replicas 3 \
  --publish 3000:3000 \
  autoarchitect:latest
```

### Kubernetes (Advanced)

```bash
# Scale deployment
kubectl scale deployment autoarchitect --replicas=5

# Horizontal pod autoscaler
kubectl autoscale deployment autoarchitect \
  --cpu-percent=50 \
  --min=2 \
  --max=10
```

---

## Backup & Recovery

### Database Backups

Supabase automatically backs up your database daily. To manually export:

```bash
# Using Supabase CLI
supabase db dump > backup.sql

# Restore
supabase db reset --db-url your-connection-string < backup.sql
```

### Application State

User data is stored in Supabase and backed up automatically. For offline users (IndexedDB), data is local to their device.

---

## Support

- **Documentation**: https://github.com/Krosebrook/autoarchitect/tree/main/docs
- **Issues**: https://github.com/Krosebrook/autoarchitect/issues
- **Discussions**: https://github.com/Krosebrook/autoarchitect/discussions
