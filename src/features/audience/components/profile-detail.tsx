"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Profile } from "@/features/audience/types";
import {
  ArrowLeft,
  Mail,
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  MousePointer,
  Send,
  Tag,
  ArrowRightLeft,
  Coins,
  Gift,
  Target,
} from "lucide-react";

const createProfilesData = (): Record<string, Profile> => {
  const data: Record<string, Profile> = {
    "1": {
      id: 1,
      name: "Alex Thompson",
      email: "alex@example.com",
      wallet: "0x1234...5678",
      walletFull: "0x1234567890abcdef1234567890abcdef12345678",
      status: "verified",
      segments: ["High Value", "NFT Holder"],
      tags: ["VIP", "Early Supporter", "Active Trader"],
      intelligenceSegments: ["Your Pudgy Whales >$5k", "Your Base Power Users"],
      contractLabels: [
        {
          contract: "Pudgy Penguins",
          label: "Whale",
          volume: "$125,400",
          txCount: 23,
        },
        {
          contract: "Base Bridge",
          label: "Power User",
          volume: "$45,000",
          txCount: 47,
        },
      ],
      churnRisk: "low",
      churnScore: 12,
      predictedLtv: "$18,500",
      revenueAttribution: "$4,200 from Your Pudgy Whales segment",
      memberSince: "Jan 15, 2024",
      lastActive: "2 hours ago",
      engagement: "active",
      engagementScore: 92,
      holdings: "whale",
      holdingsValue: "$125,000+",
      onchainActivity: "active",
      lastTx: "2 hours ago",
      chain: "ETH",
      dappActivity: {
        totalTxns: 47,
        lastInteraction: "2 hours ago",
        lastAction: "stake",
        activityLevel: "power",
        totalVolume: "$45,230",
        firstInteraction: "Jan 15, 2024",
      },
      emailStats: {
        sent: 24,
        opened: 22,
        clicked: 18,
        openRate: 91.7,
        clickRate: 81.8,
      },
      notes: "Key account - referred 5 other high-value users.",
    },
  };

  // Generate profiles 2-100
  for (let i = 2; i <= 100; i++) {
    const names = [
      "Sarah Chen",
      "Mike Johnson",
      "Emily Davis",
      "Chris Wilson",
      "Anna Lee",
      "David Kim",
      "Lisa Wang",
      "James Park",
    ];
    const name = names[(i - 2) % names.length];
    data[String(i)] = {
      id: i,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      wallet: `0x${i.toString(16).padStart(4, "0")}...${(i * 17).toString(16).slice(0, 4)}`,
      walletFull: `0x${i.toString(16).padStart(40, "0")}`,
      status: i % 3 === 0 ? "pending" : "verified",
      segments: i % 2 === 0 ? ["High Value"] : ["New User"],
      tags: i % 2 === 0 ? ["VIP"] : ["Onboarding"],
      intelligenceSegments: i % 2 === 0 ? ["Your Pudgy Whales >$5k"] : [],
      contractLabels: [
        {
          contract: "Base Bridge",
          label: i % 2 === 0 ? "Power User" : "New",
          volume: `$${i * 100}`,
          txCount: i,
        },
      ],
      churnRisk: i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low",
      churnScore: (i * 7) % 100,
      predictedLtv: `$${(i * 150).toLocaleString()}`,
      revenueAttribution: i % 2 === 0 ? `$${i * 50} attributed` : null,
      memberSince: "Jan 2024",
      lastActive: `${i % 24} hours ago`,
      engagement: i % 2 === 0 ? "active" : "cooling",
      engagementScore: 50 + (i % 50),
      holdings: i % 2 === 0 ? "whale" : "fish",
      holdingsValue: i % 2 === 0 ? "$50,000+" : "$1,000-$5,000",
      onchainActivity: "active",
      lastTx: `${i % 48} hours ago`,
      chain: "ETH",
      dappActivity: {
        totalTxns: i * 3,
        lastInteraction: `${i % 24}h ago`,
        lastAction: "stake",
        activityLevel: "power",
        totalVolume: `$${i * 500}`,
        firstInteraction: "Jan 2024",
      },
      emailStats: {
        sent: i * 2,
        opened: i,
        clicked: Math.floor(i * 0.7),
        openRate: 50 + (i % 40),
        clickRate: 30 + (i % 50),
      },
      notes: "",
    };
  }
  return data;
};

