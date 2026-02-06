import {
  NotificationBell,
  SearchTrigger,
  ThemeModeToggle,
} from "@/components/common";
import { OrganizationSwitcher } from "./organization-switcher";

export const DashboardHeader = ({
  breadcrumbs,
  currentPage,
  setOpen,
}: {
  breadcrumbs?: { href: string; label: string }[];
  currentPage?: string;
  setOpen?: (open: boolean) => void;
}) => {
  return (
    <header className="bg-background sticky top-0 z-1 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
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
          {currentPage && (
            <span className="text-foreground">{currentPage}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 md:ml-auto">
        <OrganizationSwitcher />
        <SearchTrigger onClick={() => setOpen?.(true)} />
        <NotificationBell />
        <ThemeModeToggle />
      </div>
    </header>
  );
};
