"use client";

import { BoltIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { intelligenceService } from "../intelligence.service";

const compact = (n: number) => {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return `${Math.round(n)}`;
};

// circular progress geometry
const SIZE = 42;
const STROKE = 3.5;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/**
 * Dynamic GoldRush API credit meter, rendered as a compact circular usage ring
 * with the AI/credit icon at its center. The numeric usage, remaining credits
 * and period detail surface on hover. MCP chat + on-chain enrichment consume
 * credits; SQL queries run against your own DB and are free. Refreshes when
 * other intelligence requests invalidate the ["intelligence","credits"] key.
 */
export function CreditMeter() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["intelligence", "credits"],
    queryFn: () => intelligenceService.getCredits(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="h-[42px] w-[42px] animate-pulse rounded-full border border-border bg-card" />
    );
  }
  if (isError || !data) return null;

  const used = Math.max(0, Number(data.used) || 0);
  const limit = Math.max(0, Number(data.limit) || 0);
  const remaining =
    typeof data.remaining === "number"
      ? Math.max(0, data.remaining)
      : Math.max(0, limit - used);
  const percent =
    typeof data.percent === "number"
      ? Math.min(100, Math.max(0, data.percent))
      : limit > 0
        ? Math.min(100, (used / limit) * 100)
        : 0;

  const status =
    data.status === "warn" || data.status === "exceeded" ? data.status : "ok";
  const tone =
    status === "exceeded"
      ? {
          stroke: "stroke-rose-500",
          icon: "text-rose-500",
          ring: "border-rose-500/40",
          text: "text-rose-600 dark:text-rose-400",
        }
      : status === "warn"
        ? {
            stroke: "stroke-amber-500",
            icon: "text-amber-500",
            ring: "border-amber-500/40",
            text: "text-amber-600 dark:text-amber-400",
          }
        : {
            stroke: "stroke-primary",
            icon: "text-primary",
            ring: "border-border",
            text: "text-foreground",
          };

  const dash = (percent / 100) * C;

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`AI credits: ${compact(used)} of ${compact(limit)} used`}
            className={`relative grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border bg-card transition-colors hover:bg-muted/40 ${tone.ring}`}
          >
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="absolute inset-0 -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                strokeWidth={STROKE}
                className="stroke-muted"
              />
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C - dash}`}
                className={`${tone.stroke} transition-[stroke-dasharray] duration-500`}
              />
            </svg>
            <BoltIcon className={`h-4 w-4 ${tone.icon}`} aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[240px] text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">AI credits</span>
            <span className={`font-semibold tabular-nums ${tone.text}`}>
              {compact(used)} / {compact(limit)}
            </span>
          </div>
          <p className="mt-1">
            {status === "exceeded"
              ? "Limit reached — upgrade to continue."
              : `${compact(remaining)} credits remaining this ${data.period}.`}
          </p>
          <p className="mt-1 text-muted-foreground">
            Used by MCP chat and on-chain enrichment. SQL queries run on your
            own data and don&apos;t spend credits.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default CreditMeter;
