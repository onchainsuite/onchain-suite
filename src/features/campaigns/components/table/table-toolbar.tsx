"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { CampaignsTableFacetedFilter } from "./campaigns-table-faceted-filter";
import {
  CAMPAIGN_STATUS_FILTERS,
  CAMPAIGN_TYPE_FILTERS,
} from "../../../campaigns/constants";
import type { Campaign } from "../../../campaigns/types";

interface TableToolbarProps {
  table: Table<Campaign>;
}

export function TableToolbar({ table }: TableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-9 h-10 rounded-xl border-border bg-background transition-all duration-300 focus-visible:ring-2"
          />
        </div>
        {table.getColumn("status") && (
          <CampaignsTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={CAMPAIGN_STATUS_FILTERS}
          />
        )}
        {table.getColumn("type") && (
          <CampaignsTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={CAMPAIGN_TYPE_FILTERS}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-3 rounded-xl"
          >
            Clear
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 rounded-xl border-border bg-transparent"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
