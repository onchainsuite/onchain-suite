/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSession } from "@/lib/auth-session";

import { GET, POST } from "./route";

vi.mock("@/lib/auth-session", () => ({
  getSession: vi.fn(),
}));

const mockedGetSession = vi.mocked(getSession);
type SessionValue = Awaited<ReturnType<typeof getSession>>;

const resetStore = () => {
  const g = globalThis as unknown as {
    __onchainCampaignTypeStore?: Map<string, unknown>;
  };
  delete g.__onchainCampaignTypeStore;
};

describe("Campaign Types API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    resetStore();
  });

  it("GET /campaign-types returns 401 when unauthenticated", async () => {
    mockedGetSession.mockResolvedValue(null as SessionValue);
    const req = new NextRequest("http://localhost/api/v1/campaign-types", {
      headers: { "x-org-id": "org-1" },
    });
    const res = await GET(req);
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json?.error?.code).toBe("UNAUTHORIZED");
  });

  it("GET /campaign-types returns seeded defaults", async () => {
    mockedGetSession.mockResolvedValue({
      session: {},
      user: { id: "u1" },
    } as unknown as SessionValue);
    const req = new NextRequest("http://localhost/api/v1/campaign-types", {
      headers: { "x-org-id": "org-1" },
    });
    const res = await GET(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    const ids = (json.data as Array<{ id: string }>).map((x) => x.id);
    expect(ids).toContain("EMAIL_BLAST");
    expect(ids).toContain("DRIP_CAMPAIGN");
    expect(ids).toContain("SMART_SENDING");
  });

  it("POST /campaign-types requires admin role", async () => {
    mockedGetSession.mockResolvedValue({
      session: {},
      user: { id: "u1", role: "user" },
    } as unknown as SessionValue);
    const req = new NextRequest("http://localhost/api/v1/campaign-types", {
      method: "POST",
      headers: { "x-org-id": "org-1" },
      body: JSON.stringify({ label: "Custom" }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(403);
    expect(json?.error?.code).toBe("FORBIDDEN");
  });

  it("POST /campaign-types creates a custom type when admin", async () => {
    mockedGetSession.mockResolvedValue({
      session: {},
      user: { id: "u1", role: "admin" },
    } as unknown as SessionValue);
    const req = new NextRequest("http://localhost/api/v1/campaign-types", {
      method: "POST",
      headers: { "x-org-id": "org-1" },
      body: JSON.stringify({
        label: "My Custom Type",
        channels: ["email"],
        supportsSchedule: false,
        supportsSequence: false,
      }),
    });
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json?.data?.id).toBe("MY_CUSTOM_TYPE");
    expect(json?.data?.isSystem).toBe(false);
  });
});
