import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { CampaignsListsView } from "@/features/campaigns/pages";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.CAMPAIGNS, label: "Campaigns" },
];

export default function ListsCampaignPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <CampaignsListsView />
    </DashboardLayout>
  );
}
