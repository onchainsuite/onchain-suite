"use client";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";

interface SortOrderToggleProps {
  order: "asc" | "desc";
  onOrderChange: (order: "asc" | "desc") => void;
  className?: string;
}

export function SortOrderToggle({
  order,
  onOrderChange,
  className,
}: SortOrderToggleProps) {
  const handleToggle = () => {
    onOrderChange(order === "asc" ? "desc" : "asc");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={`hover:bg-muted/50 h-8 px-2 transition-colors ${className}`}
      title={`Sort ${order === "asc" ? "ascending" : "descending"}`}
    >
      {order === "asc" ? (
        <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
}
