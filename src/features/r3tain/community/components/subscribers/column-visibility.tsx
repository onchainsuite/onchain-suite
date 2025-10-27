import { Settings2 } from "lucide-react";

import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

import { type DataTableProps } from "./types";

export function ColumnVisibility<TData>({ table }: DataTableProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent transition-all hover:scale-105 hover:shadow-md"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Columns</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="animate-in slide-in-from-top-2 w-80"
        align="end"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Columns</h4>
            <p className="text-muted-foreground text-sm">
              Customize how columns appear or go to community fields to add new
              community fields.
            </p>
          </div>
          <div className="max-h-[300px] space-y-2 overflow-y-auto">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <div
                    key={column.id}
                    className="hover:bg-muted/50 flex items-center space-x-2 rounded p-1 transition-colors"
                  >
                    <Checkbox
                      id={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      className="transition-all"
                    />
                    <label
                      htmlFor={column.id}
                      className="cursor-pointer text-sm leading-none font-medium capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {column.id.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
