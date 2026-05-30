"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.INTELLIGENCE, label: "Intelligence" },
  { href: "", label: "Report" },
];

export default function Loading() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="ml-auto h-9 w-28" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-44" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
