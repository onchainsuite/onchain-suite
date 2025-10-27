"use client";

import { Button } from "@/components/ui/button";

interface MessagePerformancePaginationProps {
  currentPage: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function MessagePerformancePagination({
  currentPage,
  totalItems,
  onPreviousPage,
  onNextPage,
}: MessagePerformancePaginationProps) {
  // Split data in half - first page gets floor(total/2), second page gets the rest
  const firstPageItems = Math.floor(totalItems / 2);
  const totalPages = totalItems > 0 ? 2 : 1;

  const startIndex = currentPage === 0 ? 0 : firstPageItems;
  const endIndex = currentPage === 0 ? firstPageItems : totalItems;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-sm">
          {startIndex} - {endIndex} of {totalItems}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousPage}
            disabled={currentPage === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage >= totalPages - 1}
            className="text-primary hover:text-primary/80 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: "#8b5cf6" }}
          />
          <span className="text-muted-foreground">Email</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: "#22c55e" }}
          />
          <span className="text-muted-foreground">SMS</span>
        </div>
      </div>
    </div>
  );
}
