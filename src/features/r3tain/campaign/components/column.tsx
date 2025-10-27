"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Mail, MoreHorizontal, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

import { type Campaign } from "../types";

export const columns: ColumnDef<Campaign>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Details",
    cell: ({ row }) => {
      const campaign = row.original;
      return (
        <div className="flex items-start gap-3">
          <div className="bg-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-card-foreground font-medium">
              {campaign.name}
            </h3>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <Badge
                variant="outline"
                className={`px-2 py-0.5 text-xs font-medium ${
                  campaign.status === "Active"
                    ? "bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20 hover:text-[#10b981]"
                    : campaign.status === "Sent"
                      ? "bg-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6]/20 hover:text-[#3b82f6]"
                      : campaign.status === "Draft"
                        ? "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                        : "bg-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/20 hover:text-[#f59e0b]"
                }`}
              >
                {campaign.status}
              </Badge>
              <span>{campaign.type}</span>
              <span>•</span>
              <span>
                Last edited{" "}
                {formatDistanceToNow(campaign.lastEdited, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      );
    },
    size: 280,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "audience",
    header: "Audience",
    cell: ({ row }) => {
      const audience = row.getValue("audience") as string;
      return (
        <div className="flex items-center gap-2">
          <Users className="text-muted-foreground h-4 w-4" />
          <span className="text-card-foreground text-sm">{audience}</span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "analytics",
    header: "Analytics",
    cell: ({ row }) => {
      const campaign = row.original;
      return (
        <div>
          {campaign.openRate !== null ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Open rate</span>
                <span className="text-card-foreground font-medium">
                  {campaign.openRate}%
                </span>
              </div>
              <Progress
                value={campaign.openRate}
                className="bg-muted h-1.5 w-full"
                indicatorClassName="bg-primary"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Click rate</span>
                <span className="text-card-foreground font-medium">
                  {campaign.clickRate}%
                </span>
              </div>
              <Progress
                value={campaign.clickRate}
                className="bg-muted h-1.5 w-full"
                indicatorClassName="bg-[#0ea5e9]"
              />
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">
              No data available
            </span>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const campaign = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 cursor-pointer p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log(campaign)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 60,
  },
];
