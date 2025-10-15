import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { loadGitHubMultiRepoData } from "@/lib/github-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Get GitHub access token from session
    const accessToken = (session as any).accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "No GitHub access token found. Please reconnect your GitHub account." },
        { status: 400 }
      );
    }

    const data = await loadGitHubMultiRepoData(accessToken);

    return NextResponse.json({
      repositories: data.repositories.map(repo => ({
        name: repo.name,
        path: repo.path,
        prefix: repo.prefix,
        issueCount: repo.issues.length,
        openCount: repo.issues.filter(i => i.status === "open").length,
        inProgressCount: repo.issues.filter(i => i.status === "in_progress").length,
        closedCount: repo.issues.filter(i => i.status === "closed").length,
      })),
      totalRepos: data.repositories.length,
      totalIssues: data.allIssues.length,
      totalOpen: data.totalOpen,
      totalInProgress: data.totalInProgress,
      totalClosed: data.totalClosed,
    });
  } catch (error) {
    console.error("Error loading repos:", error);
    return NextResponse.json(
      { error: "Failed to load repositories from GitHub" },
      { status: 500 }
    );
  }
}
