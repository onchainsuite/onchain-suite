import { Suspense } from "react";

import { WorkInProgressPage } from "@/components/meta-components";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";

const crumbs = [
  { label: "Community", href: PRIVATE_ROUTES.R3TAIN.COMMUNITY },
  {
    label: "Subscriber Preferences",
    href: PRIVATE_ROUTES.R3TAIN.SUBSCRIBER_PREFS,
  },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <WorkInProgressPage
          featureName="Subscriber Preferences"
          expectedRelease="Q3 2024"
          description="Manage your subscriber preferences with ease"
          progress={30}
        />
      </Suspense>
    </DashboardLayout>
  );
}
