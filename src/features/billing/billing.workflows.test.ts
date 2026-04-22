import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api-client";

import { billingService } from "./billing.service";

const mockResponse = (status: number, data: any) =>
  ({ status, data: { data } }) as any;

describe("billing workflows", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("upgrade -> plan -> invoices flow", async () => {
    const requestSpy = vi.spyOn(apiClient, "request");

    requestSpy
      .mockResolvedValueOnce(
        mockResponse(200, {
          checkoutUrl: "https://checkout.example.com",
          success: true,
        })
      )
      .mockResolvedValueOnce(
        mockResponse(200, { name: "Pro", status: "active" })
      )
      .mockResolvedValueOnce(
        mockResponse(200, {
          items: [
            { id: "inv_1", number: "INV-001", amount: 49, currency: "USD" },
          ],
        })
      );

    const upgrade = await billingService.upgradeFiat(
      { plan: "Pro" },
      { orgId: "org-123" }
    );
    expect((upgrade as any).checkoutUrl).toBeTruthy();

    const plan = await billingService.getPlan({ orgId: "org-123" });
    expect((plan as any).name).toBe("Pro");

    const invoices = await billingService.listInvoices(
      { page: 1, limit: 10 },
      { orgId: "org-123" }
    );
    const list = (invoices as any).items ?? (invoices as any).data ?? [];
    expect(Array.isArray(list)).toBe(true);
    expect(list[0]?.id).toBe("inv_1");
  });
});
