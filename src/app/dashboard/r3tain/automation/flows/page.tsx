import { Suspense } from "react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AllFlowsPage } from "@/r3tain/automation/flows";
import { AllFlowsPageSkeleton } from "@/r3tain/automation/flows/components";

const crumbs = [
  { label: "Automation", href: PRIVATE_ROUTES.R3TAIN.AUTOMATION },
  { label: "All Flows", href: PRIVATE_ROUTES.R3TAIN.FLOWS },
];

const AutomationFlowsPage = () => {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AllFlowsPageSkeleton />}>
        <AllFlowsPage />
      </Suspense>
    </DashboardLayout>
  );
};

export default AutomationFlowsPage;
