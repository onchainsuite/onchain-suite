import { VerifyAccountView } from "@/features/core/auth/components/verify-account-view";
import { AuthLayout } from "@/features/core/auth/components/shared/auth-layout";

export default function VerifyAccountPage() {
  return (
    <AuthLayout>
      <VerifyAccountView />
    </AuthLayout>
  );
}
