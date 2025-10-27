"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { CustomSegmentBuilder } from "./custom-segment-builder";
import { SegmentCard } from "./segment-card";
import type { Filter, Segment } from "@/r3tain/segment/types";

export interface SegmentBuilderProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  segments: Segment[];
  onCreateSegment: (segmentId: string) => void;
}

export function SegmentBuilder({
  isOpen,
  onOpenChange,
  segments,
  onCreateSegment,
}: SegmentBuilderProps) {
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  const handleBuildFromScratch = () => {
    setShowCustomBuilder(true);
  };

  const handleCustomBuilderSave = (filters: Filter[]) => {
    // Handle saving custom segment
    console.log("Custom segment filters:", filters);
    // You can process the filters and create a new segment here
  };

  return (
    <>
      <Drawer open={isOpen && !showCustomBuilder} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90">
            Create segment
          </Button>
        </DrawerTrigger>
        <DrawerContent className="mx-auto flex h-[90vh] w-full flex-col px-8 sm:max-w-7xl">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-semibold">
                Segment builder
              </DrawerTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Create segment
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="mt-6 flex min-h-0 flex-1 flex-col">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Who are you looking for?
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBuildFromScratch}
              >
                Build from scratch
              </Button>
            </div>

            {/* Scrollable section */}
            <div className="min-h-0 flex-1 overflow-y-auto py-6">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {segments.map((segment) => (
                  <SegmentCard
                    key={segment.id}
                    segment={segment}
                    showDetails={segment.id === "new-subscribers"}
                    size="sm"
                    onClick={() => onCreateSegment(segment.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Custom Segment Builder */}
      <CustomSegmentBuilder
        isOpen={showCustomBuilder}
        onOpenChange={(open) => {
          setShowCustomBuilder(open);
          if (!open) {
            onOpenChange(false);
          }
        }}
        onSave={handleCustomBuilderSave}
      />
    </>
  );
}