const profilesData = createProfilesData();

const activityTimeline = [
  {
    id: 1,
    type: "email_opened",
    title: "Opened campaign email",
    description: "Exclusive NFT Drop",
    time: "2h ago",
    icon: Eye,
  },
  {
    id: 2,
    type: "email_clicked",
    title: "Clicked product link",
    description: "Viewed NFT collection",
    time: "2h ago",
    icon: MousePointer,
  },
  {
    id: 3,
    type: "dapp_txn",
    title: "Staked 5 ETH",
    description: "Contract: 0x1234...5678",
    time: "3h ago",
    icon: Coins,
    txHash: "0xabc...def",
  },
  {
    id: 4,
    type: "dapp_txn",
    title: "Swapped tokens",
    description: "500 USDC → 0.25 ETH",
    time: "1d ago",
    icon: ArrowRightLeft,
    txHash: "0xdef...ghi",
  },
  {
    id: 5,
    type: "email_sent",
    title: "Email sent",
    description: "Weekly Digest",
    time: "2d ago",
    icon: Send,
  },
  {
    id: 6,
    type: "tag_added",
    title: "Tag added",
    description: "Added to VIP segment",
    time: "3d ago",
    icon: Tag,
  },
  {
    id: 7,
    type: "dapp_txn",
    title: "Minted NFT",
    description: "Genesis Collection #4521",
    time: "5d ago",
    icon: Gift,
    txHash: "0xghi...jkl",
  },
  {
    id: 8,
    type: "profile_created",
    title: "Profile created",
    description: "Joined via wallet connect",
    time: "Jan 15, 2024",
    icon: CheckCircle2,
  },
];

const emailHistory = [
  {
    id: 1,
    subject: "Exclusive NFT Drop - Early Access",
    status: "clicked",
    sentAt: "Dec 1, 2024",
    openedAt: "Dec 1, 2024",
    clickedAt: "Dec 1, 2024",
  },
  {
    id: 2,
    subject: "Weekly Digest - Top Stories",
    status: "opened",
    sentAt: "Nov 28, 2024",
    openedAt: "Nov 28, 2024",
    clickedAt: null,
  },
  {
    id: 3,
    subject: "Your Staking Rewards Are Ready",
    status: "clicked",
    sentAt: "Nov 25, 2024",
    openedAt: "Nov 25, 2024",
    clickedAt: "Nov 25, 2024",
  },
  {
    id: 4,
    subject: "Monthly Product Update",
    status: "opened",
    sentAt: "Nov 20, 2024",
    openedAt: "Nov 21, 2024",
    clickedAt: null,
  },
];

const dappTransactions = [
  {
    id: 1,
    action: "Stake",
    details: "5 ETH staked",
    time: "3h ago",
    txHash: "0xabc123...",
    value: "$9,500",
    chain: "ETH",
  },
  {
    id: 2,
    action: "Swap",
    details: "500 USDC → 0.25 ETH",
    time: "1d ago",
    txHash: "0xdef456...",
    value: "$500",
    chain: "ETH",
  },
  {
    id: 3,
    action: "Mint",
    details: "Genesis #4521",
    time: "5d ago",
    txHash: "0xghi789...",
    value: "$250",
    chain: "ETH",
  },
  {
    id: 4,
    action: "Claim",
    details: "12.5 TOKEN rewards",
    time: "1w ago",
    txHash: "0xjkl012...",
    value: "$125",
    chain: "ETH",
  },
];

