# QueryLens - AI Database Query Interface

An AI-powered database query interface that converts natural language questions into SQL queries and visualizes results. Built with Next.js 15, TypeScript, and Kinde Auth.

## Features

- 🤖 **AI-Powered SQL Generation** - Convert natural language to SQL queries
- 📊 **Data Visualization** - Interactive charts and tables for query results
- 🔍 **Schema Explorer** - Browse database structure and relationships
- 📝 **Query History** - Track and replay previous queries
- 🔐 **Authentication** - Secure user authentication with Kinde
- 🎨 **Modern UI** - Beautiful interface built with shadcn/ui
- ⚡ **Fast Performance** - Optimized with Next.js 15 and React 19

## Tech Stack

- **Framework:** Next.js 15.1.9
- **Language:** TypeScript 5.7.3
- **Auth:** Kinde Auth
- **UI Components:** Radix UI + shadcn/ui
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Package Manager:** pnpm 9.15.4

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm 9.15.4+ installed
- A Kinde account (free at [kinde.com](https://kinde.com))

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd v0-ai-database-query
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then update `.env.local` with your Kinde credentials. See [KINDE_SETUP.md](./KINDE_SETUP.md) for detailed instructions.

4. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Authentication Setup

This application uses Kinde Auth for authentication. Follow the complete setup guide in [KINDE_SETUP.md](./KINDE_SETUP.md).

**Quick setup:**
1. Create a Kinde account at [kinde.com](https://kinde.com)
2. Create a new Next.js application in Kinde dashboard
3. Copy your credentials to `.env.local`
4. Add callback URLs in Kinde settings

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth/[kindeAuth]/    # Kinde auth routes
│   │   ├── generate-sql/        # AI SQL generation endpoint
│   │   └── schema/              # Database schema endpoint
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main query interface
├── components/
│   ├── auth/                    # Authentication components
│   ├── ui/                      # shadcn/ui components
│   ├── export-buttons.tsx       # Export functionality
│   ├── query-history.tsx        # Query history sidebar
│   ├── query-input.tsx          # Natural language input
│   ├── result-visualization.tsx # Chart visualizations
│   ├── results-table.tsx        # Results data table
│   ├── schema-explorer.tsx      # Database schema browser
│   └── sql-preview.tsx          # Generated SQL display
├── lib/
│   ├── auth.ts                  # Auth utility functions
│   ├── demo-database.ts         # Demo database setup
│   ├── query-executor.ts        # SQL execution logic
│   ├── query-validator.ts       # SQL validation
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Utility functions
├── middleware.ts                # Next.js middleware (auth)
└── KINDE_SETUP.md              # Detailed auth setup guide
```

## Available Scripts

```bash
# Development
pnpm dev          # Start development server

# Building
pnpm build        # Build for production
pnpm start        # Start production server

# Linting
pnpm lint         # Run ESLint
```

## Environment Variables

Required environment variables (see `.env.example`):

```env
KINDE_CLIENT_ID=              # Your Kinde client ID
KINDE_CLIENT_SECRET=          # Your Kinde client secret
KINDE_ISSUER_URL=             # Your Kinde issuer URL
KINDE_SITE_URL=               # Your site URL
KINDE_POST_LOGOUT_REDIRECT_URL=   # Post-logout redirect
KINDE_POST_LOGIN_REDIRECT_URL=    # Post-login redirect
```

## Features in Detail

### AI SQL Generation
- Natural language to SQL conversion
- Query explanation and analysis
- Estimated result counts
- Table usage tracking

### Schema Explorer
- Browse all database tables
- View column types and constraints
- See table relationships
- Quick reference for queries

### Query History
- Save all executed queries
- Star favorite queries
- Replay previous queries
- View execution statistics

### Data Visualization
- Automatic chart type detection
- Bar, line, pie, and area charts
- Interactive data tables
- Export to CSV/JSON

## Development

### Adding New Components

This project uses shadcn/ui for components. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Database Setup

The application currently uses a demo in-memory database. To connect to a real database:

1. Update `lib/query-executor.ts` with your database client
2. Update `lib/demo-database.ts` with your schema
3. Configure database connection in environment variables

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Remember to update Kinde callback URLs with your production domain.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check [KINDE_SETUP.md](./KINDE_SETUP.md) for auth issues
- Review [Kinde documentation](https://kinde.com/docs)

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Authentication by [Kinde](https://kinde.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
