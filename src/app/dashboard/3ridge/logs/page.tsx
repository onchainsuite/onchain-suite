import { PRIVATE_ROUTES } from "@/config/app-routes";

import { LogsPage } from "@/3ridge/logs/page";
import { DashboardLayout } from "@/common/layout";

const crumbs = [{ label: "Logs", href: PRIVATE_ROUTES.BRIDGE.LOGS.ROOT }];

export default function BridgeOverviewPage() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <LogsPage />
    </DashboardLayout>
  );
}
