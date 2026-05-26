import { ProtectedLayout } from "@/lib/guard";

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
      {children}
    </ProtectedLayout>
  );
}
