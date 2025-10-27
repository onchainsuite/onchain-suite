import { Suspense } from "react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AutomationPageSkeleton } from "@/r3tain/automation/components";
import { TagsPage } from "@/r3tain/tag/page";

const crumbs = [
  { label: "Community", href: PRIVATE_ROUTES.R3TAIN.COMMUNITY },
  { label: "Tags", href: PRIVATE_ROUTES.R3TAIN.TAGS },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <Suspense fallback={<AutomationPageSkeleton />}>
        <TagsPage />
      </Suspense>
    </DashboardLayout>
  );
}
