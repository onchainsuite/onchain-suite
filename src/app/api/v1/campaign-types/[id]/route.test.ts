/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSession } from "@/lib/auth-session";

import { POST } from "../route";
import { DELETE, GET, PUT } from "./route";

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

describe("Campaign Types by id API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    resetStore();
  });

  it("GET /campaign-types/:id returns 404 when missing", async () => {
    mockedGetSession.mockResolvedValue({
      session: {},
      user: { id: "u1" },
    } as unknown as SessionValue);
    const req = new NextRequest("http://localhost/api/v1/campaign-types/NOPE", {
      headers: { "x-org-id": "org-1" },
    });
    const res = await GET(req, { params: Promise.resolve({ id: "NOPE" }) });
    expect(res.status).toBe(404);
  });

  it("PUT /campaign-types/:id rejects updates to system records", async () => {
    mockedGetSession.mockResolvedValue({
      session: {},
      user: { id: "u1", role: "admin" },
    } as unknown as SessionValue);
    const req = new NextRequest(
      "http://localhost/api/v1/campaign-types/EMAIL_BLAST",
      {
        method: "PUT",
        headers: { "x-org-id": "org-1" },
        body: JSON.stringify({ label: "New" }),
      }
    );
    const res = await PUT(req, {
      params: Promise.resolve({ id: "EMAIL_BLAST" }),
    });
    expect(res.status).toBe(409);
  });

  it("PUT /campaign-types/:id updates a custom record", async () => {
    mockedGetSession.mockResolvedValue({
      session: {},
      user: { id: "u1", role: "admin" },
    } as unknown as SessionValue);

    const createReq = new NextRequest(
      "http://localhost/api/v1/campaign-types",
      {
        method: "POST",
        headers: { "x-org-id": "org-1" },
        body: JSON.stringify({ label: "My Type", channels: ["email"] }),
      }
    );
    const created = await POST(createReq);
    expect(created.status).toBe(201);

    const req = new NextRequest(
      "http://localhost/api/v1/campaign-types/MY_TYPE",
      {
        method: "PUT",
        headers: { "x-org-id": "org-1" },
        body: JSON.stringify({ supportsSchedule: false }),
      }
    );
    const res = await PUT(req, { params: Promise.resolve({ id: "MY_TYPE" }) });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json?.data?.supportsSchedule).toBe(false);
  });

  it("DELETE /campaign-types/:id deletes a custom record", async () => {
    mockedGetSession.mockResolvedValue({
      session: {},
      user: { id: "u1", role: "admin" },
    } as unknown as SessionValue);

    const createReq = new NextRequest(
      "http://localhost/api/v1/campaign-types",
      {
        method: "POST",
        headers: { "x-org-id": "org-1" },
        body: JSON.stringify({ label: "To Delete", channels: ["email"] }),
      }
    );
    const created = await POST(createReq);
    expect(created.status).toBe(201);

    const req = new NextRequest(
      "http://localhost/api/v1/campaign-types/TO_DELETE",
      {
        method: "DELETE",
        headers: { "x-org-id": "org-1" },
      }
    );
    const res = await DELETE(req, {
      params: Promise.resolve({ id: "TO_DELETE" }),
    });
    expect(res.status).toBe(204);
  });
});
