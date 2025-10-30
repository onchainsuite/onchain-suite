import { PRIVATE_ROUTES } from "@/config/app-routes";

import { ProfilesPage } from "@/3ridge/profiles/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Profiles", href: PRIVATE_ROUTES.BRIDGE.PROFILES.ROOT },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <ProfilesPage />
    </DashboardLayout>
  );
}
