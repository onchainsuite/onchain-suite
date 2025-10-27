"use client";

import { Button } from "@/components/ui/button";

interface ChartPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  legendLabel?: string;
  legendColor?: string;
}

export function ChartPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPreviousPage,
  onNextPage,
  legendLabel,
  legendColor = "var(--chart-1)",
}: ChartPaginationProps) {
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

  return (
    <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center lg:pr-4">
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-sm">
          {startItem} - {endItem} of {totalItems}
        </span>
        {totalPages > 1 && (
          <span className="text-muted-foreground bg-muted/50 rounded px-2 py-1 text-xs">
            Page {currentPage + 1} of {totalPages}
          </span>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousPage}
            disabled={currentPage === 0}
            className="text-muted-foreground hover:text-foreground h-8 px-3 disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage >= totalPages - 1}
            className="text-primary hover:text-primary/80 h-8 px-3 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>

      {legendLabel && (
        <div className="flex items-center gap-2 text-sm">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: legendColor }}
          />
          <span className="text-muted-foreground">{legendLabel}</span>
        </div>
      )}
    </div>
  );
}
