"use client";

import { useCallback, useState } from "react";

export function useSegmentSelection(totalSegments: number) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const toggleSegmentSelection = useCallback((segmentId: string) => {
    setSelectedSegments((prev) =>
      prev.includes(segmentId)
        ? prev.filter((id) => id !== segmentId)
        : [...prev, segmentId]
    );
  }, []);

  const selectAllSegments = useCallback(
    (segmentIds: string[]) => {
      if (selectedSegments.length === totalSegments) {
        setSelectedSegments([]);
      } else {
        setSelectedSegments(segmentIds);
      }
    },
    [selectedSegments.length, totalSegments]
  );

  const clearSelection = useCallback(() => {
    setSelectedSegments([]);
  }, []);

  return {
    selectedSegments,
    toggleSegmentSelection,
    selectAllSegments,
    clearSelection,
    hasSelection: selectedSegments.length > 0,
    isAllSelected: selectedSegments.length === totalSegments,
  };
}
