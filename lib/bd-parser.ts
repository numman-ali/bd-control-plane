import fs from "fs";
import path from "path";
import type { Issue, Repository, MultiRepoData, DependencyGraph } from "./types";

/**
 * Parse a single JSONL file and return array of issues
 */
export function parseJSONLFile(filePath: string): Issue[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.trim().split("\n").filter(line => line.trim());

    return lines.map(line => {
      try {
        return JSON.parse(line) as Issue;
      } catch (e) {
        console.error(`Failed to parse line in ${filePath}:`, line);
        return null;
      }
    }).filter((issue): issue is Issue => issue !== null);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

/**
 * Find all .beads directories in a given root path
 */
export function findBeadsDirectories(rootPath: string, maxDepth: number = 5): string[] {
  const beadsDirs: string[] = [];

  function scan(dir: string, depth: number) {
    if (depth > maxDepth) return;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const fullPath = path.join(dir, entry.name);

        // Skip node_modules and hidden directories (except .beads)
        if (entry.name === "node_modules" || (entry.name.startsWith(".") && entry.name !== ".beads")) {
          continue;
        }

        if (entry.name === ".beads") {
          beadsDirs.push(fullPath);
          continue; // Don't scan inside .beads
        }

        // Recursively scan subdirectories
        scan(fullPath, depth + 1);
      }
    } catch (error) {
      // Permission denied or other errors - skip this directory
      return;
    }
  }

  scan(rootPath, 0);
  return beadsDirs;
}

/**
 * Extract repository name and prefix from a .beads directory
 */
export function getRepoInfo(beadsPath: string): { name: string; prefix: string } {
  const repoPath = path.dirname(beadsPath);
  const name = path.basename(repoPath);

  // Try to find the prefix from the database filename
  try {
    const files = fs.readdirSync(beadsPath);
    const dbFile = files.find(f => f.endsWith(".db") && f !== "beads.db");
    const prefix = dbFile ? path.basename(dbFile, ".db") : name;
    return { name, prefix };
  } catch {
    return { name, prefix: name };
  }
}

/**
 * Load a single repository's issues
 */
export function loadRepository(beadsPath: string): Repository | null {
  try {
    const issuesPath = path.join(beadsPath, "issues.jsonl");

    if (!fs.existsSync(issuesPath)) {
      return null;
    }

    const issues = parseJSONLFile(issuesPath);
    const { name, prefix } = getRepoInfo(beadsPath);

    return {
      name,
      path: path.dirname(beadsPath),
      dbPath: beadsPath,
      issues,
      prefix,
    };
  } catch (error) {
    console.error(`Error loading repository from ${beadsPath}:`, error);
    return null;
  }
}

/**
 * Scan multiple directories and load all BD repositories
 */
export function loadMultiRepoData(rootPaths: string[]): MultiRepoData {
  const repositories: Repository[] = [];
  const allIssues: Issue[] = [];

  for (const rootPath of rootPaths) {
    const beadsDirs = findBeadsDirectories(rootPath);

    for (const beadsDir of beadsDirs) {
      const repo = loadRepository(beadsDir);
      if (repo) {
        repositories.push(repo);
        allIssues.push(...repo.issues);
      }
    }
  }

  const totalOpen = allIssues.filter(i => i.status === "open").length;
  const totalInProgress = allIssues.filter(i => i.status === "in_progress").length;
  const totalClosed = allIssues.filter(i => i.status === "closed").length;

  return {
    repositories,
    allIssues,
    totalOpen,
    totalInProgress,
    totalClosed,
  };
}

/**
 * Build a dependency graph from issues
 */
export function buildDependencyGraph(issues: Issue[], repoMap: Map<string, string>): DependencyGraph {
  const nodes = issues.map(issue => ({
    id: issue.id,
    title: issue.title,
    status: issue.status,
    priority: issue.priority,
    type: issue.issue_type,
    repo: repoMap.get(issue.id) || "unknown",
    assignee: issue.assignee,
  }));

  const edges: DependencyGraph["edges"] = [];

  for (const issue of issues) {
    if (issue.dependencies) {
      for (const dep of issue.dependencies) {
        edges.push({
          id: `${dep.issue_id}-${dep.depends_on_id}-${dep.type}`,
          source: dep.depends_on_id, // The dependency
          target: dep.issue_id,      // The dependent issue
          type: dep.type,
        });
      }
    }
  }

  return { nodes, edges };
}

/**
 * Get issues that are ready to work on (no blocking dependencies)
 */
export function getReadyIssues(issues: Issue[]): Issue[] {
  const issueMap = new Map(issues.map(i => [i.id, i]));

  return issues.filter(issue => {
    // Must be open
    if (issue.status !== "open") return false;

    // Check if any blocking dependencies are not closed
    if (issue.dependencies) {
      const blockingDeps = issue.dependencies.filter(d => d.type === "blocks");

      for (const dep of blockingDeps) {
        const depIssue = issueMap.get(dep.depends_on_id);
        // If the dependency exists and is not closed, this issue is blocked
        if (depIssue && depIssue.status !== "closed") {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * Calculate various metrics for analytics
 */
export function calculateMetrics(issues: Issue[]) {
  const byStatus = {
    open: issues.filter(i => i.status === "open").length,
    in_progress: issues.filter(i => i.status === "in_progress").length,
    closed: issues.filter(i => i.status === "closed").length,
  };

  const byPriority = {
    p0: issues.filter(i => i.priority === 0).length,
    p1: issues.filter(i => i.priority === 1).length,
    p2: issues.filter(i => i.priority === 2).length,
    p3: issues.filter(i => i.priority === 3).length,
    p4: issues.filter(i => i.priority === 4).length,
  };

  const byType = {
    task: issues.filter(i => i.issue_type === "task").length,
    feature: issues.filter(i => i.issue_type === "feature").length,
    bug: issues.filter(i => i.issue_type === "bug").length,
    epic: issues.filter(i => i.issue_type === "epic").length,
  };

  const avgDepsPerIssue = issues.reduce((sum, i) =>
    sum + (i.dependencies?.length || 0), 0
  ) / Math.max(issues.length, 1);

  return {
    total: issues.length,
    byStatus,
    byPriority,
    byType,
    avgDepsPerIssue,
    readyCount: getReadyIssues(issues).length,
  };
}
