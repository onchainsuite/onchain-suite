"use client";

import { ResetPasswordForm } from "@/auth/components";
import { AuthLayout } from "@/auth/components/shared";

interface ResetPasswordPageProps {
  token?: string;
  onPasswordReset?: () => void;
}

export default function ResetPasswordPage({
  token,
  onPasswordReset,
}: ResetPasswordPageProps) {
  return (
    <AuthLayout>
      <ResetPasswordForm token={token} onPasswordReset={onPasswordReset} />
    </AuthLayout>
  );
}
