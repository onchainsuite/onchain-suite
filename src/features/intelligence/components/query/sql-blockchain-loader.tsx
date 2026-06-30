"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const HEX = "0123456789abcdef";

const makeHash = (length = 10) =>
  Array.from(
    { length },
    () => HEX[Math.floor(Math.random() * HEX.length)]
  ).join("");

const PHASES = [
  {
    key: "parse",
    label: "Parsing SQL",
    detail: "Tokenizing and validating the statement.",
  },
  {
    key: "plan",
    label: "Planning query",
    detail: "Choosing indexes and the cheapest read path.",
  },
  {
    key: "scan",
    label: "Scanning ledger",
    detail: "Streaming matching rows from org-scoped tables.",
  },
  {
    key: "seal",
    label: "Sealing results",
    detail: "Hashing the result set into a stable block.",
  },
] as const;

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
};

/**
 * SqlBlockchainLoader
 * A "thinking" blockchain animation shown while a SQL query executes.
 * Blocks are mined left-to-right, linked by a flowing connector, while the
 * active execution phase cycles beneath. Purely presentational.
 */
export function SqlBlockchainLoader({
  query,
  className = "",
}: {
  query?: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [sealed, setSealed] = useState(reduced ? 4 : 0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [hashes, setHashes] = useState<string[]>(() =>
    Array.from({ length: 4 }, () => makeHash())
  );

  const totalBlocks = 4;

  useEffect(() => {
    if (reduced) {
      setSealed(totalBlocks);
      setPhaseIndex(PHASES.length - 1);
      return;
    }
    const blockTimer = window.setInterval(() => {
      setSealed((prev) => {
        const next = prev + 1;
        if (next > totalBlocks) {
          setHashes(Array.from({ length: totalBlocks }, () => makeHash()));
          return 1;
        }
        return next;
      });
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 850);
    return () => window.clearInterval(blockTimer);
  }, [reduced]);

  // Continuously shuffle the hash of the block currently being mined.
  useEffect(() => {
    if (reduced) return;
    const flicker = window.setInterval(() => {
      setHashes((prev) => {
        const idx = Math.min(sealed, totalBlocks - 1);
        const next = [...prev];
        next[idx] = makeHash();
        return next;
      });
    }, 110);
    return () => window.clearInterval(flicker);
  }, [reduced, sealed]);

  const phase = PHASES[phaseIndex] ?? PHASES[0];
  const queryPreview = useMemo(() => {
    const q = (query ?? "").replace(/\s+/g, " ").trim();
    if (q.length === 0) return "Running your statement against org data.";
    return q.length > 96 ? `${q.slice(0, 96)}…` : q;
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      role="status"
      aria-live="polite"
      aria-label="Running SQL query"
      className={`relative overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-[0_30px_90px_-50px_rgba(66,118,255,0.7)] ${className}`}
    >
      {/* grid + glow backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(122,140,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(122,140,255,0.16)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="ocs-anim-float-glow pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
      <div className="ocs-anim-float-glow pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-secondary/30 blur-3xl [animation-delay:1.2s]" />

      <div className="relative p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary/85">
              Onchain Suite
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">
              Sealing your query into a block
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
            <span className="ocs-anim-think-pulse inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Executing
          </span>
        </div>

        {/* Blockchain track */}
        <div className="relative mt-5 flex items-stretch gap-0 overflow-hidden">
          {Array.from({ length: totalBlocks }).map((_, i) => {
            const isSealed = i < sealed;
            const isActive =
              i === Math.min(sealed, totalBlocks - 1) && !reduced;
            return (
              <div key={i} className="flex flex-1 items-center">
                <motion.div
                  className={`relative w-full rounded-lg border p-2.5 ${
                    isSealed
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-muted/40"
                  }`}
                  animate={
                    isSealed && !reduced
                      ? { boxShadow: "0 0 0 1px rgba(96,129,255,0.25)" }
                      : {}
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      #{i + 1}
                    </span>
                    {isSealed ? (
                      <span className="text-[9px] font-medium text-primary">
                        ✓ sealed
                      </span>
                    ) : (
                      <span className="text-[9px] text-muted-foreground/60">
                        pending
                      </span>
                    )}
                  </div>
                  <div
                    className={`mt-1.5 truncate font-mono text-[10px] ${
                      isActive
                        ? "ocs-anim-hash-flicker text-primary"
                        : isSealed
                          ? "text-primary/80"
                          : "text-muted-foreground/40"
                    }`}
                  >
                    0x{hashes[i] ?? "··········"}
                  </div>
                </motion.div>
                {i < totalBlocks - 1 ? (
                  <div className="relative mx-1 h-[2px] w-5 shrink-0 overflow-hidden rounded-full bg-muted">
                    {i < sealed ? (
                      <div className="ocs-anim-chain-flow absolute inset-0 [background-image:linear-gradient(90deg,transparent,rgba(96,129,255,0.9),transparent)]" />
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Active phase */}
        <div className="mt-5 rounded-xl border border-border bg-muted/40 p-3.5">
          <div className="flex items-center gap-2">
            <span className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="ocs-anim-think-pulse inline-block h-1.5 w-1.5 rounded-full bg-primary"
                  style={{ animationDelay: `${d * 0.18}s` }}
                />
              ))}
            </span>
            <span className="text-sm font-medium text-foreground">
              {phase.label}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
            {phase.detail}
          </p>
          <div className="mt-3 truncate rounded-md border border-border bg-muted px-2.5 py-1.5 font-mono text-[11px] text-primary/80">
            {queryPreview}
          </div>
        </div>
      </div>

      {/* scan line */}
      {!reduced ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10">
          <div className="ocs-anim-scan h-px w-full bg-[linear-gradient(90deg,transparent,rgba(96,129,255,0.8),transparent)]" />
        </div>
      ) : null}
    </motion.div>
  );
}

export default SqlBlockchainLoader;
