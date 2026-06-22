"use client";

import {
  AnalyticsDownIcon,
  AnalyticsUpIcon,
  ArrowDown01Icon,
  BotIcon,
  Calendar01Icon,
  Mail01Icon,
  Search01Icon,
  SentIcon,
  SparklesIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

import { isJsonObject } from "@/lib/utils";

import { intelligenceService } from "../../intelligence.service";

type ReportType = "email" | "automation" | "unknown";
type ReportStatus = "active" | "completed" | "paused" | "unknown";

type UiReport = {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  revenueChange: string;
  conversions?: number;
  exitRate?: number;
  topTrigger?: string;
};

const asNumber = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim().length > 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const asString = (v: unknown): string => (typeof v === "string" ? v : "");

const formatDate = (v: unknown): string => {
  const raw = asString(v);
  if (raw.length > 0) return raw;
  const n = asNumber(v);
  if (n === null) return "—";
  const d = new Date(n);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
};

const normalizeRate = (v: unknown): number => {
  const n = asNumber(v);
  if (n === null) return 0;
  if (n <= 1 && n >= 0) return Math.round(n * 100);
  return Math.round(n);
};

const formatMoneyChange = (v: unknown): string => {
  if (typeof v === "string" && v.trim().length > 0) return v;
  const n = asNumber(v);
  if (n === null) return "—";
  const dollars = Math.round(n);
  if (dollars >= 1000) {
    const k = Math.round((dollars / 1000) * 10) / 10;
    return `+$${k}k`;
  }
  return `+$${dollars.toLocaleString()}`;
};

const toUiReport = (input: unknown): UiReport | null => {
  if (!isJsonObject(input)) return null;
  const r = input as Record<string, unknown>;
  const id =
    asString(r.id) ||
    asString(r.reportId) ||
    asString(r.campaignId) ||
    asString(r.campaign_id);
  if (id.length === 0) return null;

  const name =
    asString(r.name) ||
    asString(r.title) ||
    asString(r.subject) ||
    `Report ${id}`;

  const typeRaw =
    asString(r.type) || asString(r.kind) || asString(r.reportType);
  const type: ReportType =
    typeRaw === "email"
      ? "email"
      : typeRaw === "automation"
        ? "automation"
        : "unknown";

  const statusRaw =
    asString(r.status) || asString(r.state) || asString(r.reportStatus);
  const status: ReportStatus =
    statusRaw === "active"
      ? "active"
      : statusRaw === "completed"
        ? "completed"
        : statusRaw === "paused"
          ? "paused"
          : "unknown";

  const sentDate =
    formatDate(r.sentDate) ||
    formatDate(r.sentAt) ||
    formatDate(r.createdAt) ||
    "—";

  const recipients =
    asNumber(r.recipients) ??
    asNumber(r.recipientCount) ??
    asNumber(r.audienceSize) ??
    0;

  const openRate = normalizeRate(r.openRate ?? r.open_rate ?? r.openRatio);
  const clickRate = normalizeRate(r.clickRate ?? r.click_rate ?? r.clickRatio);

  const revenueChange = formatMoneyChange(
    r.revenueChange ?? r.revenue_change ?? r.revenueUsd ?? r.revenue
  );

  const conversions = asNumber(r.conversions ?? r.conversionCount) ?? undefined;
  const exitRate = normalizeRate(r.exitRate ?? r.exit_rate);
  const topTrigger =
    asString(r.topTrigger ?? r.trigger ?? r.top_trigger) || undefined;

  return {
    id,
    name,
    type,
    status,
    sentDate,
    recipients,
    openRate,
    clickRate,
    revenueChange,
    conversions,
    exitRate: exitRate > 0 ? exitRate : undefined,
    topTrigger,
  };
};

interface ReportsTabProps {
  setActiveTab: (tab: string) => void;
}

export function ReportsTab({ setActiveTab }: ReportsTabProps) {
  const filterTriggerClassName =
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20";

  const [reportSearch, setReportSearch] = useState("");
  const [reportDateRange, setReportDateRange] = useState<"30d" | "all">("30d");
  const [reportTypeFilter, setReportTypeFilter] = useState<
    "all" | "email" | "automation"
  >("all");
  const [reportStatusFilter, setReportStatusFilter] = useState<
    "all" | "active" | "completed" | "paused"
  >("all");

  const normalizedSearch = reportSearch.trim();

  const reportsQuery = useQuery({
    queryKey: ["intelligence", "reports", { search: normalizedSearch }],
    queryFn: async () => {
      const res = await intelligenceService.listReports({
        search: normalizedSearch.length > 0 ? normalizedSearch : undefined,
        page: 1,
        limit: 100,
      });
      const root = Array.isArray(res)
        ? res
        : ((res as { items?: unknown[] }).items ?? []);
      const items = Array.isArray(root) ? root : [];
      return items.map(toUiReport).filter((r): r is UiReport => !!r);
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const metricsQuery = useQuery({
    queryKey: ["intelligence", "reports", "metrics"],
    queryFn: () => intelligenceService.getReportsMetrics(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const summaryQuery = useQuery({
    queryKey: ["intelligence", "reports", "summary"],
    queryFn: () => intelligenceService.getReportsSummary(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const filtersQuery = useQuery({
    queryKey: ["intelligence", "reports", "filters"],
    queryFn: () => intelligenceService.getReportsFilters(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const filteredReports = useMemo(() => {
    const source = reportsQuery.data ?? [];
    return source.filter((report) => {
      const matchesSearch = report.name
        .toLowerCase()
        .includes(reportSearch.toLowerCase());
      const matchesType =
        reportTypeFilter === "all" || report.type === reportTypeFilter;
      const matchesStatus =
        reportStatusFilter === "all" || report.status === reportStatusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reportSearch, reportStatusFilter, reportTypeFilter, reportsQuery.data]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">Reports</span>{" "}
          <span className="font-medium text-foreground">
            {typeof (metricsQuery.data as Record<string, unknown> | undefined)
              ?.reportsCount === "number"
              ? String(
                  (metricsQuery.data as { reportsCount: number }).reportsCount
                )
              : (filteredReports.length ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">Summary</span>{" "}
          <span className="font-medium text-foreground">
            {typeof (summaryQuery.data as Record<string, unknown> | undefined)
              ?.summary === "string"
              ? String((summaryQuery.data as { summary: string }).summary)
              : "—"}
          </span>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">Filters</span>{" "}
          <span className="font-medium text-foreground">
            {filtersQuery.data ? "Loaded" : "—"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search reports..."
            value={reportSearch}
            onChange={(e) => setReportSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={filterTriggerClassName}>
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>
                  {reportDateRange === "30d" ? "Last 30 days" : "All time"}
                </span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
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
                value={reportDateRange}
                onValueChange={(value) =>
                  setReportDateRange(value === "all" ? "all" : "30d")
                }
              >
                <DropdownMenuRadioItem value="30d">
                  Last 30 days
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="all">
                  All time
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={filterTriggerClassName}>
                <span>
                  Type:{" "}
                  {reportTypeFilter === "all"
                    ? "All"
                    : reportTypeFilter === "email"
                      ? "Email"
                      : "Automation"}
                </span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
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
                value={reportTypeFilter}
                onValueChange={(value) =>
                  setReportTypeFilter(value as "all" | "email" | "automation")
                }
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="email">
                  Email
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="automation">
                  Automation
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={filterTriggerClassName}>
                <span>
                  Status:{" "}
                  {reportStatusFilter === "all"
                    ? "All"
                    : reportStatusFilter === "active"
                      ? "Active"
                      : reportStatusFilter === "completed"
                        ? "Completed"
                        : "Paused"}
                </span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
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
                value={reportStatusFilter}
                onValueChange={(value) =>
                  setReportStatusFilter(
                    value as "all" | "active" | "completed" | "paused"
                  )
                }
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="active">
                  Active
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed">
                  Completed
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="paused">
                  Paused
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {reportsQuery.isFetching ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              <HugeiconsIcon
                icon={SentIcon}
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Loading reports…
            </h3>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              <HugeiconsIcon
                icon={SentIcon}
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No intelligence reports yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {reportsQuery.error
                ? String(
                    reportsQuery.error instanceof Error
                      ? reportsQuery.error.message
                      : "Failed to load reports"
                  )
                : "Run your first campaign or automation to start tracking opens, clicks, and revenue attribution here."}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("query")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <HugeiconsIcon
                icon={SparklesIcon}
                className="h-4 w-4"
                aria-hidden="true"
              />
              Run a query
            </button>
          </div>
        ) : (
          <>
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
                            <HugeiconsIcon
                              icon={Mail01Icon}
                              className="h-4 w-4"
                            />
                          ) : (
                            <HugeiconsIcon icon={BotIcon} className="h-4 w-4" />
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
                            {report.type === "automation" &&
                              report.topTrigger && (
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
                            {report.exitRate ?? "—"}% exited
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
                          <HugeiconsIcon
                            icon={AnalyticsUpIcon}
                            className="h-3.5 w-3.5 text-secondary"
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={AnalyticsDownIcon}
                            className="h-3.5 w-3.5 text-destructive"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/intelligence/reports/${report.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_12px_rgba(var(--primary),0.4)]"
                      >
                        <HugeiconsIcon
                          icon={ViewIcon}
                          className="h-3.5 w-3.5"
                        />
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
                          <HugeiconsIcon
                            icon={Mail01Icon}
                            className="h-5 w-5"
                          />
                        ) : (
                          <HugeiconsIcon icon={BotIcon} className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {report.name}
                        </p>
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
                      <p className="text-xs text-muted-foreground">
                        Recipients
                      </p>
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
                      <p className="text-xs text-muted-foreground">
                        Click Rate
                      </p>
                      <p className="font-medium">{report.clickRate}%</p>
                    </div>
                  </div>
                  <Link
                    href={`/intelligence/reports/${report.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                  >
                    <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                    View Report
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
