import type {
  EmailTemplate,
  List,
  MergeTag,
  Segment,
  Timezone,
} from "../../campaigns/types";
import { ALL_VARIABLES } from "@/features/templates/onchain-variables";

export const CAMPAIGN_LISTS: List[] = [
  { id: "newsletter", name: "Newsletter", count: 1, starred: true },
  { id: "preview-list", name: "Preview List", count: 1, starred: true },
];

export const CAMPAIGN_SEGMENTS: Segment[] = [
  { id: "new-subscribers", name: "New Subscribers", count: 0, starred: true },
];

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "newsletter-8",
    title: "Newsletter #8 (Snack w/ Recommendations)",
    date: "July 11, 2022 at 4:35 PM",
    preview: "/email-newsletter-with-snack-recommendations.jpg",
  },
  {
    id: "newsletter-7",
    title: "Newsletter #7 (Snack)",
    date: "July 11, 2022 at 4:35 PM",
    preview: "/email-newsletter-snack-announcement.jpg",
  },
  {
    id: "newsletter-6",
    title: "Newsletter #6 (Product Launch)",
    date: "July 10, 2022 at 2:15 PM",
    preview: "/product-launch-email-template.png",
  },
  {
    id: "newsletter-5",
    title: "Newsletter #5 (Weekly Update)",
    date: "July 8, 2022 at 3:20 PM",
    preview: "/weekly-newsletter-email.jpg",
  },
];

// Onchain-native merge tags (name, ens_name, wallet, …) replace the previous
// generic Web2 set. Sourced from the shared variable registry so the email
// templates, subject line, and automation Send-email all stay in sync.
export const MERGE_TAGS: MergeTag[] = ALL_VARIABLES.map((v) => ({
  id: v.id,
  label: v.label,
  tag: v.tag,
}));

export const TIMEZONES: Timezone[] = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)" },
];

export const CAMPAIGN_TYPE_OPTIONS = [
  {
    id: "email-blast" as const,
    title: "Email Blast",
    description: "Send one-off campaigns or manage a batch of emails",
  },
  {
    id: "smart-sending" as const,
    title: "Smart sending",
    description: "Reach users where they are with in-app push notifications",
  },
];
