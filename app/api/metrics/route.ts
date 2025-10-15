import { NextResponse } from "next/server";
import { loadMultiRepoData, calculateMetrics } from "@/lib/bd-parser";
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
      process.cwd(),
    ].filter(p => {
      try {
        return require("fs").existsSync(p);
      } catch {
        return false;
      }
    });

    const data = loadMultiRepoData(scanPaths);
    const metrics = calculateMetrics(data.allIssues);

    // Calculate per-repo metrics
    const repoMetrics = data.repositories.map(repo => ({
      name: repo.name,
      metrics: calculateMetrics(repo.issues),
    }));

    return NextResponse.json({
      overall: metrics,
      byRepo: repoMetrics,
      repositories: data.repositories.length,
    });
  } catch (error) {
    console.error("Error calculating metrics:", error);
    return NextResponse.json(
      { error: "Failed to calculate metrics" },
      { status: 500 }
    );
  }
}
