/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const mockedFetch = vi.fn<typeof fetch>();
global.fetch = mockedFetch as unknown as typeof fetch;

describe("Logo upload proxy route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.NEXT_PUBLIC_BACKEND_URL = "http://backend.test/api/v1";
    process.env.BACKEND_API_KEY = "api-key-123";
  });

  it("forwards derived auth, org, and api key headers to the backend", async () => {
    mockedFetch.mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const formData = new FormData();
    formData.append(
      "file",
      new File(["logo"], "logo.png", { type: "image/png" })
    );

    const req = new NextRequest(
      "http://localhost/api/upload/logo/primary?orgId=org_123",
      {
        method: "POST",
        headers: {
          cookie: "better-auth.session_token=session-token-123",
        },
        body: formData,
      }
    );

    const response = await POST(req, {
      params: Promise.resolve({ type: "primary" }),
    });

    expect(response.status).toBe(200);
    expect(mockedFetch).toHaveBeenCalledWith(
      "http://backend.test/api/v1/organization/branding/logo/primary",
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Headers),
      })
    );

    const [, init] = mockedFetch.mock.calls[0] ?? [];
    const forwardedHeaders = (init as RequestInit | undefined)
      ?.headers as Headers;
    expect(forwardedHeaders.get("authorization")).toBe(
      "Bearer session-token-123"
    );
    expect(forwardedHeaders.get("x-session-token")).toBe("session-token-123");
    expect(forwardedHeaders.get("x-editor-token")).toBe("session-token-123");
    expect(forwardedHeaders.get("x-org-id")).toBe("org_123");
    expect(forwardedHeaders.get("x-api-key")).toBe("api-key-123");
    expect(forwardedHeaders.get("cookie")).toContain(
      "better-auth.session_token=session-token-123"
    );
    expect(forwardedHeaders.get("cookie")).toContain(
      "onchain.token=session-token-123"
    );
  });
});
