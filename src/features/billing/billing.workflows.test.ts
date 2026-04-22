import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api-client";
import { isJsonObject } from "@/lib/utils";

import { billingService } from "./billing.service";

type ApiClientResponse = Awaited<ReturnType<typeof apiClient.request>>;

const mockResponse = (status: number, data: unknown) =>
  ({ status, data: { data } }) as unknown as ApiClientResponse;

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
    expect(
      (upgrade as unknown as { checkoutUrl?: string }).checkoutUrl
    ).toBeTruthy();

    const plan = await billingService.getPlan({ orgId: "org-123" });
    expect((plan as unknown as { name?: string }).name).toBe("Pro");

    const invoices = await billingService.listInvoices(
      { page: 1, limit: 10 },
      { orgId: "org-123" }
    );
    const invoicesObj = isJsonObject(invoices) ? invoices : undefined;
    const list = Array.isArray(invoicesObj?.items)
      ? invoicesObj.items
      : Array.isArray(invoicesObj?.data)
        ? invoicesObj.data
        : [];
    expect(Array.isArray(list)).toBe(true);
    expect((list[0] as unknown as { id?: string } | undefined)?.id).toBe(
      "inv_1"
    );
  });
});
