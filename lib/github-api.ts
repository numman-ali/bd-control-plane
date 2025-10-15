import { Octokit } from "octokit";
import type { Issue, Repository, MultiRepoData } from "./types";

/**
 * Create authenticated Octokit instance
 */
export function createGitHubClient(accessToken: string) {
  return new Octokit({ auth: accessToken });
}

/**
 * Fetch all repositories for the authenticated user
 */
export async function fetchUserRepos(octokit: Octokit): Promise<{ name: string; full_name: string; html_url: string }[]> {
  try {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: "updated",
    });
    return data.map(repo => ({
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
    }));
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}

/**
 * Check if a repo has .beads directory
 */
export async function repoHasBeads(octokit: Octokit, owner: string, repo: string): Promise<boolean> {
  try {
    await octokit.rest.repos.getContent({
      owner,
      repo,
      path: ".beads",
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Fetch issues.jsonl content from a repository
 */
export async function fetchBeadsIssues(octokit: Octokit, owner: string, repo: string): Promise<Issue[]> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: ".beads/issues.jsonl",
    });

    if (!("content" in data) || !data.content) {
      return [];
    }

    // Decode base64 content
    const content = Buffer.from(data.content, "base64").toString("utf-8");

    // Parse JSONL
    const lines = content.trim().split("\n").filter(line => line.trim());
    const issues: Issue[] = lines.map(line => {
      try {
        return JSON.parse(line) as Issue;
      } catch (e) {
        console.error(`Failed to parse line:`, line);
        return null;
      }
    }).filter((issue): issue is Issue => issue !== null);

    return issues;
  } catch (error) {
    console.error(`Error fetching .beads/issues.jsonl from ${owner}/${repo}:`, error);
    return [];
  }
}

/**
 * Get repository prefix from database filename
 */
async function getRepoPrefix(octokit: Octokit, owner: string, repo: string): Promise<string> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: ".beads",
    });

    if (Array.isArray(data)) {
      const dbFile = data.find(f => f.name.endsWith(".db") && f.name !== "beads.db");
      if (dbFile) {
        return dbFile.name.replace(".db", "");
      }
    }
    return repo;
  } catch {
    return repo;
  }
}

/**
 * Load all BD-tracked repositories for a user
 */
export async function loadUserRepos(accessToken: string): Promise<Repository[]> {
  const octokit = createGitHubClient(accessToken);
  const repos = await fetchUserRepos(octokit);

  const repositories: Repository[] = [];

  for (const repo of repos) {
    const [owner, repoName] = repo.full_name.split("/");

    const hasBeads = await repoHasBeads(octokit, owner, repoName);
    if (!hasBeads) continue;

    const issues = await fetchBeadsIssues(octokit, owner, repoName);
    const prefix = await getRepoPrefix(octokit, owner, repoName);

    repositories.push({
      name: repo.name,
      path: repo.html_url,
      dbPath: `${repo.html_url}/.beads`,
      issues,
      prefix,
    });
  }

  return repositories;
}

/**
 * Load multi-repo data from GitHub
 */
export async function loadGitHubMultiRepoData(accessToken: string): Promise<MultiRepoData> {
  const repositories = await loadUserRepos(accessToken);

  const allIssues = repositories.flatMap(repo => repo.issues);
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
