import {
  type CommunityStats,
  type EngagementData,
  type GrowthData,
  type LocationData,
  type MessageInbox,
  type TagData,
} from "@/r3tain/community/types";

export const mockCommunityStats: CommunityStats = {
  totalSubscribers: 3,
  emailSubscribers: 3,
  communityName: "R3tain",
};

export const mockMessageInbox: MessageInbox = {
  messageCount: 0,
  daysPeriod: 30,
};

export const mockGrowthData: GrowthData = {
  newSubscribers: 0,
  dateRange: {
    from: "2025-06-24",
    to: "2025-07-24",
  },
  subscribed: 0,
  nonSubscribed: 0,
};

export const mockTags: TagData[] = [
  { id: "1", name: "newTag", count: 2 },
  { id: "2", name: "Customer", count: 2 },
  { id: "3", name: "Influencer", count: 2 },
];

export const mockEngagementData: EngagementData = {
  often: 0,
  sometimes: 0,
  rarely: 33,
};

export const mockLocationData: LocationData = {
  hasData: false,
  message: "No location data to show just yet",
};
