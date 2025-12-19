import { Clock, GitBranch, Mail, Tag, Users, Wallet } from "lucide-react";
import React from "react";

import type { AutomationTemplate, HelpResource } from "../types";

export const emailTemplates = [
  {
    id: "winback",
    name: "Win-back Campaign",
    subject: "We miss you, {{ens_name}}",
    category: "Re-engagement",
    previewText: "Come back and see what's new...",
    body: "<p>Hi {{ens_name}},</p><p>We noticed you haven't been active lately. Come back and see what's new</p><p>Best,</p><p>The Team</p>",
  },
  {
    id: "newsletter",
    name: "Weekly Newsletter",
    subject: "This week in Web3, {{ens_name}}",
    category: "Newsletter",
    previewText: "Top stories and updates...",
    body: "<p>Hi {{ens_name}},</p><p>Here's your weekly dose of Web3 news.</p><p>Cheers,</p><p>The Editors</p>",
  },
  {
    id: "airdrop",
    name: "Airdrop Alert",
    subject: "You're eligible for an airdrop",
    category: "Promotional",
    previewText: "Based on your on-chain activity...",
    body: "<p>Hello {{ens_name}},</p><p>You're eligible for a special airdrop</p><p>Details inside.</p>",
  },
  {
    id: "vip",
    name: "VIP Announcement",
    subject: "Exclusive: You're invited",
    category: "VIP",
    previewText: "As a valued member...",
    body: "<p>Dear {{ens_name}},</p><p>You're invited to an exclusive event.</p><p>Don't miss out</p>",
  },
  {
    id: "product",
    name: "Product Update",
    subject: "New features just dropped",
    category: "Product",
    previewText: "Check out what we built...",
    body: "<p>Hey {{ens_name}},</p><p>We've launched some exciting new features</p><p>See what's new.</p>",
  },
  {
    id: "welcome",
    name: "Welcome Series #1",
    subject: "Welcome to the community",
    category: "Onboarding",
    previewText: "Thanks for joining us...",
    body: "<p>Welcome, {{ens_name}}</p><p>Glad to have you here.</p><p>Let's get started.</p>",
  },
];

export const mockContracts = [
  {
    address: "0x8d35...12cf8",
    name: "Pudgy Penguins",
    chain: "Ethereum",
    users: 714,
  },
  { address: "0x49cf...A28B", name: "Clone X", chain: "Ethereum", users: 342 },
  { address: "0x3Bf2...5e9D", name: "Base Bridge", chain: "Base", users: 1247 },
];

export const eventTypes = [
  "Transfer",
  "Mint",
  "Bridge",
  "Swap",
  "Approval",
  "Stake",
];
export const chainOptions = [
  "All Chains",
  "Ethereum",
  "Base",
  "Polygon",
  "Arbitrum",
];

export const mockDynamicData = {
  ens_name: "vitalik.eth",
  contract_volume: "$1500",
  engagement_score: "High",
  ltv: "$5000",
  last_activity: "2 days ago",
};

export const triggerNodes = [
  {
    type: "onchain",
    label: "On-chain Event",
    description: "When your users interact with a contract",
    icon: <Wallet className="h-5 w-5 text-primary" />,
    color: "emerald",
  },
  {
    type: "email_opened",
    label: "Email Opened",
    description: "When your user opens an email",
    icon: <Mail className="h-5 w-5 text-primary" />,
    color: "emerald",
  },
  {
    type: "segment_entered",
    label: "Segment Entered",
    description: "When user joins a segment",
    icon: <Users className="h-5 w-5 text-primary" />,
    color: "emerald",
  },
];

