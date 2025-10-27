import { Suspense } from "react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";
import { AutomationPage } from "@/r3tain/automation/page";

const crumbs = [
  { label: "Automation", href: PRIVATE_ROUTES.R3TAIN.AUTOMATION },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <AutomationPage />;
      </Suspense>
    </DashboardLayout>
  );
}
