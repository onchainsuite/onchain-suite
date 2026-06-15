import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  apiClient: {
    request: vi.fn(),
  },
}));

vi.mock("@/lib/api-client", () => ({
  apiClient: mocks.apiClient,
}));

vi.mock("@/lib/utils", async () => {
  const actual = await vi.importActual("@/lib/utils");
  return {
    ...actual,
    getSelectedOrganizationId: () => "org_test_123",
  };
});

import { intelligenceService } from "./intelligence.service";

describe("intelligenceService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.apiClient.request.mockResolvedValue({ data: {} });
  });

  it("requests query starters with org-scoped headers", async () => {
    await intelligenceService.getQueryStarters();

    expect(mocks.apiClient.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "/intelligence/query/starters",
        headers: expect.objectContaining({
          "x-org-id": "org_test_123",
          "x-onchain-silent-error": "1",
        }),
      })
    );
  });

  it("posts query suggestions using the documented payload shape", async () => {
    const body = {
      prompt: "Find high-value dormant users",
      protocol: "Pudgy Penguins",
      sector: "nft" as const,
      chain: "eth-mainnet",
      contractAddresses: ["0xabc"],
      goal: "winback",
      limit: 3,
      includeSql: true,
      mode: "best" as const,
    };

    await intelligenceService.getQuerySuggestions(body);

    expect(mocks.apiClient.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/intelligence/query/suggestions",
        data: body,
      })
    );
  });

  it("supports protocol registry list and upsert endpoints", async () => {
    await intelligenceService.listQueryProtocols({
      search: "pudgy",
      sector: "nft",
      chain: "base-mainnet",
    });

    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: "GET",
        url: "/intelligence/query/protocols",
        params: {
          search: "pudgy",
          sector: "nft",
          chain: "base-mainnet",
        },
      })
    );

    await intelligenceService.upsertQueryProtocol({
      name: "Pudgy Penguins",
      sector: "nft",
      chain: "eth-mainnet",
      contractAddresses: ["0xabc"],
      aliases: ["Pudgies"],
      metadata: { source: "manual" },
    });

    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        method: "POST",
        url: "/intelligence/query/protocols",
      })
    );
  });

  it("supports suggestion tracking, analytics, and SQL generation", async () => {
    await intelligenceService.trackQuerySuggestion("log_123", {
      selected: true,
      executed: true,
      metadata: { source: "editor" },
    });
    await intelligenceService.getQuerySuggestionsAnalytics();
    await intelligenceService.generateSql({
      prompt: "Find inactive whales",
      mode: "fast",
    });

    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: "POST",
        url: "/intelligence/query/suggestions/log_123/track",
      })
    );
    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        method: "GET",
        url: "/intelligence/query/suggestions/analytics",
      })
    );
    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        method: "POST",
        url: "/intelligence/query/generate-sql",
      })
    );
  });

  it("supports query cache inspection and invalidation", async () => {
    await intelligenceService.listQueryCache({
      chain: "base-mainnet",
      resourceType: "balances",
      subjectAddress: "0xabc",
      page: 1,
      limit: 20,
    });
    await intelligenceService.getQueryCacheEntry("cache_123");
    await intelligenceService.deleteQueryCacheEntry("cache_123");

    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: "GET",
        url: "/intelligence/query/cache",
      })
    );
    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        method: "GET",
        url: "/intelligence/query/cache/cache_123",
      })
    );
    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        method: "DELETE",
        url: "/intelligence/query/cache/cache_123",
      })
    );
  });

  it("supports wallet and contact enrichment endpoints", async () => {
    await intelligenceService.enqueueWalletEnrichment({
      walletAddress: "0xabc",
      chain: "base-mainnet",
      forceRefresh: true,
    });
    await intelligenceService.enqueueContactsEnrichment({
      chain: "eth-mainnet",
      limit: 25,
    });
    await intelligenceService.getWalletEnrichmentMetrics("0xabc");

    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: "POST",
        url: "/intelligence/query/enrichment/wallets/enqueue",
      })
    );
    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        method: "POST",
        url: "/intelligence/query/enrichment/contacts/enqueue",
      })
    );
    expect(mocks.apiClient.request).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        method: "GET",
        url: "/intelligence/query/enrichment/wallets/0xabc",
      })
    );
  });
});
