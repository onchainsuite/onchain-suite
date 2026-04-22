import dns from "dns";
import { type NextRequest, NextResponse } from "next/server";

import { isJsonObject } from "@/lib/utils";

const { resolveAny } = dns.promises;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { success: false, error: "Domain parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Basic validation of domain format
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      throw new Error("Invalid domain format");
    }

    // Perform DNS lookup for all record types
    const records = await resolveAny(domain).catch(() => []);

    // Format the records for the frontend
    const formattedRecords = records.map((record: unknown) => {
      const recordObj = isJsonObject(record) ? record : {};
      const type =
        typeof recordObj.type === "string" ? recordObj.type : "UNKNOWN";
      let value = "";
      let priority = undefined;

      switch (type) {
        case "A":
        case "AAAA":
          value =
            typeof recordObj.address === "string" ? recordObj.address : "";
          break;
        case "MX":
          {
            const exchange =
              typeof recordObj.exchange === "string" ? recordObj.exchange : "";
            const mxPriority =
              typeof recordObj.priority === "number"
                ? recordObj.priority
                : undefined;
            value = exchange;
            priority = mxPriority;
          }
          break;
        case "TXT":
          value = Array.isArray(recordObj.entries)
            ? recordObj.entries.map(String).join(" ")
            : "";
          break;
        case "CNAME":
        case "NS":
        case "PTR":
          {
            const recordValue =
              typeof recordObj.value === "string" ? recordObj.value : "";
            value = recordValue;
          }
          break;
        case "SOA":
          value = `${String(recordObj.nsname ?? "")} ${String(
            recordObj.hostmaster ?? ""
          )}`.trim();
          break;
        default:
          value = JSON.stringify(record);
      }

      return {
        type,
        name: domain,
        value,
        ttl: typeof recordObj.ttl === "number" ? recordObj.ttl : 3600,
        priority,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        domain,
        records: formattedRecords,
      },
    });
  } catch (error: unknown) {
    console.error(`DNS Lookup error for ${domain}:`, error);
    const message =
      error instanceof Error && error.message.length > 0
        ? error.message
        : String(error);
    return NextResponse.json(
      {
        success: false,
        error: message.length > 0 ? message : "Failed to perform DNS lookup",
      },
      { status: 500 }
    );
  }
}
