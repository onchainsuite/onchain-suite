import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@/shared/hooks/client/use-local-storage";
import { fetchTimezones, formatTimezone, TimezoneEntry } from "@/lib/timezone-api";

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
  const { value, setValue, isLoading } = useLocalStorage<CacheShape>("timezones-cache", {
    version: null,
    items: [],
    lastFetched: 0,
  });
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const stale = !value.version || now - value.lastFetched > TTL_MS || value.items.length === 0;
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
