"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Calendar,
  Eye,
  Mail,
  Search,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export const reportsData = [
  {
    id: "1",
    name: "Your Pudgy Whales Win-back",
    type: "email",
    status: "completed",
    sentDate: "Dec 2, 2025",
    recipients: 714,
    openRate: 68,
    clickRate: 24,
    revenue: 45200,
    revenueChange: "+$45.2k",
  },
  {
    id: "2",
    name: "Your Base Users Welcome",
    type: "automation",
    status: "active",
    sentDate: "Nov 28, 2025",
    recipients: 2341,
    openRate: 72,
    clickRate: 31,
    revenue: 89400,
    revenueChange: "+$89.4k",
    conversions: 412,
    entries: 2341,
    exits: 1847,
    exitRate: 79,
    topTrigger: "On-chain purchase",
    topTriggerRevenue: 68,
  },
  {
    id: "3",
    name: "Your DeFi Users Alert",
    type: "email",
    status: "completed",
    sentDate: "Nov 25, 2025",
    recipients: 1892,
    openRate: 54,
    clickRate: 18,
    revenue: 23100,
    revenueChange: "+$23.1k",
  },
  {
    id: "4",
    name: "Your NFT Collectors Drop",
    type: "email",
    status: "completed",
    sentDate: "Nov 22, 2025",
    recipients: 3241,
    openRate: 62,
    clickRate: 28,
    revenue: 67800,
    revenueChange: "+$67.8k",
  },
  {
    id: "5",
    name: "Your Dormant Users Re-engage",
    type: "automation",
    status: "active",
    sentDate: "Nov 18, 2025",
    recipients: 892,
    openRate: 45,
    clickRate: 12,
    revenue: 18400,
    revenueChange: "+$18.4k",
    conversions: 89,
    entries: 892,
    exits: 634,
    exitRate: 71,
    topTrigger: "90-day inactive",
    topTriggerRevenue: 54,
  },
  {
    id: "6",
    name: "Your Multi-chain Users Promo",
    type: "automation",
    status: "active",
    sentDate: "Nov 15, 2025",
    recipients: 4521,
    openRate: 71,
    clickRate: 34,
    revenue: 124500,
    revenueChange: "+$124.5k",
    conversions: 847,
    entries: 4521,
    exits: 3892,
    exitRate: 86,
    topTrigger: "Portfolio change >10%",
    topTriggerRevenue: 72,
  },
  {
    id: "7",
    name: "Your Whale Alert",
    type: "automation",
    status: "active",
    sentDate: "Nov 10, 2025",
    recipients: 1247,
    openRate: 78,
    clickRate: 45,
    revenue: 156800,
    revenueChange: "+$156.8k",
    conversions: 324,
    entries: 1247,
    exits: 892,
    exitRate: 72,
    topTrigger: "Wallet balance >$50k",
    topTriggerRevenue: 82,
  },
];

interface ReportsTabProps {
  setActiveTab: (tab: string) => void;
}

export function ReportsTab({ setActiveTab }: ReportsTabProps) {
  const [reportSearch, setReportSearch] = useState("");
  const [reportTypeFilter, setReportTypeFilter] = useState<
    "all" | "email" | "automation"
  >("all");
  const [reportStatusFilter, setReportStatusFilter] = useState<
    "all" | "active" | "completed" | "paused"
  >("all");

  const filteredReports = useMemo(() => {
    return reportsData.filter((report) => {
      const matchesSearch = report.name
        .toLowerCase()
        .includes(reportSearch.toLowerCase());
      const matchesType =
        reportTypeFilter === "all" || report.type === reportTypeFilter;
      const matchesStatus =
        reportStatusFilter === "all" || report.status === reportStatusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reportSearch, reportTypeFilter, reportStatusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={reportSearch}
            onChange={(e) => setReportSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last 30 days</span>
          </div>
          <select
            value={reportTypeFilter}
            onChange={(e) =>
              setReportTypeFilter(
                e.target.value as "all" | "email" | "automation"
              )
            }
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="automation">Automation</option>
          </select>
          <select
            value={reportStatusFilter}
            onChange={(e) =>
              setReportStatusFilter(
                e.target.value as "all" | "active" | "completed" | "paused"
              )
            }
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full hidden md:table">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sent
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recipients
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Open Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Click Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Conv / Exits
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Revenue
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredReports.map((report, index) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="transition-colors hover:bg-secondary/30"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        report.type === "email"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {report.type === "email" ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {report.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                            report.type === "email"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          {report.type === "email" ? "Email" : "Automation"}
                        </span>
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                            report.status === "active"
                              ? "bg-secondary/10 text-secondary"
                              : report.status === "completed"
                                ? "bg-secondary text-muted-foreground"
                                : "bg-accent/10 text-accent-foreground"
                          }`}
                        >
                          {report.status}
                        </span>
                        {report.type === "automation" && report.topTrigger && (
                          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs bg-accent/10 text-accent-foreground">
                            <Zap className="h-3 w-3" />
                            {report.topTrigger}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {report.sentDate}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-foreground">
                    {report.recipients.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${report.openRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-primary">
                      {report.openRate}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">
                    {report.clickRate}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  {report.type === "automation" && report.conversions ? (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-secondary">
                        {report.conversions.toLocaleString()} conv
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {report.exitRate}% exited
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-secondary">
                      {report.revenueChange}
                    </span>
                    {report.revenueChange.includes("+") ? (
                      <TrendingUp className="h-3.5 w-3.5 text-secondary" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/intelligence/reports/${report.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_12px_rgba(var(--primary),0.4)]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Report
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <div className="md:hidden divide-y divide-border">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      report.type === "email"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    {report.type === "email" ? (
                      <Mail className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.sentDate}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-secondary">
                  {report.revenueChange}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Recipients</p>
                  <p className="font-medium">
                    {report.recipients.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                  <p className="font-medium text-secondary">
                    {report.openRate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Click Rate</p>
                  <p className="font-medium">{report.clickRate}%</p>
                </div>
              </div>
              <Link
                href={`/intelligence/reports/${report.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                <Eye className="h-4 w-4" />
                View Report
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredReports.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary/10 to-secondary/10">
            <Send className="h-10 w-10 text-primary/50" />
          </div>
          <h3 className="text-xl font-medium text-foreground">
            No campaigns sent yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first campaign to start tracking opens, clicks, and
            revenue attribution
          </p>
          <button
            onClick={() => setActiveTab("query")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            Create your first campaign
          </button>
        </motion.div>
      )}
    </div>
  );
}
