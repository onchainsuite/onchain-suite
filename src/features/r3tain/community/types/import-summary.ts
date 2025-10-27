export interface ImportSummary {
  subscriberCount: number;
  importMethod: string;
  communityName: string;
  emailMarketingStatus: string;
  updateExistingSubscribers: boolean;
  selectedTags: string[];
  planLimit?: {
    current: number;
    limit: number;
    planType: string;
  };
}
