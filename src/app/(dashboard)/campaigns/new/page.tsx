import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";
import { CreateCampaignPage } from "@/features/campaigns/pages";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.CAMPAIGNS, label: "Campaigns" },
];

export default function NewCampaignPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <CreateCampaignPage />
    </DashboardLayout>
  );
}
