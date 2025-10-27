export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  birthday?: string;
  company?: string;
  tags: string[];
  emailMarketing: "subscribed" | "unsubscribed" | "non-subscribed" | "cleaned";
  source: string;
  rating: number;
  contactDateAdded: string;
  lastChanged: string;
  segment: string;
  signupSource: string;
}

export interface SubscriberFilters {
  segments: string[];
  subscriptionStatus: string[];
  tags: string[];
  signupSource: string[];
  search: string;
  advancedFilters: Record<string, unknown>;
}

export interface ColumnVisibility {
  email: boolean;
  firstName: boolean;
  lastName: boolean;
  address: boolean;
  phoneNumber: boolean;
  birthday: boolean;
  company: boolean;
  tags: boolean;
  emailMarketing: boolean;
  source: boolean;
  rating: boolean;
  contactDateAdded: boolean;
  lastChanged: boolean;
}

export interface ColumnOrder {
  id: string;
  label: string;
  visible: boolean;
}
