import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";
import { getAuthSession } from "@/lib/guard";
import { getFullName } from "@/lib/utils";

import { NewUserFlow } from "@/features/campaigns/components/new-user";
import { CampaignsListsView } from "@/features/campaigns/pages";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.CAMPAIGNS, label: "Campaigns" },
];

export default async function CampaignsListsPage() {
  const session = await getAuthSession();
  const firstLast = getFullName(
    session?.user?.firstName,
    session?.user?.lastName
  );
  const userFullName =
    session?.user?.name ??
    (firstLast && firstLast.length > 0 ? firstLast : undefined);

  // TODO: Implement API call to check if user has campaigns
  // For now, assuming user has campaigns to skip new user flow, or logic based on user profile
  // const campaignsCount = await apiClient.get('/campaigns').then(res => res.data.length).catch(() => 0);
  const campaignsCount = 1; // Mocked to show campaigns list by default

  const shouldShowNewUserFlow =
    !!session?.user?.isNewUser && (campaignsCount as number) === 0;

  if (shouldShowNewUserFlow && session?.user?.id) {
    // TODO: Update user isNewUser status via API
    // await apiClient.put('/user/profile', { isNewUser: false });
  }

  return (
    <DashboardLayout breadcrumbs={breadcrumbs} userFullName={userFullName}>
      {shouldShowNewUserFlow ? <NewUserFlow /> : <CampaignsListsView />}
    </DashboardLayout>
  );
}
