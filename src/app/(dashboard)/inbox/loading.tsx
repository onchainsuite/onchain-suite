"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.INBOX, label: "Inbox" },
];

export default function Loading() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="space-y-3">
            <Skeleton className="h-9 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="ml-auto h-8 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
