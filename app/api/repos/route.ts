import { NextResponse } from "next/server";
import { loadMultiRepoData } from "@/lib/bd-parser";
import os from "os";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const homeDir = os.homedir();
    const scanPaths = [
      path.join(homeDir, "repos"),
      path.join(homeDir, "projects"),
      path.join(homeDir, "work"),
      process.cwd(), // Current project
    ].filter(p => {
      try {
        return require("fs").existsSync(p);
      } catch {
        return false;
      }
    });

    const data = loadMultiRepoData(scanPaths);

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
      { error: "Failed to load repositories" },
      { status: 500 }
    );
  }
}
