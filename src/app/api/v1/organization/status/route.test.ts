/**
 * @vitest-environment node
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSession } from "@/lib/auth-session";

import { GET } from "./route";

// Mock getSession
vi.mock("@/lib/auth-session", () => ({
  getSession: vi.fn(),
}));

// Mock fetch
const mockedFetch = vi.fn<typeof fetch>();
global.fetch = mockedFetch as unknown as typeof fetch;

const mockedGetSession = vi.mocked(getSession);
type SessionValue = Awaited<ReturnType<typeof getSession>>;

describe("Organization Status API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return 401 if no session", async () => {
    mockedGetSession.mockResolvedValue(null as SessionValue);
    const req = new NextRequest("http://localhost/api/v1/organization/status");

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ isActive: false, status: "unknown" });
  });

  it("should return 401 if no active organization", async () => {
    mockedGetSession.mockResolvedValue({ session: {} } as SessionValue);
    const req = new NextRequest("http://localhost/api/v1/organization/status");

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ isActive: false, status: "unknown" });
  });

  it("should return isActive=true if status is active", async () => {
    mockedGetSession.mockResolvedValue({
      session: {
        activeOrganizationId: "org-123",
        token: "token-123",
      },
    } as SessionValue);

    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "active" }),
    } as unknown as Response);

    const req = new NextRequest("http://localhost/api/v1/organization/status");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ isActive: true, status: "active" });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/organization"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-org-id": "org-123",
        }),
      })
    );
  });

  it("should return isActive=false if status is inactive", async () => {
    mockedGetSession.mockResolvedValue({
      session: {
        activeOrganizationId: "org-123",
        token: "token-123",
      },
    } as SessionValue);

    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "inactive" }),
    } as unknown as Response);

    const req = new NextRequest("http://localhost/api/v1/organization/status");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ isActive: false, status: "inactive" });
  });

  it("should return isActive=true if fetch fails", async () => {
    mockedGetSession.mockResolvedValue({
      session: {
        activeOrganizationId: "org-123",
        token: "token-123",
      },
    } as SessionValue);

    mockedFetch.mockResolvedValue({
      ok: false,
    } as unknown as Response);

    const req = new NextRequest("http://localhost/api/v1/organization/status");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ isActive: true, status: "unknown" });
  });
});
