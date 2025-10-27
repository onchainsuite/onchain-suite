import { Suspense } from "react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";
import { SegmentManager } from "@/r3tain/segment/page";

const crumbs = [
  { label: "Community", href: PRIVATE_ROUTES.R3TAIN.COMMUNITY },
  { label: "Segments", href: PRIVATE_ROUTES.R3TAIN.SEGMENTS },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <SegmentManager />
      </Suspense>
    </DashboardLayout>
  );
}
