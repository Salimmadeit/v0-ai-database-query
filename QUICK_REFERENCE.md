# Quick Reference Guide

Fast reference for common tasks and configurations.

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Kinde credentials

# Run development server
pnpm dev

# Open browser
http://localhost:3000
```

## Environment Variables

```env
# Required for Kinde Auth
KINDE_CLIENT_ID=your_client_id_here
KINDE_CLIENT_SECRET=your_client_secret_here
KINDE_ISSUER_URL=https://yourapp.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Main query interface |
| `/dashboard` | Protected | User dashboard |
| `/demo/[id]` | Public | Shared demo page |
| `/api/auth/[kindeAuth]` | Public | Kinde auth endpoints |

## Key Components

### Client Components
- `QueryPageClient` - Main query interface
- `ShareDemoDialog` - Demo sharing modal
- `AuthHeader` - Authentication UI
- `UserProfile` - User dropdown menu

### Server Components
- `app/page.tsx` - Home page
- `app/dashboard/page.tsx` - Dashboard
- `app/demo/[id]/page.tsx` - Demo viewer

## Common Tasks

### Enable Magic Link

1. Go to Kinde Dashboard
2. Settings > Authentication > Email
3. Toggle "Magic link" ON
4. Save

### Test Authentication

1. Click "Sign In" on home page
2. Enter your email
3. Check inbox for magic link
4. Click link to log in
5. Redirected to dashboard

### Share a Query

1. Run a query
2. Click "Share Query" button
3. Click "Create Share Link"
4. Copy and share the link

### Access a Demo

1. Open demo link: `/demo/[id]`
2. View query and results
3. No login required

## API Endpoints

### Generate SQL
```bash
POST /api/generate-sql
Content-Type: application/json

{
  "question": "Show me top customers"
}
```

### Save Demo
```bash
POST /api/demos/save
Content-Type: application/json

{
  "query": { /* QueryHistoryItem */ },
  "isPublic": true
}
```

### Get Schema
```bash
GET /api/schema
```

## Middleware Logic

```typescript
// Public routes
if (pathname.startsWith("/demo/")) {
  return next();
}

// Protected routes
if (pathname.startsWith("/dashboard")) {
  return withAuth(req);
}

// Default: public
return next();
```

## Type Definitions

### QueryHistoryItem
```typescript
{
  id: string;
  naturalLanguage: string;
  sql: string;
  explanation: string;
  timestamp: number;
  rowCount: number;
  executionTimeMs: number;
  starred: boolean;
  userId?: string;
}
```

### SavedDemo
```typescript
{
  id: string;
  userId?: string;
  query: QueryHistoryItem;
  createdAt: number;
  isPublic: boolean;
}
```

## Storage Functions

```typescript
// Save demo
saveDemoToStorage(demo);

// Get demo
const demo = getDemoFromStorage(id);

// Get all demos
const demos = getAllDemosFromStorage();

// Get user demos
const userDemos = getUserDemosFromStorage(userId);

// Delete demo
deleteDemoFromStorage(id);
```

## Auth Functions

```typescript
// Server-side
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const { getUser } = getKindeServerSession();
const user = await getUser();
console.log(user?.id, user?.email);

// Check authentication
import { isAuthenticated } from "@/lib/auth";
const authed = await isAuthenticated();
```

## Common Queries

Try these example queries:

```
"Show me all employees"
"What are the top 5 products by revenue?"
"List departments with their employee count"
"Show customers from USA"
"What's the average salary by department?"
"Show recent orders"
"Which products are out of stock?"
```

## Kinde Dashboard Tasks

### Get API Credentials
1. Applications > Your App
2. Copy Client ID
3. Copy Client Secret
4. Copy Issuer URL

### Configure Callbacks
1. Applications > Your App > Settings
2. Add Allowed callback URLs:
   - `http://localhost:3000/api/auth/kinde_callback`
3. Add Allowed logout redirect URLs:
   - `http://localhost:3000`

### Enable Magic Link
1. Settings > Authentication
2. Email tab
3. Enable "Magic link"
4. Save

### Customize Email
1. Settings > Email > Templates
2. Select "Magic link email"
3. Edit subject, body, button
4. Save

## Debugging

### Check Auth Status
```typescript
// In a server component
const { getUser } = getKindeServerSession();
const user = await getUser();
console.log("User:", user);
```

### Check Demo Storage
```typescript
// In browser console
localStorage.getItem('querylens_demos')
```

### View Network Requests
1. Open DevTools (F12)
2. Network tab
3. Filter by "Fetch/XHR"
4. Test feature
5. Inspect requests

### Check Console Logs
1. Open DevTools (F12)
2. Console tab
3. Look for errors
4. Check warnings

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Magic link not received | Check spam folder, verify email |
| Can't access dashboard | Ensure logged in, check auth |
| Demo not loading | Check localStorage, verify ID |
| Share button missing | Run a query first |
| Routes not protected | Verify middleware config |

## Production Deployment

### Environment Variables
```env
# Update for production
KINDE_SITE_URL=https://yourdomain.com
KINDE_POST_LOGOUT_REDIRECT_URL=https://yourdomain.com
KINDE_POST_LOGIN_REDIRECT_URL=https://yourdomain.com/dashboard
```

### Kinde Configuration
1. Add production callback URLs
2. Configure custom email provider
3. Set up custom domain (optional)
4. Test thoroughly

### Vercel Deployment
```bash
# Deploy to Vercel
vercel

# Or push to Git (auto-deploy)
git push origin main
```

## File Locations

| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection |
| `lib/auth.ts` | Auth utilities |
| `lib/demo-storage.ts` | Demo storage |
| `lib/types.ts` | TypeScript types |
| `components/share-demo-dialog.tsx` | Share modal |
| `.env.local` | Environment config |

## Resources

- [Full Setup Guide](./START_HERE.md)
- [Magic Link Guide](./MAGIC_LINK_SETUP.md)
- [Features List](./FEATURES.md)
- [Implementation Details](./IMPLEMENTATION_SUMMARY.md)
- [Kinde Docs](https://kinde.com/docs/)
- [Next.js Docs](https://nextjs.org/docs)

## Support

Need help?
1. Check documentation files
2. Review Kinde documentation
3. Check console for errors
4. Test in incognito mode
5. Clear cache and cookies

## Tips

- Use incognito mode to test public access
- Check localStorage to debug demos
- Verify environment variables are set
- Test both logged in and logged out states
- Use DevTools Network tab to debug API calls
- Check Kinde logs for authentication issues

---

For detailed information, see the full documentation files in the root directory.
