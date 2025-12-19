import type {
  Campaign,
  EmailTemplate,
  List,
  MergeTag,
  Segment,
  Timezone,
} from "../../campaigns/types";

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

export const MERGE_TAGS: MergeTag[] = [
  { id: "firstName", label: "First Name", tag: "{{ firstName }}" },
  { id: "lastName", label: "Last Name", tag: "{{ lastName }}" },
  { id: "email", label: "Email Address", tag: "{{ email }}" },
  { id: "fullName", label: "Full Name", tag: "{{ fullName }}" },
  { id: "company", label: "Company", tag: "{{ company }}" },
  { id: "phone", label: "Phone Number", tag: "{{ phone }}" },
  { id: "city", label: "City", tag: "{{ city }}" },
  { id: "state", label: "State", tag: "{{ state }}" },
  { id: "country", label: "Country", tag: "{{ country }}" },
  {
    id: "unsubscribeLink",
    label: "Unsubscribe Link",
    tag: "{{ unsubscribeLink }}",
  },
];

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
    id: "drip-campaign" as const,
    title: "Drip campaign",
    description: "Send messages at specific intervals in a specific audience",
  },
  {
    id: "smart-sending" as const,
    title: "Smart sending",
    description: "Send messages at specific intervals in a specific audience",
  },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "Welcome Series - Day 1",
    type: "email-blast",
    status: "sent",
    subject: "Welcome to our community! 🎉",
    audience: ["Newsletter", "New Subscribers"],
    recipients: 1250,
    openRate: 45.2,
    clickRate: 12.8,
    createdAt: new Date("2024-11-10T10:00:00"),
    sentAt: new Date("2024-11-10T14:30:00"),
    scheduledFor: new Date("2024-11-10T14:30:00"),
  },
  {
    id: "2",
    name: "Product Launch Announcement",
    type: "email-blast",
    status: "sent",
    subject: "Introducing our newest feature",
    audience: ["Newsletter"],
    recipients: 3450,
    openRate: 38.5,
    clickRate: 8.2,
    createdAt: new Date("2024-11-08T09:15:00"),
    sentAt: new Date("2024-11-09T10:00:00"),
    scheduledFor: new Date("2024-11-09T10:00:00"),
  },
  {
    id: "3",
    name: "Weekly Newsletter #42",
    type: "email-blast",
    status: "scheduled",
    subject: "Your weekly digest is here",
    audience: ["Newsletter", "Preview List"],
    recipients: 2890,
    createdAt: new Date("2024-11-12T15:20:00"),
    scheduledFor: new Date("2025-01-15T09:00:00"),
  },
  {
    id: "4",
    name: "Re-engagement Campaign",
    type: "drip-campaign",
    status: "sending",
    subject: "We miss you! Here's 20% off",
    audience: ["Preview List"],
    recipients: 850,
    openRate: 22.3,
    clickRate: 5.1,
    createdAt: new Date("2024-11-11T11:45:00"),
    scheduledFor: new Date("2025-01-18T10:00:00"),
  },
  {
    id: "5",
    name: "Flash Sale Alert",
    type: "email-blast",
    status: "draft",
    subject: "24-hour flash sale starts now! ⚡",
    audience: ["Newsletter"],
    recipients: 0,
    createdAt: new Date("2024-11-13T08:30:00"),
    scheduledFor: new Date("2025-01-20T09:00:00"),
  },
  {
    id: "6",
    name: "Customer Feedback Survey",
    type: "email-blast",
    status: "sent",
    subject: "Help us improve - 2 min survey",
    audience: ["Newsletter", "New Subscribers"],
    recipients: 1680,
    openRate: 31.7,
    clickRate: 14.5,
    createdAt: new Date("2024-11-05T14:00:00"),
    sentAt: new Date("2024-11-06T10:00:00"),
    scheduledFor: new Date("2024-11-06T10:00:00"),
  },
  {
    id: "7",
    name: "Abandoned Cart Reminder",
    type: "smart-sending",
    status: "paused",
    subject: "You left something behind...",
    audience: ["Preview List"],
    recipients: 420,
    openRate: 18.5,
    createdAt: new Date("2024-11-07T16:20:00"),
    scheduledFor: new Date("2025-01-22T14:00:00"),
  },
  {
    id: "8",
    name: "Holiday Promotion 2024",
    type: "email-blast",
    status: "failed",
    subject: "Holiday deals you don't want to miss",
    audience: ["Newsletter"],
    recipients: 0,
    createdAt: new Date("2024-11-04T12:00:00"),
    scheduledFor: new Date("2025-01-25T08:00:00"),
  },
];
