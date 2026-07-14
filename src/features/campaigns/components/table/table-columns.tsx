"use client";

import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";

import type { Campaign } from "../../../campaigns/types";
import { formatDate } from "../../../campaigns/utils";
import { CampaignActionsCell } from "./campaign-actions-cell";
import { CampaignNameCell } from "./campaign-name-cell";
import { CampaignRateCell } from "./campaign-rate-cell";
import { CampaignStatusCell } from "./campaign-status-cell";
import { CampaignTypeCell } from "./campaign-type-cell";

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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 h-8 data-[state=open]:bg-accent"
        >
          Campaign Name
          <ArrowsUpDownIcon aria-hidden="true" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <CampaignNameCell campaign={row.original} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <CampaignStatusCell status={row.original.status} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <CampaignTypeCell type={row.original.type} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "recipients",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 h-8 data-[state=open]:bg-accent"
        >
          Recipients
          <ArrowsUpDownIcon aria-hidden="true" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const recipients = row.getValue("recipients") as number | undefined;
      return (
        <div className="text-sm text-foreground">
          {typeof recipients === "number" ? recipients.toLocaleString() : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "openRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 h-8 data-[state=open]:bg-accent"
        >
          Open Rate
          <ArrowsUpDownIcon aria-hidden="true" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <CampaignRateCell campaign={row.original} metric="openRate" />
    ),
  },
  {
    accessorKey: "clickRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 h-8 data-[state=open]:bg-accent"
        >
          Click Rate
          <ArrowsUpDownIcon aria-hidden="true" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <CampaignRateCell campaign={row.original} metric="clickRate" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 h-8 data-[state=open]:bg-accent"
        >
          Created
          <ArrowsUpDownIcon aria-hidden="true" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CampaignActionsCell campaign={row.original} />,
  },
];
