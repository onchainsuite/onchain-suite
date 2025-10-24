"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

interface NavItemProps {
  title: string;
  icon: LucideIcon;
  href?: string;
  isActive?: boolean;
  isCollapsed: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  itemRef?: (el: HTMLLIElement | null) => void;
  isFocused?: boolean;
}

export const NavItem = React.memo(function NavItem({
  title,
  icon: Icon,
  href,
  isActive,
  isCollapsed,
  hasSubmenu,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  itemRef,
  isFocused,
}: NavItemProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (isFocused && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isFocused]);

  const buttonContent = (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      tabIndex={isFocused ? 0 : -1}
      aria-current={isActive ? "page" : undefined}
      aria-expanded={hasSubmenu ? "false" : undefined}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        isCollapsed && "justify-center"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 text-sidebar-foreground/70 transition-colors group-hover:text-sidebar-accent-foreground",
          isActive && "text-sidebar-accent-foreground"
        )}
      />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left text-sidebar-foreground">
            {title}
          </span>
          {hasSubmenu && (
            <ChevronRight className="h-4 w-4 text-sidebar-foreground/50" />
          )}
        </>
      )}
    </button>
  );

  return (
    <li ref={itemRef} className="relative">
      <TooltipProvider>
        {isCollapsed && !hasSubmenu ? (
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {title}
            </TooltipContent>
          </Tooltip>
        ) : (
          buttonContent
        )}
      </TooltipProvider>
    </li>
  );
});
