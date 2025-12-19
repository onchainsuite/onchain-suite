import { getAuthSession } from "@/lib/guard";
import { getFullName } from "@/lib/utils";

import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { MainDashboard } from "@/features/dashboard/page";

export const dynamic = "force-dynamic";

function toTitleName(email?: string): string | undefined {
  if (!email) return undefined;
  const [local] = email.split("@");
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

export default async function DashboardPage() {
  const session = await getAuthSession();
  const firstLast = getFullName(
    session?.user?.firstName,
    session?.user?.lastName
  );
  const fullName =
    session?.user?.name ??
    (firstLast && firstLast.length > 0
      ? firstLast
      : toTitleName(session?.user?.email));
  const timezone = session?.user?.timezone;

  const userData = {
    projectName: "YieldFarm DAO",
    userType: "DeFi" as const,
    trialDaysLeft: 7,
    isNewUser: !!session?.user?.isNewUser,
    subscriptionTier: "free_trial" as const,
    fullName,
    timezone,
  };
  return (
    <DashboardLayout>
      <MainDashboard userData={userData} />
    </DashboardLayout>
  );
}
