import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { OnchainOverviewPage } from "@/onchain/overview/pages";

const crumbs = [{ label: "Overview", href: PRIVATE_ROUTES.ONCHAIN.OVERVIEW }];

export default function Overview() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <OnchainOverviewPage />
    </DashboardLayout>
  );
}
