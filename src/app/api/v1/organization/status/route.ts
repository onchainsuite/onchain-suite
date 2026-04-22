import { type NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth-session";

const pickNonEmpty = (...values: Array<string | undefined | null>) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return "";
};

const pickNonEmptyString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return "active";
};

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json(
        { isActive: false, status: "unknown" },
        { status: 401 }
      );
    }

    const orgId = session.session.activeOrganizationId;

    const rawBase = pickNonEmpty(
      process.env.BACKEND_URL,
      process.env.NEXT_PUBLIC_BACKEND_URL,
      "http://127.0.0.1:3333"
    );
    const cleanOrigin = rawBase.replace(/\/$/, "").replace(/\/api\/v1$/i, "");

    // Fetch organization details from the backend
    // We reuse the session token for authentication
    const response = await fetch(`${cleanOrigin}/api/v1/organization`, {
      headers: {
        Authorization: `Bearer ${session.session.token}`, // Assuming token is available or cookie handles it
        Cookie: req.headers.get("cookie") ?? "",
        "x-org-id": orgId,
      },
    });

    if (!response.ok) {
      // If we can't fetch it, assume active or handle error?
      // Let's return unknown
      return NextResponse.json({ isActive: true, status: "unknown" });
    }

    const orgData = await response.json();

    // Determine status
    // Assuming 'status' field exists, or 'metadata.status'
    const status = pickNonEmptyString(
      orgData?.status,
      orgData?.metadata?.status
    );
    const isActive =
      status === "active" || status === "paid" || status === "trial";

    return NextResponse.json({ isActive, status });
  } catch (error) {
    console.error("Failed to check organization status:", error);
    return NextResponse.json(
      { isActive: true, status: "error" },
      { status: 500 }
    );
  }
}
