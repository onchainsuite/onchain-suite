import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { VersionedSegmentsPage } from "@/onchain/segments/pages";

const crumbs = [
  { label: "Segments", href: PRIVATE_ROUTES.ONCHAIN.SEGMENTS },
  { label: "Versioned", href: PRIVATE_ROUTES.ONCHAIN.SEGMENTS_VERSIONED },
];

export default function VersionedSegments() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <VersionedSegmentsPage />
    </DashboardLayout>
  );
}
