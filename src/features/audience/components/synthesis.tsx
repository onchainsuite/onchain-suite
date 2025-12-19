"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Link2,
  Mail,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 animate-spin text-secondary" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-destructive" />;
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen gap-2 bg-background p-2 md:gap-4 md:p-4"
    >
      <main className="flex-1 py-10">
        {/* Header */}
        <div className="mb-8 px-2 pt-4 md:px-0 md:pt-6">
          <Link
            href="/audience"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Audience
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Wallet-Email Synthesis
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Connect blockchain wallet addresses with email identities to
                create unified customer profiles.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRerunMatching}
                disabled={isRerunning}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <RotateCcw
                  className={`h-4 w-4 ${isRerunning ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">
                  {isRerunning ? "Re-running..." : "Re-run matching"}
                </span>
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Synthesis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-2 mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:mx-0">
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
              className="rounded-lg border border-border bg-card p-4 shadow-md transition-all hover:shadow-lg"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-semibold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="mx-2 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center md:mx-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
        <div className="mx-2 space-y-4 md:mx-0">
          {filteredQueue.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-md transition-all hover:bg-emerald-500/5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.email}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>

                <Link2 className="hidden h-4 w-4 text-muted-foreground sm:block" />

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">
                    {item.wallet}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {item.matchScore && (
                  <span className="text-sm font-medium text-green-500">
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
          <div className="mx-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 md:mx-0">
            <Link2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">
              No synthesis jobs found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start a new synthesis to match wallets with emails
            </p>
          </div>
        )}
      </main>
    </motion.div>
  );
}
