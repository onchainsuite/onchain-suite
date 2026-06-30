"use client";

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { PageHeader } from "@/shared/components/page/page-header";

const synthesisQueue = [
  {
    id: 1,
    email: "john@example.com",
    wallet: "0x1111...2222",
    status: "completed",
    matchScore: 98,
    date: "2 hours ago",
  },
  {
    id: 2,
    email: "jane@example.com",
    wallet: "0x3333...4444",
    status: "processing",
    matchScore: null,
    date: "5 mins ago",
  },
  {
    id: 3,
    email: "bob@example.com",
    wallet: "0x5555...6666",
    status: "failed",
    matchScore: null,
    date: "1 hour ago",
  },
  {
    id: 4,
    email: "alice@example.com",
    wallet: "0x7777...8888",
    status: "completed",
    matchScore: 85,
    date: "3 hours ago",
  },
  {
    id: 5,
    email: "charlie@example.com",
    wallet: "0x9999...0000",
    status: "completed",
    matchScore: 92,
    date: "1 day ago",
  },
  {
    id: 6,
    email: "diana@example.com",
    wallet: "0xaaaa...bbbb",
    status: "pending",
    matchScore: null,
    date: "Just now",
  },
];

export default function SynthesisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<
    "all" | "completed" | "processing" | "failed" | "pending"
  >("all");
  const [isRerunning, setIsRerunning] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircleIcon
            className="h-4 w-4 text-primary"
            aria-hidden="true"
          />
        );
      case "processing":
        return (
          <ArrowPathIcon
            className="h-4 w-4 animate-spin text-secondary"
            aria-hidden="true"
          />
        );
      case "pending":
        return (
          <ClockIcon className="h-4 w-4 text-amber-500" aria-hidden="true" />
        );
      default:
        return (
          <ExclamationCircleIcon
            className="h-4 w-4 text-destructive"
            aria-hidden="true"
          />
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-primary/10 text-primary",
      processing: "bg-secondary/10 text-secondary",
      pending: "bg-amber-500/10 text-amber-600",
      failed: "bg-destructive/10 text-destructive",
    };
    return styles[status] || styles.failed;
  };

  const filteredQueue = synthesisQueue.filter((item) => {
    const matchesSearch =
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wallet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: synthesisQueue.length,
    completed: synthesisQueue.filter((i) => i.status === "completed").length,
    processing: synthesisQueue.filter((i) => i.status === "processing").length,
    failed: synthesisQueue.filter((i) => i.status === "failed").length,
  };

  const handleRerunMatching = () => {
    setIsRerunning(true);
    setTimeout(() => {
      setIsRerunning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/audience"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Back to Audience
      </Link>

      <PageHeader
        title="Wallet-Email Synthesis"
        description="Connect wallet addresses with email identities into unified profiles."
        actions={
          <>
            <button
              onClick={handleRerunMatching}
              disabled={isRerunning}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <ArrowUturnLeftIcon
                className={`h-4 w-4 ${isRerunning ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {isRerunning ? "Re-running..." : "Re-run matching"}
              </span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">New Synthesis</span>
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          {
            label: "Completed",
            value: stats.completed,
            color: "text-primary",
          },
          {
            label: "Processing",
            value: stats.processing,
            color: "text-secondary",
          },
          { label: "Failed", value: stats.failed, color: "text-destructive" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/20"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search by email or wallet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          {(
            ["all", "completed", "processing", "pending", "failed"] as const
          ).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-3 py-2 text-sm capitalize transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:bg-accent"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Queue */}
      <div className="space-y-3">
        {filteredQueue.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-3">
                <EnvelopeIcon
                  className="h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-foreground">{item.email}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>

              <LinkIcon
                className="hidden h-4 w-4 text-muted-foreground sm:block"
                aria-hidden="true"
              />

              <div className="flex items-center gap-3">
                <WalletIcon
                  className="h-5 w-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">
                  {item.wallet}
                </code>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {item.matchScore && (
                <span className="text-sm font-medium text-primary">
                  {item.matchScore}% match
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusBadge(item.status)}`}
              >
                {getStatusIcon(item.status)}
                {item.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredQueue.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <LinkIcon
            className="mb-4 h-10 w-10 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-lg font-medium text-foreground">
            No synthesis jobs found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start a new synthesis to match wallets with emails
          </p>
        </div>
      )}
    </div>
  );
}
