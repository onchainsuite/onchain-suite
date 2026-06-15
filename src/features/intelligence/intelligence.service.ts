import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

export type IntelligenceQueryStatus =
  | "running"
  | "completed"
  | "failed"
  | string;

export interface IntelligenceQueryRunResponse {
  queryId: string;
  status: IntelligenceQueryStatus;
  resultSummary?: string;
  provider?: string;
  columns?: Array<{ name: string; type?: string }>;
  rows?: Array<Record<string, unknown>> | unknown[];
  totalRows?: number;
  cache?: Record<string, unknown>;
  summary?: Record<string, unknown>;
}

export interface IntelligenceQueryValidateResponse {
  valid: boolean;
  suggestions?: string[];
}

export interface IntelligenceQueryHistoryItem {
  queryId: string;
  id?: string;
  query: string;
  status: IntelligenceQueryStatus;
  createdAt?: string;
  updatedAt?: string;
  resultSummary?: string;
  provider?: string;
  cacheHit?: boolean;
  metadata?: Record<string, unknown>;
}

export interface IntelligenceGoldrushRunBody {
  resourceType:
    | "balances"
    | "transactions"
    | "nft_holdings"
    | "portfolio_summary"
    | "enriched_activity";
  chain: string;
  subjectAddress: string;
  forceRefresh?: boolean;
  allowStale?: boolean;
  cacheScope?: "organization" | "user";
  limit?: number;
  cursor?: string;
  noSpam?: boolean;
}

export interface IntelligenceQueryStatusResponse {
  queryId: string;
  status: IntelligenceQueryStatus;
  error?: string;
  updatedAt?: string;
}

export interface IntelligenceQueryResultsResponse {
  rows: Array<Record<string, unknown>> | unknown[];
  total: number;
}

export interface IntelligenceQuerySummaryResponse {
  summary: string;
  winbackPotential?: string;
  score?: number;
}

export interface IntelligenceQuerySaveResponse {
  reportId?: string;
  success?: boolean;
}

export interface IntelligenceQueryStarter {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  query: string;
}

export interface IntelligenceQueryStartersResponse {
  items: IntelligenceQueryStarter[];
}

export interface IntelligenceQuerySuggestionRequest {
  prompt?: string;
  protocol?: string;
  sector?:
    | "nft"
    | "defi"
    | "gaming"
    | "meme"
    | "dao"
    | "payments"
    | "infrastructure"
    | "general";
  chain?: string;
  contractAddresses?: string[];
  goal?: string;
  limit?: number;
  includeSql?: boolean;
  mode?: "fast" | "best";
}

export interface IntelligenceQuerySuggestion {
  id: string;
  title: string;
  prompt?: string;
  reason?: string;
  sector?: string;
  goal?: string;
  tags?: string[];
  suggestedTables?: string[];
  sqlDraft?: string;
  starterQuery?: IntelligenceQueryStarter | Record<string, unknown> | null;
  warnings?: string[];
  confidence?: number;
}

export interface IntelligenceQuerySuggestionsResponse {
  source?: string;
  summary?: string;
  context?: Record<string, unknown>;
  suggestions: IntelligenceQuerySuggestion[];
}

