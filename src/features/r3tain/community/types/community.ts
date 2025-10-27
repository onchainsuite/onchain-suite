export interface Community {
  id: string;
  name: string;
  subscriberCount: number;
  createdAt: string;
  isDefault: boolean;
}

export interface OrganizeSettings {
  selectedCommunityId: string;
  updateExistingSubscribers: boolean;
}
