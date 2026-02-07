# QueryLens - Project Overview

## 🎯 Application Purpose

**QueryLens** is an AI-powered database query interface that allows users to:
- Ask questions in natural language
- Get AI-generated SQL queries with explanations
- Execute queries against a database
- Visualize results with interactive charts
- Explore database schemas
- Track and replay query history
- Authenticate securely with Kinde Auth

## 🏗️ Technical Architecture

### Frontend
- **Framework**: Next.js 15.1.9 (App Router)
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with client components
- **Data Fetching**: SWR for client-side caching

### Backend
- **API Routes**: Next.js API routes
- **Authentication**: Kinde Auth (OAuth 2.0 / OIDC)
- **Database**: Currently demo in-memory (SQL.js), ready for real DB integration
- **AI Integration**: Configured for AI SQL generation

### Authentication Flow
```
User → Sign In Button → Kinde Auth Page → OAuth Flow → Callback → Dashboard/App
```

## 📁 Folder Structure Explained

```
v0-ai-database-query/
│
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── auth/[kindeAuth]/    # Kinde auth handler (automatic routing)
│   │   ├── generate-sql/        # AI SQL generation endpoint
│   │   └── schema/              # Database schema endpoint
│   ├── dashboard/               # Protected dashboard page
│   ├── layout.tsx               # Root layout with fonts and metadata
│   ├── page.tsx                 # Main query interface (server component)
│   └── globals.css              # Global styles and Tailwind
│
├── components/                   # React components
│   ├── auth/                    # Authentication components
│   │   ├── auth-header.tsx      # Main header with conditional auth UI
│   │   ├── login-button.tsx     # Sign in button
│   │   ├── logout-button.tsx    # Sign out button
│   │   ├── register-button.tsx  # Sign up button
│   │   └── user-profile.tsx     # User profile dropdown
│   ├── ui/                      # shadcn/ui base components
│   ├── export-buttons.tsx       # CSV/JSON export functionality
│   ├── query-history.tsx        # Query history sidebar
│   ├── query-input.tsx          # Natural language input
│   ├── query-page-client.tsx    # Main query interface (client component)
│   ├── result-visualization.tsx # Chart selection and rendering
│   ├── results-table.tsx        # Data table display
│   ├── schema-explorer.tsx      # Database schema browser
│   ├── sql-preview.tsx          # Generated SQL display
│   └── theme-provider.tsx       # Dark/light theme support
│
├── lib/                         # Utility functions and helpers
│   ├── auth.ts                  # Auth helper functions
│   ├── demo-database.ts         # Demo database with sample data
│   ├── query-executor.ts        # SQL execution logic
│   ├── query-validator.ts       # SQL validation and safety
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # General utilities (cn, etc.)
│
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── use-toast.ts             # Toast notifications hook
│
├── scripts/                     # Utility scripts
│   └── install.sh               # Automated installation script
│
├── middleware.ts                # Next.js middleware (auth protection)
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── components.json              # shadcn/ui configuration
│
├── .env.example                 # Environment variable template
├── .env.local                   # Your environment variables (git-ignored)
├── .gitignore                   # Git ignore patterns
│
└── Documentation/
    ├── START_HERE.md            # Quick start guide ⭐
    ├── QUICKSTART.md            # 5-minute setup
    ├── INSTALLATION_CHECKLIST.md # Step-by-step checklist
    ├── KINDE_SETUP.md           # Detailed auth setup
    ├── SETUP_COMPLETE.md        # What's been installed
    ├── README.md                # Full project documentation
    └── PROJECT_OVERVIEW.md      # This file
```

## 🔐 Authentication Implementation

### Server Components (RSC)
```tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const authed = await isAuthenticated();
  // Use user data
}
```

### Client Components
```tsx
// Pass user data from server component as props
// Or use client-side auth checking
```

### Protected Routes
```tsx
// In page.tsx or layout.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const { isAuthenticated } = getKindeServerSession();
if (!(await isAuthenticated())) {
  redirect("/api/auth/login");
}
```

### Middleware Protection
```tsx
// middleware.ts - already configured
// Optionally protect specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

## 🔄 Data Flow

### Query Execution Flow
```
1. User enters natural language question
   ↓
2. Client component sends to /api/generate-sql
   ↓
3. API generates SQL with AI + explanation
   ↓
4. Returns SQL to client
   ↓
5. Client executes SQL on local database
   ↓
6. Results displayed in table + charts
   ↓
7. Query saved to history
```

### Authentication Flow
```
1. User clicks "Sign In"
   ↓
2. Redirected to /api/auth/login (Kinde)
   ↓
3. Kinde authentication page
   ↓
4. User authenticates
   ↓
5. Redirected to /api/auth/kinde_callback
   ↓
6. Session created
   ↓
