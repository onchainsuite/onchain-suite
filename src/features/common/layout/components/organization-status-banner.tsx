"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data || json;
};

export function OrganizationStatusBanner() {
  const { data, error, isLoading } = useSWR("/api/v1/organization", fetcher, {
    refreshInterval: 0, // Don't poll aggressively
    revalidateOnFocus: false,
  });

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (isLoading || error || !data) return;

    // Assuming 'active' or 'paid' means the account is in good standing
    // Also handle missing status to avoid showing warning for undefined states
    const status = data.status?.toLowerCase();
    const isActive = !status || ["active", "paid", "trial"].includes(status);

    if (!isActive && !hasShownToast.current) {
      toast.error(
        `Your organization account is currently ${
          data.status || "inactive"
        }. Please contact support or update your billing information.`,
        { duration: 6000 }
      );
      hasShownToast.current = true;
    }
  }, [data, error, isLoading]);

  return null;
}
