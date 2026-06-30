"use client";

import { motion } from "framer-motion";
import { type ComponentType, type SVGProps } from "react";

import { cn } from "@/lib/utils";

export interface PageTabItem {
  id: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /** Optional small count/badge shown after the label. */
  badge?: string | number;
}

interface PageTabsProps {
  tabs: PageTabItem[];
  value: string;
  onValueChange: (id: string) => void;
  /** Unique id so multiple tab bars don't share the same layout animation. */
  layoutId?: string;
  className?: string;
}

/**
 * Shared animated tab bar for dashboard sections. Plain icons (no colored
 * tiles), a spring-animated active pill, and horizontal scroll on small screens.
 */
export function PageTabs({
  tabs,
  value,
  onValueChange,
  layoutId = "page-tabs-active",
  className,
}: PageTabsProps) {
  return (
    <div className={cn("-mx-1 overflow-x-auto px-1 pb-1", className)}>
      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = value === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onValueChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive ? (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-lg bg-primary shadow-[0_8px_24px_-12px_rgba(86,112,255,0.9)]"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                />
              ) : null}
              {Icon ? (
                <Icon className="relative z-10 h-4 w-4" aria-hidden="true" />
              ) : null}
              <span className="relative z-10">{tab.label}</span>
              {tab.badge !== undefined ? (
                <span
                  className={cn(
                    "relative z-10 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PageTabs;
