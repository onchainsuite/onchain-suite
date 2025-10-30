import { PRIVATE_ROUTES } from "@/config/app-routes";

import { BiometricPage } from "@/3ridge/3ridge-auth/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Biometrics", href: PRIVATE_ROUTES.BRIDGE.AUTH.BIOMETRIC },
];

export default function Biometric() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <BiometricPage />
    </DashboardLayout>
  );
}
