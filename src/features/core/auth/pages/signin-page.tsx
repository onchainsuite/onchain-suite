"use client";

import { SignInForm } from "@/auth/components";
import { AuthLayout } from "@/auth/components/shared";

interface SignInPageProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

export default function SignInPage({
  onSwitchToSignUp,
  onSwitchToForgotPassword,
}: SignInPageProps) {
  return (
    <AuthLayout>
      <SignInForm
        onSwitchToSignUp={onSwitchToSignUp}
        onSwitchToForgotPassword={onSwitchToForgotPassword}
      />
    </AuthLayout>
  );
}
