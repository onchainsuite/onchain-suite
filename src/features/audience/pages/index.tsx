"use client";

import React from "react";

import type { ReactElement } from "react";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStatusIcon,
  getHealthColor,
  getHealthBarColor,
} from "@/features/audience/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MousePointer,
  Eye,
  ArrowRightLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
  RefreshCw,
  ArrowRight,
  X,
  Trash2,
  Download,
  UserPlus,
  Brain,
} from "lucide-react";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const expandVariants = {
  initial: { opacity: 0, height: 0 },
  animate: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const generateMockProfiles = () => {
  const names = [
    "Alex Thompson",
    "Sarah Chen",
    "Mike Roberts",
    "Emma Davis",
    "James Wilson",
    "Lisa Park",
    "David Kim",
    "Anna Lopez",
    "Chris Johnson",
    "Maria Garcia",
    "Tom Anderson",
    "Sophie Brown",
    "Ryan Martinez",
    "Jessica Taylor",
    "Kevin Lee",
    "Amanda White",
    "Daniel Harris",
    "Rachel Clark",
    "Brandon Lewis",
    "Nicole Walker",
    "Josh Hall",
    "Megan Allen",
    "Tyler Young",
    "Stephanie King",
    "Eric Wright",
    "Lauren Scott",
    "Mark Green",
    "Heather Adams",
    "Paul Baker",
    "Christina Nelson",
    "Andrew Hill",
    "Melissa Moore",
    "Justin Campbell",
    "Ashley Mitchell",
    "Steven Roberts",
    "Rebecca Perez",
    "Brian Turner",
    "Kimberly Phillips",
    "Jonathan Evans",
    "Samantha Edwards",
    "Nathan Reed",
    "Victoria Cox",
    "Sean Price",
    "Emily Richardson",
    "Adam Foster",
    "Olivia Sanders",
    "Jacob Bryant",
    "Grace Russell",
    "Luke Griffin",
    "Natalie Diaz",
    "Caleb Hayes",
    "Hannah Murphy",
    "Owen Simmons",
    "Lily Patterson",
    "Ian Hughes",
  ];
  const chains = ["ETH", "Base", "Polygon", "Arbitrum", "Optimism"];
  const statuses = ["verified", "pending", "unverified"];
  const actions = [
    { type: "click", label: "Clicked campaign link" },
    { type: "open", label: "Opened newsletter" },
    { type: "swap", label: "Swapped on Uniswap" },
    { type: "mint", label: "Minted NFT" },
    { type: "stake", label: "Staked tokens" },
    { type: "buy", label: "Purchased item" },
    { type: "refer", label: "Referred friend" },
    { type: "claim", label: "Claimed airdrop" },
  ];
  const timeAgo = [
    "2m ago",
    "15m ago",
    "1h ago",
    "3h ago",
    "6h ago",
    "12h ago",
    "1d ago",
    "2d ago",
    "3d ago",
    "1w ago",
  ];
  const engagements = ["High", "Medium", "Low"];
  const tags = [
    "Whale",
    "Active Trader",
    "NFT Collector",
    "DeFi User",
    "New User",
    "High Value",
    "At Risk",
  ];

  return names.map((name, i) => ({
    id: i + 1,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
    wallet: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    chain: chains[Math.floor(Math.random() * chains.length)],
    healthScore: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    engagement: engagements[Math.floor(Math.random() * engagements.length)],
    tags: [tags[Math.floor(Math.random() * tags.length)]],
    lastAction: {
      ...actions[Math.floor(Math.random() * actions.length)],
      time: timeAgo[Math.floor(Math.random() * timeAgo.length)],
    },
    healthTrend:
      Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable",
  }));
};

export function AudiencePages(): ReactElement {
  const router = useRouter();
  const [profiles] = useState(generateMockProfiles);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [sortField, setSortField] = useState<
    "name" | "healthScore" | "lastAction"
  >("healthScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCerebra, setShowCerebra] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isRefreshSpinning, setIsRefreshSpinning] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const itemsPerPage = 10;

  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "healthScore") {
        comparison = a.healthScore - b.healthScore;
      } else if (sortField === "lastAction") {
        comparison = a.lastAction.time.localeCompare(b.lastAction.time);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [profiles, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedProfiles.length / itemsPerPage);
  const paginatedProfiles = sortedProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const aggregatedStats = useMemo(() => {
    const totalHealth = profiles.reduce((sum, p) => sum + p.healthScore, 0);
    const avgHealth = Math.round(totalHealth / profiles.length);
    const activeCount = profiles.filter((p) => p.healthScore >= 70).length;
    const coolingCount = profiles.filter(
      (p) => p.healthScore >= 40 && p.healthScore < 70
    ).length;
    const coldCount = profiles.filter((p) => p.healthScore < 40).length;
    const engagementTrend = Math.round(
      (activeCount / profiles.length) * 100 - 50
    );
    const onchainTrend = 8;
    const opensTrend = -3;
    return {
      avgHealth,
      activeCount,
      coolingCount,
      coldCount,
      engagementTrend,
      onchainTrend,
      opensTrend,
      total: profiles.length,
    };
  }, [profiles]);

  useEffect(() => {
    if (showCerebra && animatedScore < aggregatedStats.avgHealth) {
      const timer = setTimeout(() => {
        setAnimatedScore((prev) =>
          Math.min(prev + 1, aggregatedStats.avgHealth)
        );
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [showCerebra, animatedScore, aggregatedStats.avgHealth]);

  const handleSort = (field: "name" | "healthScore" | "lastAction") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedProfiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProfiles.map((p) => p.id));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRefreshCerebra = () => {
    setIsRefreshSpinning(true);
    setIsGeneratingSummary(true);
    setAnimatedScore(0);
    setTimeout(() => {
      setIsGeneratingSummary(false);
      setIsRefreshSpinning(false);
    }, 1500);
  };

  const handleBulkDelete = () => {
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const selectedProfiles = profiles.filter((p) => selectedIds.includes(p.id));
    const csv = [
      ["Name", "Email", "Wallet", "Chain", "Health Score", "Status"].join(","),
      ...selectedProfiles.map((p) =>
        [p.name, p.email, p.wallet, p.chain, p.healthScore, p.status].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audience-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    setSelectedIds([]);
  };

  return (
    <motion.div
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      initial="initial"
      animate="animate"
      className="flex min-h-screen bg-background"
    >
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Audience
              </h1>
              <p className="mt-1 text-muted-foreground">
                {profiles.length} profiles in your audience
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowCerebra(!showCerebra);
                  if (!showCerebra) setAnimatedScore(0);
                }}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${showCerebra ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-border bg-card text-muted-foreground hover:bg-secondary"}`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Cerebra</span>
              </button>
              <Link
                href="/audience/import-export"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
              >
                <UserPlus className="h-4 w-4" />
                Add Profile
              </Link>
            </div>
          </div>

          {/* Cerebra Panel */}
          <AnimatePresence>
            {showCerebra && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mx-2 mb-10 overflow-hidden md:mx-0"
              >
                <div
                  className="group relative rounded-3xl border border-border/30 bg-card py-6 px-8 shadow-sm transition-all duration-500 hover:border-emerald-500/20 hover:shadow-lg"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, hsl(var(--accent) / 0.04) 0%, transparent 50%)",
                  }}
                >
                  <button
                    onClick={handleRefreshCerebra}
                    className="absolute right-6 top-6 p-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isRefreshSpinning ? "animate-spin" : ""}`}
                    />
                  </button>
                  {isGeneratingSummary ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <p className="text-lg font-light text-foreground leading-relaxed">
                        <span className="text-5xl font-extralight tracking-tighter text-foreground/90">
                          {animatedScore}
                        </span>
                        <span className="text-2xl font-extralight text-muted-foreground">
                          /100
                        </span>
                        <span className="ml-4 text-base font-light text-foreground/80">
                          : Engagement is{" "}
                          <span
                            className={
                              aggregatedStats.engagementTrend >= 0
                                ? "text-emerald-600/70"
                                : "text-red-600/70"
                            }
                          >
                            {aggregatedStats.engagementTrend >= 0 ? "+" : ""}
                            {aggregatedStats.engagementTrend}%
                          </span>
                          , On-chain is{" "}
                          <span
                            className={
                              aggregatedStats.onchainTrend >= 0
                                ? "text-emerald-600/70"
                                : "text-red-600/70"
                            }
                          >
                            {aggregatedStats.onchainTrend >= 0 ? "+" : ""}
                            {aggregatedStats.onchainTrend}%
                          </span>{" "}
                          and Opens is{" "}
                          <span
                            className={
                              aggregatedStats.opensTrend >= 0
                                ? "text-emerald-600/70"
                                : "text-red-600/70"
                            }
                          >
                            {aggregatedStats.opensTrend >= 0 ? "+" : ""}
                            {aggregatedStats.opensTrend}%
                          </span>
                          . About {aggregatedStats.activeCount} of{" "}
                          {aggregatedStats.total} subscribers are actively
                          engaged · {aggregatedStats.coolingCount} showing
                          declining engagement · {aggregatedStats.coldCount}{" "}
                          require re-engagement
                        </span>
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-sm font-medium text-emerald-600">
                          → Target cooling users before they go inactive
                        </span>
                        <button className="group/btn inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-600 transition-all hover:bg-emerald-500/10">
                          Create Automation
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mx-2 mb-6 flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 md:mx-0">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-indigo-500" />
              <p className="text-sm text-foreground">
                <span className="font-medium">Advanced segmentation</span>
                <span className="text-muted-foreground">
                  {" "}
                  has moved to Intelligence
                </span>
              </p>
            </div>
            <Link
              href="/intelligence"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Go to Intelligence
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="mx-2 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mx-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search profiles..."
                className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20">
                <option>All Profiles</option>
                <option>Verified</option>
                <option>Pending</option>
                <option>Unverified</option>
              </select>
              <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20">
                <option>All</option>
                <option>Active</option>
                <option>Cooling</option>
                <option>Cold</option>
              </select>
              <select className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20">
                <option>All Tags</option>
                <option>Whale</option>
                <option>Active Trader</option>
                <option>NFT Collector</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="mx-2 rounded-xl border border-border bg-card shadow-md md:mx-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === paginatedProfiles.length &&
                          paginatedProfiles.length > 0
                        }
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-border"
                      />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      >
                        Profile
                        {sortField === "name" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                    </th>
                    <th className="hidden px-4 py-3 text-left sm:table-cell">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Wallet
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("healthScore")}
                        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      >
                        Health
                        {sortField === "healthScore" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                    </th>
                    <th className="hidden px-4 py-3 text-left md:table-cell">
                      <button
                        onClick={() => handleSort("lastAction")}
                        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      >
                        Last Action
                        {sortField === "lastAction" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {paginatedProfiles.map((profile) => (
                    <React.Fragment key={profile.id}>
                      <motion.tr
                        variants={{
                          initial: { opacity: 0, y: 20 },
                          animate: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.3,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            },
                          },
                        }}
                        onClick={() => handleRowClick(profile.id)}
                        className="cursor-pointer border-b border-border transition-colors hover:bg-emerald-500/5"
                      >
                        <td
                          className="px-4 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(profile.id)}
                            onChange={() => handleSelectOne(profile.id)}
                            className="h-4 w-4 rounded border-border"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                              style={{
                                backgroundColor: `hsl(${(profile.id * 47) % 360}, 70%, 50%)`,
                              }}
                            >
                              {profile.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/audience/${profile.id}`;
                                  }}
                                  className="font-medium text-foreground transition-colors hover:text-accent hover:underline"
                                >
                                  {profile.name}
                                </button>
                                {getStatusIcon(profile.status)}
                              </div>
                              <p className="truncate text-sm text-muted-foreground">
                                {profile.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-4 sm:table-cell">
                          <div className="flex items-center gap-2">
                            <code className="w-24 text-sm text-muted-foreground">
                              {profile.wallet}
                            </code>
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                              {profile.chain}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${getHealthColor(profile.healthScore)}`}
                            >
                              {profile.healthScore}
                            </span>
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={`h-full rounded-full ${getHealthBarColor(profile.healthScore)}`}
                                style={{ width: `${profile.healthScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-4 md:table-cell">
                          <div>
                            <p className="text-sm text-foreground">
                              {profile.lastAction.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {profile.lastAction.time}
                            </p>
                          </div>
                        </td>
                      </motion.tr>
                      <AnimatePresence>
                        {expandedRow === profile.id && (
                          <motion.tr
                            variants={{
                              initial: { opacity: 0, height: 0 },
                              animate: {
                                opacity: 1,
                                height: "auto",
                                transition: {
                                  duration: 0.3,
                                  ease: [0.25, 0.46, 0.45, 0.94],
                                },
                              },
                              exit: {
                                opacity: 0,
                                height: 0,
                                transition: {
                                  duration: 0.3,
                                  ease: [0.25, 0.46, 0.45, 0.94],
                                },
                              },
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                          >
                            <td colSpan={5} className="bg-muted/30 px-4 py-4">
                              <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-lg border border-border bg-card p-4">
                                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Recent Activity
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>Opened email - 2h ago</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <MousePointer className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>Clicked link - 1d ago</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>Swapped tokens - 3d ago</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="rounded-lg border border-border bg-card p-4">
                                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    dApp Stats
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">
                                        Total Volume
                                      </span>
                                      <span className="font-medium">
                                        $12,450
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">
                                        Transactions
                                      </span>
                                      <span className="font-medium">47</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">
                                        Active Days
                                      </span>
                                      <span className="font-medium">23</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="rounded-lg border border-border bg-card p-4">
                                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Tags
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {profile.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                      {profile.engagement} Engagement
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </motion.tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, sortedProfiles.length)} of{" "}
                {sortedProfiles.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
            >
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-6 py-3 shadow-xl">
                <span className="text-sm font-medium text-foreground">
                  {selectedIds.length} selected
                </span>
                <div className="h-4 w-px bg-border" />
                <button
                  onClick={handleBulkExport}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <div className="h-4 w-px bg-border" />
                <button
                  onClick={() => setSelectedIds([])}
                  className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
