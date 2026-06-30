"use client";

import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { type Template } from "@/features/automation/types";

interface TemplatesListProps {
  templates: Template[];
  onApply: (template: Template) => void;
}

export const TemplatesList = ({ templates, onApply }: TemplatesListProps) => {
  const [active, setActive] = useState<string>("all");

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of templates) {
      const c = (t.category || "other").trim() || "other";
      map.set(c, (map.get(c) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [templates]);

  const visible = useMemo(
    () =>
      active === "all"
        ? templates
        : templates.filter((t) => (t.category || "other") === active),
    [active, templates]
  );

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <Squares2X2Icon
          className="h-7 w-7 text-muted-foreground"
          aria-hidden="true"
        />
        <h3 className="mt-3 text-base font-semibold text-foreground">
          No saved templates yet
        </h3>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          Templates will appear here as you create and save automation patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* category filter chips (mirror the protocol playbooks) */}
      {categories.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              active === "all"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-muted/40"
            }`}
          >
            <Squares2X2Icon className="h-3.5 w-3.5" aria-hidden="true" />
            All
            <span className="opacity-70">{templates.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setActive(c.name)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                active === c.name
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/40"
              }`}
            >
              {c.name}
              <span className="opacity-70">{c.count}</span>
            </button>
          ))}
        </div>
      ) : null}

      <motion.div
        layout
        className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(14rem,1fr))]"
      >
        {visible.map((template) => (
          <motion.div
            layout
            key={template.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <Squares2X2Icon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
              <span className="rounded-full bg-white dark:bg-card border dark:border-muted/40 px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                {template.category || "other"}
              </span>
            </div>
            <h3 className="mt-2.5 text-sm font-semibold leading-snug text-foreground">
              {template.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {template.description}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                {template.uses.toLocaleString()} uses
              </span>
              <button
                type="button"
                onClick={() => onApply(template)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                Use
                <ArrowRightIcon
                  className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TemplatesList;
