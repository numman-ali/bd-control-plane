import { NextResponse } from "next/server";
import { loadMultiRepoData, getReadyIssues } from "@/lib/bd-parser";
import os from "os";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const repo = searchParams.get("repo");
    const ready = searchParams.get("ready") === "true";

    const homeDir = os.homedir();
    const scanPaths = [
      path.join(homeDir, "repos"),
      path.join(homeDir, "projects"),
      path.join(homeDir, "work"),
      process.cwd(),
    ].filter(p => {
      try {
        return require("fs").existsSync(p);
      } catch {
        return false;
      }
    });

    const data = loadMultiRepoData(scanPaths);
    let issues = data.allIssues;

    // Create repo map for each issue
    const issuesWithRepo = issues.map(issue => {
      const repository = data.repositories.find(r =>
        r.issues.some(i => i.id === issue.id)
      );
      return {
        ...issue,
        repository: repository?.name || "unknown",
      };
    });

    let filteredIssues = issuesWithRepo;

    // Apply filters
    if (status) {
      filteredIssues = filteredIssues.filter(i => i.status === status);
    }

    if (priority !== null && priority !== undefined) {
      const priorityNum = parseInt(priority);
      if (!isNaN(priorityNum)) {
        filteredIssues = filteredIssues.filter(i => i.priority === priorityNum);
      }
    }

    if (repo) {
      filteredIssues = filteredIssues.filter(i => i.repository === repo);
    }

    if (ready) {
      const readyIssues = getReadyIssues(issues);
      const readyIds = new Set(readyIssues.map(i => i.id));
      filteredIssues = filteredIssues.filter(i => readyIds.has(i.id));
    }

    return NextResponse.json({
      issues: filteredIssues,
      count: filteredIssues.length,
    });
  } catch (error) {
    console.error("Error loading issues:", error);
    return NextResponse.json(
      { error: "Failed to load issues" },
      { status: 500 }
    );
  }
}
