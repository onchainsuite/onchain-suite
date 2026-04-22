import { headers } from "next/headers";

import { getAuthSession } from "@/lib/guard";
import { getFullName } from "@/lib/utils";

import { NewUserFlow } from "@/features/campaigns/components/new-user";
import { CampaignsListsView } from "@/features/campaigns/pages";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

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

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const forwardedProto = headersList.get("x-forwarded-proto") ?? "http";
  const forwardedHost =
    headersList.get("x-forwarded-host") ?? headersList.get("host");
  const inferredBase = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : null;

  const appBase =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    inferredBase ??
    "http://localhost:3000";
  const appClean = appBase.replace(/\/$/, "");

  let campaignsCount = 0;
  try {
    const res = await fetch(`${appClean}/api/v1/campaigns?page=1&limit=1`, {
      headers: { Cookie: cookie },
      cache: "no-store",
    });

    if (res.ok) {
      const json: any = await res.json();
      const totalRaw =
        json?.total ??
        json?.meta?.total ??
        json?.data?.total ??
        json?.data?.meta?.total ??
        json?.data?.pagination?.total ??
        json?.pagination?.total;
      const total = Number(totalRaw);

      if (Number.isFinite(total)) {
        campaignsCount = total;
      } else {
        const list =
          json?.items ??
          json?.data?.items ??
          json?.data ??
          json?.data?.data ??
          json;
        const arr = Array.isArray(list) ? list : [];
        campaignsCount = arr.length;
      }
    }
  } catch (_e) {
    String(_e);
  }

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
