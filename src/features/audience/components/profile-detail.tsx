"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  Eye,
  Gift,
  Mail,
  MousePointer,
  Send,
  Tag,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import type { Profile } from "@/features/audience/types";

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
        return "bg-primary/10 text-primary border-primary/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-destructive/10 text-destructive border-destructive/20";
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
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 px-6 py-12 md:px-16">
        <div className="mx-auto max-w-5xl">
          {/* Back */}
          <Link
            href="/audience"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Audience
          </Link>

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 text-xl font-semibold text-primary-foreground shadow-lg">
                {profile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-light tracking-tight text-foreground">
                    {profile.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(profile.status)}`}
                  >
                    {getStatusIcon(profile.status)}
                    {profile.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{profile.email}</span>
                  <span className="text-muted-foreground/50">|</span>
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {profile.wallet}
                  </span>
                  <button
                    onClick={copyWallet}
                    className="hover:text-foreground transition-colors"
                  >
                    {copiedWallet ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <a
                    href={`https://etherscan.io/address/${profile.walletFull}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30">
              <Mail className="h-4 w-4" />
              Send Email
            </button>
          </div>

          {/* Tags */}
          <div className="mb-10 flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Intelligence Cards */}
          <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {profile.intelligenceSegments.length > 0 && (
              <div className="rounded-2xl border border-secondary/20 bg-linear-to-br from-secondary/5 to-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/10">
                    <Target className="h-4 w-4 text-secondary" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">
                    Intelligence Segments
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.intelligenceSegments.map((seg) => (
                    <span
                      key={seg}
                      className="rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary"
                    >
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 to-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                  <Coins className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground">
                  Contract Activity
                </h3>
              </div>
              <div className="space-y-3">
                {profile.contractLabels.map((cl) => (
                  <div
                    key={cl.contract}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {cl.contract}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {cl.label}
                      </span>
                    </div>
                    <span className="text-muted-foreground">{cl.volume}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`rounded-2xl border p-6 shadow-sm ${
                profile.churnRisk === "high"
                  ? "border-destructive/20 bg-linear-to-br from-destructive/5 to-card"
                  : profile.churnRisk === "medium"
                    ? "border-secondary/20 bg-linear-to-br from-secondary/5 to-card"
                    : "border-primary/20 bg-linear-to-br from-primary/5 to-card"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    profile.churnRisk === "high"
                      ? "bg-destructive/10"
                      : profile.churnRisk === "medium"
                        ? "bg-secondary/10"
                        : "bg-primary/10"
                  }`}
                >
                  <AlertCircle
                    className={`h-4 w-4 ${
                      profile.churnRisk === "high"
                        ? "text-destructive"
                        : profile.churnRisk === "medium"
                          ? "text-secondary"
                          : "text-primary"
                    }`}
                  />
                </div>
                <h3 className="text-sm font-medium text-foreground">
                  Churn Prediction
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      profile.churnRisk === "high"
                        ? "bg-destructive/10 text-destructive"
                        : profile.churnRisk === "medium"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-primary/10 text-primary"
                    }`}
                  >
                    {profile.churnRisk === "high"
                      ? "High Risk"
                      : profile.churnRisk === "medium"
                        ? "Medium Risk"
                        : "Low Risk"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Score: {profile.churnScore}/100
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Predicted LTV</span>
                  <span className="font-semibold text-foreground">
                    {profile.predictedLtv}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mb-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email Open Rate
              </p>
              <p className="mt-2 text-3xl font-light text-foreground">
                {profile.emailStats.openRate}%
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Click Rate
              </p>
              <p className="mt-2 text-3xl font-light text-foreground">
                {profile.emailStats.clickRate}%
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Txns
              </p>
              <p className="mt-2 text-3xl font-light text-foreground">
                {profile.dappActivity.totalTxns}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Volume
              </p>
              <p className="mt-2 text-3xl font-light text-foreground">
                {profile.dappActivity.totalVolume}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1 border-b border-border">
            {(["activity", "emails", "transactions"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-emerald-500 text-emerald-600"
                    : "text-muted-foreground hover:text-foreground"
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
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {activeTab === "activity" && (
              <div className="space-y-4">
                {activityTimeline.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground/70">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "emails" && (
              <div className="space-y-3">
                {emailHistory.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          email.status === "clicked"
                            ? "bg-emerald-100"
                            : email.status === "opened"
                              ? "bg-blue-100"
                              : "bg-muted"
                        }`}
                      >
                        {email.status === "clicked" ? (
                          <MousePointer className="h-4 w-4 text-emerald-600" />
                        ) : email.status === "opened" ? (
                          <Eye className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Send className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {email.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sent {email.sentAt}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        email.status === "clicked"
                          ? "bg-primary/20 text-primary"
                          : email.status === "opened"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-muted text-muted-foreground"
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
                    className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Coins className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {tx.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tx.details}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{tx.value}</p>
                      <p className="text-xs text-muted-foreground/70">
                        {tx.time}
                      </p>
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
