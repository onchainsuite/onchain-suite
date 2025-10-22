"use client";

import { ForgotPasswordForm } from "@/auth/components";
import { AuthLayout } from "@/auth/components/shared";

interface ForgotPasswordPageProps {
  onSwitchToSignIn: () => void;
}

export default function ForgotPasswordPage({
  onSwitchToSignIn,
}: ForgotPasswordPageProps) {
  return (
    <AuthLayout>
      <ForgotPasswordForm onSwitchToSignIn={onSwitchToSignIn} />
    </AuthLayout>
  );
}
