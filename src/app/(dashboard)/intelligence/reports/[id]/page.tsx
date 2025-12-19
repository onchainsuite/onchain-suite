import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";
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
