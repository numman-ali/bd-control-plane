# Working with BD (Beads) - Guide for Claude

## What is BD?

BD (Beads) is a dependency-aware issue tracker designed specifically for AI-supervised workflows. It's a "memory system for coding agents" that lets you manage complex, multi-step tasks with proper dependency tracking across sessions.

Think of it as: **Issues chained together like beads.**

## Core Concepts

### Local SQLite + Git-Distributed JSONL
- Locally uses SQLite for fast queries (<100ms)
- Source of truth is JSONL files committed to git
- Auto-syncs between SQLite and JSONL automatically
- No servers or configuration needed

### Dependency Types
1. **blocks** - Task B must complete before Task A
2. **related** - Soft connection, doesn't block progress
3. **parent-child** - Epic/subtask hierarchical relationship
4. **discovered-from** - Auto-created when AI discovers related work

### Ready Work
The `bd ready` command shows issues that are:
- Status is 'open' AND
- No blocking dependencies

This is the **perfect command for agents to find next work to claim!**

---

## Getting Started

### Initialize a Project
```bash
# Auto-detect prefix from directory name
bd init

# Or specify custom prefix
bd init --prefix myapp
```

This creates `.beads/` directory with project-specific database.

---

## Essential Commands for AI Agents

### 1. Find Work to Do
```bash
bd ready              # Show ready issues (human-readable)
bd ready --json       # JSON output for programmatic parsing
```

### 2. Create New Issues
```bash
# Simple create
bd create "Fix login bug"

# With details
bd create "Add authentication" \
  -p 0 \
  -t feature \
  -d "Implement OAuth2 flow" \
  --assignee claude

# Get JSON response
bd create "Write tests" --json
```

### 3. View Issues
```bash
bd list                    # All issues
bd list --status open      # Filter by status
bd list --priority 0       # Filter by priority (0-4, 0=highest)
bd show bd-1              # Detailed view of specific issue
```

### 4. Manage Dependencies
```bash
# Add blocking dependency (bd-2 blocks bd-1)
bd dep add bd-1 bd-2

# Add with specific type
bd dep add bd-1 bd-3 --type related

# Visualize dependency tree
bd dep tree bd-1

# Detect circular dependencies
bd dep cycles
```

### 5. Update Issues
```bash
# Update status
bd update bd-1 --status in_progress

# Update priority
bd update bd-1 --priority 0

# Update assignee
bd update bd-1 --assignee claude

# Combine multiple updates
bd update bd-1 --status in_progress --priority 0
```

### 6. Close Issues
```bash
bd close bd-1
bd close bd-2 bd-3 --reason "Fixed in PR #42"
```

---

## AI Agent Workflow Pattern

When working on tasks, follow this pattern:

### 1. Check for Ready Work
```bash
bd ready --json
```

### 2. During Execution: Create Issues for Discovered Work
```bash
# When you discover a new task while working
NEW_ID=$(bd create "New task discovered" --json | jq -r '.id')

# Link it to current work
bd dep add $NEW_ID $CURRENT_ID --type discovered-from
```

### 3. Update Status When Starting Work
```bash
bd update bd-1 --status in_progress
```

### 4. Close When Complete
```bash
bd close bd-1 --reason "Completed: implemented OAuth2 with JWT tokens"
```

### 5. Repeat
The dependency graph ensures work is done in the right order.

---

## Database Discovery

BD automatically finds your database by checking:
1. `--db /path/to/db.db` flag
2. `$BEADS_DB` environment variable
3. `.beads/*.db` in current directory or ancestors (walks up like git)
4. `~/.beads/default.db` as fallback

---

## Git Workflow (Automatic!)

BD automatically keeps git in sync:
- Exports to JSONL after CRUD operations (5s debounce)
- Imports from JSONL when newer than DB (e.g., after git pull)
- Works seamlessly across machines and team members

**No manual export/import needed!**

Disable with: `--no-auto-flush` or `--no-auto-import`

---

## Advanced: Database Extension

