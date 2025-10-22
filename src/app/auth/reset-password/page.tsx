"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AnimatedLoading } from "@/components/loading";

import AuthContainer from "@/auth/pages";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AnimatedLoading />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <AuthContainer
      initialView="reset-password"
      resetToken={token ?? undefined}
    />
  );
}
