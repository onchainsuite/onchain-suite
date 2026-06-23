"use client";

import { Add01Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";

import {
  type ProtocolTemplate,
  protocolTemplateFamilies,
  protocolTemplates,
} from "@/features/automation/data/protocol-templates";

interface ProtocolTemplatesListProps {
  onApply: (template: ProtocolTemplate) => void;
  applyingId?: string | null;
}

const stepSummary = (template: ProtocolTemplate) => {
  const counts = { email: 0, wait: 0, branch: 0 };
  const walk = (steps: ProtocolTemplate["steps"]) => {
    for (const s of steps) {
      if (s.kind === "email") counts.email += 1;
      else if (s.kind === "wait") counts.wait += 1;
      else if (s.kind === "branch") {
        counts.branch += 1;
        walk(s.yes);
        walk(s.no);
      }
    }
  };
  walk(template.steps);
  const parts: string[] = [];
  if (counts.email) parts.push(`${counts.email} email${counts.email > 1 ? "s" : ""}`);
  if (counts.wait) parts.push(`${counts.wait} wait${counts.wait > 1 ? "s" : ""}`);
  if (counts.branch) parts.push(`${counts.branch} branch`);
  return parts.join(" · ");
};

export const ProtocolTemplatesList = ({
  onApply,
  applyingId,
}: ProtocolTemplatesListProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Protocol playbooks
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Onchain-native automations that work out of the box. Pick one and we&apos;ll
          build a ready-to-run flow you can tweak.
        </p>
      </div>

      {protocolTemplateFamilies.map((family) => {
        const templates = protocolTemplates.filter(
          (t) => t.family === family.id
        );
        if (templates.length === 0) return null;
        return (
          <section key={family.id} className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${family.accent} text-lg`}
                aria-hidden="true"
              >
                {family.icon}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {family.label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {family.description}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => {
                const isApplying = applyingId === template.id;
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div
                      className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br ${family.accent} opacity-40`}
                    />
                    <div className="relative flex items-start justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-xl">
                        {template.icon}
                      </span>
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        ~{template.estimatedReach.toLocaleString()} wallets
                      </span>
                    </div>

                    <h4 className="relative mt-4 font-semibold text-foreground">
                      {template.name}
                    </h4>
                    <p className="relative mt-1 line-clamp-3 text-sm text-muted-foreground">
                      {template.description}
                    </p>

                    <div className="relative mt-3 flex flex-wrap gap-1.5">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="relative mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      <span>{stepSummary(template)}</span>
                      <button
                        type="button"
                        disabled={isApplying}
                        onClick={() => onApply(template)}
                        className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/90 disabled:opacity-50"
                      >
                        {isApplying ? (
                          <HugeiconsIcon
                            icon={Loading02Icon}
                            className="h-3.5 w-3.5 animate-spin"
                          />
                        ) : (
                          <HugeiconsIcon icon={Add01Icon} className="h-3.5 w-3.5" />
                        )}
                        {isApplying ? "Creating…" : "Use template"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProtocolTemplatesList;
