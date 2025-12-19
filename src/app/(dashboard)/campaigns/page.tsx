import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { getAuthSession } from "@/lib/guard";
import { getFullName } from "@/lib/utils";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";
import { prisma } from "@/lib/prisma";
import { NewUserFlow } from "@/features/campaigns/components/new-user";
import { CampaignsListsView } from "@/features/campaigns/pages";

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

  const userId = session?.user?.id;
  const hasUser = !!userId;
  const campaignsCount = hasUser
    ? await prisma.campaign.count({ where: { userId } })
    : 0;

  const shouldShowNewUserFlow =
    !!session?.user?.isNewUser && campaignsCount === 0;

  if (shouldShowNewUserFlow && hasUser) {
    await prisma.user.update({
      where: { id: userId! },
      data: { isNewUser: false },
    });
  }

  return (
    <DashboardLayout breadcrumbs={breadcrumbs} userFullName={userFullName}>
      {shouldShowNewUserFlow ? <NewUserFlow /> : <CampaignsListsView />}
    </DashboardLayout>
  );
}