export const initialAutomationsData = [
  {
    id: "1",
    name: "Win-back Cooling Pudgy Holders",
    description:
      "Re-engage your users who held Pudgy Penguins but went inactive",
    trigger: {
      type: "onchain",
      contract: "Pudgy Penguins",
      event: "Transfer (out)",
    },
    status: "active",
    entries: 847,
    conversions: 234,
    conversionRate: 27.6,
    revenue: 45200,
    lastTriggered: "2h ago",
    createdAt: "Oct 15, 2024",
  },
  {
    id: "2",
    name: "Base Bridge Welcome Series",
    description: "Onboard your users who bridge to Base chain",
    trigger: {
      type: "onchain",
      contract: "Base Bridge",
      event: "Bridge Complete",
    },
    status: "active",
    entries: 1243,
    conversions: 456,
    conversionRate: 36.7,
    revenue: 78400,
    lastTriggered: "15m ago",
    createdAt: "Nov 2, 2024",
  },
  {
    id: "3",
    name: "High-Value User Nurture",
    description: "VIP treatment for your users with LTV > $5k",
    trigger: { type: "behavior", event: "LTV crosses $5,000" },
    status: "active",
    entries: 312,
    conversions: 89,
    conversionRate: 28.5,
    revenue: 34500,
    lastTriggered: "1d ago",
    createdAt: "Sep 28, 2024",
  },
  {
    id: "4",
    name: "NFT Mint Announcement",
    description: "Alert your users when new collection drops",
    trigger: {
      type: "onchain",
      contract: "Your Collection",
      event: "Mint Open",
    },
    status: "paused",
    entries: 2156,
    conversions: 623,
    conversionRate: 28.9,
    revenue: 92300,
    lastTriggered: "5d ago",
    createdAt: "Aug 10, 2024",
  },
  {
    id: "5",
    name: "Churn Prevention Alert",
    description: "Intervene when your users show churn signals",
    trigger: { type: "behavior", event: "Churn score > 70" },
    status: "active",
    entries: 156,
    conversions: 67,
    conversionRate: 42.9,
    revenue: 28700,
    lastTriggered: "4h ago",
    createdAt: "Nov 18, 2024",
  },
];

export const draftsData = [
  {
    id: "d1",
    name: "Airdrop Eligible Users",
    description: "Notify your users who qualify for upcoming airdrop",
    trigger: { type: "onchain", contract: "Token Contract", event: "Snapshot" },
    lastEdited: "2d ago",
  },
  {
    id: "d2",
    name: "Re-engagement Campaign",
    description: "Win back your dormant users",
    trigger: { type: "behavior", event: "Inactive 60+ days" },
    lastEdited: "1w ago",
  },
];

export const templatesData = [
  {
    id: "t1",
    name: "Welcome Series",
    description: "3-email onboarding sequence for new users",
    category: "Onboarding",
    uses: 1234,
  },
  {
    id: "t2",
    name: "Win-back Flow",
    description: "Re-engage users who haven't opened in 30 days",
    category: "Retention",
    uses: 892,
  },
  {
    id: "t3",
    name: "VIP Upgrade",
    description: "Nurture high-value users with exclusive content",
    category: "Loyalty",
    uses: 567,
  },
  {
    id: "t4",
    name: "On-chain Event Alert",
    description: "Trigger emails based on smart contract events",
    category: "Web3",
    uses: 2341,
  },
];

export const actionNodes = [
  {
    type: "send_email",
    label: "Send Email",
    description: "Send an email to the user",
    icon: <Mail className="h-5 w-5 text-indigo-500" />,
    color: "indigo",
  },
  {
    type: "wait",
    label: "Wait",
    description: "Wait for a period of time",
    icon: <Clock className="h-5 w-5 text-amber-500" />,
    color: "amber",
  },
  {
    type: "branch",
    label: "Branch",
    description: "Split based on condition",
    icon: <GitBranch className="h-5 w-5 text-violet-500" />,
    color: "violet",
  },
  {
    type: "add_tag",
    label: "Add Tag",
    description: "Add a tag to the user",
    icon: <Tag className="h-5 w-5 text-indigo-500" />,
    color: "indigo",
  },
];

export const statsChartData = [
  { date: "Nov 1", entries: 45, conversions: 12, revenue: 4200 },
  { date: "Nov 8", entries: 67, conversions: 18, revenue: 6800 },
  { date: "Nov 15", entries: 89, conversions: 24, revenue: 9100 },
  { date: "Nov 22", entries: 112, conversions: 31, revenue: 11500 },
  { date: "Nov 29", entries: 134, conversions: 38, revenue: 14200 },
  { date: "Dec 1", entries: 156, conversions: 42, revenue: 15800 },
];

