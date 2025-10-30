import {
  type ApiKey,
  type Integration,
  type NetworkOption,
  type NotificationSetting,
  type Permission,
} from "../types";

// Mock data
export const apiKeys: ApiKey[] = [
  {
    id: "1",
    key: "sk_live_1234567890abcdef",
    createdDate: "Jan 15, 2025",
    status: "Active",
  },
  {
    id: "2",
    key: "sk_test_abcdef1234567890",
    createdDate: "Jan 1, 2025",
    status: "Active",
  },
];

export const integrations: Integration[] = [
  {
    id: "supabase",
    label: "Supabase API Key",
    placeholder: "••••••••••••••••",
    status: "Connected",
  },
  {
    id: "openai",
    label: "OpenAI API Key",
    placeholder: "sk-...",
    status: "Connected",
  },
  {
    id: "r3tain",
    label: "R3tain Integration Key",
    placeholder: "••••••••••••••••",
    status: "Not Connected",
  },
];

export const permissions: Permission[] = [
  {
    id: "full-access",
    title: "Full Data Access",
    description: "Access all data and analytics",
    defaultChecked: true,
    disabled: (role) => role !== "admin",
  },
  {
    id: "segment-mgmt",
    title: "Segment Management",
    description: "Create and edit segments",
    defaultChecked: true,
    disabled: (role) => role === "standard",
  },
  {
    id: "api-access",
    title: "API Access",
    description: "Generate and use API keys",
    defaultChecked: true,
  },
  {
    id: "export-data",
    title: "Export Data",
    description: "Download reports and data",
    defaultChecked: true,
  },
];

export const notificationSettings: NotificationSetting[] = [
  {
    id: "email-notif",
    title: "Email Notifications",
    description: "Receive alerts via email",
    defaultChecked: true,
  },
  {
    id: "critical-only",
    title: "Critical Alerts Only",
    description: "Only notify for high-priority alerts",
    defaultChecked: false,
  },
  {
    id: "weekly-reports",
    title: "Weekly Reports",
    description: "Receive weekly summary emails",
    defaultChecked: true,
  },
  {
    id: "segment-updates",
    title: "Segment Updates",
    description: "Notify when segments change",
    defaultChecked: true,
  },
];

export const networkOptions: NetworkOption[] = [
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "kaia", label: "Kaia" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "avalanche", label: "Avalanche" },
];
