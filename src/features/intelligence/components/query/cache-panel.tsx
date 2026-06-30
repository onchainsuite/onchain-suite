"use client";

import {
  CheckIcon,
  ChevronUpIcon,
  CircleStackIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { isJsonObject } from "@/lib/utils";

import { intelligenceService } from "../../intelligence.service";

interface CacheRow {
  id: string;
  chain: string;
  resourceType: string;
  subjectAddress: string;
  summary: string;
  totalRows: number | null;
  latencyMs: number | null;
  freshUntil: string;
  staleUntil: string;
  fetchedAt: string;
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

const truncate = (a: string) =>
  a.length <= 14 ? a : `${a.slice(0, 6)}…${a.slice(-4)}`;

const timeAgo = (iso: string): string => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const s = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
};

function freshness(row: CacheRow): {
  label: string;
  cls: string;
} {
  const now = Date.now();
  const fresh = new Date(row.freshUntil).getTime();
  const stale = new Date(row.staleUntil).getTime();
  if (Number.isFinite(fresh) && now < fresh)
    return {
      label: "Fresh",
      cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  if (Number.isFinite(stale) && now < stale)
    return {
      label: "Stale",
      cls: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  return {
    label: "Expired",
    cls: "border-border bg-muted text-muted-foreground",
  };
}

function CacheRowCard({ row }: { row: CacheRow }) {
  const [copied, setCopied] = useState(false);
  const fr = freshness(row);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(row.subjectAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium capitalize text-primary">
          {row.resourceType || "data"}
        </span>
        <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {row.chain}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${fr.cls}`}
        >
          {fr.label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={row.subjectAddress}
        >
          {copied ? (
            <CheckIcon className="h-3 w-3 text-primary" aria-hidden="true" />
          ) : (
            <ClipboardDocumentIcon className="h-3 w-3" aria-hidden="true" />
          )}
          {truncate(row.subjectAddress)}
        </button>
      </div>
      {row.summary ? (
        <p className="mt-2 text-xs text-foreground">{row.summary}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {row.totalRows !== null ? (
          <span className="font-medium text-foreground">
            {row.totalRows.toLocaleString()} rows
          </span>
        ) : null}
        {row.latencyMs !== null ? <span>{row.latencyMs}ms</span> : null}
        {row.fetchedAt ? <span>cached {timeAgo(row.fetchedAt)}</span> : null}
      </div>
    </div>
  );
}

/**
 * Cached on-chain data — surfaces the GoldRush cache (populated by MCP /
 * enrichment) so users can see fetched on-chain results even when the SQL
 * tables (`user_onchain_metrics`, ...) haven't been materialized yet. Only
 * renders when the org has cache entries.
 */
export function CachePanel() {
  const [open, setOpen] = useState(true);

  const cacheQuery = useQuery({
    queryKey: ["intelligence", "query", "cache", { page: 1, limit: 20 }],
    queryFn: () => intelligenceService.listQueryCache({ page: 1, limit: 20 }),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  const rows = useMemo<CacheRow[]>(() => {
    const list = Array.isArray(cacheQuery.data?.data)
      ? cacheQuery.data.data
      : [];
    return list
      .map((entry): CacheRow | null => {
        if (!isJsonObject(entry)) return null;
        const id = str(entry.id);
        const sub = str(entry.subjectAddress);
        if (!id || !sub) return null;
        const rs = isJsonObject(entry.responseSummary)
          ? entry.responseSummary
          : {};
        return {
          id,
          chain: str(entry.chain),
          resourceType: str(entry.resourceType),
          subjectAddress: sub,
          summary: str(rs.summary),
          totalRows: num(rs.totalRows) ?? num(rs.returnedRows),
          latencyMs: num(entry.latencyMs),
          freshUntil: str(entry.freshUntil),
          staleUntil: str(entry.staleUntil),
          fetchedAt: str(entry.fetchedAt),
        };
      })
      .filter((r): r is CacheRow => r !== null);
  }, [cacheQuery.data]);

  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/40">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
      >
        <CircleStackIcon className="h-4 w-4 text-primary" aria-hidden="true" />
        <span className="text-sm font-medium text-foreground">
          Cached on-chain data
        </span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {rows.length}
        </span>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          from GoldRush enrichment
        </span>
        <ChevronUpIcon
          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform duration-300 ${
            open ? "" : "rotate-180"
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-2.5 p-4 pt-1 sm:grid-cols-2">
            {rows.map((r) => (
              <CacheRowCard key={r.id} row={r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CachePanel;
