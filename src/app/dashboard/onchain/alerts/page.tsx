import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AlertsPage } from "@/onchain/alerts/page";

const crumbs = [{ label: "Alerts", href: PRIVATE_ROUTES.ONCHAIN.ALERTS }];

export default function Alerts() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <AlertsPage />
    </DashboardLayout>
  );
}
