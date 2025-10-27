import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { AUTH_ROUTES, PRIVATE_ROUTES } from "@/config/app-routes";

import { type auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { useSession } = authClient;

export const signInWithGoogle = async () => {
  try {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: PRIVATE_ROUTES.ROOT,
      newUserCallbackURL: AUTH_ROUTES.ONBOARDING,
      fetchOptions: {
        onError: (error) => {
          console.error("🚀 ~ signInWithGoogle ~ error:", error);
          toast.error(error.error.message);
        },
      },
    });
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
