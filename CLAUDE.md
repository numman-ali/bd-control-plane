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
