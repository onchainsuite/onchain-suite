import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { CampaignDashboard } from "@/r3tain/campaign";

const crumbs = [{ label: "Campaigns", href: PRIVATE_ROUTES.R3TAIN.CAMPAIGNS }];

export default function CampaignsPage() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <CampaignDashboard />
    </DashboardLayout>
  );
}
