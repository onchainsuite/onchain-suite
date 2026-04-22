"use client";

import { useQuery } from "@tanstack/react-query";
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
import {
  cn,
  getSelectedOrganizationId,
  isOrganizationConfirmed,
} from "@/lib/utils";

import { DashboardHeader } from "./dashboard-header";
import { DashboardNavbar } from "./dashboard-navbar";
import { OrganizationStatusBanner } from "./organization-status-banner";
import { notificationsService } from "@/features/notifications/notifications.service";
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
  const { data: session } = authClient.useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isSwitchingOrg, setIsSwitchingOrg] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    setSelectedOrgId(getSelectedOrganizationId());
  }, [isMounted]);

  useEffect(() => {
    const onStart = (_e: Event) => {
      setIsSwitchingOrg(true);
      setSelectedOrgId(getSelectedOrganizationId());
    };
    const onDone = (_e: Event) => {
      setIsSwitchingOrg(false);
      setSelectedOrgId(getSelectedOrganizationId());
    };
    window.addEventListener("onchain:org-switch-start", onStart);
    window.addEventListener("onchain:org-changed", onDone);
    window.addEventListener("onchain:org-switch-failed", onDone);
    return () => {
      window.removeEventListener("onchain:org-switch-start", onStart);
      window.removeEventListener("onchain:org-changed", onDone);
      window.removeEventListener("onchain:org-switch-failed", onDone);
    };
  }, []);

  const activeOrganizationId = isMounted
    ? (session?.session?.activeOrganizationId ?? null)
    : null;
  const isConfirmedBySession = isMounted
    ? isOrganizationConfirmed(activeOrganizationId)
    : false;
  const hasActiveOrganization =
    isConfirmedBySession || (!!selectedOrgId && !isSwitchingOrg);

  const notificationsQuery = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => notificationsService.list({ page: 1, limit: 50 }),
    enabled: hasActiveOrganization,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const unreadCount = notificationsQuery.isSuccess
    ? notificationsQuery.data.filter((n) => !n.read).length
    : 0;

  const fullName = hasActiveOrganization
    ? (userFullName ?? session?.user?.name ?? undefined)
    : undefined;
  const userId = hasActiveOrganization
    ? (session?.user?.id ?? undefined)
    : undefined;
  const imageUrl = hasActiveOrganization
    ? (session?.user?.image ?? undefined)
    : undefined;

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
        hasActiveOrganization={hasActiveOrganization}
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
          hasActiveOrganization={hasActiveOrganization}
        />
      </div>

      <div
        className={cn(
          "transition-all duration-300",
          hasBreadcrumbs ? "pt-0" : "pt-0",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {hasActiveOrganization ? <OrganizationStatusBanner /> : null}
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 md:p-4 md:px-15">
          {hasActiveOrganization ? (
            children
          ) : (
            <div className="mx-auto mt-8 flex min-h-[62vh] max-w-3xl items-center justify-center">
              <div className="relative w-full overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card/90 via-card/70 to-card/40 p-12 shadow-2xl shadow-primary/10 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_35%)]" />
                <div className="relative flex flex-col items-center gap-4 text-center">
                  <div className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
                    Organization Access Required
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {isSwitchingOrg
                      ? "Switching organization..."
                      : "Please select an organization to continue"}
                  </div>
                  <div className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Choose an organization from the top-right selector to unlock
                    dashboard data, settings, members, reports, and
                    configuration.
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
