"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface SegmentBuilderHeaderProps {
  onCancel: () => void;
  onSave: () => void;
  hasValidFilters: boolean;
}

export function SegmentBuilderHeader({
  onCancel,
  onSave,
  hasValidFilters,
}: SegmentBuilderHeaderProps) {
  return (
    <>
      <DrawerHeader>
        <div className="flex items-center justify-between">
          <DrawerTitle className="text-2xl font-semibold">
            Segment builder
          </DrawerTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              disabled={!hasValidFilters}
              onClick={onSave}
            >
              Review segment
            </Button>
          </div>
        </div>
      </DrawerHeader>

      <div className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
        <span>Filter contacts for</span>
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary hover:bg-primary/20"
        >
          R3tain
        </Badge>
      </div>
    </>
  );
}
