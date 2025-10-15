"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ReactFlow, Node, Edge, Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DependencyGraph } from "@/lib/types";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-yellow-500/20 border-yellow-500";
    case "in_progress":
      return "bg-blue-500/20 border-blue-500";
    case "closed":
      return "bg-green-500/20 border-green-500";
    default:
      return "bg-gray-500/20 border-gray-500";
  }
};

const getPriorityLabel = (priority: number) => {
  return `P${priority}`;
};

export default function GraphPage() {
  const searchParams = useSearchParams();
  const repo = searchParams.get("repo");

  const [data, setData] = useState<DependencyGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [direction, setDirection] = useState<"TB" | "LR">("TB");

  useEffect(() => {
    const url = repo ? `/api/graph?repo=${encodeURIComponent(repo)}` : "/api/graph";
    fetch(url)
      .then((res) => res.json())
      .then((graph: DependencyGraph) => {
        setData(graph);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [repo]);

  useEffect(() => {
    if (!data) return;

    const flowNodes: Node[] = data.nodes.map((node) => ({
      id: node.id,
      type: "default",
      data: {
        label: (
          <div className="px-3 py-2">
            <div className="font-semibold text-sm mb-1">{node.title}</div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="h-5 px-1.5">
                {node.id}
              </Badge>
              <Badge variant="outline" className="h-5 px-1.5">
                {getPriorityLabel(node.priority)}
              </Badge>
              <span className="text-muted-foreground">{node.repo}</span>
            </div>
          </div>
        ),
      },
      position: { x: 0, y: 0 },
      className: `border-2 rounded-lg shadow-md ${getStatusColor(node.status)}`,
      style: { width: nodeWidth },
    }));

    const flowEdges: Edge[] = data.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: edge.type === "blocks",
      label: edge.type,
      labelStyle: { fontSize: 10, fill: "#666" },
      labelBgStyle: { fill: "#fff" },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      style: {
        strokeWidth: edge.type === "blocks" ? 2 : 1,
        stroke: edge.type === "blocks" ? "#3b82f6" : "#94a3b8",
      },
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      flowNodes,
      flowEdges,
      direction
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [data, direction, setNodes, setEdges]);

  const onLayout = useCallback(
    (newDirection: "TB" | "LR") => {
      setDirection(newDirection);
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dependency graph...</p>
        </div>
      </div>
    );
  }

  if (!data || data.nodes.length === 0) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle>No Issues Found</CardTitle>
          <CardDescription>
            {repo ? `No issues found in repository: ${repo}` : "No issues found in any repository"}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dependency Graph</CardTitle>
              <CardDescription>
                {repo ? `Repository: ${repo}` : "All repositories"} - {data.nodes.length} issues, {data.edges.length} dependencies
              </CardDescription>
            </div>
            <Tabs value={direction} onValueChange={(v) => onLayout(v as "TB" | "LR")}>
              <TabsList>
                <TabsTrigger value="TB">Vertical</TabsTrigger>
                <TabsTrigger value="LR">Horizontal</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] border rounded-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-right"
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {data.nodes.filter((n) => n.status === "open").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.nodes.filter((n) => n.status === "in_progress").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.nodes.filter((n) => n.status === "closed").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.edges.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
