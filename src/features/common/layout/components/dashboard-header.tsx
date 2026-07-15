import {
  NotificationBell,
  SearchTrigger,
  ThemeModeToggle,
} from "@/components/common";
import { useCommandPalette } from "@/components/common/command-palette";

import type { NavItem } from "./dashboard-navbar";
import { MobileNav } from "./mobile-nav";
import { OrganizationSwitcher } from "./organization-switcher";

export const DashboardHeader = ({
  breadcrumbs,
  currentPage,
  hasActiveOrganization = true,
  navItems,
}: {
  breadcrumbs?: { href: string; label: string }[];
  currentPage?: string;
  hasActiveOrganization?: boolean;
  navItems?: NavItem[];
}) => {
  const palette = useCommandPalette();
  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex min-w-0 items-center gap-2">
        {navItems && navItems.length > 0 ? (
          <MobileNav navItems={navItems} />
        ) : null}
        <div className="hidden md:flex items-center gap-2 text-sm">
          {breadcrumbs?.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {typeof crumb.href === "string" && crumb.href.length > 0 ? (
                <a href={crumb.href} className="hover:underline">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
              {index < (breadcrumbs?.length ?? 0) - 1 && (
                <span className="text-muted-foreground">/</span>
              )}
            </span>
          ))}
          {currentPage &&
            currentPage !==
              breadcrumbs?.[(breadcrumbs?.length ?? 0) - 1]?.label && (
              <span className="text-foreground">{currentPage}</span>
            )}
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 px-1 sm:px-4 md:ml-auto">
        <OrganizationSwitcher />
        {hasActiveOrganization ? (
          <SearchTrigger onClick={() => palette.open()} />
        ) : null}
        {hasActiveOrganization ? <NotificationBell /> : null}
        <ThemeModeToggle />
      </div>
    </header>
  );
};
