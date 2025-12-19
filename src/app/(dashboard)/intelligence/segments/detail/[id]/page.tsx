import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { SegmentDetailPage } from "@/features/intelligence/components/segments/detail";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.INTELLIGENCE_SEGMENT(1), label: "Segments" },
];

export default async function SegmentDetailPages() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <SegmentDetailPage />
    </DashboardLayout>
  );
}
