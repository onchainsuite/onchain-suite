import { describe, expect, it, vi } from "vitest";

import { campaignsService } from "./campaigns.service";

const requestMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-client", () => {
  return {
    apiClient: {
      request: (...args: unknown[]) => requestMock(...args),
    },
  };
});

describe("campaignsService enum mapping", () => {
  it("normalizes campaign types from API into UI values", async () => {
    requestMock.mockResolvedValueOnce({
      data: {
        data: [{ id: "DRIP_CAMPAIGN", label: "Drip campaign" }],
      },
    });

    const types = await campaignsService.listCampaignTypes();
    expect(types[0]?.id).toBe("drip-campaign");
  });

  it("maps UI type/status to API enum values for createCampaign and normalizes response back", async () => {
    requestMock.mockImplementationOnce(async (config: unknown) => {
      return {
        data: {
          id: "c_1",
          name: "Untitled campaign",
          type: "EMAIL_BLAST",
          status: "DRAFT",
          subject: "",
          audience: [],
          recipients: 0,
          createdAt: new Date().toISOString(),
        },
        __config: config,
      };
    });

    const created = await campaignsService.createCampaign({
      name: "Untitled campaign",
      type: "email-blast",
      status: "draft",
    });

    expect(created.type).toBe("email-blast");
    expect(created.status).toBe("draft");

    const call = requestMock.mock.calls[0]?.[0] as
      | { data?: unknown; method?: unknown; url?: unknown }
      | undefined;
    expect(call?.method).toBe("POST");
    expect(call?.url).toBe("/campaigns");
    expect(call?.data).toMatchObject({
      type: "EMAIL_BLAST",
      status: "DRAFT",
    });
  });
});
