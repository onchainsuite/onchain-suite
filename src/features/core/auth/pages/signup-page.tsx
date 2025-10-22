"use client";

import { SignUpForm } from "@/auth/components";
import { AuthLayout } from "@/auth/components/shared";

interface SignUpPageProps {
  onSwitchToSignIn: () => void;
}

export default function SignUpPage({ onSwitchToSignIn }: SignUpPageProps) {
  return (
    <AuthLayout>
      <SignUpForm onSwitchToSignIn={onSwitchToSignIn} />
    </AuthLayout>
  );
}
