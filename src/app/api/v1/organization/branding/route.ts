import { type NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth-session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.session?.activeOrganizationId || !session?.session?.token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const backendBase =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://onchain-backend-dvxw.onrender.com/api/v1";
    const cleanBase = backendBase.replace(/\/$/, "");

    const response = await fetch(`${cleanBase}/organization/branding`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.session.token}`,
        Cookie: req.headers.get("cookie") || "",
        "x-org-id": session.session.activeOrganizationId,
      },
      cache: "no-store",
    });

    const text = await response.text();
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(text);
        return NextResponse.json(json, { status: response.status });
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid JSON from backend" },
          { status: 502 }
        );
      }
    }

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType || "text/plain" },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
