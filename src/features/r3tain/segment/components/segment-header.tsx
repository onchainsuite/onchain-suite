"use client";

import { SegmentBuilder, type SegmentBuilderProps } from "./segment-builder";

export function SegmentHeader({
  isOpen,
  onOpenChange,
  segments,
  onCreateSegment,
}: SegmentBuilderProps) {
  return (
    <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Segments</h1>
        <SegmentBuilder
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          segments={segments}
          onCreateSegment={onCreateSegment}
        />
      </div>
    </div>
  );
}
