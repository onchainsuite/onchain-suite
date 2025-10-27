"use client";

import { useMemo } from "react";

import type {
  SavedSegment,
  SortOption,
  SortOrder,
} from "@/r3tain/segment/types";

export function useSegmentSorting(
  segments: SavedSegment[],
  sortBy: SortOption,
  sortOrder: SortOrder = "desc"
) {
  return useMemo(() => {
    const sortedSegments = [...segments];

    switch (sortBy) {
      case "name":
        sortedSegments.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "date-added":
        sortedSegments.sort(
          (a, b) => b.createdDate.getTime() - a.createdDate.getTime()
        );
        break;
      case "size":
        // For now, sort by name as we don't have size data
        sortedSegments.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        return sortedSegments;
    }

    return sortOrder === "asc" ? sortedSegments : sortedSegments.reverse();
  }, [segments, sortBy, sortOrder]);
}
