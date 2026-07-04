"use client";

import {
  ListBulletIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import { cn } from "@/lib/utils";

export type FormsViewMode = "grid" | "list";
export type FormsStatusFilter = "all" | "active" | "paused" | "archived";

const STATUS_OPTIONS: { value: FormsStatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
];

/** Search + status filter + grid/list view toggle, mirroring the Campaigns toolbar. */
export function FormsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  viewMode,
  onViewModeChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: FormsStatusFilter;
  onStatusChange: (v: FormsStatusFilter) => void;
  viewMode: FormsViewMode;
  onViewModeChange: (v: FormsViewMode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search forms…"
          className="pl-9"
          aria-label="Search forms"
        />
      </div>
      <Select
        value={status}
        onValueChange={(v) => onStatusChange(v as FormsStatusFilter)}
      >
        <SelectTrigger className="w-[150px]" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="ml-auto flex items-center rounded-lg border border-border p-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange("grid")}
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
          className={cn(
            "h-8 w-8 p-0",
            viewMode === "grid" && "bg-accent/20 text-foreground"
          )}
        >
          <Squares2X2Icon className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewModeChange("list")}
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          className={cn(
            "h-8 w-8 p-0",
            viewMode === "list" && "bg-accent/20 text-foreground"
          )}
        >
          <ListBulletIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
