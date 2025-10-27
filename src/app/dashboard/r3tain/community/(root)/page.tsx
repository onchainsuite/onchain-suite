import { Suspense } from "react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";
import { CommunityDashboard } from "@/r3tain/community/pages";

const crumbs = [{ label: "Community", href: PRIVATE_ROUTES.R3TAIN.COMMUNITY }];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <CommunityDashboard />
      </Suspense>
    </DashboardLayout>
  );
}
