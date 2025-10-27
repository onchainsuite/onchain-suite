"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { FilterOperatorButtons } from "./filter-operator-buttons";
import { FilterRow } from "./filter-row";
import { SegmentReview } from "./segment-review";
import { useFilterManagement } from "@/r3tain/segment/hooks";
import { type Filter } from "@/r3tain/segment/types";

interface CustomSegmentBuilderProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (filters: Filter[]) => void;
}

export function CustomSegmentBuilder({
  isOpen,
  onOpenChange,
}: CustomSegmentBuilderProps) {
  const { filters, addFilter, removeFilter, updateFilter, duplicateFilter } =
    useFilterManagement();
  const [showReview, setShowReview] = useState(false);

  const handleReviewSegment = () => {
    setShowReview(true);
  };

  const handleBackToBuilder = () => {
    setShowReview(false);
  };

  const handleCancel = () => {
    setShowReview(false);
    onOpenChange(false);
  };

  const isValidFilter = (filter: Filter) => {
    // Must have an option (field) selected
    if (!filter.option) return false;

    // Must have a filter operator selected
    if (!filter.filterOperator) return false;

    // Must have a value if the operator requires one
    if (
      filter.filterOperator.requiresValue &&
      (!filter.value || filter.value === "")
    ) {
      return false;
    }

    // If operator requires secondary value, check that too
    if (
      filter.filterOperator.requiresSecondaryValue &&
      (!filter.secondaryValue || filter.secondaryValue === "")
    ) {
      return false;
    }

    return true;
  };

  const hasValidFilters = filters.length > 0 && filters.some(isValidFilter);

  return (
    <>
      <Drawer open={isOpen && !showReview} onOpenChange={onOpenChange}>
        <DrawerContent className="mx-auto flex h-[90vh] w-full flex-col px-8 sm:max-w-7xl">
          <DrawerHeader>
            <div className="mb-6 flex items-center justify-between">
              <DrawerTitle className="text-2xl font-semibold">
                Segment builder
              </DrawerTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleReviewSegment}
                  disabled={!hasValidFilters}
                >
                  Review segment
                </Button>
              </div>
            </div>
          </DrawerHeader>

          {/* Make this the main flex column with min-h-0 */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 space-y-4">
              <div className="text-lg font-medium">
                Filter contacts for R3tain
              </div>

              <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <div className="border-muted-foreground/30 relative flex h-4 w-4 items-center justify-center rounded border">
                  <div className="bg-muted-foreground/50 h-0.5 w-2" />
                  <div className="bg-muted-foreground/50 absolute h-2 w-0.5" />
                </div>
                Segment Filters
              </div>
            </div>

            {/* Scrollable filters list */}
            <div className="min-h-0 flex-1 overflow-y-auto py-6">
              <div className="space-y-4">
                {filters.map((filter, index) => (
                  <div key={filter.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FilterRow
                        filter={filter}
                        onUpdate={(updates) => updateFilter(filter.id, updates)}
                        onDuplicate={() => duplicateFilter(filter.id)}
                        onRemove={() => removeFilter(filter.id)}
                        canRemove={filters.length > 1}
                      />
                    </div>

                    {index < filters.length - 1 && (
                      <FilterOperatorButtons
                        filter={filter}
                        onUpdate={(updates) => updateFilter(filter.id, updates)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-2 text-sm"
              onClick={addFilter}
            >
              <Plus className="h-4 w-4" />
              Add filter
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <SegmentReview
        isOpen={showReview}
        onOpenChange={(open) => {
          if (!open) {
            setShowReview(false);
            onOpenChange(false);
          }
        }}
        onBack={handleBackToBuilder}
        filters={filters}
      />
    </>
  );
}
