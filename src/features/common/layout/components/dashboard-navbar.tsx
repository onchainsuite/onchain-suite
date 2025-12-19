"use client";

import { Lock, Unlock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { PRIVATE_ROUTES } from "@/config/app-routes";
import { useGetLogo } from "@/hooks/client";
import { getInitials } from "@/lib/user-utils";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardNavbarProps {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  navItems: NavItem[];
  activePath: string;
  unreadCount: number;
  isLocked: boolean;
  onToggleLock: () => void;
  userFullName?: string;
}

export function DashboardNavbar({
  isCollapsed,
  setCollapsed,
  navItems,
  activePath,
  unreadCount,
  isLocked,
  onToggleLock,
  userFullName,
}: DashboardNavbarProps) {
  const initials = userFullName ? getInitials(userFullName) : "U";
  const { lightIcon, darkIcon } = useGetLogo();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
      onMouseEnter={() => {
        if (!isLocked) setCollapsed(false);
      }}
      onMouseLeave={() => {
        if (!isLocked) setCollapsed(true);
      }}
    >
      <div
        className={cn(
          "m-3 h-[calc(100%-1.5rem)] rounded-2xl bg-card border border-border",
          "shadow-[0_10px_40px_rgba(34,42,53,0.08),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04)]",
          "backdrop-blur-md",
          "flex flex-col items-center justify-between"
        )}
      >
        <div className="w-full p-4 flex flex-col items-center gap-4">
          <Link
            href={PRIVATE_ROUTES.DASHBOARD}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground"
            )}
          >
            <Image
              src={lightIcon}
              width={20}
              height={20}
              alt="Onchain Logo"
              className="dark:hidden"
            />
            <Image
              src={darkIcon}
              width={20}
              height={20}
              alt="Onchain Logo"
              className="hidden dark:block"
            />
          </Link>

          <TooltipProvider>
            <nav className="mt-2 flex flex-col items-center gap-2 w-full">
              {navItems.map((item) => {
                const active =
                  item.href === PRIVATE_ROUTES.DASHBOARD
                    ? activePath === PRIVATE_ROUTES.DASHBOARD
                    : activePath.startsWith(item.href);
                return (
                  <Tooltip key={`${item.href}-${item.label}`}>
                    <TooltipTrigger asChild>
                      <a
                        href={item.href}
                        className={cn(
                          "relative flex items-center",
                          isCollapsed ? "justify-center" : "justify-start",
                          "gap-3 rounded-full",
                          isCollapsed ? "h-10 w-10" : "h-10 w-full px-3",
                          active
                            ? "bg-accent text-foreground shadow-[0_6px_20px_rgba(34,42,53,0.12)]"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <div className="h-4 w-4">{item.icon}</div>
                        {!isCollapsed && (
                          <span className="text-sm">{item.label}</span>
                        )}
                        {item.label === "Notifications" && unreadCount > 0 && (
                          <span className="absolute right-1 top-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-500" />
                        )}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </TooltipProvider>
        </div>

        <div className="w-full p-4 flex flex-col items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onToggleLock}
            aria-label="Toggle sidebar lock"
            title="Lock sidebar"
          >
            {isLocked ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
          </Button>
          <div className={cn("flex items-center gap-2")}>
            <Avatar className="h-9 w-9 ring-1 ring-border shadow-sm">
              <AvatarImage alt="User avatar" src="/avatar.png" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {!isCollapsed && userFullName && (
              <span className="text-sm font-medium">{userFullName}</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