export const recentEntries = [
  {
    id: "usr_1",
    wallet: "0x8d35...a2f1",
    email: "whale@example.com",
    timestamp: "2 hours ago",
    outcome: "converted",
    revenue: 2450,
    path: "Cold → Email",
  },
  {
    id: "usr_2",
    wallet: "0x4c21...b8e3",
    email: "trader@example.com",
    timestamp: "5 hours ago",
    outcome: "in_progress",
    revenue: 0,
    path: "Cold → Email",
  },
  {
    id: "usr_3",
    wallet: "0x9f47...c4d2",
    email: "hodler@example.com",
    timestamp: "8 hours ago",
    outcome: "converted",
    revenue: 1890,
    path: "Cold → Email",
  },
  {
    id: "usr_4",
    wallet: "0x2e18...f9a5",
    email: "degen@example.com",
    timestamp: "12 hours ago",
    outcome: "exited",
    revenue: 0,
    path: "Warm → Exit",
  },
  {
    id: "usr_5",
    wallet: "0x7b93...e1c6",
    email: "collector@example.com",
    timestamp: "1 day ago",
    outcome: "converted",
    revenue: 3200,
    path: "Cold → Email",
  },
  {
    id: "usr_6",
    wallet: "0x5a62...d7b8",
    email: "flipper@example.com",
    timestamp: "1 day ago",
    outcome: "in_progress",
    revenue: 0,
    path: "Cold → Email",
  },
];

export const pathPerformance = [
  {
    path: "Trigger → Wait → Cold → Email",
    entries: 847,
    conversions: 289,
    rate: 34.2,
    revenue: 89000,
  },
  {
    path: "Trigger → Wait → Warm → Exit",
    entries: 400,
    conversions: 53,
    rate: 13.3,
    revenue: 38000,
  },
];

export const recommendedFlows: AutomationTemplate[] = [
  {
    id: "welcome-contacts",
    title: "Welcome new contacts",
    description:
      "Increase engagement from new subscribers with a personalized hello.",
    icon: "📧",
    category: "recommended",
    tags: ["Popular"],
  },
  {
    id: "exclusive-content",
    title: "Share exclusive content with new leads",
    description:
      "Welcome new contacts acquired through Meta lead ads. Once a lead is approved, automatically engage them with members-only content via email.",
    icon: "🎯",
    category: "recommended",
  },
  {
    id: "celebrate-anniversaries",
    title: "Celebrate sign-up anniversaries with your contacts",
    description:
      "Offer promotions or well wishes that help contacts feel closer to your brand.",
    icon: "🎉",
    category: "recommended",
  },
];

export const popularTemplates: AutomationTemplate[] = [
  {
    id: "welcome-new-contacts",
    title: "Welcome new contacts",
    description: "Send a series of emails to new subscribers",
    icon: "📧",
    category: "popular",
    isPopular: true,
  },
  {
    id: "email-tagged-customers",
    title: "Email tagged customers",
    description: "Send targeted emails based on customer tags",
    icon: "🏷️",
    category: "popular",
    isPopular: true,
  },
  {
    id: "celebrate-birthdays",
    title: "Celebrate customer birthdays",
    description: "Send birthday wishes and special offers",
    icon: "🎂",
    category: "popular",
    isPopular: true,
  },
  {
    id: "recover-abandoned-carts",
    title: "Recover abandoned carts",
    description: "Win back customers who left items in their cart",
    icon: "🛒",
    category: "popular",
    isPopular: true,
  },
  {
    id: "facebook-lead-ads",
    title: "Find new contacts with Facebook Lead Ads",
    description: "Automatically add Facebook leads to your audience",
    icon: "📱",
    category: "popular",
    isPopular: true,
  },
  {
    id: "recover-lost-customers",
    title: "Recover lost customers",
    description: "Re-engage customers who haven't purchased recently",
    icon: "🔄",
    category: "popular",
    isPopular: true,
  },
  {
    id: "repeat-customers",
    title: "Create repeat customers",
    description: "Turn one-time buyers into loyal customers",
    icon: "🔁",
    category: "popular",
    isPopular: true,
  },
];

export const helpResources: HelpResource[] = [
  {
    id: "about-flows",
    title: "About automation flows",
    description:
      "Get started with our automation builder, and create dynamic marketing paths for your contacts.",
    type: "guide",
    image: "/placeholder.svg?height=200&width=300&text=Automation+Builder",
    category: "getting started",
  },
  {
    id: "quick-start-video",
    title: "Quick start video",
    description:
      "Watch as we guide you through the process of setting up an automation with the flow builder.",
    type: "video",
    image: "/placeholder.svg?height=200&width=300&text=Video+Tutorial",
    category: "tutorial",
  },
  {
    id: "create-automation",
    title: "Create an automation flow",
    description:
      "Learn how to build automated workflows that deliver personalized experiences for your contacts.",
    type: "tutorial",
    image: "/placeholder.svg?height=200&width=300&text=Step+by+Step",
    category: "step-by-step guide",
  },
];
