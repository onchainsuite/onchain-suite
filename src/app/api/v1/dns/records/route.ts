import dns from "dns";
import { type NextRequest, NextResponse } from "next/server";

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
    const formattedRecords = records.map((record: any) => {
      let value = "";
      let priority = undefined;

      switch (record.type) {
        case "A":
        case "AAAA":
          value = record.address;
          break;
        case "MX":
          {
            const { exchange, priority: mxPriority } = record;
            value = exchange;
            priority = mxPriority;
          }
          break;
        case "TXT":
          value = Array.isArray(record.entries) ? record.entries.join(" ") : "";
          break;
        case "CNAME":
        case "NS":
        case "PTR":
          {
            const { value: recordValue } = record;
            value = recordValue;
          }
          break;
        case "SOA":
          value = `${record.nsname} ${record.hostmaster}`;
          break;
        default:
          value = JSON.stringify(record);
      }

      return {
        type: record.type,
        name: domain,
        value,
        ttl: record.ttl ?? 3600,
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
  } catch (error: any) {
    console.error(`DNS Lookup error for ${domain}:`, error);
    return NextResponse.json(
      {
        success: false,
        error:
          typeof error?.message === "string" && error.message.length > 0
            ? error.message
            : "Failed to perform DNS lookup",
      },
      { status: 500 }
    );
  }
}
