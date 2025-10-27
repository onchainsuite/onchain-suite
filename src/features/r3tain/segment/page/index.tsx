"use client";

import { useState } from "react";

import {
  PrebuiltSegmentsSection,
  SavedSegmentsList,
  SegmentHeader,
} from "@/r3tain/segment/components";
import { prebuiltSegments, savedSegments } from "@/r3tain/segment/data";
import { useSegmentSelection, useSegmentSorting } from "@/r3tain/segment/hooks";
import { type SortOption, type SortOrder } from "@/r3tain/segment/types";

export function SegmentManager() {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date-added");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [pageSize, setPageSize] = useState(25);

  const sortedSegments = useSegmentSorting(savedSegments, sortBy, sortOrder);
  const {
    selectedSegments,
    toggleSegmentSelection,
    selectAllSegments,
    clearSelection,
    hasSelection,
    isAllSelected,
  } = useSegmentSelection(savedSegments.length);

  const handleSelectAll = () => {
    selectAllSegments(savedSegments.map((s) => s.id));
  };

  const handleDelete = () => {
    console.log("Delete selected segments:", selectedSegments);
    clearSelection();
  };

  const handleCreateSegment = (segmentId: string) => {
    console.log("Create segment from template:", segmentId);
    setIsBuilderOpen(false);
  };

  const handleSegmentClick = (segmentId: string) => {
    console.log("Clicked segment:", segmentId);
  };

  const handleViewAllSegments = () => {
    setIsBuilderOpen(true);
  };

  return (
    <div className="bg-background min-h-screen">
      <SegmentHeader
        isOpen={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        segments={prebuiltSegments}
        onCreateSegment={handleCreateSegment}
      />

      <div className="container">
        {/* Page Header */}

        {/* Main Content */}
      </div>
      <div className="mx-auto space-y-6 px-4 py-6 md:px-6">
        <SavedSegmentsList
          segments={sortedSegments}
          selectedSegments={selectedSegments}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onToggleSelection={toggleSegmentSelection}
          onSelectAll={handleSelectAll}
          isAllSelected={isAllSelected}
          hasSelection={hasSelection}
          onDelete={handleDelete}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />

        <PrebuiltSegmentsSection
          segments={prebuiltSegments}
          onSegmentClick={handleSegmentClick}
          onViewAllSegments={handleViewAllSegments}
        />
      </div>
    </div>
  );
}
