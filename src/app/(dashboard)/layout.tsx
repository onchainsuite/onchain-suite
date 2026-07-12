import { ProtectedLayout } from "@/lib/guard";

import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { AUTH_ROUTES, PRIVATE_ROUTES } from "@/shared/config/app-routes";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout
      requireOrganization
      redirectTo={`${AUTH_ROUTES.LOGIN}?redirectTo=${encodeURIComponent(PRIVATE_ROUTES.DASHBOARD)}`}
    >
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedLayout>
  );
}
