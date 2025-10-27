"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  totalItems: number;
}

export function PaginationControls({
  pageSize,
  onPageSizeChange,
  currentPage,
  totalItems,
}: PaginationControlsProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="mt-6 flex items-center justify-between">
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => onPageSizeChange(Number(value))}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
      <div className="text-muted-foreground text-sm">
        {startItem}-{endItem} of {totalItems}
      </div>
    </div>
  );
}
