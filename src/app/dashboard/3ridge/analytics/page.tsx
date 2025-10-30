import { PRIVATE_ROUTES } from "@/config/app-routes";

import { AnalyticsPage } from "@/3ridge/analytics/page";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Analytics", href: PRIVATE_ROUTES.BRIDGE.ANALYTICS.ROOT },
];

export default function Analytics() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <AnalyticsPage />
    </DashboardLayout>
  );
}
