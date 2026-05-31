import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { getUserTimezone } from "@/lib/timezone";
import {
  fetchTimezones,
  formatTimezone,
  type TimezoneEntry,
} from "@/lib/timezone-api";
import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

import { useLocalStorage } from "@/shared/hooks/client/use-local-storage";

type CacheShape = {
  version: string | null;
  items: string[];
  lastFetched: number;
};

const TTL_MS = 24 * 60 * 60 * 1000;

function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

export function useTimezones() {
  const { value, setValue, isLoading } = useLocalStorage<CacheShape>(
    "timezones-cache",
    {
      version: null,
      items: [],
      lastFetched: 0,
    }
  );
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const stale =
      !value.version ||
      now - value.lastFetched > TTL_MS ||
      value.items.length === 0;
    if (stale && !fetching) {
      setFetching(true);
      fetchTimezones()
        .then((list) => {
          const version = hash(JSON.stringify(list));
          if (version !== value.version) {
            setValue({ version, items: list, lastFetched: now });
          } else {
            setValue({ ...value, lastFetched: now });
          }
        })
        .finally(() => setFetching(false));
    }
  }, [value, setValue, fetching]);

  const formatted: TimezoneEntry[] = useMemo(() => {
    return value.items.map(formatTimezone);
  }, [value.items]);

  return { items: formatted, loading: isLoading || fetching };
}

const pickNonEmptyString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return undefined;
};

export function useActiveTimezone(): {
  timezone: string;
  loading: boolean;
  source: "user" | "organization" | "browser" | "default";
} {
  const { data: session } = authClient.useSession();

  const organizationId = useMemo(() => {
    const selected = getSelectedOrganizationId();
    const active = session?.session?.activeOrganizationId ?? null;
    return selected ?? active ?? null;
  }, [session?.session?.activeOrganizationId]);

  const orgQuery = useQuery({
    queryKey: ["organization", "detail", organizationId],
    enabled: typeof organizationId === "string" && organizationId.length > 0,
    queryFn: async () => {
      const res = await apiClient.get("/organization", {
        headers: { "x-org-id": organizationId },
      });
      const payload: unknown = res.data;
      const root =
        isJsonObject(payload) && "data" in payload ? payload.data : payload;
      return isJsonObject(root) ? (root as Record<string, unknown>) : {};
    },
    retry: false,
    staleTime: 60_000,
  });

  const userTimezone = pickNonEmptyString(
    isJsonObject(session?.user)
      ? (session.user as Record<string, unknown>).timezone
      : undefined,
    (session?.user as { timezone?: unknown } | undefined)?.timezone
  );

  const orgTimezone = useMemo(() => {
    const obj = orgQuery.data;
    if (!obj) return undefined;
    const settings = isJsonObject(obj.settings)
      ? (obj.settings as Record<string, unknown>)
      : undefined;
    const meta = isJsonObject(obj.metadata)
      ? (obj.metadata as Record<string, unknown>)
      : undefined;
    const metaSettings = isJsonObject(meta?.settings)
      ? (meta?.settings as Record<string, unknown>)
      : undefined;
    return pickNonEmptyString(
      obj.timezone,
      settings?.timezone,
      meta?.timezone,
      metaSettings?.timezone
    );
  }, [orgQuery.data]);

  const browserTimezone = useMemo(() => getUserTimezone(), []);

  if (userTimezone) {
    return { timezone: userTimezone, loading: false, source: "user" };
  }
  if (orgTimezone) {
    return {
      timezone: orgTimezone,
      loading: orgQuery.isLoading,
      source: "organization",
    };
  }
  if (browserTimezone) {
    return { timezone: browserTimezone, loading: false, source: "browser" };
  }
  return { timezone: "UTC", loading: false, source: "default" };
}
