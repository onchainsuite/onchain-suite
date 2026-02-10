import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

import { ProfileDetailPage } from "@/features/audience/components";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.AUDIENCE, label: "Audience" },
];

export default async function ProfilesDataCreated() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <ProfileDetailPage />
    </DashboardLayout>
  );
}
