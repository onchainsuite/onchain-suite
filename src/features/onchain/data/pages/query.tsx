"use client";

import { Search, Sparkles } from "lucide-react";
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
import { Input } from "@/components/ui/input";

import { mockResults } from "../data";

export function QueryPage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-balance">
          Visual Schema Search
        </h1>
        <p className="text-muted-foreground mt-1">
          Natural language search for your data schema
        </p>
      </div>

      <Card className="border-primary/20 bg-linear-to-br from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Search</CardTitle>
          </div>
          <CardDescription>
            Ask questions about your data in plain English
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g., wallets that interacted with Curve in October..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {mockResults.length} matching entities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockResults.map((result) => (
                <div
                  key={v7()}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-mono font-semibold">
                        {result.entity}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.description}
                      </p>
                    </div>
                    <Badge variant="secondary">{result.matches} matches</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {result.relations.map((relation) => (
                      <Badge
                        key={relation}
                        variant="outline"
                        className="text-xs"
                      >
                        → {relation}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Graph Preview</CardTitle>
              <CardDescription>
                Visual representation of search results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg border-2 border-dashed border-border">
                <p className="text-muted-foreground">
                  Interactive graph visualization of related entities
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