Applications can extend BD's SQLite database:
- Add your own tables (e.g., `myapp_executions`)
- Join with `issues` table for powerful queries
- See: https://github.com/steveyegge/beads/blob/main/EXTENDING.md

---

## Why Use BD Instead of Markdown TODOs?

### BD Advantages
- **Dependency tracking**: Automatically knows what's ready to work on
- **Persistent memory**: Survives across sessions and conversations
- **Team collaboration**: Git-based, works across machines
- **Queryable**: Fast SQLite queries, JSON output for parsing
- **Audit trail**: Every change is logged
- **No duplicate work**: Dependencies prevent agents from overlapping

### When to Use Markdown TODOs
- Single session, simple linear tasks
- Ephemeral work that doesn't need persistence
- Quick brainstorming

**Recommendation**: For any multi-step work or work that might span sessions, use BD.

---

## Example: Complex Task Workflow

```bash
# Initialize
bd init --prefix myapp

# Create main epic
bd create "Implement user authentication system" -t epic -p 0 --json
# Returns: {"id": "myapp-1", ...}

# Create subtasks
bd create "Design database schema" -p 1 --json
# Returns: {"id": "myapp-2", ...}

bd create "Implement OAuth2 flow" -p 0 --json
# Returns: {"id": "myapp-3", ...}

bd create "Write tests" -p 1 --json
# Returns: {"id": "myapp-4", ...}

# Set up dependencies
bd dep add myapp-1 myapp-2 --type parent-child
bd dep add myapp-1 myapp-3 --type parent-child
bd dep add myapp-1 myapp-4 --type parent-child
bd dep add myapp-3 myapp-2  # OAuth blocks on schema
bd dep add myapp-4 myapp-3  # Tests block on OAuth

# Check what's ready
bd ready
# Shows: myapp-2 (design database schema)

# Start work
bd update myapp-2 --status in_progress

# Complete it
bd close myapp-2 --reason "Created schema with users, sessions, tokens tables"

# Check what's ready now
bd ready
# Shows: myapp-3 (implement OAuth2 flow)
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `bd init` | Initialize project |
| `bd create "title"` | Create new issue |
| `bd list` | View all issues |
| `bd ready` | Show ready work |
| `bd show <id>` | Show issue details |
| `bd update <id>` | Update issue |
| `bd close <id>` | Close issue |
| `bd dep add <a> <b>` | Add dependency (b blocks a) |
| `bd dep tree <id>` | Visualize dependencies |
| `--json` | Get JSON output |

---

## Tips for Claude

1. **Always check `bd ready` before asking user what to work on** - there might already be queued work!

2. **Create issues proactively** - When you discover new work during execution, file it immediately with proper dependencies.

3. **Use meaningful close reasons** - Future you (or other agents) will appreciate the context.

4. **Leverage `--json` flags** - Parse output programmatically for robust workflows.

5. **Check `bd dep cycles`** - Before creating complex dependency chains, verify no circular dependencies.

6. **Use priorities** - 0 is highest, 4 is lowest. Critical work should be priority 0.

7. **Update status** - Keep issues in sync: `open` → `in_progress` → `closed`

---

## Resources

- GitHub: https://github.com/steveyegge/beads
- Extension Guide: https://github.com/steveyegge/beads/blob/main/EXTENDING.md
- Claude Code Plugin: Available with slash commands and MCP tools
- MCP Server: Available for other compatible clients

---

**Remember**: BD is designed for AI-supervised workflows. Use it to maintain context across sessions, coordinate with other agents, and ensure complex work happens in the right order.

---

## 🚀 BD Control Plane Project - Current State

**Last Updated**: October 16, 2025
**Status**: Feature-complete UI, needs backend fixes for production
**Completion**: 18/18 BD issues closed (100%)

### What This Project Is

BD Control Plane is a web dashboard for managing BD (Beads) issues across multiple GitHub repositories. It uses GitHub OAuth to authenticate users, then scans their repos for `.beads/` directories and visualizes the issues.

### Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind v4
- **Auth**: Better Auth (NOT NextAuth!)
- **Database**: Drizzle ORM + Neon Serverless Postgres
- **GitHub API**: Octokit
- **UI**: shadcn/ui + Framer Motion + Recharts

### Current State Summary

**What Works:**
- ✅ Beautiful landing page with animations
- ✅ Login page UI
- ✅ Onboarding flow UI
- ✅ Dashboard, Graph, Kanban, Analytics pages (UI)
- ✅ Settings page UI
- ✅ Admin panel UI
- ✅ Command palette (Cmd+K)
- ✅ Navigation with user menu
- ✅ Responsive design (desktop)

**What Needs Fixing:**
- ❌ OAuth token retrieval (critical - breaks all API calls)
- ❌ Mobile navigation (critical - no nav on mobile)
- ❌ Database migrations (critical - can't deploy)
- ❌ PAT functionality (UI exists but doesn't save to DB)
- ❌ Admin panel shows mock data
- ❌ Error handling in client components
- ❌ Loading skeletons not used

### 🔴 Critical Blockers

**MUST FIX BEFORE PRODUCTION:**

1. **OAuth Token Retrieval** - See `NEXT_STEPS.md` section 1
2. **Mobile Navigation** - See `NEXT_STEPS.md` section 2
3. **Database Migrations** - See `NEXT_STEPS.md` section 3

These three issues will prevent the app from working at all.

### 📚 Key Files for Next Agent

**Read These First:**
- `NEXT_STEPS.md` - Detailed fix instructions
- `STANDOUT_FEATURES.md` - Product strategy and wow features
- `LAUNCH.md` - What we built and deployment guide

**Files to Modify:**
- `app/api/*/route.ts` - Fix token retrieval (all 4 files)
- `components/nav.tsx` - Add mobile menu
- `app/settings/page.tsx` - Implement PAT storage
- `app/admin/page.tsx` - Query real user data

**Database Schema:**
- `lib/db/schema.ts` - Already complete, just need to use it!

### 🎯 Recommended Workflow for Next Agent

1. **Read the audit**: `NEXT_STEPS.md` (comprehensive issue list)
2. **Fix blockers**: Start with OAuth token retrieval
3. **Add mobile nav**: Use shadcn Sheet component
4. **Generate migrations**: Run `npx drizzle-kit generate`
5. **Test locally**: Ensure OAuth flow works end-to-end
6. **Commit often**: Keep BD issues updated!

### 📊 BD Project Tracking

This project used BD to track its own development!

```bash
# View project history
bd list

# See dependency graph
bd dep tree bdviz-1

# Check if anything remains
bd ready
```

All 18 issues are closed, but you may want to create new issues for the critical fixes:

```bash
bd create "Fix OAuth token retrieval in API routes" -p 0 -t bug
bd create "Add mobile navigation menu" -p 0 -t feature
bd create "Generate database migrations" -p 0 -t task
bd create "Implement PAT storage in database" -p 1 -t feature
bd create "Add comprehensive error handling" -p 1 -t task
```

### 🎨 Vision for Standout Status

See `STANDOUT_FEATURES.md` for ideas on:
- Real-time collaboration
- AI-powered insights
- Share links & embeds
- GitHub Actions integration
- Success metrics to track

### ⚠️ Important Notes

1. **This is a PUBLIC repository** - All code is visible on GitHub
2. **Be honest about limitations** - Don't hide issues
3. **Document everything** - Future developers need context
4. **Test thoroughly** - This could be a real product!

### 🤝 Handoff Checklist

Before you start working:
- [ ] Read `NEXT_STEPS.md` completely
- [ ] Understand the OAuth token issue
- [ ] Check BD issues: `bd ready`
- [ ] Review the tech stack documentation
- [ ] Set up local environment (.env.local)

### 💡 Quick Start for Development

```bash
# Create .env.local with test credentials
# See .env.example for template

# Install dependencies
npm install --legacy-peer-deps

# Run dev server (works on Termux with Turbopack)
npm run dev

# The app will run but APIs will fail (OAuth token issue)
```

---

**Good luck building the next phase! You've got an incredible foundation to work with.** 🚀

**Questions?** Check the comprehensive docs or review the codebase - everything is documented!
