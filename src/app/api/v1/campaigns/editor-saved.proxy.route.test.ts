/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "../[...path]/route";

const mockedFetch = vi.fn<typeof fetch>();
global.fetch = mockedFetch as unknown as typeof fetch;

describe("API v1 proxy (campaign editor saved payload)", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    mockedFetch.mockImplementation(async () => {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
  });

  it("normalizes editor saved payload into { html, textVersion, json, assets }", async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "http://backend.test/api/v1";

    const req = new NextRequest(
      "http://localhost/api/v1/campaigns/c_1/editor/saved",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-org-id": "org_123",
          authorization: "Bearer token_123",
        },
        body: JSON.stringify({
          payload: {
            html: "<p>Hello</p>",
            text: "Hello",
            design: { blocks: [] },
            assets: [{ id: "a1" }],
          },
        }),
      }
    );

    const response = await POST(req, {
      params: Promise.resolve({
        path: ["campaigns", "c_1", "editor", "saved"],
      }),
    });

    expect(response.status).toBe(200);
    const backendCall = mockedFetch.mock.calls.find(([input]) =>
      String(input).includes("backend.test/api/v1/campaigns/c_1/editor/saved")
    );
    expect(backendCall).toBeTruthy();

    const [, init] = backendCall ?? [];
    const initObj = init as unknown as { body?: unknown; headers?: Headers };
    const rawBody = initObj.body as ArrayBuffer;
    const parsed = JSON.parse(new TextDecoder().decode(rawBody));

    expect(parsed).toEqual({
      html: "<p>Hello</p>",
      textVersion: "Hello",
      json: { blocks: [] },
      assets: [{ id: "a1" }],
    });

    const contentType = initObj.headers?.get("content-type");
    expect(contentType).toContain("application/json");
  });

  it("normalizes nested data.payload editor content so rendered HTML is not dropped", async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "http://backend.test/api/v1";

    const req = new NextRequest(
      "http://localhost/api/v1/campaigns/c_1/editor/saved",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-org-id": "org_123",
          authorization: "Bearer token_123",
        },
        body: JSON.stringify({
          data: {
            payload: {
              content: {
                html: "<p>Nested hello</p>",
                textVersion: "Nested hello",
              },
              design: { blocks: [{ id: "b1" }] },
              assets: [{ id: "a2" }],
            },
          },
        }),
      }
    );

    const response = await POST(req, {
      params: Promise.resolve({
        path: ["campaigns", "c_1", "editor", "saved"],
      }),
    });

    expect(response.status).toBe(200);
    const backendCall = mockedFetch.mock.calls.find(([input]) =>
      String(input).includes("backend.test/api/v1/campaigns/c_1/editor/saved")
    );
    expect(backendCall).toBeTruthy();

    const [, init] = backendCall ?? [];
    const initObj = init as unknown as { body?: unknown };
    const rawBody = initObj.body as ArrayBuffer;
    const parsed = JSON.parse(new TextDecoder().decode(rawBody));

    expect(parsed).toEqual({
      html: "<p>Nested hello</p>",
      textVersion: "Nested hello",
      json: { blocks: [{ id: "b1" }] },
      assets: [{ id: "a2" }],
    });
  });

  it("injects x-org-id and Authorization from query for embedded editor calls", async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "http://backend.test/api/v1";

    const req = new NextRequest(
      "http://localhost/api/v1/templates?orgId=org_123&token=token_123",
      { method: "GET" }
    );

    const response = await GET(req, {
      params: Promise.resolve({
        path: ["templates"],
      }),
    });

    expect(response.status).toBe(200);
    const backendCall = mockedFetch.mock.calls.find(([input]) =>
      String(input).includes("backend.test/api/v1/templates?orgId=org_123&token=token_123")
    );
    expect(backendCall).toBeTruthy();

    const [, init] = backendCall ?? [];
    const initObj = init as unknown as { headers?: Headers };
    const headers = initObj.headers;
    expect(headers?.get("x-org-id")).toBe("org_123");
    expect(headers?.get("authorization")).toBe("Bearer token_123");
  });
});
