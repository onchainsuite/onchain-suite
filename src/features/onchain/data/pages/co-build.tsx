"use client";

import { MessageSquare, Play, Users } from "lucide-react";
import { useState } from "react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { buildMockResults, comments } from "../data";

export function CoBuildPage() {
  const [query, setQuery] = useState(
    "SELECT wallet_address, COUNT(*) as transactions, SUM(value) as volume\nFROM transactions\nWHERE chain = 'ethereum'\nGROUP BY wallet_address\nORDER BY volume DESC\nLIMIT 10;"
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-balance">
            Co-Build Query Editor
          </h1>
          <p className="text-muted-foreground mt-1">
            Collaborate in real-time on data queries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />3 Active
          </Badge>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Users className="h-4 w-4" />
            Invite
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Query Editor</CardTitle>
                  <CardDescription>
                    Write and execute SQL queries
                  </CardDescription>
                </div>
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Run Query
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="font-mono text-sm min-h-[200px] bg-secondary"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Query execution results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet Address</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buildMockResults.map((row) => (
                    <TableRow key={v7()}>
                      <TableCell className="font-mono text-sm">
                        {row.wallet}
                      </TableCell>
                      <TableCell>{row.transactions}</TableCell>
                      <TableCell className="font-semibold">
                        {row.volume}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.lastActive}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
              </CardTitle>
              <CardDescription>Team collaboration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {comments.map((comment) => (
                <div key={v7()} className="p-3 rounded-lg bg-secondary">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">
                      {comment.user}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {comment.time}
                    </span>
                  </div>
                  <p className="text-sm">{comment.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Collaborators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-semibold">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium">Alice</p>
                  <p className="text-xs text-muted-foreground">
                    Editing line 3
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-chart-2 flex items-center justify-center text-sm font-semibold">
                  B
                </div>
                <div>
                  <p className="text-sm font-medium">Bob</p>
                  <p className="text-xs text-muted-foreground">
                    Viewing results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
