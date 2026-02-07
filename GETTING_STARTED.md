# Getting Started with QueryLens

Welcome! This guide will get you up and running with QueryLens in minutes.

## What is QueryLens?

QueryLens is an AI-powered database query application that:
- Converts natural language to SQL
- Executes queries safely
- Visualizes results
- Shares demos publicly
- Uses passwordless magic link authentication

## Quick Setup (5 Minutes)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Kinde Auth

1. **Create Account:** Go to [kinde.com](https://kinde.com) and sign up
2. **Create Application:** Create a new "Regular web application"
3. **Get Credentials:** Copy Client ID, Client Secret, and Issuer URL

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your Kinde credentials
```

Your `.env.local` should look like:
```env
KINDE_CLIENT_ID=your_actual_client_id_here
KINDE_CLIENT_SECRET=your_actual_client_secret_here
KINDE_ISSUER_URL=https://yourapp.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

### 4. Enable Magic Link

In Kinde Dashboard:
1. Go to **Settings** > **Authentication** > **Email**
2. Toggle **Magic link** to **ON**
3. Click **Save**

### 5. Configure Callback URLs

In Kinde Dashboard:
1. Go to **Applications** > Your App > **Settings**
2. Add callback URL: `http://localhost:3000/api/auth/kinde_callback`
3. Add logout redirect URL: `http://localhost:3000`
4. Click **Save**

### 6. Run the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## First Steps

### Try Without Signing In

1. **Open the app** - No login required
2. **Type a question:** "Show me all employees"
3. **See results** - SQL generated and executed
4. **Explore data** - View tables, charts, export

### Create an Account

1. **Click "Sign Up"** in the header
2. **Enter your email**
3. **Check inbox** for magic link
4. **Click the link** to sign in
5. **Explore dashboard** with saved features

### Share a Query

1. **Run a query** (logged in or out)
2. **Click "Share Query"** button
3. **Create share link**
4. **Copy and share** the link
5. **Anyone can view** without login!

## What You Can Do

### Without Account (Public Access)
- ✅ Run natural language queries
- ✅ View SQL and results
- ✅ Create visualizations
- ✅ Export data
- ✅ Browse schema
- ✅ View shared demos

### With Account (Protected Features)
- ✅ Everything above, plus:
- ✅ Access dashboard
- ✅ Save query history
- ✅ Create attributed demos
- ✅ Star favorite queries
- ✅ Sync across devices (future)

## Key Features

### 1. Natural Language Queries

Just ask in plain English:
```
"What are the top 5 products by revenue?"
"Show me employees hired in 2023"
"Which customers have spent the most?"
```

### 2. Magic Link Authentication

No passwords! Just:
1. Enter email
2. Click link
3. You're in!

### 3. Demo Sharing

Share queries with anyone:
- Public URLs work without login
- Results preserved
- Attribution shown for logged-in users

### 4. Route Protection

Smart access control:
- `/` - Public (no login needed)
- `/demo/[id]` - Public (sharable)
- `/dashboard` - Protected (login required)

## Example Queries

Try these to get started:

```
"Show me all departments"
"List employees with salary over $100,000"
"What's the average order value by customer?"
"Show products that are out of stock"
"Which department has the most employees?"
"Show recent orders"
"List customers from USA"
```

## File Structure

```
📁 app/
  ├── 📁 api/               API endpoints
  ├── 📁 dashboard/         Protected dashboard
  ├── 📁 demo/[id]/         Public demo pages
  ├── layout.tsx            Root layout
  └── page.tsx              Home page

📁 components/
  ├── 📁 auth/              Auth components
  ├── query-page-client.tsx Main interface
  └── share-demo-dialog.tsx Share modal

📁 lib/
  ├── auth.ts               Auth utilities
  ├── demo-storage.ts       Demo management
  └── types.ts              TypeScript types

middleware.ts               Route protection
.env.local                  Your config
```

## Documentation

### Quick References
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Common tasks
- **[START_HERE.md](./START_HERE.md)** - Detailed setup

### Feature Guides
- **[MAGIC_LINK_SETUP.md](./MAGIC_LINK_SETUP.md)** - Magic link config
- **[FEATURES.md](./FEATURES.md)** - Complete feature list
- **[KINDE_SETUP.md](./KINDE_SETUP.md)** - Kinde configuration

### Technical Documentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Architecture
- **[README.md](./README.md)** - Full project docs

### Testing & Deployment
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Test everything
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Go live guide
- **[INSTALLATION_CHECKLIST.md](./INSTALLATION_CHECKLIST.md)** - Setup steps

## Common Issues

### Magic Link Not Received?
- Check spam folder
- Verify email address is correct
- Check Kinde dashboard logs
- Try requesting a new link

### Can't Access Dashboard?
- Make sure you're logged in
- Check if session expired
- Try logging in again
- Clear cookies and retry

### Demo Not Loading?
- Verify demo ID in URL
- Check if demo exists in localStorage
- Try creating a new demo
- Check browser console for errors

### Authentication Not Working?
- Verify environment variables
- Check Kinde callback URLs
- Review Kinde dashboard logs
- Ensure magic link is enabled

## Getting Help

### Resources
1. Read the documentation (see list above)
2. Check [Kinde Documentation](https://kinde.com/docs/)
3. Review [Next.js Documentation](https://nextjs.org/docs)
4. Check browser console for errors

### Debugging Steps
1. Check `.env.local` is configured
2. Verify Kinde settings match
3. Review browser console
4. Check network tab for failed requests
5. Test in incognito mode

## Next Steps

Now that you're set up:

1. **Explore the Interface**
   - Try different queries
   - Browse the schema
   - Test visualizations

2. **Test Authentication**
   - Sign up with email
   - Test magic link
   - Access dashboard

3. **Share a Demo**
   - Run an interesting query
   - Create share link
   - Test in incognito mode

4. **Customize**
   - Connect real database (optional)
   - Modify styling
   - Add features

5. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Configure production Kinde
   - Go live!

## Development Workflow

### Daily Development
```bash
# Start dev server
pnpm dev

# Run in parallel terminals:
# - Main app: http://localhost:3000
# - Watch for changes (automatic)
```

### Adding Features
1. Create new components in `/components`
2. Add API routes in `/app/api`
3. Update types in `/lib/types.ts`
4. Test locally
5. Commit changes

### Before Committing
```bash
# Type check
pnpm type-check

# Lint (if configured)
pnpm lint

# Build test
pnpm build

# Test locally
pnpm start
```

## Tips & Best Practices

### Development
- Use TypeScript for type safety
- Test features logged in AND out
- Check mobile responsiveness
- Review console for errors
- Test in multiple browsers

### Authentication
- Never commit `.env.local`
- Keep secrets secret
- Test magic link flow fully
- Verify session persistence
- Test logout functionality

### Sharing
- Test demo links in incognito
- Verify attribution works
- Ensure demos are public
- Test link copying
- Check demo persistence

## What's Next?

### Immediate Improvements
- [ ] Add more example queries
- [ ] Create demo videos
- [ ] Write tutorials
- [ ] Add tooltips
- [ ] Improve error messages

### Future Features
- [ ] Real database connections
- [ ] Team workspaces
- [ ] Advanced analytics
- [ ] Query templates
- [ ] API access

### Advanced Topics
- [ ] Custom database integration
- [ ] Advanced visualizations
- [ ] Query optimization
- [ ] Performance tuning
- [ ] Monitoring setup

## Success Checklist

You're ready when:
- [ ] App runs locally without errors
- [ ] Magic link authentication works
- [ ] Can create and share demos
- [ ] Dashboard is accessible
- [ ] Public pages work without login
- [ ] Ready to show others!

## Congratulations!

You're all set up with QueryLens! Start exploring your data with natural language queries.

**Happy Querying!** 🚀

---

**Questions?** Check the documentation or create an issue on GitHub.
