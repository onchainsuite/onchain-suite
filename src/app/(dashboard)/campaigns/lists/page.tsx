import { CampaignsListsView } from "@/features/campaigns/pages";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export const dynamic = "force-dynamic";

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
