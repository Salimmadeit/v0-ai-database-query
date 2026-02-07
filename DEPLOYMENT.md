# Deployment Guide

Complete guide for deploying QueryLens to production.

## Pre-Deployment Checklist

### Code Ready
- [ ] All features tested locally
- [ ] No console errors
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Environment variables documented

### Kinde Configuration
- [ ] Production app created in Kinde
- [ ] Magic link enabled
- [ ] Email provider configured
- [ ] Custom domain set up (optional)
- [ ] Production URLs ready

### Database (if applicable)
- [ ] Database provisioned
- [ ] Schema deployed
- [ ] Connection tested
- [ ] Backups configured

## Deployment Options

### Option 1: Vercel (Recommended)

#### Why Vercel?
- Built for Next.js
- Automatic deployments
- Zero configuration
- Great performance
- Free tier available

#### Steps

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your Git repository
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
   - Output Directory: `.next`

4. **Set Environment Variables**
   
   In Vercel dashboard > Settings > Environment Variables:
   
   ```env
   KINDE_CLIENT_ID=your_production_client_id
   KINDE_CLIENT_SECRET=your_production_secret
   KINDE_ISSUER_URL=https://yourapp.kinde.com
   KINDE_SITE_URL=https://yourdomain.vercel.app
   KINDE_POST_LOGOUT_REDIRECT_URL=https://yourdomain.vercel.app
   KINDE_POST_LOGIN_REDIRECT_URL=https://yourdomain.vercel.app/dashboard
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your production URL

6. **Update Kinde URLs**
   
   In Kinde dashboard > Applications > Your App > Settings:
   
   Add these URLs:
   ```
   Callback URLs:
   https://yourdomain.vercel.app/api/auth/kinde_callback
   
   Logout redirect URLs:
   https://yourdomain.vercel.app
   ```

### Option 2: Custom Server

#### Requirements
- Node.js 18+ installed
- Process manager (PM2, systemd)
- Reverse proxy (nginx, Caddy)
- SSL certificate

#### Steps

1. **Build Application**
   ```bash
   pnpm install
   pnpm build
   ```

2. **Set Environment Variables**
   ```bash
   # Create .env.production
   KINDE_CLIENT_ID=your_production_client_id
   KINDE_CLIENT_SECRET=your_production_secret
   KINDE_ISSUER_URL=https://yourapp.kinde.com
   KINDE_SITE_URL=https://yourdomain.com
   KINDE_POST_LOGOUT_REDIRECT_URL=https://yourdomain.com
   KINDE_POST_LOGIN_REDIRECT_URL=https://yourdomain.com/dashboard
   ```

3. **Start Production Server**
   ```bash
   # Using npm
   NODE_ENV=production pnpm start
   
   # Using PM2
   pm2 start pnpm --name "querylens" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup SSL**
   ```bash
   # Using Certbot
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 3: Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - KINDE_CLIENT_ID=${KINDE_CLIENT_ID}
      - KINDE_CLIENT_SECRET=${KINDE_CLIENT_SECRET}
      - KINDE_ISSUER_URL=${KINDE_ISSUER_URL}
      - KINDE_SITE_URL=${KINDE_SITE_URL}
      - KINDE_POST_LOGOUT_REDIRECT_URL=${KINDE_POST_LOGOUT_REDIRECT_URL}
      - KINDE_POST_LOGIN_REDIRECT_URL=${KINDE_POST_LOGIN_REDIRECT_URL}
    restart: unless-stopped
```

#### Deploy
```bash
docker-compose up -d
```

## Kinde Production Setup

### 1. Create Production App

