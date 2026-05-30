/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "../[...path]/route";

const mockedFetch = vi.fn<typeof fetch>();
global.fetch = mockedFetch as unknown as typeof fetch;

describe("API v1 proxy (in-app integration)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.NEXT_PUBLIC_BACKEND_URL = "http://backend.test/api/v1";
  });

  it("forwards GET /integrations/inapp/status to backend with org header", async () => {
    mockedFetch.mockResolvedValue(
      new Response(JSON.stringify({ publishableKey: "pk", secretKey: "sk" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const req = new NextRequest(
      "http://localhost/api/v1/integrations/inapp/status",
      {
        headers: {
          "x-org-id": "org_123",
          authorization: "Bearer token_123",
        },
      }
    );

    const response = await GET(req, {
      params: Promise.resolve({
        path: ["integrations", "inapp", "status"],
      }),
    });

    expect(response.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://backend.test/api/v1/integrations/inapp/status",
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      })
    );

    const [, init] = mockedFetch.mock.calls[0] ?? [];
    const forwardedHeaders = (init as RequestInit | undefined)
      ?.headers as Headers;
    expect(forwardedHeaders.get("x-org-id")).toBe("org_123");
    expect(forwardedHeaders.get("authorization")).toBe("Bearer token_123");
  });

  it("forwards POST /integrations/inapp/test-push to backend", async () => {
    mockedFetch.mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const req = new NextRequest(
      "http://localhost/api/v1/integrations/inapp/test-push",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-org-id": "org_123",
          authorization: "Bearer token_123",
        },
        body: JSON.stringify({ walletAddress: "0xabc", title: "t", body: "b" }),
      }
    );

    const response = await POST(req, {
      params: Promise.resolve({
        path: ["integrations", "inapp", "test-push"],
      }),
    });

    expect(response.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://backend.test/api/v1/integrations/inapp/test-push",
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Headers),
      })
    );
  });
});
