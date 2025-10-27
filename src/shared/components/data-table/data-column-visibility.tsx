import type { Table } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";

import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

interface DataColumnVisibilityProps<TData> {
  table: Table<TData>;
}

export const DataColumnVisibility = <TData,>({
  table,
}: DataColumnVisibilityProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Columns3
            className="-ms-1 me-2 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(event) => event.preventDefault()}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
