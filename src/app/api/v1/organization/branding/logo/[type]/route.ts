import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    // 1. Validate type
    if (!["primary", "dark", "favicon"].includes(type)) {
      return NextResponse.json({ error: "Invalid logo type" }, { status: 400 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validation (Size & Type)
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    // Common image types + favicon types
    const ALLOWED_TYPES = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/x-icon",
      "image/vnd.microsoft.icon",
    ];

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Unsupported file type. Please upload PNG, JPG, SVG, or ICO.",
        },
        { status: 400 }
      );
    }

    // 4. Forward to Backend
    // Using the same fallback logic as next.config.ts
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://onchain-backend-dvxw.onrender.com/api/v1";

    // Ensure no trailing slash on base, ensure leading slash on path if needed
    const cleanBase = backendUrl.replace(/\/$/, "");
    const targetUrl = `${cleanBase}/organization/branding/logo/${type}`;

    // Reconstruct FormData for forwarding
    const forwardFormData = new FormData();
    forwardFormData.append("file", file);

    // Forward headers (especially Auth and Organization Context)
    const headers = new Headers();
    const authHeader = req.headers.get("authorization");
    const cookieHeader = req.headers.get("cookie");
    const orgIdHeader = req.headers.get("x-org-id");

    if (authHeader) headers.set("Authorization", authHeader);
    if (cookieHeader) headers.set("Cookie", cookieHeader);
    if (orgIdHeader) headers.set("x-org-id", orgIdHeader);

    // Do NOT set Content-Type manually for FormData, fetch does it with boundary

    console.log(`Forwarding upload to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: headers,
      body: forwardFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend upload failed:", response.status, errorText);
      return NextResponse.json(
        { error: "Backend upload failed", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}
