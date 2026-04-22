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

const getSetCookieHeaders = (headers: Headers): string[] => {
  const anyHeaders = headers as any;
  if (typeof anyHeaders.getSetCookie === "function") {
    return anyHeaders.getSetCookie() as string[];
  }
  const single = headers.get("set-cookie");
  return single ? [single] : [];
};

const extractOnchainToken = (cookieHeader: string): string | null => {
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

const extractOnchainUser = (cookieHeader: string): any | null => {
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
  const raw = cookieMap.get("onchain.user") ?? null;
  if (!raw) return null;
  try {
    const json = Buffer.from(decodeURIComponent(raw), "base64").toString(
      "utf8"
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const normalizeUserFromResponse = (payload: any) => {
  const root = payload?.data ?? payload;
  return root?.user ?? root?.data?.user ?? payload?.user ?? null;
};

const getRedirectUrlFromResponse = (payload: any): string | null => {
  const directCandidates: Array<unknown> = [
    payload?.url,
    payload?.redirectUrl,
    payload?.redirect,
    payload?.redirect?.url,
    payload?.redirect?.to,
    payload?.redirect?.href,
    payload?.redirect?.location,
  ];
  const direct = directCandidates.find((v) => typeof v === "string") as
    | string
    | undefined;
  if (direct && direct.length > 0) return direct;

  const isObject = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === "object" && !Array.isArray(v);

  const looksLikeUrl = (v: unknown): v is string =>
    typeof v === "string" && (v.startsWith("http") || v.startsWith("/"));

  const deepFind = (obj: unknown, depth: number): string | null => {
    if (depth < 0) return null;
    if (looksLikeUrl(obj)) return obj;
    if (!isObject(obj)) return null;
    for (const key of [
      "url",
      "href",
      "to",
      "location",
      "redirectUrl",
      "redirectURL",
      "callbackURL",
      "callbackUrl",
    ]) {
      const val = (obj as any)[key];
      if (looksLikeUrl(val)) return val;
    }
    for (const val of Object.values(obj)) {
      const found = deepFind(val, depth - 1);
      if (found) return found;
    }
    return null;
  };

  return deepFind(payload?.redirect, 2);
};

const toAbsoluteUrl = (maybeUrl: string, backendBaseUrl: string): string => {
  try {
    return new URL(maybeUrl).toString();
  } catch {
    const { origin } = new URL(backendBaseUrl);
    return new URL(maybeUrl, origin).toString();
  }
};

const rewriteSetCookieForLocalDev = (cookie: string, reqUrl: URL): string => {
  const { hostname } = reqUrl;
  const isLocalhost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  if (!isLocalhost) return cookie;

  let updated = cookie;

  updated = updated.replace(/;\s*Domain=[^;]+/i, "");
  if (/;\s*Path=/i.test(updated)) {
    updated = updated.replace(/;\s*Path=[^;]+/i, "; Path=/");
  } else {
    updated = `${updated}; Path=/`;
  }

  if (reqUrl.protocol === "http:") {
    updated = updated.replace(/;\s*Secure/gi, "");
    updated = updated.replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
  }

  return updated;
};

const getBackendApiKey = () => {
  return pickNonEmpty(
    process.env.BACKEND_API_KEY,
    process.env.NEXT_PUBLIC_BACKEND_API_KEY,
    process.env.NEXT_PUBLIC_API_KEY
  );
};

const withAuthHeaders = (
  base: Headers,
  token: string | null,
  cookieHeader: string
) => {
  const headers = new Headers(base);
  if (cookieHeader) headers.set("Cookie", cookieHeader);
  if (token && !headers.has("authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const apiKey = getBackendApiKey();
  if (apiKey && !headers.has("x-api-key")) {
    headers.set("x-api-key", apiKey);
  }
  return headers;
};

const forward = async (
  req: NextRequest,
  path: string[],
  overrideMethod?: string
) => {
  const url = new URL(req.url);
  const isOrganizationPlugin = path.length >= 1 && path[0] === "organization";
  const targetUrl = isOrganizationPlugin
    ? `${getBackendBaseUrl()}/organization/${path.slice(1).join("/")}${url.search}`
    : `${getBackendBaseUrl()}/auth/${path.join("/")}${url.search}`;

  const method = (overrideMethod ?? req.method).toUpperCase();
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("accept-encoding");

  const isAuthWrite =
    method === "POST" &&
    path.length >= 2 &&
    path[0] === "sign-in" &&
    (path[1] === "email" || path[1] === "username");

  const cookieHeader = req.headers.get("cookie") ?? "";
  const onchainToken = extractOnchainToken(cookieHeader);
  const onchainUser = extractOnchainUser(cookieHeader);

  const upstreamHeaders = withAuthHeaders(headers, onchainToken, cookieHeader);

  const isGetSession =
    method === "GET" && path.length === 1 && path[0] === "get-session";
  if (isGetSession) {
    if (onchainUser) {
      return NextResponse.json(
        {
          session: onchainToken ? { token: onchainToken } : {},
          user: onchainUser,
        },
        { status: 200 }
      );
    }

    const backendBase = getBackendBaseUrl();
    const upstream = await fetch(`${backendBase}/auth/get-session`, {
      method: "GET",
      headers: upstreamHeaders,
      cache: "no-store",
    });

    if (!upstream.ok) {
      const profileTry = await fetch(`${backendBase}/user/profile`, {
        method: "GET",
        headers: withAuthHeaders(new Headers(), onchainToken, cookieHeader),
        cache: "no-store",
      });

      if (profileTry.ok) {
        const profileJson = await profileTry.json().catch(() => null);
        const user = normalizeUserFromResponse(profileJson);
        if (user) {
          return NextResponse.json(
            {
              session: onchainToken ? { token: onchainToken } : {},
              user,
            },
            { status: 200 }
          );
        }
      }
    }

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("connection");
    responseHeaders.delete("transfer-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("content-encoding");

    const body = upstream.status === 204 ? null : await upstream.arrayBuffer();
    const nextResponse = new NextResponse(body, {
      status: upstream.status,
      headers: responseHeaders,
    });

    for (const cookie of getSetCookieHeaders(upstream.headers)) {
      nextResponse.headers.append(
        "set-cookie",
        rewriteSetCookieForLocalDev(cookie, url)
      );
    }

    return nextResponse;
  }

  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method,
    headers: upstreamHeaders,
    body,
    cache: "no-store",
  });

  const isSignInEmail =
    method === "POST" &&
    path.length >= 2 &&
    path[0] === "sign-in" &&
    path[1] === "email";

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("connection");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("content-encoding");

  const responseBody =
    upstream.status === 204 ? null : await upstream.arrayBuffer();

  const nextResponse = new NextResponse(responseBody, {
    status: upstream.status,
    headers: responseHeaders,
  });

  const setCookies = getSetCookieHeaders(upstream.headers);
  if (isSignInEmail) {
    const redact = (c: string) => c.replace(/=([^;]*)/, "=<redacted>");
    console.log("[auth-proxy:sign-in/email]", {
      at: new Date().toISOString(),
      upstreamStatus: upstream.status,
      upstreamSetCookieCount: setCookies.length,
      upstreamSetCookies: setCookies.map(redact),
      targetUrl,
    });
  }

  for (const cookie of setCookies) {
    nextResponse.headers.append(
      "set-cookie",
      rewriteSetCookieForLocalDev(cookie, url)
    );
  }

  if (isSignInEmail) {
    const contentType = upstream.headers.get("content-type") ?? "";
    if (contentType.includes("application/json") && responseBody) {
      try {
        const text = new TextDecoder().decode(responseBody);
        const json: any = JSON.parse(text);
        const candidates: Array<string | undefined> = [
          json?.token,
          json?.accessToken,
          json?.sessionToken,
          json?.data?.token,
          json?.data?.accessToken,
          json?.data?.sessionToken,
          json?.session?.token,
          json?.data?.session?.token,
        ];
        const token =
          candidates.find((t) => typeof t === "string" && t.length > 20) ??
          null;

        const topLevelKeys =
          json && typeof json === "object" ? Object.keys(json) : [];
        if (typeof token === "string" && token.length > 0) {
          nextResponse.headers.append(
            "set-cookie",
            `onchain.token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax`
          );
          const user = normalizeUserFromResponse(json);
          if (user) {
            const encoded = encodeURIComponent(
              Buffer.from(JSON.stringify(user), "utf8").toString("base64")
            );
            nextResponse.headers.append(
              "set-cookie",
              `onchain.user=${encoded}; Path=/; HttpOnly; SameSite=Lax`
            );
          }
        }

        const redirectUrl = getRedirectUrlFromResponse(json);
        if (redirectUrl) {
          try {
            const absoluteUrl = toAbsoluteUrl(redirectUrl, targetUrl);
            const redirectRes = await fetch(absoluteUrl, {
              method: "GET",
              headers: {
                "accept-encoding": "identity",
              },
              redirect: "manual",
              cache: "no-store",
            });

            for (const cookie of getSetCookieHeaders(redirectRes.headers)) {
              nextResponse.headers.append(
                "set-cookie",
                rewriteSetCookieForLocalDev(cookie, url)
              );
            }
          } catch (e) {
            console.error("Failed to follow redirect", e);
          }
        }

        const redact = (v: unknown) =>
          typeof v === "string" && v.length > 10 ? `${v.slice(0, 6)}…` : v;
        console.log("[auth-proxy:sign-in/email:body]", {
          at: new Date().toISOString(),
          keys: topLevelKeys,
          tokenFound: !!token,
          tokenMeta:
            typeof token === "string"
              ? {
                  length: token.length,
                  hasDot: token.includes("."),
                  hasPercent: token.includes("%"),
                }
              : null,
          redirectMeta: redirectUrl
            ? {
                isAbsolute: redirectUrl.startsWith("http"),
                length: redirectUrl.length,
              }
            : typeof json?.redirect === "object" && json?.redirect
              ? {
                  type: "object",
                  keys: Object.keys(json.redirect).slice(0, 12),
                }
              : json?.redirect !== null && json?.redirect !== undefined
                ? { type: typeof json.redirect, value: json.redirect }
                : null,
          sampleFields: {
            hasToken: typeof json?.token === "string",
            hasAccessToken: typeof json?.accessToken === "string",
            hasDataToken: typeof json?.data?.token === "string",
            hasSessionToken: typeof json?.session?.token === "string",
          },
          url: targetUrl,
        });
      } catch (_e) {
        String(_e);
      }
    }
  }

  if (isSignInEmail) {
    const redact = (c: string) => c.replace(/=([^;]*)/, "=<redacted>");
    const returnedSetCookies =
      typeof (nextResponse.headers as any).getSetCookie === "function"
        ? ((nextResponse.headers as any).getSetCookie() as string[])
        : undefined;
    console.log("[auth-proxy:sign-in/email]", {
      at: new Date().toISOString(),
      returnedSetCookieCount: returnedSetCookies?.length,
      returnedSetCookies: returnedSetCookies?.map(redact),
    });
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
