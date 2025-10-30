import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { InsightsPage } from "@/onchain/insights/pages";

const crumbs = [{ label: "Insights", href: PRIVATE_ROUTES.ONCHAIN.INSIGHTS }];

export default function Insights() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <InsightsPage />
    </DashboardLayout>
  );
}
