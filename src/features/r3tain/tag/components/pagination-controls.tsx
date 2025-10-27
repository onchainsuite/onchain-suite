"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  pageSize: string;
  onPageSizeChange: (value: string) => void;
  currentCount: number;
  totalCount: number;
  className?: string;
}

export function PaginationControls({
  pageSize,
  onPageSizeChange,
  currentCount,
  totalCount,
  className,
}: PaginationControlsProps) {
  return (
    <div
      className={`flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <Select value={pageSize} onValueChange={onPageSizeChange}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>

      <span className="text-muted-foreground text-sm">
        1-{currentCount} of {totalCount}
      </span>
    </div>
  );
}
