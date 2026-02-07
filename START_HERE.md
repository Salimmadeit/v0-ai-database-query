# 🚀 START HERE - QueryLens Setup Guide

Welcome to QueryLens! This guide will get you up and running in just a few minutes.

## 📋 What You Need

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **A Kinde Account** - [Sign up free](https://kinde.com)

That's it!

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Dependencies (2 minutes)

Open your terminal in this project directory and run:

```bash
pnpm install
```

Don't have pnpm? Install it first:
```bash
npm install -g pnpm@9.15.4
```

### Step 2: Setup Kinde Auth (2 minutes)

1. **Go to [https://app.kinde.com](https://app.kinde.com)**
2. **Create a new application** → Select "Next.js"
3. **Add callback URLs** in your app settings:
   - Callback: `http://localhost:3000/api/auth/kinde_callback`
   - Logout: `http://localhost:3000`
4. **Copy your credentials** from the "Details" page

### Step 3: Configure Environment (1 minute)

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace these values with your Kinde credentials:
   ```env
   KINDE_CLIENT_ID=<paste your client id>
   KINDE_CLIENT_SECRET=<paste your client secret>
   KINDE_ISSUER_URL=https://<yourapp>.kinde.com
   ```

### Step 4: Start the App!

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## ✅ Test It Out

1. **Try without auth**: Type a question like "Show all customers" and see the magic
2. **Sign in**: Click "Sign In" in the header to test authentication
3. **Explore**: Check out the schema explorer and query history

## 📚 Documentation

- **[INSTALLATION_CHECKLIST.md](./INSTALLATION_CHECKLIST.md)** - Step-by-step checklist
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick reference guide  
- **[KINDE_SETUP.md](./KINDE_SETUP.md)** - Detailed auth setup
- **[README.md](./README.md)** - Complete documentation
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - What's been installed

## 🏗️ Project Structure

```
v0-ai-database-query/
├── app/
│   ├── api/auth/[kindeAuth]/    ← Kinde auth handler
│   ├── dashboard/               ← Protected dashboard page
│   └── page.tsx                 ← Main query interface
├── components/
│   ├── auth/                    ← Auth UI components
│   └── query-page-client.tsx    ← Query interface logic
├── lib/
│   ├── auth.ts                  ← Auth helper functions
│   └── ...
├── .env.local                   ← Your secrets (git-ignored)
├── .env.example                 ← Template
└── middleware.ts                ← Auth middleware
```

## 🎯 What This App Does

**QueryLens** is an AI-powered database query tool that:

✨ Converts natural language to SQL  
📊 Visualizes results with charts  
🔍 Lets you explore your database schema  
📝 Tracks your query history  
🔐 Protects with Kinde authentication  
💾 Exports data to CSV/JSON  

## 🛠️ Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
```

## 🐛 Troubleshooting

### "Module not found"
```bash
rm -rf node_modules .next
pnpm install
```

### "Callback URL mismatch"
- Check Kinde dashboard callback URLs
- Verify `.env.local` has correct `KINDE_SITE_URL`

### Authentication loops
- Clear browser cookies for localhost
- Verify all `KINDE_*` variables in `.env.local`
- Restart dev server

## 🚢 Deploy to Production

1. **Push to GitHub**
2. **Deploy to Vercel**: [vercel.com/new](https://vercel.com/new)
3. **Add environment variables** in Vercel dashboard
4. **Update Kinde callbacks** with your production domain
5. **Done!**

## 💡 Features You Can Build

Now that auth is set up, you can:

- ✅ Add user-specific query history (saved to database)
- ✅ Create team workspaces
- ✅ Save and share queries
- ✅ Add role-based permissions
- ✅ Connect to real databases
- ✅ Build custom dashboards

## 📞 Need Help?

1. Check the docs in this directory (see above)
2. Visit [Kinde Docs](https://kinde.com/docs)
3. Check [Next.js Docs](https://nextjs.org/docs)

## 🎉 You're All Set!

Your QueryLens application is ready to go. Start building something awesome!

**Quick command to get started:**
```bash
pnpm install && pnpm dev
```

Then visit [http://localhost:3000](http://localhost:3000)

---

Made with ⚡ by v0.dev
