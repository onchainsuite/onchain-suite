import { PRIVATE_ROUTES } from "@/config/app-routes";

import { WalletsPage } from "@/3ridge/3ridge-auth/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [{ label: "Wallets", href: PRIVATE_ROUTES.BRIDGE.AUTH.WALLETS }];

export default function Wallets() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <WalletsPage />
    </DashboardLayout>
  );
}
