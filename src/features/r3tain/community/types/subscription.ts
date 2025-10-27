export interface SubscriptionStatus {
  id: string;
  name: string;
  description: string;
  value: "subscribed" | "unsubscribed" | "non-subscribed" | "cleaned";
}

export interface SubscriptionSettings {
  selectedStatus: SubscriptionStatus;
}

export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  {
    id: "subscribed",
    name: "Subscribed",
    description: "Consented to receive email marketing.",
    value: "subscribed",
  },
  {
    id: "unsubscribed",
    name: "Unsubscribed",
    description: "Opted out of receiving email marketing.",
    value: "unsubscribed",
  },
  {
    id: "non-subscribed",
    name: "Non-Subscribed",
    description: "Never opted in to receive email marketing.",
    value: "non-subscribed",
  },
  {
    id: "cleaned",
    name: "Cleaned",
    description:
      "Emails hard bounced or repeatedly soft bounced, and are considered invalid.",
    value: "cleaned",
  },
];
