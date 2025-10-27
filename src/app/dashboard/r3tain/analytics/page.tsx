import { Suspense } from "react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { MarketingDashboard } from "@/r3tain/analytics/dashboard/page";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";

const crumbs = [{ label: "Analytics", href: PRIVATE_ROUTES.R3TAIN.ANALYTICS }];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <MarketingDashboard />
      </Suspense>
    </DashboardLayout>
  );
}
