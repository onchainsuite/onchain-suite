"use client";

import { useState } from "react";
import type React from "react";

import { DashboardHeader } from "./dashboard-header";
import { DashboardNavbar } from "./dashboard-navbar";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Brain,
  Settings,
  Zap,
  Mail
} from "lucide-react";

import { cn } from "@/lib/utils";
import { PRIVATE_ROUTES } from "@/config/app-routes";
import { initialNotifications } from "@/data/notifications";

type BreadcrumbItem = { href: string; label: string };

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  userFullName?: string;
}

export const dynamic = "force-dynamic";

export function DashboardLayout({
  children,
  breadcrumbs,
  userFullName,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const pathname = usePathname();
  const unreadCount = initialNotifications.filter((n) => !n.read).length;

  const navItems: { label: string; href: string; icon: React.ReactNode }[] = [
    {
      label: "Dashboard",
      href: PRIVATE_ROUTES.DASHBOARD,
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "Campaigns",
      href: PRIVATE_ROUTES.CAMPAIGNS,
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      label: "Audience",
      href: PRIVATE_ROUTES.AUDIENCE,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Inbox",
      href: PRIVATE_ROUTES.INBOX,
      icon: <Mail className="h-4 w-4" />,
    },
    {
      label: "Automations",
      href: PRIVATE_ROUTES.AUTOMATIONS,
      icon: <Zap className="h-4 w-4" />,
    },
    {
      label: "Intelligence",
      href: PRIVATE_ROUTES.INTELLIGENCE,
      icon: <Brain className="h-4 w-4" />,
    },
    {
      label: "Settings",
      href: PRIVATE_ROUTES.SETTINGS,
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const hasBreadcrumbs = !!breadcrumbs && breadcrumbs.length > 0;

  return (
    <div className="relative min-h-screen">
      <DashboardNavbar
        isCollapsed={isCollapsed}
        setCollapsed={setIsCollapsed}
        navItems={navItems}
        activePath={pathname}
        unreadCount={unreadCount}
        isLocked={isLocked}
        onToggleLock={() => setIsLocked((l) => !l)}
        userFullName={userFullName}
      />

      <div className={cn(isCollapsed ? "pl-20" : "pl-64")}>
        <DashboardHeader
          breadcrumbs={breadcrumbs}
          currentPage={
            breadcrumbs && breadcrumbs.length > 0
              ? breadcrumbs[breadcrumbs.length - 1].label
              : undefined
          }
          setOpen={() => {}}
        />
      </div>

      <div
        className={cn(
          "transition-all duration-300",
          hasBreadcrumbs ? "pt-0" : "pt-0",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 md:p-4 md:px-15">
          {children}
        </main>
      </div>
    </div>
  );
}
