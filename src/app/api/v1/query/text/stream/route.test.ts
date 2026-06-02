/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSession } from "@/lib/auth-session";

import { GET } from "./route";

vi.mock("@/lib/auth-session", () => ({
  getSession: vi.fn(),
}));

const mockedGetSession = vi.mocked(getSession);
type SessionValue = Awaited<ReturnType<typeof getSession>>;

const mockedFetch = vi.fn<typeof fetch>();
global.fetch = mockedFetch as unknown as typeof fetch;

describe("Query Text Stream API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockedGetSession.mockResolvedValue(null as SessionValue);
    const req = new NextRequest(
      "http://localhost/api/v1/query/text/stream?query=hello",
      { headers: { "x-org-id": "org-1" } }
    );
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 422 when query is missing", async () => {
    mockedGetSession.mockResolvedValue({
      session: {},
      user: { id: "u1" },
    } as unknown as SessionValue);
    const req = new NextRequest("http://localhost/api/v1/query/text/stream", {
      headers: { "x-org-id": "org-1" },
    });
    const res = await GET(req);
    expect(res.status).toBe(422);
  });

  it("proxies SSE stream when upstream ok", async () => {
    mockedGetSession.mockResolvedValue({
      session: {},
      user: { id: "u1" },
    } as unknown as SessionValue);

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          encoder.encode('data: {"type":"token","token":"Hi"}\n\n')
        );
        controller.enqueue(
          encoder.encode(
            'data: {"type":"done","data":{"answer":"Hi","queryLogId":"q1"}}\n\n'
          )
        );
        controller.close();
      },
    });

    mockedFetch.mockResolvedValue(
      new Response(stream, {
        status: 200,
        headers: { "content-type": "text/event-stream" },
      })
    );

    const req = new NextRequest(
      "http://localhost/api/v1/query/text/stream?query=hello&mode=best",
      {
        headers: {
          "x-org-id": "org-1",
          cookie: "better-auth.session_token=abc",
        },
      }
    );

    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") ?? "").toContain(
      "text/event-stream"
    );
    expect(mockedFetch).toHaveBeenCalled();
  });
});
