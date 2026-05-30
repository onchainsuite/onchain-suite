"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.INTELLIGENCE, label: "Intelligence" },
  { href: "", label: "Create Segment" },
];

export default function Loading() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="ml-auto h-10 w-40" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
