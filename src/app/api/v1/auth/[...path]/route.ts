import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getBackendBaseUrl = () => {
  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://onchain-backend-dvxw.onrender.com/api/v1";
  return backendUrl.replace(/\/$/, "");
};

const getSetCookieHeaders = (headers: Headers): string[] => {
  const anyHeaders = headers as any;
  if (typeof anyHeaders.getSetCookie === "function") {
    return anyHeaders.getSetCookie() as string[];
  }
  const single = headers.get("set-cookie");
  return single ? [single] : [];
};

const forward = async (
  req: NextRequest,
  path: string[],
  overrideMethod?: string
) => {
  const url = new URL(req.url);
  const targetUrl = `${getBackendBaseUrl()}/auth/${path.join("/")}${url.search}`;

  const method = (overrideMethod ?? req.method).toUpperCase();
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("accept-encoding");

  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("connection");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("content-encoding");

  const nextResponse = new NextResponse(
    upstream.status === 204 ? null : await upstream.arrayBuffer(),
    { status: upstream.status, headers: responseHeaders }
  );

  for (const cookie of getSetCookieHeaders(upstream.headers)) {
    nextResponse.headers.append("set-cookie", cookie);
  }

  return nextResponse;
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
