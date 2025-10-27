"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MappingSummaryProps {
  selectedCount: number;
  totalCount: number;
  showUnmatchedOnly: boolean;
  onToggleFilter: () => void;
}

export function MappingSummary({
  selectedCount,
  totalCount,
  showUnmatchedOnly,
  onToggleFilter,
}: MappingSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-muted/30 border-border flex items-center justify-between rounded-lg border p-4"
    >
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="px-3 py-1">
          {selectedCount}/{totalCount} columns will be imported
        </Badge>
      </div>
      <Button
        variant="link"
        size="sm"
        onClick={onToggleFilter}
        className="text-primary hover:text-primary/80 p-0"
      >
        {showUnmatchedOnly ? "Show all columns" : "Show unmatched columns only"}
      </Button>
    </motion.div>
  );
}