export interface IntelligenceProtocolRegistryEntry {
  id: string;
  name: string;
  slug?: string;
  sector?: string;
  chain?: string;
  contractAddresses?: string[];
  aliases?: string[];
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface IntelligenceProtocolRegistryListResponse {
  items: IntelligenceProtocolRegistryEntry[];
}

export interface IntelligenceQuerySuggestionTrackRequest {
  selected?: boolean;
  executed?: boolean;
  saved?: boolean;
  convertedToSegment?: boolean;
  convertedToCampaign?: boolean;
  metadata?: Record<string, unknown>;
}

export interface IntelligenceQuerySuggestionTrackResponse {
  id: string;
  suggestionId?: string;
  selected?: boolean;
  executed?: boolean;
  saved?: boolean;
  convertedToSegment?: boolean;
  convertedToCampaign?: boolean;
  lastInteractionAt?: string;
  metadata?: Record<string, unknown>;
}

export interface IntelligenceQuerySuggestionsAnalyticsResponse {
  totals?: Record<string, unknown>;
  topProtocols?: Array<Record<string, unknown>>;
}

export interface IntelligenceGenerateSqlResponse {
  prompt?: string;
  sql?: string;
  explanation?: string;
  warnings?: string[];
  valid?: boolean;
  starterQuery?: IntelligenceQueryStarter | Record<string, unknown> | null;
  schema?: Record<string, unknown>;
  provider?: string;
  mode?: "fast" | "best" | string;
}

export interface IntelligenceSegmentFromQueryResponse {
  segmentId: string;
  profileCount?: number;
}

export interface IntelligenceCampaignFromQueryResponse {
  campaignId: string;
}

export interface IntelligenceSchemaResponse {
  tables?: Array<Record<string, unknown>>;
  entities?: Array<Record<string, unknown>>;
  columns?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface IntelligenceMetricsResponse {
  score?: number;
  segmentsCount?: number;
  revenuePotential?: number;
  [key: string]: unknown;
}

export interface IntelligenceSegment {
  id: string;
  name: string;
  size?: number;
  matchCount?: number;
  lastUsedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  tags?: string[];
  rules?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface IntelligenceSegmentsListResponse {
  items: IntelligenceSegment[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface IntelligenceSegmentsMetricsResponse {
  segmentsCount?: number;
  revenuePotential?: number;
  [key: string]: unknown;
}

export interface IntelligenceSegmentProfilesResponse {
  items: Array<Record<string, unknown>>;
  total?: number;
  page?: number;
  limit?: number;
}

export interface IntelligenceReportsListResponse {
  items: Array<Record<string, unknown>>;
  total?: number;
  page?: number;
  limit?: number;
}

export interface IntelligenceQueryCacheListResponse {
  data: Array<Record<string, unknown>>;
  meta?: Record<string, unknown>;
}

export interface IntelligenceQueryCacheDetailResponse extends Record<
  string,
  unknown
> {}

export interface IntelligenceWalletEnrichmentEnqueueResponse extends Record<
  string,
  unknown
> {}

export interface IntelligenceContactsEnrichmentEnqueueResponse extends Record<
  string,
  unknown
> {}

export interface IntelligenceWalletEnrichmentMetricsResponse extends Record<
  string,
  unknown
> {}

const pickOrgId = (orgId?: string) =>
  orgId ?? getSelectedOrganizationId() ?? null;

const extractData = <T>(payload: unknown): T => {
  if (isJsonObject(payload) && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
};

const request = async <T>(
  config: AxiosRequestConfig,
  orgId?: string
): Promise<T> => {
  const resolvedOrgId = pickOrgId(orgId);
  const headers = {
    ...(config.headers ?? {}),
    ...(resolvedOrgId ? { "x-org-id": resolvedOrgId } : {}),
    "x-onchain-silent-error": "1",
  };

  try {
    const res = await apiClient.request<T>({ ...config, headers });
    return extractData<T>(res.data);
  } catch (e) {
    const err = e as AxiosError<unknown>;
    const data = err.response?.data;
    const nestedError =
      isJsonObject(data) && isJsonObject(data.error) ? data.error : undefined;
    const message = isJsonObject(nestedError)
      ? nestedError.message
      : isJsonObject(data)
        ? data.message
        : typeof data === "string"
          ? data
          : (err.message ?? "Intelligence request failed");
    throw new Error(String(message));
  }
};

export const intelligenceService = {
  runQuery(body: { query: string }, orgId?: string) {
    return request<IntelligenceQueryRunResponse>(
      { method: "POST", url: "/intelligence/query/run", data: body },
      orgId
    );
  },

  getQueryStarters(orgId?: string) {
    return request<IntelligenceQueryStartersResponse>(
      { method: "GET", url: "/intelligence/query/starters" },
      orgId
    );
  },

  getQuerySuggestions(
    body: IntelligenceQuerySuggestionRequest,
    orgId?: string
  ) {
    return request<IntelligenceQuerySuggestionsResponse>(
      { method: "POST", url: "/intelligence/query/suggestions", data: body },
      orgId
    );
  },

  listQueryProtocols(
    params?: { search?: string; sector?: string; chain?: string },
    orgId?: string
  ) {
    return request<IntelligenceProtocolRegistryListResponse>(
      { method: "GET", url: "/intelligence/query/protocols", params },
      orgId
    );
  },

  upsertQueryProtocol(
    body: {
      name: string;
      sector: string;
      chain?: string;
      contractAddresses?: string[];
      aliases?: string[];
      metadata?: Record<string, unknown>;
    },
    orgId?: string
  ) {
    return request<IntelligenceProtocolRegistryEntry>(
      { method: "POST", url: "/intelligence/query/protocols", data: body },
      orgId
    );
  },

  trackQuerySuggestion(
    logId: string,
    body: IntelligenceQuerySuggestionTrackRequest,
    orgId?: string
  ) {
    return request<IntelligenceQuerySuggestionTrackResponse>(
      {
        method: "POST",
        url: `/intelligence/query/suggestions/${logId}/track`,
        data: body,
      },
      orgId
    );
  },

  getQuerySuggestionsAnalytics(orgId?: string) {
    return request<IntelligenceQuerySuggestionsAnalyticsResponse>(
      { method: "GET", url: "/intelligence/query/suggestions/analytics" },
      orgId
    );
  },

  generateSql(
    body: { prompt: string; mode?: "fast" | "best" },
    orgId?: string
  ) {
    return request<IntelligenceGenerateSqlResponse>(
      { method: "POST", url: "/intelligence/query/generate-sql", data: body },
      orgId
    );
  },

  runGoldrushQuery(body: IntelligenceGoldrushRunBody, orgId?: string) {
    return request<IntelligenceQueryRunResponse>(
      {
        method: "POST",
        url: "/intelligence/query/goldrush/run",
        data: body,
      },
      orgId
    );
  },

  validateQuery(body: { query: string }, orgId?: string) {
    return request<IntelligenceQueryValidateResponse>(
      { method: "POST", url: "/intelligence/query/validate", data: body },
      orgId
    );
  },

  getQueryHistory(orgId?: string) {
    return request<
      | { items?: IntelligenceQueryHistoryItem[] }
      | IntelligenceQueryHistoryItem[]
    >({ method: "GET", url: "/intelligence/query/history" }, orgId);
  },

  getQueryStatus(queryId: string, orgId?: string) {
    return request<IntelligenceQueryStatusResponse>(
      { method: "GET", url: `/intelligence/query/${queryId}/status` },
      orgId
    );
  },

  getQueryResults(
    queryId: string,
    params?: { page?: number; limit?: number },
    orgId?: string
  ) {
    return request<IntelligenceQueryResultsResponse>(
      {
        method: "GET",
        url: `/intelligence/query/${queryId}/results`,
        params,
      },
      orgId
    );
  },

  getQuerySummary(queryId: string, orgId?: string) {
    return request<IntelligenceQuerySummaryResponse>(
      { method: "GET", url: `/intelligence/query/${queryId}/summary` },
      orgId
    );
  },

  listQueryCache(
    params?: {
      chain?: string;
      resourceType?: string;
      subjectAddress?: string;
      page?: number;
      limit?: number;
    },
    orgId?: string
  ) {
    return request<IntelligenceQueryCacheListResponse>(
      { method: "GET", url: "/intelligence/query/cache", params },
      orgId
    );
  },

  getQueryCacheEntry(cacheId: string, orgId?: string) {
    return request<IntelligenceQueryCacheDetailResponse>(
      { method: "GET", url: `/intelligence/query/cache/${cacheId}` },
      orgId
    );
  },

  deleteQueryCacheEntry(cacheId: string, orgId?: string) {
    return request<{ deleted?: boolean; cacheId?: string }>(
      { method: "DELETE", url: `/intelligence/query/cache/${cacheId}` },
      orgId
    );
  },

  enqueueWalletEnrichment(
    body: { walletAddress: string; chain: string; forceRefresh?: boolean },
    orgId?: string
  ) {
    return request<IntelligenceWalletEnrichmentEnqueueResponse>(
      {
        method: "POST",
        url: "/intelligence/query/enrichment/wallets/enqueue",
        data: body,
      },
      orgId
    );
  },

  enqueueContactsEnrichment(
    body: { chain: string; limit?: number; forceRefresh?: boolean },
    orgId?: string
  ) {
    return request<IntelligenceContactsEnrichmentEnqueueResponse>(
      {
        method: "POST",
        url: "/intelligence/query/enrichment/contacts/enqueue",
        data: body,
      },
      orgId
    );
  },

  getWalletEnrichmentMetrics(walletAddress: string, orgId?: string) {
    return request<IntelligenceWalletEnrichmentMetricsResponse>(
      {
        method: "GET",
        url: `/intelligence/query/enrichment/wallets/${walletAddress}`,
      },
      orgId
    );
  },

  saveQuery(queryId: string, body: { name: string }, orgId?: string) {
    return request<IntelligenceQuerySaveResponse>(
      {
        method: "POST",
        url: `/intelligence/query/${queryId}/save`,
        data: body,
      },
      orgId
    );
  },

  createSegmentFromQuery(
    body: { queryId: string; name: string; tags?: string[] },
    orgId?: string
  ) {
    return request<IntelligenceSegmentFromQueryResponse>(
      {
        method: "POST",
        url: "/intelligence/query/segments/from-query",
        data: body,
      },
      orgId
    );
  },

  createCampaignFromQuery(
    body: { queryId: string; subject?: string; templateId?: unknown },
    orgId?: string
  ) {
    return request<IntelligenceCampaignFromQueryResponse>(
      {
        method: "POST",
        url: "/intelligence/query/campaign/from-query",
        data: body,
      },
      orgId
    );
  },

  getSchema(orgId?: string) {
    return request<IntelligenceSchemaResponse>(
      { method: "GET", url: "/intelligence/schema" },
      orgId
    );
  },

  getMetrics(orgId?: string) {
    return request<IntelligenceMetricsResponse>(
      { method: "GET", url: "/intelligence/metrics" },
      orgId
    );
  },

  listSegments(
    params?: { search?: string; page?: number; limit?: number; sort?: string },
    orgId?: string
  ) {
    return request<
      | IntelligenceSegmentsListResponse
      | { items?: IntelligenceSegment[] }
      | IntelligenceSegment[]
    >({ method: "GET", url: "/intelligence/segments", params }, orgId);
  },

  getSegmentsMetrics(orgId?: string) {
    return request<IntelligenceSegmentsMetricsResponse>(
      { method: "GET", url: "/intelligence/segments/metrics" },
      orgId
    );
  },

  getSegment(segmentId: string, orgId?: string) {
    return request<IntelligenceSegment>(
      { method: "GET", url: `/intelligence/segments/${segmentId}` },
      orgId
    );
  },

  createSegment(
    body: { name: string; rules?: unknown; tags?: string[] },
    orgId?: string
  ) {
    return request<{ segmentId: string; size?: number }>(
      { method: "POST", url: "/intelligence/segments", data: body },
      orgId
    );
  },

  importSegmentFromQuery(
    body: { queryId: string; name: string },
    orgId?: string
  ) {
    return request<{
      segmentId: string;
      size?: number;
      emailMatch?: number;
      revenue?: number;
    }>(
      {
        method: "POST",
        url: "/intelligence/segments/import-from-query",
        data: body,
      },
      orgId
    );
  },

  updateSegment(
    segmentId: string,
    body: { name?: string; rules?: unknown; tags?: string[] },
    orgId?: string
  ) {
    return request<{ success?: boolean }>(
      {
        method: "PUT",
        url: `/intelligence/segments/${segmentId}`,
        data: body,
      },
      orgId
    );
  },

  deleteSegment(segmentId: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "DELETE", url: `/intelligence/segments/${segmentId}` },
      orgId
    );
  },

  refreshSegment(segmentId: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "POST", url: `/intelligence/segments/${segmentId}/refresh` },
      orgId
    );
  },

  getSegmentProfiles(
    segmentId: string,
    params?: { page?: number; limit?: number },
    orgId?: string
  ) {
    return request<IntelligenceSegmentProfilesResponse>(
      {
        method: "GET",
        url: `/intelligence/segments/${segmentId}/profiles`,
        params,
      },
      orgId
    );
  },

  markSegmentUsed(segmentId: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "POST", url: `/intelligence/segments/${segmentId}/use` },
      orgId
    );
  },

  listReports(
    params?: { search?: string; page?: number; limit?: number },
    orgId?: string
  ) {
    return request<
      IntelligenceReportsListResponse | { items?: unknown[] } | unknown[]
    >({ method: "GET", url: "/intelligence/reports", params }, orgId);
  },

  getReport(reportId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/intelligence/reports/${reportId}` },
      orgId
    );
  },

  getReportsMetrics(orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: "/intelligence/reports/metrics" },
      orgId
    );
  },

  getReportsSummary(orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: "/intelligence/reports/summary" },
      orgId
    );
  },

  getReportsFilters(orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: "/intelligence/reports/filters" },
      orgId
    );
  },

  refreshReport(reportId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "POST", url: `/intelligence/reports/${reportId}/refresh` },
      orgId
    );
  },
};
