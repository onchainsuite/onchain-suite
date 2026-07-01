"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// 30-min slots, 9:00 AM → 5:30 PM
const SLOTS: { h: number; m: number }[] = [];
for (let h = 9; h <= 17; h++) {
  for (const m of [0, 30]) {
    if (h === 17 && m === 30) continue;
    SLOTS.push({ h, m });
  }
}

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function fmtSlot(h: number, m: number) {
  const ap = h < 12 ? "AM" : "PM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, "0")} ${ap}`;
}

/**
 * Interactive date + time picker. Emits an ISO string via onChange once both a
 * day and a time slot are chosen. Client-only (gated on mount) to avoid any
 * SSR/CSR date mismatch.
 */
export function DateTimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const selected = value ? new Date(value) : null;
  const [view, setView] = useState<Date>(() =>
    startOfMonth(
      selected && !Number.isNaN(selected.getTime()) ? selected : new Date()
    )
  );
  const [day, setDay] = useState<Date | null>(
    selected && !Number.isNaN(selected.getTime())
      ? new Date(
          selected.getFullYear(),
          selected.getMonth(),
          selected.getDate()
        )
      : null
  );

  if (!mounted) {
    return (
      <div
        className="skel h-[204px] w-full rounded-xl"
        aria-hidden="true"
        style={{ background: "var(--line-2)" }}
      />
    );
  }

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // negative values are leading blanks (unique keys), positives are day numbers
  const cells: number[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(-1 - i);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const canPrev = startOfMonth(view) > startOfMonth(today);

  const pickDay = (d: number) => {
    const nd = new Date(year, month, d);
    setDay(nd);
    // if a time was already chosen, keep it and re-emit for the new date
    if (selected && !Number.isNaN(selected.getTime())) {
      const nsel = new Date(nd);
      nsel.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      onChange(nsel.toISOString());
    }
  };
  const pickTime = (h: number, m: number) => {
    if (!day) return;
    const nsel = new Date(day);
    nsel.setHours(h, m, 0, 0);
    onChange(nsel.toISOString());
  };

  const selValid = selected && !Number.isNaN(selected.getTime());

  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        {/* calendar */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => setView(new Date(year, month - 1, 1))}
              aria-label="Previous month"
              className="rounded-lg p-1 t-muted transition-colors hover:text-[color:var(--ink)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-[13px] font-semibold t-ink">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setView(new Date(year, month + 1, 1))}
              aria-label="Next month"
              className="rounded-lg p-1 t-muted transition-colors hover:text-[color:var(--ink)]"
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="mono text-[10px] t-muted2">
                {w[0]}
              </span>
            ))}
            {cells.map((cell) => {
              if (cell < 0) return <span key={cell} />;
              const d = cell;
              const date = new Date(year, month, d);
              const past = date < today;
              const isSel = day !== null && sameDay(date, day);
              const isToday = sameDay(date, today);
              return (
                <button
                  key={`d-${d}`}
                  type="button"
                  disabled={past}
                  onClick={() => pickDay(d)}
                  className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[12.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                  style={
                    isSel
                      ? {
                          background: "var(--acc)",
                          color: "#fff",
                          fontWeight: 600,
                        }
                      : isToday
                        ? {
                            color: "var(--acc)",
                            fontWeight: 600,
                            boxShadow:
                              "inset 0 0 0 1px color-mix(in oklab, var(--acc) 40%, transparent)",
                          }
                        : { color: "var(--ink-2)" }
                  }
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* time slots */}
        <AnimatePresence mode="wait">
          {day ? (
            <motion.div
              key={day.toDateString()}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t pt-3 sm:w-[128px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0"
              style={{ borderColor: "var(--line-2)" }}
            >
              <div className="mb-2 text-[11px] font-medium t-muted">
                {day.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="grid max-h-[164px] grid-cols-3 gap-1.5 overflow-auto pr-1 sm:grid-cols-1">
                {SLOTS.map(({ h, m }) => {
                  const on =
                    selValid &&
                    day !== null &&
                    sameDay(selected as Date, day) &&
                    (selected as Date).getHours() === h &&
                    (selected as Date).getMinutes() === m;
                  return (
                    <button
                      key={`${h}-${m}`}
                      type="button"
                      onClick={() => pickTime(h, m)}
                      className="rounded-lg border px-2 py-1.5 text-[12px] font-medium transition-colors"
                      style={
                        on
                          ? {
                              borderColor: "var(--acc)",
                              background: "var(--acc)",
                              color: "#fff",
                            }
                          : {
                              borderColor: "var(--line)",
                              color: "var(--muted)",
                            }
                      }
                    >
                      {fmtSlot(h, m)}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden items-center justify-center text-[12px] t-muted2 sm:flex sm:w-[128px]"
            >
              Pick a day →
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DateTimePicker;
