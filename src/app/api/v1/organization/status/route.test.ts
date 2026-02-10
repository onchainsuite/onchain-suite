/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";

// Mock getSession
vi.mock("@/lib/auth-session", () => ({
  getSession: vi.fn(),
}));

import { getSession } from "@/lib/auth-session";

// Mock fetch
global.fetch = vi.fn();

describe("Organization Status API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return 401 if no session", async () => {
    (getSession as any).mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/v1/organization/status");

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ isActive: false, status: "unknown" });
  });

  it("should return 401 if no active organization", async () => {
    (getSession as any).mockResolvedValue({ session: {} });
    const req = new NextRequest("http://localhost/api/v1/organization/status");

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ isActive: false, status: "unknown" });
  });

  it("should return isActive=true if status is active", async () => {
    (getSession as any).mockResolvedValue({
      session: {
        activeOrganizationId: "org-123",
        token: "token-123",
      },
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ status: "active" }),
    });

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
    (getSession as any).mockResolvedValue({
      session: {
        activeOrganizationId: "org-123",
        token: "token-123",
      },
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ status: "inactive" }),
    });

    const req = new NextRequest("http://localhost/api/v1/organization/status");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ isActive: false, status: "inactive" });
  });

  it("should return isActive=true if fetch fails", async () => {
    (getSession as any).mockResolvedValue({
      session: {
        activeOrganizationId: "org-123",
        token: "token-123",
      },
    });

    (global.fetch as any).mockResolvedValue({
      ok: false,
    });

    const req = new NextRequest("http://localhost/api/v1/organization/status");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ isActive: true, status: "unknown" });
  });
});
