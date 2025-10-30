import { type Policy } from "../types";

export const policies = [
  {
    id: 1,
    name: "Rate Limiting",
    description: "Limit authentication attempts per IP",
    type: "security",
    status: "active",
    rules: "Max 10 attempts per 5 minutes",
  },
  {
    id: 2,
    name: "IP Allowlist",
    description: "Only allow specific IP ranges",
    type: "access",
    status: "active",
    rules: "192.168.0.0/16, 10.0.0.0/8",
  },
  {
    id: 3,
    name: "Geo-Blocking",
    description: "Block requests from specific countries",
    type: "security",
    status: "inactive",
    rules: "Block: CN, RU, KP",
  },
  {
    id: 4,
    name: "Device Fingerprinting",
    description: "Track and verify device signatures",
    type: "security",
    status: "active",
    rules: "Require device verification",
  },
];

export const webhooks = [
  {
    id: 1,
    name: "User Authentication Webhook",
    url: "https://api.example.com/webhooks/auth",
    events: ["auth.login", "auth.logout"],
    status: "active",
    lastTriggered: "2 min ago",
    successRate: 98.5,
  },
  {
    id: 2,
    name: "Profile Updates",
    url: "https://hooks.slack.com/services/T00/B00/XXX",
    events: ["profile.updated", "profile.created"],
    status: "active",
    lastTriggered: "15 min ago",
    successRate: 100,
  },
  {
    id: 3,
    name: "Failed Login Alerts",
    url: "https://api.company.io/security/alerts",
    events: ["auth.failed"],
    status: "inactive",
    lastTriggered: "2 days ago",
    successRate: 95.2,
  },
];

export const recentDeliveries = [
  {
    id: "del_1",
    webhook: "User Authentication Webhook",
    event: "auth.login",
    status: "success" as const,
    responseTime: "124ms",
    timestamp: "2 min ago",
  },
  {
    id: "del_2",
    webhook: "Profile Updates",
    event: "profile.updated",
    status: "success" as const,
    responseTime: "89ms",
    timestamp: "15 min ago",
  },
  {
    id: "del_3",
    webhook: "User Authentication Webhook",
    event: "auth.logout",
    status: "failed" as const,
    responseTime: "5000ms",
    timestamp: "1 hour ago",
  },
];

export const mockPolicies: Policy[] = [
  {
    id: "1",
    name: "Rate Limiting Policy",
    status: "active",
    type: "rate-limit",
    description: "Limit requests to 100 per minute per IP",
    rules: "rate_limit: 100/min, scope: ip_address",
  },
  {
    id: "2",
    name: "Geo-Blocking Policy",
    status: "active",
    type: "security",
    description: "Block requests from specific countries",
    rules: "blocked_countries: [CN, RU, KP]",
  },
  {
    id: "3",
    name: "IP Allowlist",
    status: "inactive",
    type: "access",
    description: "Allow only specific IP ranges",
    rules: "allowed_ips: [192.168.0.0/16, 10.0.0.0/8]",
  },
];
