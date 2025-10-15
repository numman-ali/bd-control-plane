import { NextResponse } from "next/server";
import { calculateMetrics } from "@/lib/bd-parser";
import { loadGitHubMultiRepoData } from "@/lib/github-api";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
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

    const data = await loadGitHubMultiRepoData(accessToken);
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
