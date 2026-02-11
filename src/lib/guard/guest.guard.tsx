import { redirect } from "next/navigation";
import { type ComponentType, type JSX, type ReactNode } from "react";

import { getSession } from "@/lib/auth-session";

import { PRIVATE_ROUTES } from "@/shared/config/app-routes";

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
    [key: string]: any;
  };
}

// 1. Guest Guard Component - Redirects authenticated users
export async function GuestGuard({
  children,
  redirectTo = PRIVATE_ROUTES.DASHBOARD,
}: GuestGuardProps): Promise<JSX.Element> {
  const session = await getSession();

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
  redirectTo = PRIVATE_ROUTES.DASHBOARD
) {
  return async function GuestOnlyComponent(props: P): Promise<JSX.Element> {
    const session = await getSession();

    if (session?.user) {
      redirect(redirectTo);
    }

    return <WrappedComponent {...props} />;
  };
}

// 3. Guest Layout - Protects entire auth section
export async function GuestLayout({
  children,
  redirectTo = PRIVATE_ROUTES.DASHBOARD,
}: GuestGuardProps): Promise<JSX.Element> {
  const session = await getSession();

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
    const session = await getSession();

    return {
      shouldRedirect: !!session?.user,
      session: session as unknown as Session,
    };
  } catch (error) {
    console.error("Failed to check auth status:", error);
    return {
      shouldRedirect: false,
      session: null,
    };
  }
}
