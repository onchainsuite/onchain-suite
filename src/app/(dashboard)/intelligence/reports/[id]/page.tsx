import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { ReportDetailPage } from "@/features/intelligence/components/reports/detail";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.INTELLIGENCE_REPORTS, label: "Report" },
];

export default async function ReportPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <ReportDetailPage />
    </DashboardLayout>
  );
}
