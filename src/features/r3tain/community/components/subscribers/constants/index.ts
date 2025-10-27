import { dashboardRoutes } from "@/config/routes";

import { type FilterConfig, type Filters } from "../types";

export const FILTER_CONFIGS: FilterConfig[] = [
  {
    key: "segments",
    label: "Segments",
    minWidth: "min-w-[140px]",
    options: [
      { value: "all-subscribers", label: "All Subscribers" },
      { value: "active-subscribers", label: "Active Subscribers" },
      { value: "new-subscribers", label: "New Subscribers" },
    ],
    manageOption: "Manage segments",
    manageOptionUrl: dashboardRoutes.segments,
  },
  {
    key: "subscriptionStatus",
    label: "Subscription status",
    minWidth: "min-w-[160px]",
    options: [
      { value: "subscribed", label: "Email subscribed" },
      { value: "unsubscribed", label: "Email unsubscribed" },
      { value: "non-subscribed", label: "Email non-subscribed" },
      { value: "cleaned", label: "Email cleaned" },
    ],
  },
  {
    key: "tags",
    label: "Tags",
    minWidth: "min-w-[100px]",
    options: [
      { value: "newTag", label: "newTag" },
      { value: "Customer", label: "Customer" },
      { value: "Influencer", label: "Influencer" },
    ],
    hasSearch: true,
    manageOption: "Manage tags",
    manageOptionUrl: dashboardRoutes.tags,
  },
  {
    key: "signupSource",
    label: "Signup source",
    minWidth: "min-w-[140px]",
    options: [
      { value: "Admin Add", label: "Admin Add" },
      {
        value: "List Import from File Upload",
        label: "List Import from File Upload",
      },
      { value: "Website Form", label: "Website Form" },
    ],
    hasSearch: true,
  },
];

// Filter label mapping for badges
export const FILTER_BADGE_LABELS: Record<Filters, string> = {
  segments: "Segment",
  subscriptionStatus: "Status",
  tags: "Tag",
  signupSource: "Source",
  advancedFilters: "Advanced",
};