1. Go to [Kinde Dashboard](https://app.kinde.com)
2. Create new application or use existing
3. Choose "Regular web application"
4. Configure settings

### 2. Configure URLs

**Allowed callback URLs:**
```
https://yourdomain.com/api/auth/kinde_callback
https://www.yourdomain.com/api/auth/kinde_callback
```

**Allowed logout redirect URLs:**
```
https://yourdomain.com
https://www.yourdomain.com
```

### 3. Enable Magic Link

1. Settings > Authentication
2. Email tab
3. Toggle "Magic link" ON
4. Configure email settings
5. Save

### 4. Email Provider (Production)

For production, configure a proper email provider:

**Options:**
- SendGrid
- Mailgun
- AWS SES
- Postmark

**Setup:**
1. Settings > Email > Email service
2. Choose provider
3. Add API credentials
4. Verify domain
5. Test email delivery

### 5. Custom Domain (Optional)

1. Settings > Domains
2. Add custom domain
3. Update DNS records
4. Verify domain
5. Enable custom domain

## Environment Variables

### Required Variables

```env
# Kinde Authentication
KINDE_CLIENT_ID=             # From Kinde dashboard
KINDE_CLIENT_SECRET=         # From Kinde dashboard (keep secret!)
KINDE_ISSUER_URL=           # https://yourapp.kinde.com
KINDE_SITE_URL=             # Your production URL
KINDE_POST_LOGOUT_REDIRECT_URL=  # Where to go after logout
KINDE_POST_LOGIN_REDIRECT_URL=   # Where to go after login
```

### Optional Variables

```env
# Node environment
NODE_ENV=production

# Analytics (if added)
NEXT_PUBLIC_GA_ID=          # Google Analytics
NEXT_PUBLIC_POSTHOG_KEY=    # PostHog

# Database (if added)
DATABASE_URL=               # PostgreSQL connection string

# Error tracking (if added)
SENTRY_DSN=                 # Sentry error tracking
```

## Post-Deployment

### 1. Test Production

- [ ] Visit production URL
- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Run queries
- [ ] Create demos
- [ ] Share demos
- [ ] Test from mobile
- [ ] Test from different browsers

### 2. Monitor

Set up monitoring:

```bash
# Vercel (automatic)
# Check Vercel dashboard for:
# - Deployment status
# - Error logs
# - Performance metrics
# - Usage stats
```

### 3. Set Up Custom Domain

In Vercel:
1. Go to Settings > Domains
2. Add your domain
3. Update DNS records
4. Wait for verification
5. SSL auto-configured

### 4. Configure Analytics (Optional)

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 5. Error Tracking (Optional)

Install Sentry:
```bash
pnpm add @sentry/nextjs
```

Configure in `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Security Checklist

### Pre-Deployment
- [ ] Environment variables secured
- [ ] No secrets in code
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation active

### Post-Deployment
- [ ] SSL certificate valid
- [ ] Security headers set
- [ ] CSP configured
- [ ] Cookies secure
- [ ] Session timeout set
- [ ] Auth tested

## Performance Optimization

### Vercel Configuration

Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Caching

Already configured in Next.js:
- Static pages cached
- API routes cached where appropriate
- Images optimized automatically

## Rollback Plan

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "..." > "Promote to Production"

### Custom Server
```bash
# Using git
git revert HEAD
git push origin main

# Using PM2
pm2 list
pm2 restart querylens@previous-version
```

## Monitoring & Maintenance

### Health Checks

Create `/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}
```

### Log Monitoring

In Vercel:
- Dashboard > Logs
- Real-time logs
- Error tracking
- Performance metrics

### Uptime Monitoring

Use services like:
- Uptime Robot
- Pingdom
- Better Stack
- StatusCake

## Troubleshooting

### Deployment Fails

1. Check build logs
2. Verify dependencies
3. Test build locally
4. Check environment variables

### Authentication Issues

1. Verify Kinde URLs match
2. Check environment variables
3. Test magic link email
4. Review Kinde logs

### Performance Issues

1. Check server resources
2. Review slow queries
3. Enable caching
4. Optimize images

### Database Issues

1. Check connection string
2. Verify credentials
3. Test connectivity
4. Review query performance

## Support

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Kinde Support:** [kinde.com/support](https://kinde.com/support)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)

## Next Steps

After successful deployment:

1. Monitor for issues
2. Gather user feedback
3. Plan feature updates
4. Optimize performance
5. Scale as needed

---

**Congratulations!** Your QueryLens application is now live! 🎉
