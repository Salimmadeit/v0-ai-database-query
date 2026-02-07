# Installation Checklist

Follow this checklist to ensure your QueryLens application is properly set up.

## Pre-Installation

- [ ] Node.js 18+ is installed (`node --version`)
- [ ] You have a Kinde account (or sign up at [kinde.com](https://kinde.com))

## Step 1: Install Dependencies

Choose one method:

### Method A: Automated (Recommended)
- [ ] Run: `chmod +x scripts/install.sh`
- [ ] Run: `./scripts/install.sh`

### Method B: Manual
- [ ] Install pnpm globally: `npm install -g pnpm@9.15.4`
- [ ] Run: `pnpm install`
- [ ] Verify installation completed without errors

## Step 2: Kinde Auth Setup

### Create Kinde Application
- [ ] Go to [https://app.kinde.com](https://app.kinde.com)
- [ ] Create a new application
- [ ] Select "Next.js" as the framework type
- [ ] Name your application (e.g., "QueryLens")

### Configure Callback URLs
In your Kinde application settings, add:

**Allowed callback URLs:**
- [ ] `http://localhost:3000/api/auth/kinde_callback`

**Allowed logout redirect URLs:**
- [ ] `http://localhost:3000`

### Copy Credentials
From your Kinde dashboard (Application → Details → App keys):
- [ ] Copy Client ID
- [ ] Copy Client Secret  
- [ ] Copy Issuer URL (format: `https://yourapp.kinde.com`)

## Step 3: Environment Configuration

- [ ] File `.env.local` exists (created by install script or manual copy)
- [ ] Open `.env.local` in your editor
- [ ] Replace `your_kinde_client_id` with your actual Client ID
- [ ] Replace `your_kinde_client_secret` with your actual Client Secret
- [ ] Replace `https://your_subdomain.kinde.com` with your actual Issuer URL
- [ ] Save the file

**Your `.env.local` should look like this:**
```env
KINDE_CLIENT_ID=<your_actual_client_id>
KINDE_CLIENT_SECRET=<your_actual_client_secret>
KINDE_ISSUER_URL=https://<yourapp>.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

## Step 4: Start Development Server

- [ ] Run: `pnpm dev`
- [ ] Wait for "Ready in X seconds" message
- [ ] Server is running on port 3000

## Step 5: Test the Application

### Basic Functionality
- [ ] Open [http://localhost:3000](http://localhost:3000)
- [ ] Page loads without errors
- [ ] You see the QueryLens interface
- [ ] "Sign In" and "Sign Up" buttons appear in header

### Test Authentication
- [ ] Click "Sign In" button
- [ ] Redirected to Kinde authentication page
- [ ] Can see your application name
- [ ] Sign up for a new account OR sign in with existing account
- [ ] Redirected back to application
- [ ] User avatar/profile appears in header (replacing Sign In button)
- [ ] Click avatar to see profile dropdown
- [ ] "Sign Out" option is visible

### Test Query Interface
- [ ] Type a natural language question (e.g., "Show all customers")
- [ ] Click "Generate Query" button
- [ ] SQL query is generated and displayed
- [ ] Results table appears with data
- [ ] Can view schema in right sidebar
- [ ] Query appears in history tab

### Test Sign Out
- [ ] Click user avatar in header
- [ ] Click "Sign Out"
- [ ] Redirected to home page
- [ ] "Sign In" button appears again

## Step 6: Review Documentation

- [ ] Read [README.md](./README.md) for project overview
- [ ] Read [KINDE_SETUP.md](./KINDE_SETUP.md) for detailed auth docs
- [ ] Read [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) for what was installed
- [ ] Bookmark [Kinde Docs](https://kinde.com/docs) for reference

## Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:**
- [ ] Run `pnpm install` again
- [ ] Delete `node_modules` and `.next` folders
- [ ] Run `pnpm install` again
- [ ] Run `pnpm dev`

### Issue: "Callback URL mismatch" error
**Solution:**
- [ ] Verify callback URLs in Kinde dashboard
- [ ] Ensure `KINDE_SITE_URL` is `http://localhost:3000` (no trailing slash)
- [ ] Check spelling of callback URL exactly: `/api/auth/kinde_callback`

### Issue: Authentication redirects in a loop
**Solution:**
- [ ] Clear browser cookies for localhost
- [ ] Verify all `KINDE_*` environment variables are set correctly
- [ ] Check there are no extra spaces in `.env.local` values
- [ ] Restart development server

### Issue: Environment variables not loading
**Solution:**
- [ ] Ensure file is named `.env.local` (not `.env.local.txt`)
- [ ] Environment variables should not have quotes around them
- [ ] Restart development server after changing `.env.local`

## Production Deployment Checklist

When ready to deploy to production:

- [ ] Push code to GitHub repository
- [ ] Create Vercel project from GitHub repo
- [ ] Add all environment variables in Vercel dashboard
- [ ] Update `KINDE_SITE_URL` to production domain
- [ ] Update `KINDE_POST_LOGOUT_REDIRECT_URL` to production domain
- [ ] Update `KINDE_POST_LOGIN_REDIRECT_URL` to production domain
- [ ] Add production callback URL in Kinde dashboard: `https://yourdomain.com/api/auth/kinde_callback`
- [ ] Add production logout redirect in Kinde dashboard: `https://yourdomain.com`
- [ ] Deploy and test

## Verification Commands

Run these to verify your setup:

```bash
# Check Node.js version (should be 18+)
node --version

# Check pnpm version (should be 9.15.4+)
pnpm --version

# Check if dependencies are installed
ls node_modules/@kinde-oss

# Check if .env.local exists
ls -la .env.local

# Start development server
pnpm dev
```

## Need Help?

If you're stuck on any step:

1. **Check error messages carefully** - They usually tell you what's wrong
2. **Review documentation:**
   - [KINDE_SETUP.md](./KINDE_SETUP.md) - Auth setup details
   - [QUICKSTART.md](./QUICKSTART.md) - Quick reference
   - [Kinde Docs](https://kinde.com/docs) - Official Kinde documentation
3. **Common fixes:**
   - Restart the development server
   - Clear browser cache/cookies
   - Delete `node_modules` and `.next`, reinstall
   - Double-check environment variables

## Success! 🎉

When all items are checked, your QueryLens application is fully set up and ready to use!

**Quick start command:**
```bash
pnpm dev
```

**Then visit:** [http://localhost:3000](http://localhost:3000)

Happy querying! 🚀
