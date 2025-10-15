import { NextResponse } from "next/server";
import { buildDependencyGraph } from "@/lib/bd-parser";
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
    const repo = searchParams.get("repo");

    const data = await loadGitHubMultiRepoData(accessToken);

    // Create issue-to-repo map
    const repoMap = new Map<string, string>();
    for (const repository of data.repositories) {
      for (const issue of repository.issues) {
        repoMap.set(issue.id, repository.name);
      }
    }

    let issues = data.allIssues;

    // Filter by repo if specified
    if (repo) {
      const targetRepo = data.repositories.find(r => r.name === repo);
      if (targetRepo) {
        issues = targetRepo.issues;
      }
    }

    const graph = buildDependencyGraph(issues, repoMap);

    return NextResponse.json(graph);
  } catch (error) {
    console.error("Error building graph:", error);
    return NextResponse.json(
      { error: "Failed to build dependency graph" },
      { status: 500 }
    );
  }
}
