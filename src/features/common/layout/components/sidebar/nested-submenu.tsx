"use client";

import { ChevronDown, Info } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface NestedSubmenuProps {
  item: {
    title: string;
    href: string;
    submenu?: {
      title: string;
      href: string;
    }[];
  };
  isExpanded: boolean;
  onToggle: () => void;
}

export const NestedSubmenu = React.memo(function NestedSubmenu({
  item,
  isExpanded,
  onToggle,
}: NestedSubmenuProps) {
  return (
    <li>
      <div>
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {item.title}
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </button>
        {isExpanded && item.submenu && (
          <ul className="mt-1 space-y-1 border-l-2 border-border pl-3 animate-in slide-in-from-top-2 duration-200">
            {item.submenu.map((nestedItem) => (
              <li key={nestedItem.title}>
                <a
                  href={nestedItem.href}
                  className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {nestedItem.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
});
