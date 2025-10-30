import { PRIVATE_ROUTES } from "@/config/app-routes";

import { OAuthPage } from "@/3ridge/3ridge-auth/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [{ label: "Oauth", href: PRIVATE_ROUTES.BRIDGE.AUTH.OAUTH }];

export default function OAuth() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <OAuthPage />
    </DashboardLayout>
  );
}
