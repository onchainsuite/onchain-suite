/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const mockedFetch = vi.fn<typeof fetch>();
global.fetch = mockedFetch as unknown as typeof fetch;

describe("user profile proxy route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.NEXT_PUBLIC_BACKEND_URL = "http://backend.test/api/v1";
    process.env.BACKEND_API_KEY = "api-key-123";
  });

  it("does not convert a better-auth session cookie into a bearer token", async () => {
    mockedFetch.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const req = new NextRequest("http://localhost/api/v1/user/profile", {
      method: "GET",
      headers: {
        cookie:
          "onchain.token=stale-token-123; better-auth.session_token=current-session-456",
      },
    });

    const response = await GET(req);

    expect(response.status).toBe(200);
    const upstreamCall = mockedFetch.mock.calls.find(
      ([url]) => url === "http://backend.test/api/v1/user/profile"
    );
    expect(upstreamCall).toBeTruthy();

    const [, init] = upstreamCall ?? [];
    const forwardedHeaders = (init as RequestInit | undefined)
      ?.headers as Headers;
    expect(forwardedHeaders.get("authorization")).toBeNull();
    expect(forwardedHeaders.get("x-api-key")).toBe("api-key-123");
  });

  it("patches placeholder backend identity fields with the mirrored user cookie", async () => {
    const mirroredUser = {
      id: "real-user-id",
      email: "real.user@example.com",
      name: "Real User",
      firstName: "Real",
      lastName: "User",
    };
    const encodedUser = encodeURIComponent(
      Buffer.from(JSON.stringify(mirroredUser), "utf8").toString("base64")
    );

    mockedFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            id: "test-user-id",
            email: "test-user-id@onchainsuite.local",
            name: "Test User",
            firstName: "Test",
            lastName: "User",
            timezone: "UTC",
            twoFactorEnabled: false,
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      )
    );

    const req = new NextRequest("http://localhost/api/v1/user/profile", {
      method: "GET",
      headers: {
        cookie: `onchain.token=stale-token-123; onchain.user=${encodedUser}`,
      },
    });

    const response = await GET(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          id: "test-user-id",
          email: "real.user@example.com",
          name: "Real User",
          firstName: "Real",
          lastName: "User",
          timezone: "UTC",
        }),
      })
    );
  });
});
