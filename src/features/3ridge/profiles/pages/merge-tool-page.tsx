"use client";

import {
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DuplicateProfileCard,
  MergeHistoryList,
} from "@/3ridge/profiles/components";
import { duplicateSuggestions } from "@/3ridge/profiles/data";

export function MergeToolPage() {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Profile Merge Tool
          </h1>
          <p className="text-pretty text-muted-foreground">
            Identify and merge duplicate user profiles across authentication
            methods
          </p>
        </div>
        <Button className="gap-2 sm:shrink-0">
          <GitMerge className="h-4 w-4" />
          Manual Merge
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Duplicate Suggestions
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Potential duplicates detected
            </p>
          </CardContent>
        </Card>

        <Card className="border-teal-500/20 bg-linear-to-br from-teal-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Merged This Month
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-violet-500/20 bg-linear-to-br from-violet-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profiles Cleaned
            </CardTitle>
            <Users className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              Total profiles merged
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suggestions" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="suggestions" className="whitespace-nowrap">
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="manual" className="whitespace-nowrap">
            Manual Search
          </TabsTrigger>
          <TabsTrigger value="history" className="whitespace-nowrap">
            Merge History
          </TabsTrigger>
          <TabsTrigger value="rules" className="whitespace-nowrap">
            Merge Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <CardTitle>Duplicate Suggestions</CardTitle>
                  <CardDescription>
                    AI-detected potential duplicate profiles
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Dismiss All
                  </Button>
                  <Button size="sm" className="gap-2">
                    <GitMerge className="h-4 w-4" />
                    Merge Selected
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {duplicateSuggestions.map((suggestion) => (
                <DuplicateProfileCard
                  key={suggestion.id}
                  {...suggestion}
                  isSelected={selectedProfiles.includes(
                    suggestion.id.toString()
                  )}
                  onSelect={(checked) => {
                    if (checked) {
                      setSelectedProfiles([
                        ...selectedProfiles,
                        suggestion.id.toString(),
                      ]);
                    } else {
                      setSelectedProfiles(
                        selectedProfiles.filter(
                          (id) => id !== suggestion.id.toString()
                        )
                      );
                    }
                  }}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Profile Search</CardTitle>
              <CardDescription>
                Search and manually select profiles to merge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by wallet address, email, or user ID..."
                    className="pl-8"
                  />
                </div>
                <Button className="sm:shrink-0">Search</Button>
              </div>

              <div className="space-y-3">
                <Label>Selected Profiles for Merge</Label>
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Search and select profiles to merge them together
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Profile</Label>
                <Input
                  placeholder="Select which profile should be the primary"
                  disabled
                />
              </div>

              <Button className="w-full gap-2" disabled>
                <GitMerge className="h-4 w-4" />
                Merge Selected Profiles
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <MergeHistoryList />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Merge Rules Configuration</CardTitle>
              <CardDescription>
                Configure automatic duplicate detection rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Domain Matching</Label>
                    <p className="text-sm text-muted-foreground">
                      Suggest merges for same email domain
                    </p>
                  </div>
                  <Checkbox defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Wallet Address Similarity</Label>
                    <p className="text-sm text-muted-foreground">
                      Detect similar wallet addresses
                    </p>
                  </div>
                  <Checkbox defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>OAuth Provider Matching</Label>
                    <p className="text-sm text-muted-foreground">
                      Match profiles with same OAuth accounts
                    </p>
                  </div>
                  <Checkbox defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Behavioral Pattern Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Use AI to detect similar usage patterns
                    </p>
                  </div>
                  <Checkbox defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Merge (High Confidence)</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-merge profiles with 95%+ confidence
                    </p>
                  </div>
                  <Checkbox />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Minimum Confidence Threshold (%)</Label>
                <Input type="number" defaultValue="80" min="0" max="100" />
              </div>

              <div className="space-y-2">
                <Label>Review Period Before Auto-Merge (days)</Label>
                <Input type="number" defaultValue="7" />
              </div>

              <Button className="w-full">Save Merge Rules</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
