"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Folder, AlertCircle, CheckCircle2, Clock, ArrowRight } from "lucide-react";

interface RepoData {
  name: string;
  path: string;
  prefix: string;
  issueCount: number;
  openCount: number;
  inProgressCount: number;
  closedCount: number;
}

interface DashboardData {
  repositories: RepoData[];
  totalRepos: number;
  totalIssues: number;
  totalOpen: number;
  totalInProgress: number;
  totalClosed: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/repos")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.totalRepos === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Repositories Found</CardTitle>
            <CardDescription>
              No BD-tracked repositories were found in your common project directories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Initialize BD in a project directory with:
            </p>
            <code className="block bg-muted p-3 rounded-md text-sm font-mono">
              bd init
            </code>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRepos}</div>
            <p className="text-xs text-muted-foreground">
              {data.totalIssues} total issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalOpen}</div>
            <p className="text-xs text-muted-foreground">
              Ready to work on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalInProgress}</div>
            <p className="text-xs text-muted-foreground">
              Currently being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalClosed}</div>
            <p className="text-xs text-muted-foreground">
              {((data.totalClosed / data.totalIssues) * 100).toFixed(0)}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Repositories List */}
      <Card>
        <CardHeader>
          <CardTitle>Repositories</CardTitle>
          <CardDescription>
            All BD-tracked repositories found on this machine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.repositories.map((repo, idx) => (
              <div key={repo.path}>
                {idx > 0 && <Separator />}
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{repo.name}</h3>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {repo.prefix}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{repo.path}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">{repo.issueCount}</span>
                        <span className="text-muted-foreground">total</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-yellow-600">{repo.openCount}</span>
                        <span className="text-muted-foreground">open</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-blue-600">{repo.inProgressCount}</span>
                        <span className="text-muted-foreground">in progress</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-green-600">{repo.closedCount}</span>
                        <span className="text-muted-foreground">closed</span>
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/graph?repo=${encodeURIComponent(repo.name)}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    View Graph
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
