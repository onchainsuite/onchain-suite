"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { NestedSubmenu } from "./nested-submenu";

interface SubmenuItem {
  title: string;
  href: string;
  badge?: string;
  submenu?: {
    title: string;
    href: string;
  }[];
}

interface SubmenuPanelProps {
  title: string;
  items: SubmenuItem[];
  isCollapsed: boolean;
  position: { top: number; maxHeight: number };
  expandedItems: Set<string>;
  onToggleNested: (title: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

export const SubmenuPanel = React.memo(function SubmenuPanel({
  title,
  items,
  isCollapsed,
  position,
  expandedItems,
  onToggleNested,
  onMouseEnter,
  onMouseLeave,
  panelRef,
}: SubmenuPanelProps) {
  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed z-[60] w-64 rounded-lg border border-sidebar-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 duration-200",
        isCollapsed ? "left-[4.5rem]" : "left-[17rem]"
      )}
      style={{ top: `${position.top}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="p-2 overflow-y-auto"
        style={{ maxHeight: `${position.maxHeight}px` }}
      >
        <div className="mb-2 px-2 py-1 text-xs font-semibold text-muted-foreground">
          {title}
        </div>
        <ul className="space-y-1">
          {items.map((item) =>
            item.submenu ? (
              <NestedSubmenu
                key={item.title}
                item={item}
                isExpanded={expandedItems.has(item.title)}
                onToggle={() => onToggleNested(item.title)}
              />
            ) : (
              <li key={item.title}>
                <a
                  href={item.href}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </a>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
});
