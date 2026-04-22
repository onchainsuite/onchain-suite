import {
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { AUTH_ROUTES, PRIVATE_ROUTES } from "@/shared/config/app-routes";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/v1/auth`;
  }
  return process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth`
    : "http://localhost:3000/api/v1/auth";
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [organizationClient(), twoFactorClient()],
});

export const { useSession } = authClient;

export const signInWithGoogle = async (idToken?: string) => {
  try {
    const payload: Record<string, unknown> = {
      provider: "google",
      callbackURL: PRIVATE_ROUTES.CAMPAIGNS,
      newUserCallbackURL: AUTH_ROUTES.ONBOARDING,
    };

    if (idToken) {
      payload.idToken = { token: idToken };
    }

    const data = await authClient.signIn.social(payload);
    return data;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully signed out!");
          window.location.href = "/";
        },
      },
    });
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};
