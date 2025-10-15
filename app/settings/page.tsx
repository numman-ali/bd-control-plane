"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, Key, Plus, Trash2, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [tokens, setTokens] = useState([
    { id: "1", name: "Main Token", scopes: "repo, read:user", lastUsed: "2 hours ago" },
  ]);
  const [newTokenName, setNewTokenName] = useState("");
  const [newToken, setNewToken] = useState("");

  const handleAddToken = () => {
    if (!newTokenName || !newToken) {
      toast.error("Please provide both name and token");
      return;
    }

    setTokens([
      ...tokens,
      {
        id: Date.now().toString(),
        name: newTokenName,
        scopes: "repo, read:user",
        lastUsed: "Never",
      },
    ]);

    toast.success("Personal Access Token added successfully!");
    setNewTokenName("");
    setNewToken("");
  };

  const handleDeleteToken = (id: string) => {
    setTokens(tokens.filter((t) => t.id !== id));
    toast.success("Token deleted");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and GitHub integration
        </p>
      </div>

      {/* GitHub Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Connection
          </CardTitle>
          <CardDescription>
            Your GitHub OAuth connection is active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Connected via OAuth</p>
              <p className="text-sm text-muted-foreground">
                Scopes: repo, read:user, user:email
              </p>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Personal Access Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Personal Access Tokens
          </CardTitle>
          <CardDescription>
            Add GitHub Personal Access Tokens for additional repositories or enhanced permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Tokens */}
          <div className="space-y-3">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex-1">
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Scopes: {token.scopes} • Last used: {token.lastUsed}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteToken(token.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          {/* Add New Token */}
          <div className="space-y-4">
            <h3 className="font-medium">Add New Token</h3>

            <div className="space-y-2">
              <Label htmlFor="token-name">Token Name</Label>
              <Input
                id="token-name"
                placeholder="e.g., Work Projects"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">GitHub Personal Access Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Create a token at{" "}
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  github.com/settings/tokens/new
                </a>{" "}
                with <code className="bg-muted px-1 rounded">repo</code> scope
              </p>
            </div>

            <Button onClick={handleAddToken} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Token
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions - proceed with caution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => toast.error("Not implemented yet")}>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
