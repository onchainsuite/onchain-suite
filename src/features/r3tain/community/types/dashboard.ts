export interface CommunityStats {
  totalSubscribers: number;
  emailSubscribers: number;
  communityName: string;
}

export interface MessageInbox {
  messageCount: number;
  daysPeriod: number;
}

export interface GrowthData {
  newSubscribers: number;
  dateRange: {
    from: string;
    to: string;
  };
  subscribed: number;
  nonSubscribed: number;
}

export interface TagData {
  id: string;
  name: string;
  count: number;
}

export interface EngagementData {
  often: number;
  sometimes: number;
  rarely: number;
}

export interface LocationData {
  hasData: boolean;
  message?: string;
}
