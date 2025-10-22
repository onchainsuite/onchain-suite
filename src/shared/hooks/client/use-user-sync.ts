"use client";

import { useUser } from "@stackframe/stack";
import { useEffect } from "react";

export function useUserSync() {
  const user = useUser();

  useEffect(() => {
    if (user) {
      // Sync user data with our database
      const syncUserData = async () => {
        try {
          await fetch("/api/user/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
              name: user.displayName,
              email: user.primaryEmail,
              profilePicture: user.profileImageUrl,
              emailVerified: user.primaryEmailVerified,
            }),
          });
        } catch (error) {
          console.error("Failed to sync user data:", error);
        }
      };

      syncUserData();
    }
  }, [user]);

  return { user };
}
