"use client";

import { Button } from "@/components/ui/button";

interface TagsHeaderProps {
  onCreateTag: () => void;
  onBulkTag: () => void;
}

export function TagsHeader({ onCreateTag, onBulkTag }: TagsHeaderProps) {
  return (
    <div className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold">Tags</h1>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onBulkTag}
            className="hover:bg-muted/80 bg-transparent transition-colors"
          >
            Bulk tag
          </Button>
          <Button
            onClick={onCreateTag}
            className="bg-primary hover:bg-primary/90 transition-colors"
          >
            Create new tag
          </Button>
        </div>
      </div>
    </div>
  );
}
