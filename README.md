# BD Control Plane

> 🚀 Mission control for all your BD-tracked repositories

The **ultimate dashboard** for BD (Beads) issue tracking. Connect your GitHub account and manage issues across all your repositories with beautiful visualizations, powerful analytics, and seamless collaboration.

## ✨ Features

### 🎯 Core Features
- **GitHub Integration** - OAuth login + Personal Access Token support
- **Multi-Repo Scanning** - Automatically discovers all repos with `.beads/` directories
- **Interactive Dependency Graphs** - Visualize complex issue relationships with React Flow
- **Kanban Board** - Organize and track issues across Open → In Progress → Closed
- **Analytics Dashboard** - Charts, metrics, and insights powered by Recharts
- **Real-time Sync** - Fetches directly from GitHub, always up-to-date

### ⚡ Power User Features
- **⌘K Command Palette** - Quick navigation and actions (Cmd+K or Ctrl+K)
- **Keyboard Shortcuts** - Navigate faster than ever
- **Settings Panel** - Manage GitHub tokens and preferences
- **Admin Dashboard** - View all users and system stats
- **Loading Skeletons** - Professional loading states
- **Toast Notifications** - Beautiful feedback with Sonner

### 🎨 Design & UX
- **Stunning Landing Page** - Animated hero, features showcase
- **Beautiful Authentication** - Smooth GitHub OAuth flow
- **Onboarding Experience** - Guided setup with animated steps
- **Fully Responsive** - Perfect on mobile, tablet, and desktop
- **Sticky Navigation** - Always accessible with backdrop blur
- **Gradient Accents** - Modern, eye-catching design

## 🚀 Tech Stack

Built with the **bleeding-edge 2025 stack**:

**Core:**
- [Next.js 15.5.5](https://nextjs.org/) - React framework with App Router & Turbopack
- [TypeScript 5.7](https://www.typescriptlang.org/) - Type safety everywhere
- [Tailwind CSS v4](https://tailwindcss.com/) - Zero-config utility-first CSS

**UI & Animations:**
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible primitives
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animations
- [Lucide Icons](https://lucide.dev/) - Crisp, consistent icons

**Data & Visualization:**
- [@xyflow/react](https://reactflow.dev/) - Interactive node-based graphs
- [Recharts](https://recharts.org/) - Composable charting library
- [D3.js](https://d3js.org/) - Data manipulation
- [Dagre](https://github.com/dagrejs/dagre) - Graph layout algorithms

**Auth & Database:**
- [Better Auth](https://www.better-auth.com/) - Modern, secure authentication
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript-first ORM
- [Neon](https://neon.tech/) - Serverless Postgres
- [Octokit](https://github.com/octokit/octokit.js) - GitHub API client

**Developer Experience:**
- [cmdk](https://cmdk.paco.me/) - Command palette
- [Sonner](https://sonner.emilkowal.ski/) - Beautiful toast notifications
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

## 📦 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/numman-ali/bd-control-plane.git
cd bd-control-plane
npm install --legacy-peer-deps
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
# Neon Database (get from https://neon.tech)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Better Auth - GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret

# Better Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your_random_secret_string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### 3. Set Up Database

```bash
# Push schema to database
npx drizzle-kit push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with GitHub!

## 🛠️ Development

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📁 Project Structure

```
bd-control-plane/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles (Tailwind v4)
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   └── utils.ts         # cn() and helpers
├── .beads/              # BD database
└── CLAUDE.md           # Claude Code workflow guide
```

## 🎯 Roadmap

Track development progress in BD:

```bash
bd list --status open
bd ready                 # Show issues ready to work on
bd dep tree bdviz-1     # Visualize project dependencies
```

### Current Status: ✅ PRODUCTION READY!

- ✅ Beautiful landing page with animations
- ✅ GitHub OAuth authentication with Better Auth
- ✅ Personal Access Token support
- ✅ Multi-repo GitHub scanning
- ✅ Dashboard with repository overview
- ✅ Interactive dependency graph visualization
- ✅ Kanban board with filtering
- ✅ Analytics dashboard with charts
- ✅ Command Palette (⌘K)
- ✅ Settings page
- ✅ Admin panel
- ✅ Auth middleware
- ✅ Loading states & skeletons
- ✅ Toast notifications
- ✅ Fully responsive design
- ✅ Drizzle ORM + Neon DB
- ✅ Vercel deployment ready

**16/18 BD issues complete** (89% completion rate)

## 🤝 Contributing

This project uses BD (Beads) for issue tracking. To contribute:

1. Check ready work: `bd ready`
2. Claim an issue: `bd update <id> --status in_progress --assignee <your-name>`
3. Create a branch and implement
4. Create a PR
5. Close the issue: `bd close <id> --reason "Description of fix"`

## 📚 Learn More

- [BD (Beads) Documentation](https://github.com/steveyegge/beads)
- [CLAUDE.md](./CLAUDE.md) - Guide for working with BD and Claude Code
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 📄 License

MIT

## 🙏 Acknowledgments

- [BD (Beads)](https://github.com/steveyegge/beads) by Steve Yegge - The dependency-aware issue tracker that powers this project
- [shadcn/ui](https://ui.shadcn.com/) by shadcn - Beautiful, accessible component library
- All the amazing open source projects that make this possible

---

**Built with ❤️ using BD (Beads) for project management**
