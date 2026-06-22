import type { List, Segment } from "../types";

export const partitionAudienceSelection = (
  selectedIds: string[],
  segments: Segment[]
) => {
  const knownSegmentIds = new Set(segments.map((segment) => segment.id));

  return selectedIds.reduce(
    (result, id) => {
      if (knownSegmentIds.has(id)) {
        result.segmentIds.push(id);
      } else {
        result.listIds.push(id);
      }
      return result;
    },
    { listIds: [] as string[], segmentIds: [] as string[] }
  );
};

export const getEstimatedRecipientsFromSelection = (
  selectedIds: string[],
  lists: List[],
  segments: Segment[]
) => {
  const listCounts = new Map(lists.map((list) => [list.id, list.count]));
  const segmentCounts = new Map(
    segments.map((segment) => [segment.id, segment.count])
  );

  return selectedIds.reduce(
    (total, id) => total + (listCounts.get(id) ?? segmentCounts.get(id) ?? 0),
    0
  );
};
