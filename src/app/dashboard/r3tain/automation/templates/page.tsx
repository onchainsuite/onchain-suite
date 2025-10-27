import { Suspense } from "react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { FlowTemplatesPage } from "@/r3tain/automation/flow-templates";
import { FlowTemplatesPageSkeleton } from "@/r3tain/automation/flow-templates/components";

const crumbs = [
  { label: "Automation", href: PRIVATE_ROUTES.R3TAIN.AUTOMATION },
  { label: "All Templates", href: PRIVATE_ROUTES.R3TAIN.TEMPLATES },
];

const TemplatesPage = () => {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<FlowTemplatesPageSkeleton />}>
        <FlowTemplatesPage />
      </Suspense>
    </DashboardLayout>
  );
};

export default TemplatesPage;
