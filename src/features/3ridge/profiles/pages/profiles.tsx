"use client";

import { Download, Filter, Save, Search, Upload } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UserTableRow } from "@/3ridge/profiles/components";
import { mockUsers } from "@/3ridge/profiles/data";

export function ProfilesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profiles</h1>
          <p className="text-muted-foreground">
            Segment and analyze your Web3 users
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 min-w-0">
              <Badge
                variant="secondary"
                className="gap-1 px-3 py-1 text-xs sm:text-sm"
              >
                <span className="truncate">
                  Events: connect ≥ 1 last 7 days
                </span>
                <button className="ml-1 hover:text-foreground shrink-0">
                  ×
                </button>
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1 px-3 py-1 text-xs sm:text-sm"
              >
                <span className="truncate">Net Worth {">"} $10,000</span>
                <button className="ml-1 hover:text-foreground shrink-0">
                  ×
                </button>
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1 px-3 py-1 text-xs sm:text-sm"
              >
                <span className="truncate">Device: Desktop</span>
                <button className="ml-1 hover:text-foreground shrink-0">
                  ×
                </button>
              </Badge>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3 min-w-0">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter address or ENS"
                  className="pl-9 bg-background w-full"
                />
              </div>
              <div className="flex flex-wrap gap-2 min-w-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none bg-transparent"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none bg-transparent"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none bg-transparent"
                >
                  Segment
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Segment
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Address</TableHead>
                  <TableHead>Labels</TableHead>
                  <TableHead>Net Worth</TableHead>
                  <TableHead>Socials</TableHead>
                  <TableHead>Apps</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Chains</TableHead>
                  <TableHead>First Seen</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <UserTableRow key={v7()} {...user} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