export function ProfileDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const profile = profilesData[id] || profilesData["1"];

  const [copiedWallet, setCopiedWallet] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "activity" | "emails" | "transactions"
  >("activity");

  const copyWallet = () => {
    navigator.clipboard.writeText(profile.walletFull);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-red-500/10 text-red-600 border-red-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <main className="flex-1 px-6 py-12 md:px-16">
        <div className="mx-auto max-w-5xl">
          {/* Back */}
          <Link
            href="/audience"
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Audience
          </Link>

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-xl font-semibold text-white shadow-lg">
                {profile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-light tracking-tight text-gray-900">
                    {profile.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(profile.status)}`}
                  >
                    {getStatusIcon(profile.status)}
                    {profile.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                  <span>{profile.email}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-mono text-xs text-gray-400">
                    {profile.wallet}
                  </span>
                  <button
                    onClick={copyWallet}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {copiedWallet ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <a
                    href={`https://etherscan.io/address/${profile.walletFull}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30">
              <Mail className="h-4 w-4" />
              Send Email
            </button>
          </div>

          {/* Tags */}
          <div className="mb-10 flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Intelligence Cards */}
          <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {profile.intelligenceSegments.length > 0 && (
              <div className="rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50/50 to-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10">
                    <Target className="h-4 w-4 text-indigo-500" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Intelligence Segments
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.intelligenceSegments.map((seg) => (
                    <span
                      key={seg}
                      className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-600"
                    >
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/50 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Coins className="h-4 w-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  Contract Activity
                </h3>
              </div>
              <div className="space-y-3">
                {profile.contractLabels.map((cl, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {cl.contract}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">
                        {cl.label}
                      </span>
                    </div>
                    <span className="text-gray-500">{cl.volume}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`rounded-2xl border p-6 shadow-sm ${
                profile.churnRisk === "high"
                  ? "border-red-100 bg-linear-to-br from-red-50/50 to-white"
                  : profile.churnRisk === "medium"
                    ? "border-amber-100 bg-linear-to-br from-amber-50/50 to-white"
                    : "border-emerald-100 bg-linear-to-br from-emerald-50/50 to-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    profile.churnRisk === "high"
                      ? "bg-red-500/10"
                      : profile.churnRisk === "medium"
                        ? "bg-amber-500/10"
                        : "bg-emerald-500/10"
                  }`}
                >
                  <AlertCircle
                    className={`h-4 w-4 ${
                      profile.churnRisk === "high"
                        ? "text-red-500"
                        : profile.churnRisk === "medium"
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }`}
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  Churn Prediction
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      profile.churnRisk === "high"
                        ? "bg-red-500/10 text-red-600"
                        : profile.churnRisk === "medium"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {profile.churnRisk === "high"
                      ? "High Risk"
                      : profile.churnRisk === "medium"
                        ? "Medium Risk"
                        : "Low Risk"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Score: {profile.churnScore}/100
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Predicted LTV</span>
                  <span className="font-semibold text-gray-900">
                    {profile.predictedLtv}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mb-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Email Open Rate
              </p>
              <p className="mt-2 text-3xl font-light text-gray-900">
                {profile.emailStats.openRate}%
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Click Rate
              </p>
              <p className="mt-2 text-3xl font-light text-gray-900">
                {profile.emailStats.clickRate}%
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Total Txns
              </p>
              <p className="mt-2 text-3xl font-light text-gray-900">
                {profile.dappActivity.totalTxns}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Total Volume
              </p>
              <p className="mt-2 text-3xl font-light text-gray-900">
                {profile.dappActivity.totalVolume}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1 border-b border-gray-200">
            {(["activity", "emails", "transactions"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-emerald-500 text-emerald-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab === "activity"
                  ? "Activity Timeline"
                  : tab === "emails"
                    ? "Email History"
                    : "Transactions"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            {activeTab === "activity" && (
              <div className="space-y-4">
                {activityTimeline.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <item.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "emails" && (
              <div className="space-y-3">
                {emailHistory.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          email.status === "clicked"
                            ? "bg-emerald-100"
                            : email.status === "opened"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                        }`}
                      >
                        {email.status === "clicked" ? (
                          <MousePointer className="h-4 w-4 text-emerald-600" />
                        ) : email.status === "opened" ? (
                          <Eye className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Send className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {email.subject}
                        </p>
                        <p className="text-sm text-gray-500">
                          Sent {email.sentAt}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        email.status === "clicked"
                          ? "bg-emerald-100 text-emerald-700"
                          : email.status === "opened"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {email.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-3">
                {dappTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <Coins className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.action}</p>
                        <p className="text-sm text-gray-500">{tx.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{tx.value}</p>
                      <p className="text-xs text-gray-400">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
