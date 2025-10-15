# BD Control Plane

> Mission control for all your BD-tracked repositories

A modern web dashboard for managing, visualizing, and interacting with BD (Beads) issue tracking across multiple repositories. Built with the latest 2025 stack.

## ✨ Features

- 🗂️ **Multi-Repo Aggregation** - View issues from all BD-tracked repositories in one unified dashboard
- 🕸️ **Interactive Dependency Graphs** - Visualize issue dependencies and blockers with React Flow
- 📊 **Analytics & Charts** - Track progress, burndown, and velocity with Recharts
- 📋 **Kanban Board** - Organize and manage issues with drag-and-drop
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS v4
- 🌓 **Dark Mode** - Seamless theme switching
- ⚡ **Fast** - Next.js 15 with Turbopack

## 🚀 Tech Stack

This project uses the cutting-edge 2025 web development stack:

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router & Turbopack
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (zero-config)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **Graph Visualization**: [@xyflow/react](https://reactflow.dev/) (React Flow v12)
- **Charts**: [Recharts v3](https://recharts.org/)
- **Data Manipulation**: [D3.js v7](https://d3js.org/)
- **Graph Layouts**: [Dagre](https://github.com/dagrejs/dagre)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/numman-ali/bd-control-plane.git
cd bd-control-plane

# Install dependencies
npm install --legacy-peer-deps
# or
pnpm install
# or
yarn install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

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

### Current Status

- ✅ Project setup with Next.js 15 + Tailwind v4
- ✅ shadcn/ui integration
- ✅ Visualization libraries installed
- 🚧 BD JSONL parser for multi-repo scanning
- 🚧 Repository overview page
- 🚧 Interactive dependency graph view
- 🚧 Kanban board
- 🚧 Analytics dashboard
- 🚧 BD CLI integration
- 🚧 Vercel deployment

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
