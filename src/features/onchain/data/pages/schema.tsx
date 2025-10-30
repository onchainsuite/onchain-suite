"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { entities } from "../data";

export function SchemaPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-balance">Schema Explorer</h1>
        <p className="text-muted-foreground mt-1">
          Interactive visualization of your data schema
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Schema Graph</CardTitle>
              <CardDescription>
                Visual representation of entities and relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <div className="flex items-center justify-center h-full bg-secondary/30 rounded-lg border-2 border-dashed border-border">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Interactive schema graph visualization
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click on entities to explore relationships and field details
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entity Search</CardTitle>
              <CardDescription>Find tables and fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entities</CardTitle>
              <CardDescription>
                {entities.length} tables in schema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {entities.map((entity) => (
                <div
                  key={entity.name}
                  className="p-3 rounded-lg bg-secondary hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-semibold">
                      {entity.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {entity.type}
                    </Badge>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{entity.fields} fields</span>
                    <span>{entity.relations} relations</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
