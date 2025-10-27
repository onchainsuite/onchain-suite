"use client";

import {
  Filter,
  LayoutTemplateIcon as Template,
  Plus,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import type {
  DateRangeType,
  FlowFilters,
} from "@/r3tain/automation/flows/types";

interface FlowsHeaderProps {
  filters: FlowFilters;
  onFiltersChange: (filters: FlowFilters) => void;
  totalFlows: number;
}

export function FlowsHeader({
  filters,
  onFiltersChange,
  totalFlows,
}: FlowsHeaderProps) {
  const { push } = useRouter();

  return (
    <div className="border-border bg-card/50 top-0 z-10 space-y-6 border-b py-2 backdrop-blur-sm sm:sticky">
      {/* Page Header */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">All Flows</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your automation flows and track their performance
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="group"
              onClick={() => push(PRIVATE_ROUTES.R3TAIN.TEMPLATES)}
            >
              <Template className="mr-2 h-4 w-4" />
              Choose flow template
            </Button>

            <Button className="group">
              <Plus className="mr-2 h-4 w-4" />
              Build from scratch
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search flows..."
                value={filters.search}
                onChange={(e) =>
                  onFiltersChange({ ...filters, search: e.target.value })
                }
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status.length === 1 ? filters.status[0] : "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  status: value === "all" ? [] : [value],
                })
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select
              value={filters.dateRange}
              onValueChange={(value: DateRangeType) =>
                onFiltersChange({ ...filters, dateRange: value })
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-muted-foreground text-sm">
            {totalFlows} flow{totalFlows !== 1 ? "s" : ""} total
          </div>
        </div>
      </div>
    </div>
  );
}
