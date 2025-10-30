import { PRIVATE_ROUTES } from "@/config/app-routes";

import { EmailAuthPage } from "@/3ridge/3ridge-auth/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [{ label: "Email", href: PRIVATE_ROUTES.BRIDGE.AUTH.EMAIL }];

export default function Email() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <EmailAuthPage />
    </DashboardLayout>
  );
}
