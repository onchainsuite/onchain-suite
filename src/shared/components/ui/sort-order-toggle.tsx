"use client";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
        <HugeiconsIcon icon={ArrowUp01Icon} className="h-4 w-4" />
      ) : (
        <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4" />
      )}
    </Button>
  );
}
