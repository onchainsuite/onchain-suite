
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return "UTC";
  }
}

export interface TimezoneInfo {
  short: string; // e.g., PST, GMT+1
  long: string;  // e.g., Pacific Standard Time
  timeZone: string; // e.g., America/Los_Angeles
  offset: string; // e.g., GMT-08:00
}

export function getTimezoneDisplay(timeZone: string): TimezoneInfo {
  try {
    const date = new Date();
    
    // Get parts
    const formatToParts = (options: Intl.DateTimeFormatOptions) => 
      new Intl.DateTimeFormat("en-US", { ...options, timeZone }).formatToParts(date);

    const short = formatToParts({ timeZoneName: "short" }).find(p => p.type === "timeZoneName")?.value || "";
    const long = formatToParts({ timeZoneName: "long" }).find(p => p.type === "timeZoneName")?.value || "";
    const offset = formatToParts({ timeZoneName: "longOffset" }).find(p => p.type === "timeZoneName")?.value || "";

    return { short, long, timeZone, offset };
  } catch (e) {
    return { short: "UTC", long: "Coordinated Universal Time", timeZone: "UTC", offset: "GMT+00:00" };
  }
}

export function getAllTimezones(): TimezoneInfo[] {
  // Use Intl.supportedValuesOf if available (Node 18+ / Modern Browsers)
  let timeZones: string[] = [];
  try {
    // @ts-ignore - supportedValuesOf might not be in TS lib yet depending on version
    if (Intl.supportedValuesOf) {
        // @ts-ignore
      timeZones = Intl.supportedValuesOf('timeZone');
    }
  } catch (e) {
    // Fallback list if needed
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
