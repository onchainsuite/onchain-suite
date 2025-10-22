import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { privateRoutes } from "@/config/app-routes";

export const authClient = createAuthClient();

export const { useSession } = authClient;

export const signInWithGoogle = async () => {
  try {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: privateRoutes.home,
      fetchOptions: {
        onError: (error) => {
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
