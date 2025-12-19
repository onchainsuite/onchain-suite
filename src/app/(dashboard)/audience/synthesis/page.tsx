import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";
import { SynthesisPage } from "@/features/audience/components";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.AUDIENCE, label: "Audience" },
];

export default async function AudienceSynthesisPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <SynthesisPage />
    </DashboardLayout>
  );
}
