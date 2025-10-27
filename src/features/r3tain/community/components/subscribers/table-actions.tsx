import { ChevronDown, Download } from "lucide-react";

import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

import { ColumnVisibility } from "./column-visibility";
import type { DataTableProps } from "./types";

interface TableActionsProps<TData> extends DataTableProps<TData> {
  onExportCSV?: () => void;
  onExportPDF?: () => void;
}

export function TableActions<TData>({
  onExportCSV,
  onExportPDF,
  table,
}: TableActionsProps<TData>) {
  return (
    <div className="mb-4 flex items-center justify-end">
      <div className="flex items-center gap-2">
        <ColumnVisibility table={table} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export community
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {onExportCSV && (
              <DropdownMenuItem onClick={onExportCSV}>
                Export as CSV
              </DropdownMenuItem>
            )}
            {onExportPDF && (
              <DropdownMenuItem onClick={onExportPDF}>
                Export as PDF
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
