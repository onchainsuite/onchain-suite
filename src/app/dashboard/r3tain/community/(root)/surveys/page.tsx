import { Suspense } from "react";

import { WorkInProgressPage } from "@/components/meta-components";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";

const crumbs = [
  { label: "Community", href: PRIVATE_ROUTES.R3TAIN.COMMUNITY },
  { label: "Surveys", href: PRIVATE_ROUTES.R3TAIN.SURVEYS },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <WorkInProgressPage
          featureName="Surveys"
          expectedRelease="Q3 2024"
          description="Manage your surveys with ease"
          progress={30}
        />
      </Suspense>
    </DashboardLayout>
  );
}
