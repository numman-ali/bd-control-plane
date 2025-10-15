import { NextResponse } from "next/server";
import { loadMultiRepoData, buildDependencyGraph } from "@/lib/bd-parser";
import os from "os";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const repo = searchParams.get("repo");

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
