import { PRIVATE_ROUTES } from "@/config/app-routes";

import { MergeToolPage } from "@/3ridge/profiles/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Profiles", href: PRIVATE_ROUTES.BRIDGE.PROFILES.ROOT },
  { label: "Merge Tool", href: PRIVATE_ROUTES.BRIDGE.PROFILES.MERGE },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <MergeToolPage />
    </DashboardLayout>
  );
}
