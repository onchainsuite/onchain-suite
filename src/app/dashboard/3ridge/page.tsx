import { PRIVATE_ROUTES } from "@/config/app-routes";

import { BridgeOverview } from "@/3ridge/overview/page";
import { DashboardLayout } from "@/common/layout";

const crumbs = [{ label: "Overview", href: PRIVATE_ROUTES.BRIDGE.ROOT }];

export default function BridgeOverviewPage() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <BridgeOverview />
    </DashboardLayout>
  );
}
