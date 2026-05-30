"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.SETTINGS, label: "Settings" },
];

export default function AccountLoading() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </DashboardLayout>
  );
}
