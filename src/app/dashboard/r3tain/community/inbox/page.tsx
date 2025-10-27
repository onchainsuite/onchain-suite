import { Suspense } from "react";

import { WorkInProgressPage } from "@/components/meta-components";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";

const crumbs = [
  { label: "Community", href: PRIVATE_ROUTES.R3TAIN.COMMUNITY },
  { label: "Inbox", href: PRIVATE_ROUTES.R3TAIN.INBOX },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <WorkInProgressPage
          featureName="Inbox"
          expectedRelease="Q3 2024"
          description="Manage your inbox with ease and speed"
          progress={30}
        />
      </Suspense>
    </DashboardLayout>
  );
}
