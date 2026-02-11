import { type NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth-session";

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

    // Fetch organization details from the backend
    // We reuse the session token for authentication
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://onchain-backend-dvxw.onrender.com"}/api/v1/organization`,
      {
        headers: {
          Authorization: `Bearer ${session.session.token}`, // Assuming token is available or cookie handles it
          Cookie: req.headers.get("cookie") || "",
          "x-org-id": orgId,
        },
      }
    );

    if (!response.ok) {
      // If we can't fetch it, assume active or handle error?
      // Let's return unknown
      return NextResponse.json({ isActive: true, status: "unknown" });
    }

    const orgData = await response.json();

    // Determine status
    // Assuming 'status' field exists, or 'metadata.status'
    const status = orgData.status || orgData.metadata?.status || "active";
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
