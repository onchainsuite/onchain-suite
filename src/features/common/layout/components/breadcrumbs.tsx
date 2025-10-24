"use client";

import { ChevronRight, Home, type LucideIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { v7 } from "uuid";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = React.memo(function Breadcrumbs({
  items,
  className,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-sm animate-in fade-in-0 slide-in-from-top-1 duration-300",
        className
      )}
    >
      {/* Home icon as first item */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors duration-200 group"
        aria-label="Home"
      >
        <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={v7()}>
            {/* Separator */}
            <ChevronRight className="h-4 w-4 text-sidebar-foreground/40 shrink-0" />

            {/* Breadcrumb item */}
            {isLast || !item.href ? (
              <span
                className={cn(
                  "flex items-center gap-1.5 font-medium",
                  "max-w-[200px] truncate",
                  isLast && "text-sidebar-foreground"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.icon && (
                  <span className="shrink-0">
                    <item.icon className="h-4 w-4" />
                  </span>
                )}
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                  "transition-colors duration-200 group max-w-[200px] truncate"
                )}
              >
                {item.icon && (
                  <span className="shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="h-4 w-4" />
                  </span>
                )}
                <span className="group-hover:underline underline-offset-4">
                  {item.label}
                </span>
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
});
