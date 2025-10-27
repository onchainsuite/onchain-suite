import { Suspense } from "react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";
import { SubscribersPage } from "@/r3tain/community/pages";

const crumbs = [
  { label: "Community", href: PRIVATE_ROUTES.R3TAIN.COMMUNITY },
  { label: "Subscribers", href: PRIVATE_ROUTES.R3TAIN.SUBSCRIBERS },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <SubscribersPage />
      </Suspense>
    </DashboardLayout>
  );
}
