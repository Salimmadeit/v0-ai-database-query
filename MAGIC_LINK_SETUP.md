# Magic Link Authentication Setup

This guide walks you through setting up passwordless magic link authentication with Kinde.

## What is Magic Link Authentication?

Magic link authentication allows users to sign in by clicking a link sent to their email - no password required. It provides:

- Better security (no passwords to steal or forget)
- Improved user experience (no password requirements)
- Reduced friction in signup/signin flows
- Email verification built-in

## Setup Steps

### 1. Enable Magic Link in Kinde Dashboard

1. Log in to your [Kinde Dashboard](https://app.kinde.com)
2. Navigate to **Settings** > **Authentication**
3. Click on the **Email** tab
4. Toggle **Magic link** to enabled
5. Optionally disable password authentication if you want magic link only
6. Click **Save**

### 2. Configure Authentication Methods

In your Kinde dashboard:

1. Go to **Settings** > **Authentication** > **Authentication methods**
2. You'll see these options:
   - **Email + password** - Traditional authentication
   - **Magic link** - Passwordless email authentication
   - **Social providers** - Google, GitHub, etc.

3. For magic link only setup:
   - Enable: **Magic link**
   - Optionally disable: **Email + password**
   - Configure any social providers you want

### 3. Environment Variables

Your `.env.local` should already have these variables set:

```env
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=https://your_subdomain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

No additional configuration needed for magic links!

### 4. Test Magic Link Authentication

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000`

3. Click **Sign In** or **Sign Up**

4. Enter your email address

5. Check your inbox for the magic link email from Kinde

6. Click the link in the email

7. You'll be automatically signed in and redirected to `/dashboard`

## How It Works

### User Flow

1. **User enters email** → Clicks "Sign in" or "Sign up"
2. **Email sent** → Kinde sends magic link to user's inbox
3. **User clicks link** → Link contains secure token
4. **Token validated** → Kinde verifies token authenticity
5. **User authenticated** → Session created, user logged in
6. **Redirect to app** → User sent to `/dashboard`

### Security Features

- **Time-limited tokens** - Links expire after a short period (typically 5-10 minutes)
- **Single-use tokens** - Each link can only be used once
- **Email verification** - Proves user owns the email address
- **No password storage** - Eliminates password-related vulnerabilities
- **HTTPS required** - Production requires secure connections

## Customization

### Email Templates

Customize the magic link email in Kinde dashboard:

1. Go to **Settings** > **Email** > **Templates**
2. Select **Magic link email**
3. Customize:
   - Subject line
   - Email body
   - Button text
   - Colors and branding
4. Preview and save

### Magic Link Expiration

Configure link expiration time:

1. Go to **Settings** > **Authentication** > **Email**
2. Find **Magic link expiration** setting
3. Set desired duration (default: 5 minutes)
4. Save changes

### Sign In/Sign Up Experience

You can customize whether magic links are used for:
- Sign in only
- Sign up only
- Both sign in and sign up

Configure in **Settings** > **Authentication** > **Email**

## Route Protection

The middleware is configured to:

### Protected Routes (Require Login)
- `/dashboard` - Main user dashboard
- Any route starting with `/dashboard/*`

### Public Routes (No Login Required)
- `/` - Home page (main query interface)
- `/demo/[id]` - Shared demo pages
- `/api/*` - API routes (except auth)

### How Protection Works

```typescript
// middleware.ts
export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow public access to demo pages
  if (pathname.startsWith("/demo/")) {
    return NextResponse.next();
  }

  // Protect dashboard - require authentication
  if (pathname.startsWith("/dashboard")) {
    return withAuth(req);
  }

  // Allow all other routes
  return NextResponse.next();
}
```

## User ID Tracking

### Query History with User ID

Each query is tracked with the user ID:

```typescript
const historyItem: QueryHistoryItem = {
  id: crypto.randomUUID(),
  naturalLanguage: question,
  sql: data.sql,
  explanation: data.explanation,
  timestamp: Date.now(),
  rowCount: queryResult.rowCount,
  executionTimeMs: queryResult.executionTimeMs,
  starred: false,
  userId, // Tracks which user created this query
};
```

### Demo Sharing with User ID

Demos include creator information:

```typescript
const demo: SavedDemo = {
  id: crypto.randomUUID(),
  userId, // Optional: tracks demo creator
  query: { ...query, userId },
  createdAt: Date.now(),
  isPublic: true,
};
```

## Troubleshooting

### Magic Link Email Not Arriving

1. **Check spam folder** - Magic link emails sometimes go to spam
2. **Verify email address** - Make sure the email is typed correctly
3. **Check Kinde logs** - View email delivery status in Kinde dashboard
4. **Configure email provider** - In production, set up custom email provider

### Magic Link Not Working

1. **Check expiration** - Link may have expired (default 5 minutes)
2. **Single use** - Link can only be clicked once
3. **Request new link** - Return to sign in page and request another
4. **Check callback URLs** - Verify redirect URLs match your configuration

### User Not Redirected After Login

1. **Check `KINDE_POST_LOGIN_REDIRECT_URL`** - Should be set to `/dashboard`
2. **Verify middleware** - Ensure middleware allows access to redirect URL
3. **Check browser console** - Look for redirect errors

### Session Not Persisting

1. **Check cookies** - Ensure cookies are enabled
2. **HTTPS in production** - Secure cookies require HTTPS
3. **Domain configuration** - Verify `KINDE_SITE_URL` matches your domain

## Testing Checklist

- [ ] Magic link email received within 1 minute
- [ ] Clicking magic link logs user in
- [ ] User redirected to `/dashboard` after login
- [ ] Dashboard requires authentication (try accessing without login)
- [ ] Demo pages (`/demo/[id]`) accessible without login
- [ ] User ID tracked in query history
- [ ] Shared demos include creator user ID
- [ ] Logout works correctly
- [ ] Session persists across page refreshes

## Production Considerations

### Custom Email Provider

For production, configure a custom email provider:

1. Go to **Settings** > **Email** > **Email service**
2. Choose provider:
   - SendGrid
   - Mailgun
   - AWS SES
   - Custom SMTP
3. Add credentials and test

### Domain Configuration

Update environment variables for production:

```env
KINDE_SITE_URL=https://yourdomain.com
KINDE_POST_LOGOUT_REDIRECT_URL=https://yourdomain.com
KINDE_POST_LOGIN_REDIRECT_URL=https://yourdomain.com/dashboard
```

### Callback URLs

Add production callback URLs in Kinde dashboard:

1. Go to **Settings** > **Applications** > Your App
2. Add allowed callback URLs:
   - `https://yourdomain.com/api/auth/kinde_callback`
3. Add allowed logout redirect URLs:
   - `https://yourdomain.com`

### Rate Limiting

Consider implementing rate limiting for magic link requests:
- Prevent abuse
- Limit requests per email/IP
- Use Redis or similar for tracking

## Additional Resources

- [Kinde Documentation](https://kinde.com/docs/)
- [Magic Link Best Practices](https://kinde.com/docs/authenticate/magic-links/)
- [Email Templates](https://kinde.com/docs/design/email-templates/)
- [Security Guidelines](https://kinde.com/docs/security/)

## Support

If you need help:
- Check [Kinde Documentation](https://kinde.com/docs/)
- Visit [Kinde Support](https://kinde.com/support/)
- Join [Kinde Community](https://discord.gg/kinde)
