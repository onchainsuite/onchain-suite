"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Loader2,
  MousePointer,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { isJsonObject } from "@/lib/utils";

import { intelligenceService } from "../../intelligence.service";

const asNumber = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim().length > 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const asString = (v: unknown): string => (typeof v === "string" ? v : "");

const normalizeRate = (v: unknown): number => {
  const n = asNumber(v);
  if (n === null) return 0;
  if (n <= 1 && n >= 0) return Math.round(n * 100);
  return Math.round(n);
};

const formatDate = (v: unknown): string => {
  const raw = asString(v);
  if (raw.length > 0) return raw;
  const n = asNumber(v);
  if (n === null) return "—";
  const d = new Date(n);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
};

const formatMoney = (v: unknown): string => {
  if (typeof v === "string" && v.trim().length > 0) return v;
  const n = asNumber(v);
  if (n === null) return "—";
  return `$${Math.round(n).toLocaleString()}`;
};

export function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  const queryClient = useQueryClient();

  const reportQuery = useQuery({
    queryKey: ["intelligence", "reports", reportId],
    queryFn: () => intelligenceService.getReport(reportId),
    enabled: typeof reportId === "string" && reportId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const refreshMutation = useMutation({
    mutationFn: async () => intelligenceService.refreshReport(reportId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["intelligence", "reports"],
      });
      await reportQuery.refetch();
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to refresh report";
      window.alert(message);
    },
  });

  const report = reportQuery.data;
  const rec = isJsonObject(report) ? (report as Record<string, unknown>) : {};

  const name =
    asString(rec.name) ||
    asString(rec.title) ||
    asString(rec.subject) ||
    "Report";
  const sentDate =
    formatDate(rec.sentDate) ||
    formatDate(rec.sentAt) ||
    formatDate(rec.createdAt) ||
    "—";
  const status = asString(rec.status) || asString(rec.state) || "—";

  const recipients =
    asNumber(rec.recipients) ??
    asNumber(rec.recipientCount) ??
    asNumber(rec.audienceSize) ??
    0;
  const openRate = normalizeRate(
    rec.openRate ?? rec.open_rate ?? rec.openRatio
  );
  const clickRate = normalizeRate(
    rec.clickRate ?? rec.click_rate ?? rec.clickRatio
  );
  const revenue = formatMoney(rec.revenueUsd ?? rec.revenue);

  if (!report && !reportQuery.isFetching) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Report not found</h2>
        <Link href="/intelligence" className="text-primary hover:underline">
          Back to Intelligence
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/intelligence"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {sentDate}
            </span>
            <span>•</span>
            <span className="capitalize">{status}</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
          >
            {refreshMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Recipients
            </h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {recipients.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Open Rate
            </h3>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-secondary">
              {openRate}%
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Click Rate
            </h3>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{clickRate}%</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Revenue
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">{revenue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
