"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock, CheckCircle2, Folder } from "lucide-react";
import type { Issue } from "@/lib/types";

interface IssueWithRepo extends Issue {
  repository: string;
}

interface RepoData {
  name: string;
}

export default function KanbanPage() {
  const [issues, setIssues] = useState<IssueWithRepo[]>([]);
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/issues").then((res) => res.json()),
      fetch("/api/repos").then((res) => res.json()),
    ])
      .then(([issuesData, reposData]) => {
        setIssues(issuesData.issues || []);
        setRepos(reposData.repositories || []);
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
          <p className="text-muted-foreground">Loading kanban board...</p>
        </div>
      </div>
    );
  }

  const filteredIssues = selectedRepo === "all"
    ? issues
    : issues.filter((i) => i.repository === selectedRepo);

  const openIssues = filteredIssues.filter((i) => i.status === "open");
  const inProgressIssues = filteredIssues.filter((i) => i.status === "in_progress");
  const closedIssues = filteredIssues.filter((i) => i.status === "closed");

  const IssueCard = ({ issue }: { issue: IssueWithRepo }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {issue.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="font-mono text-xs">
                {issue.id}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                P{issue.priority}
              </Badge>
              {issue.issue_type && (
                <Badge variant="outline" className="text-xs">
                  {issue.issue_type}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {(issue.description || issue.repository || issue.assignee) && (
        <CardContent className="pt-0">
          {issue.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {issue.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {issue.repository && (
              <span className="flex items-center gap-1">
                <Folder className="h-3 w-3" />
                {issue.repository}
              </span>
            )}
            {issue.assignee && (
              <span className="font-medium">{issue.assignee}</span>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );

  const Column = ({
    title,
    icon: Icon,
    count,
    issues,
    color,
  }: {
    title: string;
    icon: any;
    count: number;
    issues: IssueWithRepo[];
    color: string;
  }) => (
    <div className="flex-1 min-w-[300px]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <CardTitle className="text-base">{title}</CardTitle>
            </div>
            <Badge variant="secondary">{count}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {issues.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No issues
              </p>
            ) : (
              issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground mt-1">
            Track issue progress across all repositories
          </p>
        </div>

        <Tabs value={selectedRepo} onValueChange={setSelectedRepo}>
          <TabsList>
            <TabsTrigger value="all">All Repos</TabsTrigger>
            {repos.slice(0, 5).map((repo) => (
              <TabsTrigger key={repo.name} value={repo.name}>
                {repo.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Column
          title="Open"
          icon={AlertCircle}
          count={openIssues.length}
          issues={openIssues}
          color="text-yellow-500"
        />
        <Column
          title="In Progress"
          icon={Clock}
          count={inProgressIssues.length}
          issues={inProgressIssues}
          color="text-blue-500"
        />
        <Column
          title="Closed"
          icon={CheckCircle2}
          count={closedIssues.length}
          issues={closedIssues}
          color="text-green-500"
        />
      </div>
    </div>
  );
}