7. Redirected to dashboard or origin page
```

## 🎨 UI Components

### shadcn/ui Components Used
- Button, Card, Input, Textarea
- Dialog, Dropdown Menu, Popover
- Table, Tabs, Accordion
- Avatar, Badge, Progress
- Toast, Alert, Separator
- Scroll Area, Tooltip
- And more...

### Custom Components
- QueryInput: Natural language input with suggestions
- SQLPreview: SQL display with syntax highlighting
- ResultsTable: Sortable, searchable data table
- ResultVisualization: Dynamic chart type selection
- SchemaExplorer: Database schema tree view
- QueryHistory: Saved queries with starring
- ExportButtons: CSV/JSON export

## 🧩 Key Features

### 1. AI SQL Generation
- Natural language to SQL conversion
- Query explanation
- Table usage tracking
- Estimated result counts

### 2. Query Execution
- Safe read-only mode
- SQL validation
- Error handling
- Execution time tracking

### 3. Data Visualization
- Automatic chart type detection
- Bar, line, pie, area charts
- Interactive tooltips
- Responsive design

### 4. Schema Explorer
- Browse all tables
- View columns and types
- See constraints
- Quick reference

### 5. Query History
- Save all queries
- Star favorites
- Replay queries
- View statistics

### 6. Authentication
- Secure OAuth 2.0 / OIDC
- User profiles
- Session management
- Protected routes

## 🔧 Configuration Files

### package.json
- Dependencies management
- Scripts for dev/build/start
- Package manager: pnpm 9.15.4

### next.config.mjs
- TypeScript error ignoring (for development)
- Image optimization disabled

### tailwind.config.ts
- Custom color scheme
- Font configuration
- Plugin setup (animations, etc.)

### tsconfig.json
- TypeScript compiler options
- Path aliases (@/* = ./* )
- Strict mode enabled

### middleware.ts
- Auth middleware configuration
- Route protection (optional)
- Request interception

## 🌐 Environment Variables

Required for Kinde Auth:
```env
KINDE_CLIENT_ID=          # From Kinde dashboard
KINDE_CLIENT_SECRET=      # From Kinde dashboard
KINDE_ISSUER_URL=         # Your Kinde domain
KINDE_SITE_URL=           # Your app URL
KINDE_POST_LOGOUT_REDIRECT_URL=   # Where to go after logout
KINDE_POST_LOGIN_REDIRECT_URL=    # Where to go after login
```

## 📦 Dependencies Overview

### Core
- next@15.1.9 - React framework
- react@19.0.1 - UI library
- typescript@5.7.3 - Type safety

### Authentication
- @kinde-oss/kinde-auth-nextjs@^2.3.12 - Auth SDK

### UI
- @radix-ui/* - Headless UI primitives
- tailwindcss@^3.4.17 - Utility-first CSS
- lucide-react@^0.474.0 - Icons

### Forms & Validation
- react-hook-form@^7.54.1 - Form handling
- zod@^3.24.1 - Schema validation
- @hookform/resolvers@^3.9.1 - Form validation

### Data & State
- swr@^2.4.0 - Data fetching and caching
- recharts@2.15.0 - Charts

### Utilities
- clsx@^2.1.1 - Conditional classnames
- date-fns@^3.6.0 - Date formatting
- sonner@^1.7.1 - Toast notifications

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production
- Update all URLs to production domain
- Keep secrets secure
- Add callback URLs in Kinde dashboard

### Production Checklist
- [ ] Environment variables set
- [ ] Kinde callbacks updated
- [ ] Build succeeds locally
- [ ] All features tested
- [ ] Performance optimized

## 🎓 Learning Resources

### Technologies Used
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Kinde Auth](https://kinde.com/docs)

### Patterns Used
- Server Components (RSC)
- Client Components
- API Routes
- Middleware
- TypeScript Types
- Custom Hooks
- Component Composition

## 🤝 Contributing

To add new features:
1. Create a new branch
2. Add your changes
3. Test locally
4. Update documentation
5. Submit pull request

## 📄 License

MIT License - See LICENSE file

## 🎯 Next Steps

### Suggested Enhancements
1. **Connect Real Database**
   - PostgreSQL, MySQL, or other
   - Update query-executor.ts
   - Add connection pooling

2. **Persistent Query History**
   - Save to database
   - User-specific history
   - Share queries

3. **Advanced Visualizations**
   - More chart types
   - Custom chart configurations
   - Dashboard builder

4. **Team Features**
   - Organizations (Kinde supports this)
   - Shared workspaces
   - Permissions

5. **Query Optimization**
   - Query caching
   - Execution plan analysis
   - Performance suggestions

## 📞 Support

- **Documentation**: Check markdown files in project root
- **Kinde Issues**: [kinde.com/docs](https://kinde.com/docs)
- **Next.js Issues**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Built with**: Next.js 15 • TypeScript • Kinde Auth • Tailwind CSS • shadcn/ui

**Package Manager**: pnpm 9.15.4

**Ready to code!** 🚀
