import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const pickNonEmpty = (...values: Array<string | undefined | null>) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return "";
};

const getBackendBaseUrl = () => {
  const devDefault = "http://127.0.0.1:3333/api/v1";
  const prodDefault = "https://onchain-backend-dvxw.onrender.com/api/v1";
  const backendUrl = pickNonEmpty(
    process.env.BACKEND_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NODE_ENV === "production" ? prodDefault : devDefault
  );
  return backendUrl.replace(/\/$/, "");
};

const getBackendApiKey = () => {
  return pickNonEmpty(
    process.env.BACKEND_API_KEY,
    process.env.NEXT_PUBLIC_BACKEND_API_KEY,
    process.env.NEXT_PUBLIC_API_KEY
  );
};

const extractTokenFromCookie = (cookieHeader: string): string | null => {
  const pairs = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => {
      const idx = p.indexOf("=");
      if (idx === -1) return [p, ""] as const;
      return [p.slice(0, idx), p.slice(idx + 1)] as const;
    });

  const cookieMap = new Map(pairs);
  const raw = cookieMap.get("onchain.token") ?? null;
  return raw ? decodeURIComponent(raw) : null;
};

export async function GET(req: NextRequest) {
  try {
    const cleanBase = getBackendBaseUrl();
    const cookieHeader = req.headers.get("cookie") ?? "";
    const token = extractTokenFromCookie(cookieHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const doFetch = async (orgId?: string) => {
      const apiKey = getBackendApiKey();
      const headers: Record<string, string> = {
        Cookie: cookieHeader,
        Authorization: `Bearer ${token}`,
      };
      if (apiKey) headers["x-api-key"] = apiKey;
      if (orgId) headers["x-org-id"] = orgId;

      return fetch(`${cleanBase}/organization/branding`, {
        method: "GET",
        headers,
        cache: "no-store",
      });
    };

    let response = await doFetch();

    if (response.status === 401 || response.status === 409) {
      const apiKey = getBackendApiKey();
      const listRes = await fetch(`${cleanBase}/organization/list`, {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
          Authorization: `Bearer ${token}`,
          ...(apiKey ? { "x-api-key": apiKey } : {}),
        },
        cache: "no-store",
      });

      if (listRes.ok) {
        const json = await listRes.json().catch(() => null);
        const orgs = Array.isArray(json) ? json : (json?.data ?? []);
        const firstOrgId =
          Array.isArray(orgs) && orgs.length > 0 ? orgs[0]?.id : null;
        if (firstOrgId) {
          response = await doFetch(firstOrgId);
        }
      }
    }

    if (response.status === 409) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization context not ready",
          data: null,
        },
        { status: 200 }
      );
    }

    const text = await response.text();
    const contentType = response.headers.get("content-type") ?? "";

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
      headers: {
        "content-type": contentType.length > 0 ? contentType : "text/plain",
      },
    });
  } catch (_e) {
    String(_e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
