import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { auth } from "@/lib/auth"; // Your Better Auth instance

// Types
interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  requireRole?: string;
}

interface Session {
  user: {
    id: string;
    email: string;
    role?: string;
    isNewUser: boolean;
    // Add other user properties as needed
  };
}

// 1. Server Component Guard
export async function AuthGuard({
  children,
  redirectTo = "/",
  requireRole,
}: AuthGuardProps) {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

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

// 2. Higher-Order Function for Pages
export function withAuth<T extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<T & { session: Session }>,
  options: { redirectTo?: string; requireRole?: string } = {}
) {
  return async function AuthenticatedComponent(props: T) {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as Session | null;

    if (!session) {
      redirect(options.redirectTo ?? "/");
    }

    if (options.requireRole && session.user.role !== options.requireRole) {
      redirect("/unauthorized");
    }

    return <WrappedComponent {...props} session={session} />;
  };
}

// 3. Auth Hook for Session Data
export async function getAuthSession(): Promise<Session | null> {
  try {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as Session | null;

    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

// 4. Auth Action (for Server Actions)
export async function requireAuth(): Promise<Session> {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  if (!session) {
    redirect("/");
  }

  return session;
}

// 5. Layout Guard (for protecting entire sections)
export async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
}
