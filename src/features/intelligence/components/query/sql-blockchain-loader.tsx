"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";

const PHASES = [
  "Parsing SQL",
  "Planning query",
  "Scanning rows",
  "Finalizing results",
] as const;

/**
 * SqlBlockchainLoader
 * Minimal loading state shown while a SQL query executes: a spinner, the
 * current phase, and a preview of the running statement.
 */
export function SqlBlockchainLoader({
  query,
  className = "",
}: {
  query?: string;
  className?: string;
}) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, PHASES.length - 1));
    }, 1200);
    return () => window.clearInterval(timer);
  }, []);

  const queryPreview = useMemo(() => {
    const q = (query ?? "").replace(/\s+/g, " ").trim();
    if (q.length === 0) return "Running your statement against org data.";
    return q.length > 96 ? `${q.slice(0, 96)}…` : q;
  }, [query]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Running SQL query"
      className={`rounded-2xl border border-border bg-card p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <ArrowPathIcon
          className="h-4 w-4 shrink-0 animate-spin text-primary motion-reduce:animate-none"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">
            {PHASES[phaseIndex]}
          </div>
          <div className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
            {queryPreview}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SqlBlockchainLoader;
