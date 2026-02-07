# Kinde Auth Setup Guide

This application is now configured to use Kinde Auth for authentication. Follow these steps to complete the setup:

## 1. Create a Kinde Account

1. Go to [https://kinde.com](https://kinde.com) and sign up for a free account
2. Create a new application in your Kinde dashboard
3. Choose "Next.js" as your application type

## 2. Configure Your Kinde Application

### Callback URLs
Add these callback URLs in your Kinde application settings:

**Development:**
- `http://localhost:3000/api/auth/kinde_callback`

**Production:**
- `https://yourdomain.com/api/auth/kinde_callback`

### Logout Redirect URLs
Add these logout redirect URLs:

**Development:**
- `http://localhost:3000`

**Production:**
- `https://yourdomain.com`

## 3. Environment Variables

Copy the `.env.example` file to `.env.local` and update with your Kinde credentials:

```bash
cp .env.example .env.local
```

Then update the following values in `.env.local`:

```env
KINDE_CLIENT_ID=your_actual_client_id
KINDE_CLIENT_SECRET=your_actual_client_secret
KINDE_ISSUER_URL=https://your_subdomain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

You can find these values in your Kinde dashboard under:
- **Application** → **Details** → **App keys**

## 4. Install Dependencies

Run the following command to install all dependencies including Kinde Auth:

```bash
pnpm install
```

## 5. Run the Application

Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 6. Test Authentication

1. Click the "Sign In" button in the header
2. You'll be redirected to Kinde's authentication page
3. Create an account or sign in
4. You'll be redirected back to your application

## Features Included

### Components
- ✅ **LoginButton** - Sign in button component
- ✅ **RegisterButton** - Sign up button component
- ✅ **LogoutButton** - Sign out button component
- ✅ **UserProfile** - User profile dropdown with avatar
- ✅ **AuthHeader** - Combined auth header component

### Utilities
- ✅ **getUser()** - Get the current user
- ✅ **isAuthenticated()** - Check if user is authenticated
- ✅ **getUserDetails()** - Get user with permissions and organization

### Routes
- ✅ `/api/auth/[kindeAuth]` - Kinde Auth API routes (automatically handled)

## Usage Examples

### Protecting Pages (Server Components)

```tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/api/auth/login");
  }

  return <div>Protected Content</div>;
}
```

### Getting User Info (Server Components)

```tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function UserPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div>
      <h1>Welcome, {user?.given_name}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### Using in Client Components

For client components, you'll need to pass user data from a server component or use Kinde's client-side hooks with a provider.

## Middleware Configuration

The middleware is already set up in `middleware.ts`. By default, it doesn't protect any routes automatically. To protect specific routes, update the middleware:

```typescript
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth({
  // Protect these routes
  isReturnToCurrentPage: true,
});

// Add protected routes to the matcher
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add your production domain to Kinde callback URLs
2. Update environment variables in your hosting platform:
   - Add all `KINDE_*` variables
   - Update `KINDE_SITE_URL` to your production domain
   - Update redirect URLs to production URLs

## Troubleshooting

### "Callback URL mismatch" error
- Ensure callback URLs are correctly set in Kinde dashboard
- Check that `KINDE_SITE_URL` matches your current environment

### "Invalid client" error
- Verify `KINDE_CLIENT_ID` and `KINDE_CLIENT_SECRET` are correct
- Ensure `KINDE_ISSUER_URL` includes your subdomain

### Authentication loops
- Clear cookies and browser cache
- Verify all environment variables are set correctly
- Check that middleware isn't causing redirect loops

## Resources

- [Kinde Documentation](https://kinde.com/docs)
- [Kinde Next.js SDK](https://github.com/kinde-oss/kinde-auth-nextjs)
- [Kinde Dashboard](https://app.kinde.com)

## Support

If you need help:
1. Check the [Kinde Documentation](https://kinde.com/docs)
2. Visit the [Kinde Community](https://kinde.com/community)
3. Contact Kinde Support through your dashboard
