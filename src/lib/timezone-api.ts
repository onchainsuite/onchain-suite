import { apiClient } from "@/lib/api-client";
import { getTimezoneDisplay } from "@/lib/timezone";

type RawResponse = string[] | { data?: string[] } | unknown;

export type TimezoneEntry = {
  id: string;
  short: string;
  offset: string;
  label: string;
};

function parseUtcOffset(offset: string): string {
  const match = offset.match(/GMT([+-])(\d{2})(?::?(\d{2}))?/i);
  if (!match) return "UTC";
  const sign = match[1] === "-" ? "-" : "+";
  const hours = String(parseInt(match[2], 10));
  const minutes = match[3] ? `:${match[3]}` : "";
  return `UTC${sign}${hours}${minutes}`;
}

export function formatTimezone(tz: string): TimezoneEntry {
  const info = getTimezoneDisplay(tz);
  const utc = parseUtcOffset(info.offset);
  const label = `${info.timeZone} (${info.short}, ${utc})`;
  return { id: info.timeZone, short: info.short, offset: utc, label };
}

async function fetchFromPrimary(): Promise<string[]> {
  const res = await apiClient.get("/meta/timezones");
  const data = (res.data as RawResponse) as any;
  const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  return list.filter((v: unknown) => typeof v === "string");
}

async function fetchFromFallback(): Promise<string[]> {
  const res = await fetch("https://worldtimeapi.org/api/timezone");
  const list = (await res.json()) as unknown;
  return Array.isArray(list) ? list.filter((v) => typeof v === "string") : [];
}

export async function fetchTimezones(): Promise<string[]> {
  try {
    const primary = await fetchFromPrimary();
    if (primary.length > 0) return primary;
  } catch {}
  try {
    const fallback = await fetchFromFallback();
    if (fallback.length > 0) return fallback;
  } catch {}
  return ["UTC"];
}
