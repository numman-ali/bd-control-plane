"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Metrics {
  overall: {
    total: number;
    byStatus: { open: number; in_progress: number; closed: number };
    byPriority: { p0: number; p1: number; p2: number; p3: number; p4: number };
    byType: { task: number; feature: number; bug: number; epic: number };
    avgDepsPerIssue: number;
    readyCount: number;
  };
  byRepo: Array<{
    name: string;
    metrics: any;
  }>;
  repositories: number;
}

const COLORS = {
  open: "#eab308",
  in_progress: "#3b82f6",
  closed: "#22c55e",
  p0: "#ef4444",
  p1: "#f97316",
  p2: "#eab308",
  p3: "#84cc16",
  p4: "#22c55e",
  task: "#3b82f6",
  feature: "#8b5cf6",
  bug: "#ef4444",
  epic: "#f59e0b",
};

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return <div>Failed to load metrics</div>;
  }

  const statusData = [
    { name: "Open", value: metrics.overall.byStatus.open, color: COLORS.open },
    { name: "In Progress", value: metrics.overall.byStatus.in_progress, color: COLORS.in_progress },
    { name: "Closed", value: metrics.overall.byStatus.closed, color: COLORS.closed },
  ];

  const priorityData = Object.entries(metrics.overall.byPriority).map(([key, value]) => ({
    name: key.toUpperCase(),
    count: value,
    fill: COLORS[key as keyof typeof COLORS],
  }));

  const typeData = Object.entries(metrics.overall.byType).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    count: value,
    fill: COLORS[key as keyof typeof COLORS],
  }));

  const repoData = metrics.byRepo.map((repo) => ({
    name: repo.name,
    total: repo.metrics.total,
    open: repo.metrics.byStatus.open,
    inProgress: repo.metrics.byStatus.in_progress,
    closed: repo.metrics.byStatus.closed,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Insights and metrics across all repositories
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overall.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {metrics.repositories} repositories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ready to Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.overall.readyCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              No blocking dependencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {((metrics.overall.byStatus.closed / metrics.overall.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.overall.byStatus.closed} closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.overall.avgDepsPerIssue.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per issue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
            <CardDescription>Distribution across open, in progress, and closed</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues by Priority</CardTitle>
            <CardDescription>P0 (highest) to P4 (lowest)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues by Type</CardTitle>
            <CardDescription>Task, feature, bug, or epic</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repository Comparison</CardTitle>
            <CardDescription>Issues across repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={repoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="open" stackId="a" fill={COLORS.open} name="Open" />
                <Bar dataKey="inProgress" stackId="a" fill={COLORS.in_progress} name="In Progress" />
                <Bar dataKey="closed" stackId="a" fill={COLORS.closed} name="Closed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Repository Details */}
      <Card>
        <CardHeader>
          <CardTitle>Repository Details</CardTitle>
          <CardDescription>Breakdown by repository</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.byRepo.map((repo) => (
              <div key={repo.name} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <h4 className="font-medium">{repo.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{repo.metrics.total} total</span>
                    <span className="text-yellow-600">{repo.metrics.byStatus.open} open</span>
                    <span className="text-blue-600">{repo.metrics.byStatus.in_progress} in progress</span>
                    <span className="text-green-600">{repo.metrics.byStatus.closed} closed</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {repo.metrics.readyCount} ready
                  </Badge>
                  <Badge variant="outline">
                    {((repo.metrics.byStatus.closed / repo.metrics.total) * 100).toFixed(0)}% complete
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
