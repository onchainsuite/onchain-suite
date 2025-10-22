"use client";

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserStatus {
  isNewUser: boolean;
  onboardingCompleted: boolean;
  shouldRedirect: string;
}

export function useUserRedirect() {
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkUserStatus = async () => {
      try {
        const response = await fetch("/api/user/status");
        if (response.ok) {
          const status: UserStatus = await response.json();
          setUserStatus(status);

          // Auto-redirect based on user status
          if (
            status.shouldRedirect &&
            window.location.pathname !== status.shouldRedirect
          ) {
            router.push(status.shouldRedirect);
          }
        }
      } catch (error) {
        console.error("Failed to check user status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [user, router]);

  const completeOnboarding = async () => {
    try {
      const response = await fetch("/api/user/complete-onboarding", {
        method: "POST",
      });

      if (response.ok) {
        setUserStatus((prev) =>
          prev ? { ...prev, onboardingCompleted: true } : null
        );
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  return {
    loading,
    userStatus,
    completeOnboarding,
    isNewUser: userStatus?.isNewUser ?? false,
    onboardingCompleted: userStatus?.onboardingCompleted ?? false,
  };
}
