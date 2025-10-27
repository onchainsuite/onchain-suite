"use client";

import { useRouter } from "next/navigation";

import { AUTH_ROUTES } from "@/config/app-routes";
import { useSession } from "@/lib/auth-client";

import {
  LoadingSkeleton,
  NewUserDashboard,
  ReturningUserDashboard,
} from "@/r3tain/overview/components";

export function R3tainDashboardPageContent() {
  const { data: session, isPending } = useSession();
  const { push } = useRouter();

  if (isPending) return <LoadingSkeleton />;
  // Show onboarding dashboard for first-time users
  if (!session?.user) {
    push(AUTH_ROUTES.LOGIN);
    return;
  }

  if (session.user.isNewUser) {
    return <NewUserDashboard user={session.user} />;
  } else {
    return <ReturningUserDashboard />;
  }
}
