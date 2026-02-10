"use client";

import { AlertCircle } from "lucide-react";
import useSWR from "swr";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function OrganizationStatusBanner() {
  const { data, error, isLoading } = useSWR(
    "/api/v1/organization/status",
    fetcher,
    {
      refreshInterval: 0, // Don't poll aggressively
      revalidateOnFocus: false,
    }
  );

  if (isLoading || error || !data) return null;

  if (data.isActive) return null;

  return (
    <div className="w-full bg-destructive/10 px-4 py-2">
      <Alert variant="destructive" className="border-none bg-transparent p-0">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="mb-0 text-sm font-medium">
            Account Inactive
          </AlertTitle>
          <AlertDescription className="text-sm">
            Your organization account is currently {data.status}. Please contact
            support or update your billing information.
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
