import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type ComponentType, type JSX, type ReactNode } from "react";

import { privateRoutes } from "@/config/app-routes";
import { auth } from "@/lib/auth";

// Types
interface GuestGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

// 1. Guest Guard Component - Redirects authenticated users
export async function GuestGuard({
  children,
  redirectTo = privateRoutes.home,
}: GuestGuardProps): Promise<JSX.Element> {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  // If user is authenticated, redirect away from auth pages
  if (session?.user) {
    redirect(redirectTo);
  }

  // User is not authenticated, show the auth page
  return <>{children}</>;
}

// 2. Higher-Order Component for Guest Pages
export function withGuestOnly<P extends Record<string, unknown>>(
  WrappedComponent: ComponentType<P>,
  redirectTo = privateRoutes.home
) {
  return async function GuestOnlyComponent(props: P): Promise<JSX.Element> {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as Session | null;

    if (session?.user) {
      redirect(redirectTo);
    }

    return <WrappedComponent {...props} />;
  };
}

// 3. Guest Layout - Protects entire auth section
export async function GuestLayout({
  children,
  redirectTo = privateRoutes.home,
}: GuestGuardProps): Promise<JSX.Element> {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  if (session?.user) {
    redirect(redirectTo);
  }

  return (
    <div className="guest-layout min-h-screen">
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}

// 4. Utility function to check if user should be redirected
export async function shouldRedirectAuthenticated(): Promise<{
  shouldRedirect: boolean;
  session: Session | null;
}> {
  try {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as Session | null;

    return {
      shouldRedirect: !!session?.user,
      session,
    };
  } catch (error) {
    console.error("Failed to check auth status:", error);
    return {
      shouldRedirect: false,
      session: null,
    };
  }
}

// 5. Smart redirect based on user role/onboarding status
interface SmartRedirectOptions {
  defaultRedirect?: string;
  roleRedirects?: Record<string, string>;
  checkOnboarding?: boolean;
  onboardingRedirect?: string;
}

export async function getAuthenticatedUserRedirect(
  options: SmartRedirectOptions = {}
): Promise<string | null> {
  const {
    defaultRedirect = privateRoutes.home,
    roleRedirects = {},
    checkOnboarding = false,
    onboardingRedirect = "/onboarding",
  } = options;

  try {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as (Session & { user: { onboardingCompleted?: boolean } }) | null;

    if (!session?.user) {
      return null; // Not authenticated
    }

    // Check onboarding status
    if (checkOnboarding && !session.user.onboardingCompleted) {
      return onboardingRedirect;
    }

    // Check role-based redirects
    if (session.user.role && roleRedirects[session.user.role]) {
      return roleRedirects[session.user.role];
    }

    // Default redirect
    return defaultRedirect;
  } catch (error) {
    console.error("Failed to determine redirect:", error);
    return null;
  }
}

// 6. Advanced Guest Guard with smart redirect
export async function SmartGuestGuard({
  children,
  options = {},
}: {
  children: ReactNode;
  options?: SmartRedirectOptions;
}): Promise<JSX.Element> {
  const redirectTo = await getAuthenticatedUserRedirect(options);

  if (redirectTo) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
