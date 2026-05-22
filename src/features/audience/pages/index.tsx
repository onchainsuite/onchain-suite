"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Brain,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { type ReactElement, useEffect, useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

import { isJsonObject } from "@/lib/utils";

import { AudienceTableSkeleton } from "@/features/audience/components";
import {
  type AudienceProfile,
  audienceService,
} from "@/features/audience/audience.service";
import {
  getHealthBarColor,
  getHealthColor,
  getStatusIcon,
  deriveDisplayName,
  extractWalletFields,
  hashHue,
  normalizeTags,
} from "@/features/audience/utils";

export function AudiencePages(): ReactElement {
  const filterTriggerClassName =
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20";

  const profilesQuery = useQuery({
    queryKey: [
      "audience",
      "profiles",
      {
        page: 1,
        limit: 200,
        include: "wallets,attributes,tags,health,lastAction",
      },
    ],
    queryFn: async () => {
      const res = await audienceService.listProfiles({
        page: 1,
        limit: 200,
        include: "wallets,attributes,tags,health,lastAction",
      });
      const root = Array.isArray(res) ? res : (res.items ?? res.data ?? []);
      return Array.isArray(root) ? root : [];
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const overviewQuery = useQuery({
    queryKey: ["audience", "overview"],
    queryFn: () => audienceService.getOverview(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const showPureLoading = profilesQuery.isLoading || profilesQuery.isFetching;

  const profiles = useMemo(() => {
    if (profilesQuery.isSuccess && Array.isArray(profilesQuery.data)) {
      return profilesQuery.data.map((p: AudienceProfile, idx: number) => {
        const lastAction = isJsonObject(p.lastAction) ? p.lastAction : {};
        const idRaw =
          typeof p.id === "string" && p.id.trim().length > 0
            ? p.id
            : `${idx + 1}`;
        const id = idRaw.trim();
        const email = typeof p.email === "string" ? p.email.trim() : "";
        const { walletFull, wallet } = extractWalletFields(p);
        const name = deriveDisplayName({
          name: p.name,
          fullName: (p as unknown as { fullName?: unknown }).fullName,
          email,
          wallet: walletFull,
          walletAddress: walletFull,
        });
        const tags = normalizeTags(p.tags);
        const healthScoreRaw = Number(p.healthScore);
        const healthScore = Number.isFinite(healthScoreRaw)
          ? healthScoreRaw
          : null;
        const status = typeof p.status === "string" ? p.status : "unverified";
        const chain = typeof p.chain === "string" ? p.chain : "";
        const engagement = typeof p.engagement === "string" ? p.engagement : "";
        const attributes = isJsonObject(p.attributes) ? p.attributes : {};

        const label =
          typeof lastAction.label === "string" &&
          lastAction.label.trim().length > 0
            ? lastAction.label.trim()
            : "";
        const time =
          typeof lastAction.time === "string" &&
          lastAction.time.trim().length > 0
            ? lastAction.time.trim()
            : "";

        return {
          id,
          name,
          email,
          wallet,
          walletFull,
          chain,
          healthScore,
          status,
          engagement,
          tags: tags.length ? tags : [],
          attributes,
          lastAction: {
            type: typeof lastAction.type === "string" ? lastAction.type : "",
            label,
            time,
          },
          healthTrend: String(p.healthTrend ?? "stable"),
        };
      });
    }
    return [];
  }, [profilesQuery.isSuccess, profilesQuery.data]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<
    "name" | "healthScore" | "lastAction"
  >("healthScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCerebra, setShowCerebra] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isRefreshSpinning, setIsRefreshSpinning] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileScopeFilter, setProfileScopeFilter] = useState<
    "all" | "verified" | "pending" | "unverified"
  >("all");
  const [engagementFilter, setEngagementFilter] = useState<
    "all" | "active" | "cooling" | "cold"
  >("all");
  const [tagFilter, setTagFilter] = useState<
    "all" | "whale" | "active-trader" | "nft-collector"
  >("all");

  const itemsPerPage = 10;

  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "healthScore") {
        const aScore = typeof a.healthScore === "number" ? a.healthScore : -1;
        const bScore = typeof b.healthScore === "number" ? b.healthScore : -1;
        comparison = aScore - bScore;
      } else if (sortField === "lastAction") {
        comparison = a.lastAction.time.localeCompare(b.lastAction.time);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [profiles, sortField, sortDirection]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProfiles = useMemo(() => {
    return sortedProfiles.filter((p) => {
      if (profileScopeFilter !== "all" && p.status !== profileScopeFilter) {
        return false;
      }

      if (engagementFilter !== "all" && p.engagement !== engagementFilter) {
        return false;
      }

      if (tagFilter !== "all") {
        const normalizedTags = p.tags.map((t) => String(t).toLowerCase());
        if (
          tagFilter === "whale" &&
          !normalizedTags.some((t) => t.includes("whale"))
        ) {
          return false;
        }
        if (
          tagFilter === "active-trader" &&
          !normalizedTags.some((t) => t.includes("trader"))
        ) {
          return false;
        }
        if (
          tagFilter === "nft-collector" &&
          !normalizedTags.some((t) => t.includes("collector"))
        ) {
          return false;
        }
      }

      if (normalizedQuery.length === 0) return true;
      const name = p.name.toLowerCase();
      const email = p.email.toLowerCase();
      const wallet = p.wallet.toLowerCase();
      return (
        name.includes(normalizedQuery) ||
        email.includes(normalizedQuery) ||
        wallet.includes(normalizedQuery)
      );
    });
  }, [
    engagementFilter,
    normalizedQuery,
    profileScopeFilter,
    sortedProfiles,
    tagFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [engagementFilter, normalizedQuery, profileScopeFilter, tagFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProfiles.length / itemsPerPage)
  );
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const aggregatedStats = useMemo(() => {
    const scored = profiles.filter((p) => typeof p.healthScore === "number");
    const totalHealth = scored.reduce(
      (sum, p) => sum + (p.healthScore as number),
      0
    );
    const avgHealth =
      scored.length > 0 ? Math.round(totalHealth / scored.length) : 0;
    const activeCount = scored.filter(
      (p) => (p.healthScore as number) >= 70
    ).length;
    const coolingCount = scored.filter((p) => {
      const v = p.healthScore as number;
      return v >= 40 && v < 70;
    }).length;
    const coldCount = scored.filter(
      (p) => (p.healthScore as number) < 40
    ).length;
    const engagementTrend = Math.round(
      (activeCount / Math.max(1, scored.length)) * 100 - 50
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

  const handleRowClick = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedProfiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProfiles.map((p) => p.id));
    }
  };

  const handleSelectOne = (id: string) => {
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
        [
          p.name,
          p.email,
          p.wallet,
          p.chain,
          typeof p.healthScore === "number" ? String(p.healthScore) : "",
          p.status,
        ].join(",")
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
      <main className="flex-1 overflow-auto" aria-busy={showPureLoading}>
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Audience
              </h1>
              {!showPureLoading && (
                <p className="mt-1 text-muted-foreground">
                  {(typeof overviewQuery.data?.total === "number"
                    ? overviewQuery.data.total
                    : profiles.length) || 0}{" "}
                  profiles in your audience
                </p>
              )}
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

          <AnimatePresence mode="wait" initial={false}>
            {showPureLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <AudienceTableSkeleton />
              </motion.div>
            ) : profilesQuery.isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="mx-2 rounded-2xl border border-border bg-card px-6 py-16 text-center md:mx-0"
              >
                <div className="text-sm text-muted-foreground">
                  Failed to load audience.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <>
                  <div className="mx-2 mb-6 flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 md:mx-0">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-indigo-500" />
                      <p className="text-sm text-foreground">
                        <span className="font-medium">
                          Advanced segmentation
                        </span>
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className={filterTriggerClassName}
                          >
                            <span>
                              {profileScopeFilter === "all"
                                ? "All Profiles"
                                : profileScopeFilter === "verified"
                                  ? "Verified"
                                  : profileScopeFilter === "pending"
                                    ? "Pending"
                                    : "Unverified"}
                            </span>
                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                        >
                          <DropdownMenuRadioGroup
                            value={profileScopeFilter}
                            onValueChange={(value) =>
                              setProfileScopeFilter(
                                value as
                                  | "all"
                                  | "verified"
                                  | "pending"
                                  | "unverified"
                              )
                            }
                          >
                            <DropdownMenuRadioItem value="all">
                              All Profiles
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="verified">
                              Verified
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="pending">
                              Pending
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="unverified">
                              Unverified
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className={filterTriggerClassName}
                          >
                            <span>
                              {engagementFilter === "all"
                                ? "All engagement"
                                : engagementFilter === "active"
                                  ? "Active"
                                  : engagementFilter === "cooling"
                                    ? "Cooling"
                                    : "Cold"}
                            </span>
                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                        >
                          <DropdownMenuRadioGroup
                            value={engagementFilter}
                            onValueChange={(value) =>
                              setEngagementFilter(
                                value as "all" | "active" | "cooling" | "cold"
                              )
                            }
                          >
                            <DropdownMenuRadioItem value="all">
                              All
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="active">
                              Active
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="cooling">
                              Cooling
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="cold">
                              Cold
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className={filterTriggerClassName}
                          >
                            <span>
                              {tagFilter === "all"
                                ? "All tags"
                                : tagFilter === "whale"
                                  ? "Whale"
                                  : tagFilter === "active-trader"
                                    ? "Active Trader"
                                    : "NFT Collector"}
                            </span>
                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                        >
                          <DropdownMenuRadioGroup
                            value={tagFilter}
                            onValueChange={(value) =>
                              setTagFilter(
                                value as
                                  | "all"
                                  | "whale"
                                  | "active-trader"
                                  | "nft-collector"
                              )
                            }
                          >
                            <DropdownMenuRadioItem value="all">
                              All tags
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="whale">
                              Whale
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="active-trader">
                              Active Trader
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="nft-collector">
                              NFT Collector
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {sortedProfiles.length === 0 ? (
                    <div className="mx-2 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center md:mx-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                        <UserPlus className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-foreground">
                        No profiles yet
                      </h2>
                      <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        Import your audience or add your first profile to start
                        segmenting and sending campaigns.
                      </p>
                      <Link
                        href="/audience/import-export"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                      >
                        <UserPlus className="h-4 w-4" aria-hidden="true" />
                        Add Profile
                      </Link>
                    </div>
                  ) : (
                    <div className="mx-2 rounded-xl border border-border bg-card shadow-md md:mx-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border bg-muted/30">
                              <th className="w-12 px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedIds.length ===
                                      paginatedProfiles.length &&
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
                            variants={{
                              initial: { opacity: 0 },
                              animate: {
                                opacity: 1,
                                transition: {
                                  staggerChildren: 0.04,
                                },
                              },
                            }}
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
                                      onChange={() =>
                                        handleSelectOne(profile.id)
                                      }
                                      className="h-4 w-4 rounded border-border"
                                    />
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                                        style={{
                                          backgroundColor: `hsl(${hashHue(profile.id)}, 70%, 50%)`,
                                        }}
                                      >
                                        {profile.name.startsWith("0x")
                                          ? "W"
                                          : profile.name
                                              .split(" ")
                                              .filter((n) => n.length > 0)
                                              .slice(0, 2)
                                              .map((n) => n[0])
                                              .join("")
                                              .toUpperCase()}
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
                                          {profile.email.length > 0
                                            ? profile.email
                                            : "No email"}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="hidden px-4 py-4 sm:table-cell">
                                    <div className="flex items-center gap-2">
                                      {profile.wallet.length > 0 ? (
                                        <code
                                          className="w-24 text-sm text-muted-foreground"
                                          title={profile.walletFull}
                                        >
                                          {profile.wallet}
                                        </code>
                                      ) : (
                                        <span className="text-sm text-muted-foreground">
                                          No wallet
                                        </span>
                                      )}
                                      {profile.walletFull?.length > 0 && (
                                        <button
                                          type="button"
                                          className="rounded border border-border bg-card p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            void navigator.clipboard.writeText(
                                              String(profile.walletFull)
                                            );
                                          }}
                                          aria-label="Copy wallet address"
                                        >
                                          <Copy className="h-3.5 w-3.5" />
                                        </button>
                                      )}
                                      {profile.chain.length > 0 && (
                                        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                                          {profile.chain}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      {typeof profile.healthScore ===
                                      "number" ? (
                                        <span
                                          className={`font-medium ${getHealthColor(profile.healthScore)}`}
                                        >
                                          {profile.healthScore}
                                        </span>
                                      ) : (
                                        <span className="text-sm text-muted-foreground">
                                          Not scored
                                        </span>
                                      )}
                                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                                        <div
                                          className={`h-full rounded-full ${getHealthBarColor(typeof profile.healthScore === "number" ? profile.healthScore : 0)}`}
                                          style={{
                                            width: `${typeof profile.healthScore === "number" ? profile.healthScore : 0}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="hidden px-4 py-4 md:table-cell">
                                    <div>
                                      <p className="text-sm text-foreground">
                                        {profile.lastAction.label.length > 0
                                          ? profile.lastAction.label
                                          : "No recent activity"}
                                      </p>
                                      {profile.lastAction.time.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                          {profile.lastAction.time}
                                        </p>
                                      )}
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
                                      <td
                                        colSpan={5}
                                        className="bg-muted/30 px-4 py-4"
                                      >
                                        <div className="grid gap-4 sm:grid-cols-3">
                                          <div className="rounded-lg border border-border bg-card p-4">
                                            <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                              Activity
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                              <div className="flex items-center gap-2">
                                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-foreground">
                                                  {profile.lastAction.label
                                                    .length > 0
                                                    ? profile.lastAction.label
                                                    : "No recent activity"}
                                                </span>
                                              </div>
                                              {profile.lastAction.time.length >
                                                0 && (
                                                <div className="text-xs text-muted-foreground">
                                                  {profile.lastAction.time}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="rounded-lg border border-border bg-card p-4">
                                            <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                              Attributes
                                            </h4>
                                            {Object.keys(profile.attributes)
                                              .length > 0 ? (
                                              <div className="space-y-2">
                                                {Object.entries(
                                                  profile.attributes
                                                )
                                                  .slice(0, 6)
                                                  .map(([k, v]) => (
                                                    <div
                                                      key={k}
                                                      className="flex items-center justify-between gap-3 text-sm"
                                                    >
                                                      <span className="truncate text-muted-foreground">
                                                        {k}
                                                      </span>
                                                      <span className="truncate font-medium text-foreground">
                                                        {typeof v ===
                                                          "string" ||
                                                        typeof v === "number"
                                                          ? String(v)
                                                          : ""}
                                                      </span>
                                                    </div>
                                                  ))}
                                              </div>
                                            ) : (
                                              <div className="text-sm text-muted-foreground">
                                                No attributes
                                              </div>
                                            )}
                                          </div>
                                          <div className="rounded-lg border border-border bg-card p-4">
                                            <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                              Tags
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                              {profile.tags.map(
                                                (tag: string) => (
                                                  <span
                                                    key={tag}
                                                    className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                                                  >
                                                    {tag}
                                                  </span>
                                                )
                                              )}
                                              {profile.engagement.length >
                                                0 && (
                                                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                  {profile.engagement}{" "}
                                                  Engagement
                                                </span>
                                              )}
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
                          {Math.min(
                            currentPage * itemsPerPage,
                            sortedProfiles.length
                          )}{" "}
                          of {sortedProfiles.length}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
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
                              }
                            )}
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
                  )}

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
                </>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}
