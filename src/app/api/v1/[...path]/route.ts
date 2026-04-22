import { type NextRequest, NextResponse } from "next/server";

import { isJsonObject } from "@/lib/utils";

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

const forward = async (
  req: NextRequest,
  path: string[],
  overrideMethod?: string
) => {
  const url = new URL(req.url);
  const targetUrl = `${getBackendBaseUrl()}/${path.join("/")}${url.search}`;

  const method = (overrideMethod ?? req.method).toUpperCase();
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("accept-encoding");

  const cookieHeader = req.headers.get("cookie") ?? "";
  const token = extractTokenFromCookie(cookieHeader);
  if (token && !headers.has("authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const apiKey = getBackendApiKey();
  if (apiKey && !headers.has("x-api-key")) {
    headers.set("x-api-key", apiKey);
  }

  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const isOrganizationCreate =
    method === "POST" &&
    path.length === 2 &&
    path[0] === "organization" &&
    path[1] === "create";

  const isOrganizationList =
    method === "GET" &&
    path.length === 2 &&
    path[0] === "organization" &&
    path[1] === "list";

  if (isOrganizationCreate && upstream.status === 409) {
    const base = getBackendBaseUrl();

    let requestedName = "";
    let requestedSlug = "";
    try {
      const text = body ? new TextDecoder().decode(body) : "";
      const json = text ? JSON.parse(text) : null;
      requestedName = String(json?.name ?? "");
      requestedSlug = String(json?.slug ?? "");
    } catch (_e) {
      String(_e);
    }

    try {
      const listRes = await fetch(`${base}/organization/list`, {
        method: "GET",
        headers,
        cache: "no-store",
      });
      const listJson = await listRes.json().catch(() => null);
      const list = Array.isArray(listJson)
        ? listJson
        : Array.isArray(listJson?.data)
          ? listJson.data
          : Array.isArray(listJson?.data?.data)
            ? listJson.data.data
            : [];

      const nameLower = requestedName.toLowerCase().trim();
      const slugLower = requestedSlug.toLowerCase().trim();
      const match = Array.isArray(list)
        ? list.find((org) => {
            if (!isJsonObject(org)) return false;
            const orgName = String(org.name ?? "")
              .toLowerCase()
              .trim();
            const orgSlug = String(org.slug ?? "")
              .toLowerCase()
              .trim();
            return (
              (slugLower && orgSlug === slugLower) ||
              (nameLower && orgName === nameLower)
            );
          })
        : null;

      const orgId = isJsonObject(match)
        ? (match.id ?? match.organizationId ?? null)
        : null;

      if (typeof orgId === "string" && orgId.length > 0) {
        await fetch(`${base}/organization/set-active`, {
          method: "POST",
          headers: (() => {
            const h = new Headers(headers);
            if (!h.has("content-type")) {
              h.set("content-type", "application/json");
            }
            return h;
          })(),
          body: JSON.stringify({ organizationId: orgId }),
          cache: "no-store",
        }).catch(() => null);

        return NextResponse.json(
          { success: true, conflict: true, data: match ?? { id: orgId } },
          { status: 200 }
        );
      }
    } catch (_e) {
      String(_e);
    }

    return NextResponse.json(
      {
        success: false,
        conflict: true,
        message: "Organization already exists",
      },
      { status: 200 }
    );
  }

  if (isOrganizationList && upstream.status === 409) {
    try {
      const json = await upstream.clone().json();
      return NextResponse.json(json, { status: 200 });
    } catch {
      return NextResponse.json({ data: [] }, { status: 200 });
    }
  }

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("connection");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("content-encoding");

  return new NextResponse(
    upstream.status === 204 ? null : await upstream.arrayBuffer(),
    { status: upstream.status, headers: responseHeaders }
  );
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "POST");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "PUT");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "PATCH");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "DELETE");
}

export async function OPTIONS(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "OPTIONS");
}
