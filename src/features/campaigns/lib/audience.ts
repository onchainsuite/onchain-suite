import type { List, Segment } from "../types";

export const partitionAudienceSelection = (
  selectedIds: string[],
  segments: Segment[],
  // The campaign wizard's "lists" are individual contact profiles — the
  // backend must receive their ids as `profileIds`, not `listIds`, or the
  // campaign ends up with an empty audience.
  profiles: List[] = []
) => {
  const knownSegmentIds = new Set(segments.map((segment) => segment.id));
  const knownProfileIds = new Set(profiles.map((profile) => profile.id));

  return selectedIds.reduce(
    (result, id) => {
      if (knownSegmentIds.has(id)) {
        result.segmentIds.push(id);
      } else if (knownProfileIds.has(id)) {
        result.profileIds.push(id);
      } else {
        result.listIds.push(id);
      }
      return result;
    },
    {
      listIds: [] as string[],
      segmentIds: [] as string[],
      profileIds: [] as string[],
    }
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
