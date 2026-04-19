import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getBackendBaseUrl = () => {
  const devDefault = "http://127.0.0.1:3333/api/v1";
  const prodDefault = "https://onchain-backend-dvxw.onrender.com/api/v1";
  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NODE_ENV === "production" ? prodDefault : devDefault);
  return backendUrl.replace(/\/$/, "");
};

const getBackendApiKey = () => {
  return (
    process.env.BACKEND_API_KEY ||
    process.env.NEXT_PUBLIC_BACKEND_API_KEY ||
    process.env.NEXT_PUBLIC_API_KEY ||
    ""
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

const toNextResponse = async (upstream: Response) => {
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

const forward = async (
  req: NextRequest,
  path: string[],
  overrideMethod?: string
) => {
  const url = new URL(req.url);
  const targetUrl = `${getBackendBaseUrl()}/onboarding/${path.join("/")}${url.search}`;

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
  return upstream;
};

const isProgressPath = (path: string[]) =>
  path.length === 1 && path[0] === "progress";
const isTrackPath = (path: string[]) => path.length === 1 && path[0] === "track";
const isCompletePath = (path: string[]) =>
  path.length === 1 && path[0] === "complete";
const isAdminSummaryPath = (path: string[]) =>
  path.length === 2 && path[0] === "admin" && path[1] === "summary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const upstream = await forward(req, path, "GET");

  if (upstream.status === 409) {
    if (isProgressPath(path)) {
      try {
        const json = await upstream.clone().json();
        return NextResponse.json(json, { status: 200 });
      } catch {
        return NextResponse.json(
          { progress: null, isCompleted: false },
          { status: 200 }
        );
      }
    }

    if (isAdminSummaryPath(path)) {
      try {
        const json = await upstream.clone().json();
        return NextResponse.json(json, { status: 200 });
      } catch {
        return NextResponse.json({ summary: null }, { status: 200 });
      }
    }
  }

  if (upstream.status !== 404) return toNextResponse(upstream);

  if (isProgressPath(path)) {
    return NextResponse.json(
      { progress: null, isCompleted: false },
      { status: 200 }
    );
  }

  if (isAdminSummaryPath(path)) {
    return NextResponse.json({ summary: null }, { status: 200 });
  }

  return toNextResponse(upstream);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const upstream = await forward(req, path, "POST");

  if (upstream.status === 409 && (isTrackPath(path) || isCompletePath(path))) {
    return NextResponse.json({ ok: true, conflict: true }, { status: 200 });
  }

  if (upstream.status !== 404) return toNextResponse(upstream);

  if (isTrackPath(path) || isCompletePath(path)) {
    return NextResponse.json({ ok: true, mocked: true }, { status: 200 });
  }

  return toNextResponse(upstream);
}

export async function OPTIONS(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const upstream = await forward(req, path, "OPTIONS");
  return toNextResponse(upstream);
}
