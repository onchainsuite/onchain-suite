import { describe, expect, it, vi, beforeEach } from "vitest";

import { apiClient } from "@/lib/api-client";
import { billingService } from "./billing.service";

type MockResponse<T> = { status: number; data: T };

const mockAxiosError = (status: number, data?: any) => {
  const err: any = new Error("AxiosError");
  err.response = { status, data };
  return err;
};

describe("billingService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("adds x-org-id header when orgId is provided", async () => {
    const requestSpy = vi
      .spyOn(apiClient, "request")
      .mockResolvedValueOnce({ status: 200, data: { data: { ok: true } } } as MockResponse<any>);

    const res = await billingService.getOverview({ orgId: "org-123" });

    expect(res).toEqual({ ok: true });
    expect(requestSpy).toHaveBeenCalledTimes(1);
    const cfg = requestSpy.mock.calls[0]?.[0] as any;
    expect(cfg.headers["x-org-id"]).toBe("org-123");
  });

  it("retries on 500 and succeeds", async () => {
    const requestSpy = vi
      .spyOn(apiClient, "request")
      .mockRejectedValueOnce(mockAxiosError(500, { message: "boom" }))
      .mockResolvedValueOnce({ status: 200, data: { data: { ok: true } } } as MockResponse<any>);

    const res = await billingService.getPlan({ orgId: "org-123" });

    expect(res).toEqual({ ok: true });
    expect(requestSpy).toHaveBeenCalledTimes(2);
  });

  it("returns friendly error message on 401", async () => {
    vi.spyOn(apiClient, "request").mockRejectedValueOnce(
      mockAxiosError(401, { error: { message: "Authentication failed" } })
    );

    await expect(billingService.listInvoices(undefined, { orgId: "org-123" }))
      .rejects.toThrow("You’re not authenticated");
  });

  it("hits the correct endpoint for invoice download", async () => {
    const requestSpy = vi
      .spyOn(apiClient, "request")
      .mockResolvedValueOnce({ status: 200, data: { data: { url: "https://example.com/invoice.pdf" } } } as MockResponse<any>);

    const res = await billingService.getInvoiceDownloadUrl("inv_1", { orgId: "org-123" });

    expect(res).toEqual({ url: "https://example.com/invoice.pdf" });
    const cfg = requestSpy.mock.calls[0]?.[0] as any;
    expect(cfg.method).toBe("GET");
    expect(cfg.url).toBe("/billing/invoices/inv_1/download");
  });
});

