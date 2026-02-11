"use client";

import {
  Brain,
  LayoutDashboard,
  Mail,
  Megaphone,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { DashboardHeader } from "./dashboard-header";
import { DashboardNavbar } from "./dashboard-navbar";
import { OrganizationStatusBanner } from "./organization-status-banner";
import { initialNotifications } from "@/data/notifications";
import { PRIVATE_ROUTES } from "@/shared/config/app-routes";

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
  const { data: session } = authClient.useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fullName =
    userFullName ?? (isMounted ? session?.user?.name : undefined) ?? undefined;
  const userId = isMounted ? (session?.user?.id ?? undefined) : undefined;
  const imageUrl = isMounted ? (session?.user?.image ?? undefined) : undefined;

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
        userFullName={fullName}
        userId={userId}
        userImageUrl={imageUrl}
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
        <OrganizationStatusBanner />
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 md:p-4 md:px-15">
          {children}
        </main>
      </div>
    </div>
  );
}
