import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { SegmentsPage } from "@/onchain/segments/pages/segments";

const crumbs = [{ label: "Segments", href: PRIVATE_ROUTES.ONCHAIN.SEGMENTS }];

export default function Segments() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <SegmentsPage />
    </DashboardLayout>
  );
}
