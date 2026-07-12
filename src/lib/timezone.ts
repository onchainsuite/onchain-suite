export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

export interface TimezoneInfo {
  short: string; // e.g., PST, GMT+1
  long: string; // e.g., Pacific Standard Time
  timeZone: string; // e.g., America/Los_Angeles
  offset: string; // e.g., GMT-08:00
}

export function getTimezoneDisplay(timeZone: string): TimezoneInfo {
  try {
    const date = new Date();

    // Get parts
    const formatToParts = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("en-US", { ...options, timeZone }).formatToParts(
        date
      );

    const short =
      formatToParts({ timeZoneName: "short" }).find(
        (p) => p.type === "timeZoneName"
      )?.value ?? "";
    const long =
      formatToParts({ timeZoneName: "long" }).find(
        (p) => p.type === "timeZoneName"
      )?.value ?? "";
    const offset =
      formatToParts({ timeZoneName: "longOffset" }).find(
        (p) => p.type === "timeZoneName"
      )?.value ?? "";

    return { short, long, timeZone, offset };
  } catch {
    return {
      short: "UTC",
      long: "Coordinated Universal Time",
      timeZone: "UTC",
      offset: "GMT+00:00",
    };
  }
}

export function getAllTimezones(): TimezoneInfo[] {
  // Use Intl.supportedValuesOf if available (Node 18+ / Modern Browsers)
  let timeZones: string[] = [];
  try {
    const { supportedValuesOf } = Intl as unknown as {
      supportedValuesOf?: (key: string) => string[];
    };
    if (supportedValuesOf) {
      timeZones = supportedValuesOf("timeZone");
    }
  } catch (_e) {
    String(_e);
  }

  if (timeZones.length === 0) {
    // Basic fallback list
    timeZones = [
      "UTC",
      "America/New_York",
      "America/Los_Angeles",
      "America/Chicago",
      "Europe/London",
      "Europe/Paris",
      "Asia/Tokyo",
      "Australia/Sydney",
      // ... add more as needed or rely on polyfill
    ];
  }

  return timeZones.map(getTimezoneDisplay);
}

export type ZonedDateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const toNumber = (value: string | undefined): number => {
  const n = value ? Number(value) : Number.NaN;
  return Number.isFinite(n) ? n : 0;
};

export function getZonedDateTimeParts(
  date: Date,
  timeZone: string
): ZonedDateTimeParts {
  // Intl throws RangeError on an Invalid Date or an unknown timezone string
  // (both reachable from API data, e.g. a bad `scheduledFor` or a stored
  // timezone). Fall back instead of crashing the calling view.
  const safeDate = Number.isFinite(date.getTime()) ? date : new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  };
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      ...options,
      timeZone,
    }).formatToParts(safeDate);
  } catch {
    parts = new Intl.DateTimeFormat("en-US", {
      ...options,
      timeZone: "UTC",
    }).formatToParts(safeDate);
  }

  const map = new Map(parts.map((p) => [p.type, p.value]));

  return {
    year: toNumber(map.get("year")),
    month: toNumber(map.get("month")),
    day: toNumber(map.get("day")),
    hour: toNumber(map.get("hour")),
    minute: toNumber(map.get("minute")),
    second: toNumber(map.get("second")),
  };
}

export function getTimeZoneOffsetMs(timeZone: string, date: Date): number {
  const z = getZonedDateTimeParts(date, timeZone);
  const asUtc = Date.UTC(
    z.year,
    z.month - 1,
    z.day,
    z.hour,
    z.minute,
    z.second
  );
  return asUtc - date.getTime();
}

export function zonedWallTimeToUtcDate(
  input: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second?: number;
  },
  timeZone: string
): Date {
  const utcGuess = new Date(
    Date.UTC(
      input.year,
      input.month - 1,
      input.day,
      input.hour,
      input.minute,
      input.second ?? 0
    )
  );

  const offset1 = getTimeZoneOffsetMs(timeZone, utcGuess);
  let utcDate = new Date(utcGuess.getTime() - offset1);

  const offset2 = getTimeZoneOffsetMs(timeZone, utcDate);
  if (offset2 !== offset1) {
    utcDate = new Date(utcGuess.getTime() - offset2);
  }

  return utcDate;
}

export function utcDateToZonedWallTime(
  date: Date,
  timeZone: string
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const parts = getZonedDateTimeParts(date, timeZone);
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

export function parseTimeOfDay(value: string): {
  hour: number;
  minute: number;
} {
  const trimmed = value.trim();
  const m = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!m) return { hour: 0, minute: 0 };
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  return {
    hour: Number.isFinite(hour) ? Math.min(23, Math.max(0, hour)) : 0,
    minute: Number.isFinite(minute) ? Math.min(59, Math.max(0, minute)) : 0,
  };
}
