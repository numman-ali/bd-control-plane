// BD (Beads) Type Definitions

export type IssueStatus = "open" | "in_progress" | "closed";
export type IssueType = "task" | "feature" | "epic" | "bug";
export type DependencyType = "blocks" | "related" | "parent-child" | "discovered-from";

export interface Dependency {
  issue_id: string;
  depends_on_id: string;
  type: DependencyType;
  created_at: string;
  created_by: string;
}

export interface Issue {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  status: IssueStatus;
  priority: number; // 0-4, 0 is highest
  issue_type: IssueType;
  assignee?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  dependencies?: Dependency[];
  acceptance_criteria?: string;
  design?: string;
  external_ref?: string;
}

export interface Repository {
  name: string;
  path: string;
  dbPath: string;
  issues: Issue[];
  prefix: string; // e.g., "bdviz"
}

export interface MultiRepoData {
  repositories: Repository[];
  allIssues: Issue[];
  totalOpen: number;
  totalInProgress: number;
  totalClosed: number;
}

export interface DependencyGraphNode {
  id: string;
  title: string;
  status: IssueStatus;
  priority: number;
  type: IssueType;
  repo: string;
  assignee?: string;
}

export interface DependencyGraphEdge {
  id: string;
  source: string;
  target: string;
  type: DependencyType;
}

export interface DependencyGraph {
  nodes: DependencyGraphNode[];
  edges: DependencyGraphEdge[];
}
