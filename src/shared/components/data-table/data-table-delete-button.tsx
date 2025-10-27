import type { Table } from "@tanstack/react-table";
import { CircleAlert, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";
import { Button } from "@/ui/button";

interface DataTableDeleteButtonProps<TData> {
  table: Table<TData>;
  handleDeleteRows?: () => void;
}

export const DataTableDeleteButton = <TData,>({
  table,
  handleDeleteRows,
}: DataTableDeleteButtonProps<TData>) => {
  return (
    table.getSelectedRowModel().rows.length > 0 && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="ml-auto" variant="destructive">
            <Trash2
              className="-ms-1 me-2 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Delete
            <span className="border-border bg-background text-muted-foreground/70 ms-3 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              {table.getSelectedRowModel().rows.length}
            </span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            <div
              className="border-border flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                {table.getSelectedRowModel().rows.length} selected{" "}
                {table.getSelectedRowModel().rows.length === 1 ? "row" : "rows"}
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRows}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};
