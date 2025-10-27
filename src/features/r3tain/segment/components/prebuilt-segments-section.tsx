"use client";

import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SegmentCard } from "./segment-card";
import type { Segment } from "@/r3tain/segment/types";

interface PrebuiltSegmentsSectionProps {
  segments: Segment[];
  onSegmentClick: (segmentId: string) => void;
  onViewAllSegments: () => void;
}

export function PrebuiltSegmentsSection({
  segments,
  onSegmentClick,
  onViewAllSegments,
}: PrebuiltSegmentsSectionProps) {
  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-xl font-semibold">
            Need to reach a different audience?
          </h2>
          <p className="text-muted-foreground">
            Choose one of our pre-built segments.
          </p>
        </div>
        <Button
          variant="outline"
          className="group bg-transparent"
          onClick={onViewAllSegments}
        >
          View all pre-built segments
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {segments.slice(0, 3).map((segment) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            showDetails={segment.id === "new-subscribers"}
            size="lg"
            onClick={() => onSegmentClick(segment.id)}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="border-border bg-muted/30 mt-8 rounded-lg border p-6">
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded">
            <Mail className="text-primary h-4 w-4" />
          </div>
          <span className="text-muted-foreground">
            Build targeted customer segments.
          </span>
          <Button variant="link" className="text-primary h-auto p-0">
            Connect a store
          </Button>
          <span className="text-muted-foreground">and</span>
          <Button variant="link" className="text-primary h-auto p-0">
            send an email
          </Button>
        </div>
      </div>
    </div>
  );
}
