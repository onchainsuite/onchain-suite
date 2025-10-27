"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Star } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Subscriber } from "@/r3tain/community/types";

export const columns: ColumnDef<Subscriber>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Email Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("firstName") ?? "-"}</div>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("lastName") ?? "-"}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return (
        <div className="max-w-[200px]">
          {address ? (
            <div className="text-sm">
              {address.split("\n").map((line) => (
                <div key={v7()}>{line}</div>
              ))}
            </div>
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => <div>{row.getValue("phoneNumber") ?? "-"}</div>,
  },
  {
    accessorKey: "birthday",
    header: "Birthday",
    cell: ({ row }) => <div>{row.getValue("birthday") ?? "-"}</div>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <div>{row.getValue("company") ?? "-"}</div>,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "emailMarketing",
    header: "Email Marketing",
    cell: ({ row }) => {
      const status = row.getValue("emailMarketing") as string;
      const statusColors = {
        subscribed: "bg-green-100 text-green-800",
        unsubscribed: "bg-red-100 text-red-800",
        "non-subscribed": "bg-gray-100 text-gray-800",
        cleaned: "bg-yellow-100 text-yellow-800",
      };

      return (
        <Badge
          className={`${statusColors[status as keyof typeof statusColors]} capitalize`}
          variant="secondary"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => <div>{row.getValue("source")}</div>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={v7()}
              className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "contactDateAdded",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Subscriber Date Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("contactDateAdded"));
      return (
        <div>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      );
    },
  },
  {
    accessorKey: "lastChanged",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Last Changed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastChanged"));
      return (
        <div>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const subscriber = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(subscriber.email)}
            >
              Copy email address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View subscriber</DropdownMenuItem>
            <DropdownMenuItem>Edit subscriber</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete subscriber
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
