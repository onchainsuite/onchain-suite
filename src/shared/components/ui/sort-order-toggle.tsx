"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

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
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      )}
    </Button>
  );
}
