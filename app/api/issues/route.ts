import { NextResponse } from "next/server";
import { getReadyIssues } from "@/lib/bd-parser";
import { loadGitHubMultiRepoData } from "@/lib/github-api";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const accessToken = (session as any).accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const repo = searchParams.get("repo");
    const ready = searchParams.get("ready") === "true";

    const data = await loadGitHubMultiRepoData(accessToken);
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
