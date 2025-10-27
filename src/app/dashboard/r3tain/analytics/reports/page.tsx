import { Suspense } from "react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { ReportsPage } from "@/r3tain/analytics/reports/page";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";

const crumbs = [
  { label: "Analytics", href: PRIVATE_ROUTES.R3TAIN.ANALYTICS },
  { label: "Reports", href: PRIVATE_ROUTES.R3TAIN.REPORTS },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <ReportsPage />
      </Suspense>
    </DashboardLayout>
  );
}
