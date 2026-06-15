/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PUT } from "./route";

const mockedFetch = vi.fn<typeof fetch>();
global.fetch = mockedFetch as unknown as typeof fetch;

describe("campaign email proxy route", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    mockedFetch.mockImplementation(async () => {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
  });

  it("preserves metadata fields when forwarding PUT /campaigns/:id/email", async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "http://backend.test/api/v1";

    const req = new NextRequest(
      "http://localhost/api/v1/campaigns/c_1/email",
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-org-id": "org_123",
          authorization: "Bearer token_123",
        },
        body: JSON.stringify({
          subject: "Welcome",
          previewText: "Preview line",
          senderName: "Onchain",
          senderEmail: "hello@example.com",
          replyToEmail: "reply@example.com",
          html: "<p>Hello</p>",
          textVersion: "Hello",
          json: { blocks: [] },
          assets: [{ id: "a1" }],
        }),
      }
    );

    const response = await PUT(req, {
      params: Promise.resolve({ id: "c_1" }),
    });

    expect(response.status).toBe(200);
    const backendCall = mockedFetch.mock.calls.find(([input]) =>
      String(input).includes("backend.test/api/v1/campaigns/c_1/email")
    );
    expect(backendCall).toBeTruthy();

    const [, init] = backendCall ?? [];
    const initObj = init as { body?: string };
    const parsed = JSON.parse(initObj.body ?? "{}");

    expect(parsed).toEqual({
      subject: "Welcome",
      previewText: "Preview line",
      senderName: "Onchain",
      senderEmail: "hello@example.com",
      replyToEmail: "reply@example.com",
      html: "<p>Hello</p>",
      textVersion: "Hello",
      json: { blocks: [] },
      assets: [{ id: "a1" }],
    });
  });
});
