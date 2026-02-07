# Quick Start Guide

Get QueryLens up and running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- A Kinde account (free at [kinde.com](https://kinde.com))

## Installation

### Option 1: Automated Setup (Recommended)

```bash
# Make the install script executable
chmod +x scripts/install.sh

# Run the installation script
./scripts/install.sh
```

### Option 2: Manual Setup

```bash
# 1. Install pnpm (if not already installed)
npm install -g pnpm@9.15.4

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env.local
```

## Configuration

### 1. Create a Kinde Application

1. Sign up at [https://kinde.com](https://kinde.com)
2. Create a new application
3. Select "Next.js" as the framework
4. Copy your credentials:
   - Client ID
   - Client Secret
   - Issuer URL (e.g., `https://yourapp.kinde.com`)

### 2. Add Callback URLs

In your Kinde dashboard, add these URLs:

**Callback URLs:**
- `http://localhost:3000/api/auth/kinde_callback`

**Logout redirect URLs:**
- `http://localhost:3000`

### 3. Update Environment Variables

Edit `.env.local` and replace the placeholder values:

```env
KINDE_CLIENT_ID=your_actual_client_id_here
KINDE_CLIENT_SECRET=your_actual_client_secret_here
KINDE_ISSUER_URL=https://yourapp.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

## Running the Application

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Steps

1. **Test the app without auth**: The main query interface works without authentication
2. **Sign in**: Click "Sign In" in the header to test authentication
3. **Try a query**: Ask a natural language question like "Show all customers"
4. **View results**: See the generated SQL and visualized results

## What's Included

✅ AI-powered SQL generation  
✅ Interactive data visualization  
✅ Query history and favorites  
✅ Schema explorer  
✅ Authentication with Kinde  
✅ User profile management  
✅ Export to CSV/JSON  

## Need Help?

- **Auth issues?** See [KINDE_SETUP.md](./KINDE_SETUP.md)
- **General docs?** See [README.md](./README.md)
- **Kinde docs?** Visit [kinde.com/docs](https://kinde.com/docs)

## Next Steps

- Connect a real database (currently using demo data)
- Customize the UI theme in `app/globals.css`
- Add more visualizations in `components/result-visualization.tsx`
- Set up production deployment on Vercel

Happy querying! 🚀
