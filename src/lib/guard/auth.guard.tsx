import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { getSession } from "@/lib/auth-session";

// Types
interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  requireRole?: string;
}

// Re-export Session type if needed or define a compatible one
// Using the one from auth-session implies we get what the API returns
interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    // Add other properties as needed, matching what backend returns
    [key: string]: any;
  };
}

// 1. Server Component Guard
export async function AuthGuard({
  children,
  redirectTo = "/",
  requireRole,
}: AuthGuardProps) {
  const session = await getSession();

  // No session - redirect to login
  if (!session) {
    redirect(redirectTo);
  }

  // Role-based access control (optional)
  if (requireRole && session.user.role !== requireRole) {
    redirect("/unauthorized");
  }

  // Session is valid, render children
  return <>{children}</>;
}

export const ProtectedLayout = AuthGuard;

// 2. Higher-Order Function for Pages
export function withAuth<T extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<T & { session: Session }>,
  options: { redirectTo?: string; requireRole?: string } = {}
) {
  return async function AuthenticatedComponent(props: T) {
    const session = await getSession();

    if (!session) {
      redirect(options.redirectTo ?? "/");
    }

    if (options.requireRole && session.user.role !== options.requireRole) {
      redirect("/unauthorized");
    }

    return <WrappedComponent {...props} session={session as unknown as Session} />;
  };
}

// 3. Auth Hook for Session Data
export async function getAuthSession() {
  return await getSession();
}

// 4. Auth Action (for Server Actions)
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return session;
}
