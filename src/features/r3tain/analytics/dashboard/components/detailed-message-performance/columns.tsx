"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Mail, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { DetailedMessageData } from "@/r3tain/analytics/utils";

export const columns: ColumnDef<DetailedMessageData>[] = [
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => {
      const channel = row.getValue("channel") as string;
      return (
        <div className="flex items-center justify-center">
          {channel === "email" ? (
            <Mail className="text-muted-foreground h-5 w-5" />
          ) : (
            <Smartphone className="text-muted-foreground h-5 w-5" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Messages",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const { subtitle } = row.original;
      return (
        <div className="space-y-1">
          <div className="text-foreground font-medium">{title}</div>
          <div className="text-muted-foreground text-sm">{subtitle}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">{row.getValue("type")}</div>
      );
    },
  },
  {
    accessorKey: "sentDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-foreground h-auto p-0 font-medium hover:bg-transparent"
        >
          Sent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("sentDate") as Date;
      return (
        <div className="text-muted-foreground">
          {format(date, "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "deliveries",
    header: "Deliveries",
    cell: ({ row }) => {
      const deliveries = row.getValue("deliveries");
      return (
        <div className="text-muted-foreground">
          {deliveries?.toString() ?? "--"}
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
          className="text-foreground h-auto p-0 font-medium hover:bg-transparent"
        >
          Open rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const openRate = row.getValue("openRate") as number;
      return <div className="text-foreground">{openRate}%</div>;
    },
  },
  {
    accessorKey: "clickRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-foreground h-auto p-0 font-medium hover:bg-transparent"
        >
          Click rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const clickRate = row.getValue("clickRate") as number;
      return <div className="text-foreground">{clickRate}%</div>;
    },
  },
];
