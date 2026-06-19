/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "./route";

const mockedFetch = vi.fn<typeof fetch>();
global.fetch = mockedFetch as unknown as typeof fetch;

beforeEach(() => {
  mockedFetch.mockReset();
});

const createUpstreamResponse = (opts: {
  status: number;
  headers?: Record<string, string>;
  body?: string;
}) => {
  const headers = new Headers(opts.headers ?? {});
  const body = typeof opts.body === "string" ? opts.body : "";
  return {
    status: opts.status,
    ok: opts.status >= 200 && opts.status < 300,
    headers,
    arrayBuffer: async () => new TextEncoder().encode(body).buffer,
    json: async () => JSON.parse(body),
  } as unknown as Response;
};

describe("Auth Proxy API", () => {
  it("rewrites Origin to backend origin when proxying auth requests", async () => {
    mockedFetch.mockResolvedValueOnce(
      createUpstreamResponse({
        status: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: true }),
      })
    );

    const req = new NextRequest(
      "https://www.onchainsuite.com/api/v1/auth/sign-in/email",
      {
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "x" }),
        headers: {
          "content-type": "application/json",
          origin: "https://www.onchainsuite.com",
          referer: "https://www.onchainsuite.com/auth/signin",
        },
      }
    );

    const res = await POST(req, {
      params: Promise.resolve({ path: ["sign-in", "email"] }),
    });

    expect(res.status).toBe(200);
    const [, init] = mockedFetch.mock.calls[0] ?? [];
    const headers = (init?.headers as Headers) ?? new Headers();
    expect(headers.get("origin")).toBe("http://127.0.0.1:3333");
  });

  it("rewrites Secure/Domain cookies for localhost http callback", async () => {
    mockedFetch.mockResolvedValueOnce(
      createUpstreamResponse({
        status: 302,
        headers: {
          location: "https://example.com/after",
          "set-cookie":
            "__Secure-better-auth.session_token=abc; Domain=api.onchainsuite.com; Path=/; HttpOnly; Secure; SameSite=None",
        },
      })
    );

    const req = new NextRequest(
      "http://localhost:3000/api/v1/auth/callback/google?code=abc"
    );
    const res = await GET(req, {
      params: Promise.resolve({ path: ["callback", "google"] }),
    });

    expect(res.status).toBe(302);
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("better-auth.session_token=abc");
    expect(setCookie).not.toMatch(/;\s*Domain=/i);
    expect(setCookie).not.toMatch(/;\s*Secure/i);
    expect(setCookie).toMatch(/;\s*SameSite=Lax/i);
    expect(res.headers.get("location")).toBe("https://example.com/after");
  });

  it("adds Domain=.onchainsuite.com for better-auth cookies on production hostnames", async () => {
    mockedFetch.mockResolvedValueOnce(
      createUpstreamResponse({
        status: 200,
        headers: {
          "content-type": "application/json",
          "set-cookie":
            "__Secure-better-auth.state=abc; Max-Age=300; Path=/; HttpOnly; Secure; SameSite=Lax",
        },
        body: JSON.stringify({ ok: true }),
      })
    );

    const req = new NextRequest(
      "https://www.onchainsuite.com/api/v1/auth/sign-in/social",
      {
        method: "POST",
        body: JSON.stringify({ provider: "google", callbackURL: "/dashboard" }),
        headers: { "content-type": "application/json" },
      }
    );

    const res = await POST(req, {
      params: Promise.resolve({ path: ["sign-in", "social"] }),
    });

    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("__Secure-better-auth.state=abc");
    expect(setCookie).toMatch(/;\s*Domain=\.onchainsuite\.com/i);
  });

  it("returns 502 when upstream is unreachable", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("network down"));

    const req = new NextRequest(
      "http://localhost:3000/api/v1/auth/sign-in/social",
      {
        method: "POST",
        body: JSON.stringify({ provider: "google", callbackURL: "/dashboard" }),
        headers: { "content-type": "application/json" },
      }
    );
    const res = await POST(req, {
      params: Promise.resolve({ path: ["sign-in", "social"] }),
    });
    const json = await res.json();

    expect(res.status).toBe(502);
    expect(json).toEqual(
      expect.objectContaining({
        error: "upstream_unreachable",
      })
    );
  });

  it("passes through 403 responses (blocked accounts) from upstream", async () => {
    mockedFetch.mockResolvedValueOnce(
      createUpstreamResponse({
        status: 403,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "account_blocked" }),
      })
    );

    const req = new NextRequest(
      "http://localhost:3000/api/v1/auth/social/google",
      {
        method: "POST",
        body: JSON.stringify({ idToken: "fake" }),
        headers: { "content-type": "application/json" },
      }
    );
    const res = await POST(req, {
      params: Promise.resolve({ path: ["social", "google"] }),
    });
    const text = await res.text();

    expect(res.status).toBe(403);
    expect(text).toContain("account_blocked");
  });

  it("prefers live upstream session data over stale onchain.user cookie data", async () => {
    const staleUser = Buffer.from(
      JSON.stringify({
        id: "stale-user",
        email: "stale@example.com",
        name: "Stale User",
      }),
      "utf8"
    ).toString("base64");

    mockedFetch.mockResolvedValueOnce(
      createUpstreamResponse({
        status: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: {
            id: "live-user",
            email: "live@example.com",
            name: "Live User",
          },
        }),
      })
    );

    const req = new NextRequest(
      "http://localhost:3000/api/v1/auth/get-session",
      {
        headers: {
          cookie: `onchain.token=stale-token; onchain.user=${encodeURIComponent(staleUser)}; better-auth.session_token=live-session-token`,
        },
      }
    );

    const res = await GET(req, {
      params: Promise.resolve({ path: ["get-session"] }),
    });
    const json = await res.json();
    const setCookie = res.headers.get("set-cookie") ?? "";

    expect(res.status).toBe(200);
    expect(json).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          email: "live@example.com",
          name: "Live User",
        }),
      })
    );
    expect(setCookie).toContain("onchain.user=");
    expect(setCookie).not.toContain("onchain.token=live-session-token");

    const [, init] = mockedFetch.mock.calls[0] ?? [];
    const headers = (init?.headers as Headers) ?? new Headers();
    expect(headers.get("authorization")).toBeNull();
  });

  it("falls back to mirrored onchain.user when get-session returns 200 without a user", async () => {
    const mirroredUser = {
      id: "cookie-user",
      email: "cookie@example.com",
      name: "Cookie User",
    };
    const encodedUser = Buffer.from(
      JSON.stringify(mirroredUser),
      "utf8"
    ).toString("base64");

    mockedFetch.mockResolvedValueOnce(
      createUpstreamResponse({
        status: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ session: {} }),
      })
    );
    mockedFetch.mockResolvedValueOnce(
      createUpstreamResponse({
        status: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ session: {} }),
      })
    );

    const req = new NextRequest(
      "http://localhost:3000/api/v1/auth/get-session",
      {
        headers: {
          cookie: `onchain.token=cookie-token; onchain.user=${encodeURIComponent(encodedUser)}`,
        },
      }
    );

    const res = await GET(req, {
      params: Promise.resolve({ path: ["get-session"] }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: "cookie-user",
          email: "cookie@example.com",
        }),
      })
    );
    expect(mockedFetch).toHaveBeenCalledTimes(2);
  });

  it("clears mirrored onchain cookies on sign-out", async () => {
    mockedFetch.mockResolvedValueOnce(
      createUpstreamResponse({
        status: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ success: true }),
      })
    );

    const req = new NextRequest("http://localhost:3000/api/v1/auth/sign-out", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "onchain.token=abc; onchain.user=def",
      },
    });

    const res = await POST(req, {
      params: Promise.resolve({ path: ["sign-out"] }),
    });
    const setCookie = res.headers.get("set-cookie") ?? "";

    expect(res.status).toBe(200);
    expect(setCookie).toContain("onchain.token=;");
    expect(setCookie).toContain("onchain.user=;");
  });
});
