"use client";

import {
  Add01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  CodeIcon,
  Copy01Icon,
  Loading02Icon,
  Mail01Icon,
  Message01Icon,
  PlayIcon,
  Settings02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";

import { isJsonObject } from "@/lib/utils";

import {
  type IntelligenceGoldrushMcpQueryResponse,
  type IntelligenceGoldrushMcpStep,
  type IntelligenceGoldrushMcpStreamEvent,
  type IntelligenceGoldrushMcpStructuredResult,
  intelligenceService,
} from "../../intelligence.service";
import { McpTypingIndicator } from "./mcp-typing-indicator";
import { SqlBlockchainLoader } from "./sql-blockchain-loader";

const DEFAULT_SQL_QUERY = "";

const asRecord = (row: unknown): Record<string, unknown> =>
  isJsonObject(row) ? (row as Record<string, unknown>) : { value: row };

const asNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[$,%\s,]/g, "");
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const asDisplayText = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

const prettifyColumnLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const columnsFromRows = (rows: Array<Record<string, unknown>>) => {
  const keys = new Set<string>();
  for (const r of rows) {
    Object.keys(r).forEach((k) => keys.add(k));
  }
  return Array.from(keys);
};

const pickUnknownArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (isJsonObject(value) && Array.isArray(value.items)) return value.items;
  if (isJsonObject(value) && Array.isArray(value.data)) return value.data;
  return [];
};

const pickFirstText = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
};

const hashString = (value: string) => {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
};

const asKeyText = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : undefined;
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return undefined;
};

const createStructuredRowKey = (
  row: StructuredResultRow,
  preferredColumns: Array<string | null | undefined>,
  scope: string
) => {
  const preferred = preferredColumns
    .filter((column): column is string => typeof column === "string")
    .map((column) => column.trim())
    .filter((column) => column.length > 0);
  const preferredValue = preferred
    .map((column) => asKeyText(row[column]))
    .find(Boolean);
  const idValue = pickFirstText(
    row.id,
    row.uuid,
    row.request_id,
    row.requestId,
    row.tx_hash,
    row.transaction_hash,
    row.hash,
    row.address,
    row.wallet_address,
    row.wallet,
    row.owner,
    row.from_address,
    row.to_address,
    row.contract_address,
    row.symbol,
    row.name
  );
  const seed = [scope, idValue, preferredValue].filter(Boolean).join("|");
  const fallbackSeed =
    seed.length > 0
      ? seed
      : [scope, JSON.stringify(row)].filter(Boolean).join("|");
  return `${scope}-${hashString(fallbackSeed)}`;
};

const createStableLineKeys = (lines: string[], scope: string) => {
  const seen = new Map<string, number>();
  return lines.map((line) => {
    const count = seen.get(line) ?? 0;
    seen.set(line, count + 1);
    return {
      key: `${scope}-${hashString(line)}-${count}`,
      line,
    };
  });
};

const collectObjectCandidates = (
  payload: unknown
): Array<Record<string, unknown>> => {
  if (!isJsonObject(payload)) return [];
  const queue: Array<Record<string, unknown>> = [
    payload as Record<string, unknown>,
  ];
  const seen = new Set<Record<string, unknown>>();
  const candidates: Array<Record<string, unknown>> = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    seen.add(current);
    candidates.push(current);
    [
      "data",
      "parsedText",
      "textContent",
      "raw",
      "result",
      "response",
      "final",
      "payload",
    ].forEach((key) => {
      const nested = current[key];
      if (isJsonObject(nested)) {
        queue.push(nested as Record<string, unknown>);
      }
    });
  }

  return candidates;
};

const toStreamActivityEntry = (event: IntelligenceGoldrushMcpStreamEvent) => {
  const eventType = event.type ?? "update";
  const candidates = collectObjectCandidates(event.data);
  const [first] = candidates;
  const toolName = candidates
    .map((candidate) =>
      pickFirstText(candidate.toolName, candidate.name, candidate.title)
    )
    .find(Boolean);
  const detail = candidates
    .map((candidate) =>
      pickFirstText(
        candidate.message,
        candidate.description,
        candidate.summary,
        candidate.rationale,
        candidate.question,
        candidate.answer
      )
    )
    .find(Boolean);

  switch (eventType) {
    case "started":
      return {
        label: "Thought process",
        detail:
          detail ??
          "Working through the request and connecting to the MCP agent.",
        tone: "default" as const,
      };
    case "planner_ready":
      return {
        label: "Execution plan ready",
        detail:
          detail ??
          "Pressure-testing the best route before running any live MCP calls.",
        tone: "default" as const,
      };
    case "resource_context":
      return {
        label: "Context loaded",
        detail:
          detail ??
          `${pickUnknownArray(first?.resources).length || "Relevant"} MCP resources were loaded.`,
        tone: "default" as const,
      };
    case "tools_discovered":
      return {
        label: "Tool path selected",
        detail:
          detail ??
          `${pickUnknownArray(first?.tools).length || "Relevant"} MCP tools are in play for this request.`,
        tone: "default" as const,
      };
    case "step_started":
      return {
        label: "Next step",
        detail:
          detail ??
          toolName ??
          "Preparing the next reasoning step for the request.",
        tone: "default" as const,
      };
    case "decision":
      return {
        label: "Decision made",
        detail: detail ?? toolName ?? "The agent selected the next action.",
        tone: "default" as const,
      };
    case "validation_issue":
      return {
        label: "Input adjusted",
        detail:
          detail ?? "The request arguments needed a small normalization step.",
        tone: "warning" as const,
      };
    case "tool_call_started":
      return {
        label: "Tool running",
        detail:
          toolName ??
          detail ??
          "Executing a live MCP tool against the provider.",
        tone: "default" as const,
      };
    case "tool_call_result":
      return {
        label: "Tool returned",
        detail:
          toolName ??
          detail ??
          "Received provider output and folded it into the answer.",
        tone: "success" as const,
      };
    case "clarification":
      return {
        label: "Clarification needed",
        detail: detail ?? "The agent needs one more detail",
        tone: "warning" as const,
      };
    case "summarizing":
      return {
        label: "Composing answer",
        detail:
          detail ?? "Turning the MCP output into a product-ready response.",
        tone: "default" as const,
      };
    case "final":
      return {
        label: "Answer ready",
        detail: detail ?? "The MCP agent finished successfully.",
        tone: "success" as const,
      };
    case "error":
      return {
        label: "Error",
        detail:
          detail ?? "The MCP stream failed and could not finish this request.",
        tone: "error" as const,
      };
    default:
      return {
        label: prettifyColumnLabel(eventType),
        detail: detail ?? toolName ?? "The agent returned another update.",
        tone: "default" as const,
      };
  }
};

const extractConversationId = (payload: unknown) =>
  collectObjectCandidates(payload)
    .map((candidate) => pickFirstText(candidate.conversationId))
    .find(Boolean);

const isAbortError = (error: unknown) =>
  error instanceof Error && error.name === "AbortError";

const toStreamStep = (
  event: IntelligenceGoldrushMcpStreamEvent
): IntelligenceGoldrushMcpStep | null => {
  const eventType = event.type ?? "";
  if (
    eventType !== "tool_call_started" &&
    eventType !== "tool_call_result" &&
    eventType !== "decision"
  ) {
    return null;
  }

  const candidates = collectObjectCandidates(event.data);
  const toolName = candidates
    .map((candidate) =>
      pickFirstText(candidate.toolName, candidate.name, candidate.title)
    )
    .find(Boolean);
  const description = candidates
    .map((candidate) =>
      pickFirstText(
        candidate.description,
        candidate.summary,
        candidate.message,
        candidate.rationale
      )
    )
    .find(Boolean);

  if (!toolName && !description) return null;

  return {
    toolName,
    title: toolName,
    description,
  };
};

const toStreamFinalResponse = (
  event: IntelligenceGoldrushMcpStreamEvent,
  collectedSteps: IntelligenceGoldrushMcpStep[]
): IntelligenceGoldrushMcpQueryResponse | null => {
  const candidates = collectObjectCandidates(event.data);
  const responseCandidate =
    candidates.find(
      (candidate) =>
        "answer" in candidate ||
        "question" in candidate ||
        "status" in candidate ||
        "mode" in candidate
    ) ?? null;

  if (!responseCandidate) return null;

  const response = {
    ...responseCandidate,
  } as IntelligenceGoldrushMcpQueryResponse;

  if (
    (!Array.isArray(response.steps) || response.steps.length === 0) &&
    collectedSteps.length > 0
  ) {
    response.steps = collectedSteps;
  }

  return response;
};

interface MpcFailureReport {
  message: string;
  statusCode?: number;
  requestId?: string;
  conversationId?: string;
  prompt?: string;
  at: string;
}

const toMcpFailureReport = (
  error: unknown,
  context: {
    prompt?: string;
    conversationId?: string | null;
  }
): MpcFailureReport => {
  const candidates = [
    ...collectObjectCandidates(error),
    ...(error instanceof Error ? collectObjectCandidates(error.cause) : []),
  ];
  const message =
    (error instanceof Error && error.message.trim().length > 0
      ? error.message
      : undefined) ??
    candidates
      .map((candidate) =>
        pickFirstText(
          candidate.message,
          isJsonObject(candidate.response)
            ? candidate.response.message
            : undefined,
          isJsonObject(candidate.response) &&
            isJsonObject(candidate.response.data)
            ? candidate.response.data.message
            : undefined,
          isJsonObject(candidate.error) ? candidate.error.message : undefined
        )
      )
      .find(Boolean) ??
    "Failed to run MCP chat";
  const statusCode = candidates
    .map((candidate) => {
      const directStatus = candidate.status;
      const nestedResponse = isJsonObject(candidate.response)
        ? candidate.response
        : undefined;
      const nestedStatus = nestedResponse?.status;
      return typeof directStatus === "number"
        ? directStatus
        : typeof nestedStatus === "number"
          ? nestedStatus
          : undefined;
    })
    .find((value): value is number => typeof value === "number");
  const requestId = candidates
    .map((candidate) =>
      pickFirstText(
        candidate.requestId,
        candidate.traceId,
        candidate.correlationId,
        isJsonObject(candidate.error) ? candidate.error.requestId : undefined
      )
    )
    .find(Boolean);
  const conversationId =
    candidates
      .map((candidate) => pickFirstText(candidate.conversationId))
      .find(Boolean) ??
    context.conversationId ??
    undefined;

  return {
    message,
    statusCode,
    requestId,
    conversationId,
    prompt: context.prompt,
    at: new Date().toISOString(),
  };
};

const formatMcpFailureReport = (report: MpcFailureReport) =>
  [
    `Time: ${report.at}`,
    typeof report.statusCode === "number"
      ? `Status: ${report.statusCode}`
      : null,
    report.requestId ? `Request ID: ${report.requestId}` : null,
    report.conversationId ? `Conversation ID: ${report.conversationId}` : null,
    report.prompt ? `Prompt: ${report.prompt}` : null,
    `Message: ${report.message}`,
  ]
    .filter((line): line is string => typeof line === "string")
    .join("\n");

type StructuredResultRow = Record<string, unknown>;

type StreamActivityEntry = {
  id: string;
  label: string;
  detail?: string;
  tone: "default" | "success" | "warning" | "error";
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  kind?: "answer" | "question" | "error";
  rationale?: string;
  errorReport?: MpcFailureReport;
  confidence?: number;
  queryReady?: boolean;
  toolSteps?: Array<{
    toolName?: string;
    title?: string;
    description?: string;
  }>;
  mode?: string;
  conversationId?: string;
  structuredResult?: IntelligenceGoldrushMcpStructuredResult | null;
}

const MATRIX_GLYPHS =
  "01ABCDEF0123456789<>[]{}$#@&*+-=/\\\\|::;._MCPCHAINQUERY";

const buildMatrixFrame = (rows = 10, columns = 30) =>
  Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => {
      if (Math.random() < 0.18) return " ";
      return MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)];
    }).join("")
  );

const getFallbackReasoningActivity = (
  recovering: boolean
): StreamActivityEntry[] => [
  {
    id: "session",
    label: "Session handshake",
    detail:
      "Opening the MCP session, loading the best route, and checking which onchain tool family fits the ask.",
    tone: "default",
  },
  {
    id: "coverage",
    label: "Coverage scan",
    detail:
      "Testing protocol, chain, and wallet context before the live tool run starts.",
    tone: "default",
  },
  {
    id: "result-path",
    label: recovering ? "Recovery path" : "Authoritative result path",
    detail: recovering
      ? "The live stream recovered, and the durable query endpoint is now finishing the answer."
      : "The durable query endpoint is preparing the final structured result.",
    tone: recovering ? "warning" : "success",
  },
];

const isStructuredResult = (
  value: unknown
): value is IntelligenceGoldrushMcpStructuredResult =>
  isJsonObject(value) &&
  typeof value.kind === "string" &&
  Array.isArray(value.rows);

const normalizeStructuredRows = (
  rows: IntelligenceGoldrushMcpStructuredResult["rows"]
) => rows.map(asRecord);

const findPreferredColumn = (
  rows: StructuredResultRow[],
  preferred: string[]
): string | null => {
  const columns = columnsFromRows(rows).map((column) => ({
    raw: column,
    normalized: column.toLowerCase(),
  }));

  for (const key of preferred) {
    const exact = columns.find((column) => column.normalized === key);
    if (exact) return exact.raw;
  }

  for (const key of preferred) {
    const partial = columns.find((column) => column.normalized.includes(key));
    if (partial) return partial.raw;
  }

  return null;
};

const truncateMiddle = (value: string, start = 8, end = 6) =>
  value.length <= start + end + 3
    ? value
    : `${value.slice(0, start)}...${value.slice(-end)}`;

const asIdentifierText = (value: unknown) => {
  const text = asDisplayText(value);
  const normalized = text.trim();
  if (/^(0x[a-fA-F0-9]{8,}|[1-9A-HJ-NP-Za-km-z]{24,})$/.test(normalized)) {
    return truncateMiddle(normalized);
  }
  if (normalized.length > 24 && !normalized.includes(" ")) {
    return truncateMiddle(normalized);
  }
  return text;
};

const formatCompactNumber = (value: unknown) => {
  const numericValue = asNumber(value);
  if (numericValue === null) return asDisplayText(value);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: numericValue >= 100 ? 0 : 2,
  }).format(numericValue);
};

const formatUsdValue = (value: unknown) => {
  const numericValue = asNumber(value);
  if (numericValue === null) return asDisplayText(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: numericValue >= 100 ? 0 : 2,
  }).format(numericValue);
};

const formatPercentValue = (value: unknown) => {
  const numericValue = asNumber(value);
  if (numericValue === null) return asDisplayText(value);
  const normalized =
    numericValue > 0 && numericValue <= 1 ? numericValue * 100 : numericValue;
  return `${normalized.toFixed(normalized >= 10 ? 1 : 2)}%`;
};

const formatTimestamp = (value: unknown) => {
  if (typeof value !== "string" && typeof value !== "number") {
    return asDisplayText(value);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return asDisplayText(value);
  return date.toLocaleString();
};

const SUGGESTION_SECTORS = [
  "general",
  "defi",
  "nft",
  "gaming",
  "meme",
  "dao",
  "payments",
  "infrastructure",
] as const;

const MCP_CHAIN_OPTIONS = [
  { id: "eth-mainnet", label: "Ethereum", family: "EVM" },
  { id: "base-mainnet", label: "Base", family: "EVM" },
  { id: "arbitrum-mainnet", label: "Arbitrum", family: "EVM" },
  { id: "optimism-mainnet", label: "Optimism", family: "EVM" },
  { id: "polygon-mainnet", label: "Polygon", family: "EVM" },
  { id: "solana-mainnet", label: "Solana", family: "Solana" },
] as const;

const DEFAULT_MCP_CHAINS = [
  "eth-mainnet",
  "base-mainnet",
  "arbitrum-mainnet",
  "optimism-mainnet",
  "polygon-mainnet",
  "solana-mainnet",
] as const;

const EVM_MCP_CHAINS = MCP_CHAIN_OPTIONS.filter(
  (chain) => chain.family === "EVM"
).map((chain) => chain.id);

const SOLANA_MCP_CHAINS = MCP_CHAIN_OPTIONS.filter(
  (chain) => chain.family === "Solana"
).map((chain) => chain.id);

type MpcChainMode = "auto" | "evm" | "solana" | "custom";

const normalizeChainSlug = (value: string) => value.trim().toLowerCase();

const getChainLabel = (value: string) =>
  MCP_CHAIN_OPTIONS.find((chain) => chain.id === value)?.label ?? value;

interface QueryTabProps {
  activeSurface: "chat" | "sql";
  openEmailComposer: (recipient: unknown) => void;
  setActiveTab: (tab: string) => void;
}

export function QueryTab({
  activeSurface,
  openEmailComposer,
  setActiveTab,
}: QueryTabProps) {
  const queryClient = useQueryClient();
  const [sqlQuery, setSqlQuery] = useState(DEFAULT_SQL_QUERY);
  const [queryId, setQueryId] = useState<string | null>(null);
  const [hasRunQuery, setHasRunQuery] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 50;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameDialogKind, setNameDialogKind] = useState<
    "report" | "segment" | "campaign"
  >("report");
  const [nameDialogValue, setNameDialogValue] = useState("");
  const [chatPrompt, setChatPrompt] = useState("");
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatThreadEndRef = useRef<HTMLDivElement | null>(null);
  const [protocolSearch, setProtocolSearch] = useState("");
  const [selectedProtocolId, setSelectedProtocolId] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [lastSubmittedChatPrompt, setLastSubmittedChatPrompt] = useState("");
  const [selectedSector, setSelectedSector] =
    useState<(typeof SUGGESTION_SECTORS)[number]>("general");
  const [chainMode, setChainMode] = useState<MpcChainMode>("auto");
  const [selectedChains, setSelectedChains] = useState<string[]>([
    ...DEFAULT_MCP_CHAINS,
  ]);
  const [customChainInput, setCustomChainInput] = useState("");
  const [streamActivity, setStreamActivity] = useState<StreamActivityEntry[]>(
    []
  );
  const [streamFallbackUsed, setStreamFallbackUsed] = useState(false);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(
    null
  );
  const trimmedSqlQuery = sqlQuery.trim();
  const trimmedAssistantPrompt = assistantPrompt.trim();
  const normalizedProtocolSearch = protocolSearch.trim();
  const normalizedCustomChainInput = normalizeChainSlug(customChainInput);
  const [primaryChain] = selectedChains;

  const schemaQuery = useQuery({
    queryKey: ["intelligence", "schema"],
    queryFn: () => intelligenceService.getSchema(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const historyQuery = useQuery({
    queryKey: ["intelligence", "query", "history"],
    queryFn: async () => {
      const res = await intelligenceService.getQueryHistory();
      const items = Array.isArray(res)
        ? res
        : ((res as { items?: unknown[] }).items ?? []);
      return Array.isArray(items) ? items : [];
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const startersQuery = useQuery({
    queryKey: ["intelligence", "query", "starters"],
    queryFn: () => intelligenceService.getQueryStarters(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const protocolsQuery = useQuery({
    queryKey: [
      "intelligence",
      "query",
      "protocols",
      {
        search: normalizedProtocolSearch,
        sector: selectedSector,
        chains: selectedChains,
      },
    ],
    queryFn: () =>
      intelligenceService.listQueryProtocols({
        search:
          normalizedProtocolSearch.length > 0
            ? normalizedProtocolSearch
            : undefined,
        sector: selectedSector === "general" ? undefined : selectedSector,
        chain: selectedChains.length === 1 ? primaryChain : undefined,
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const suggestionsAnalyticsQuery = useQuery({
    queryKey: ["intelligence", "query", "suggestions", "analytics"],
    queryFn: () => intelligenceService.getQuerySuggestionsAnalytics(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const protocols = useMemo(
    () => protocolsQuery.data?.items ?? [],
    [protocolsQuery.data?.items]
  );

  const selectedProtocol = useMemo(
    () => protocols.find((protocol) => protocol.id === selectedProtocolId),
    [protocols, selectedProtocolId]
  );
  const selectedChainSet = useMemo(
    () => new Set(selectedChains),
    [selectedChains]
  );
  const selectedChainLabels = useMemo(
    () => selectedChains.map((chain) => getChainLabel(chain)),
    [selectedChains]
  );
  const chainCoverageLabel = useMemo(() => {
    if (selectedChains.length === 0) return "Auto / multichain";
    const families = new Set(
      selectedChains.map((chain) =>
        chain.includes("solana") ? "Solana" : "EVM"
      )
    );
    if (families.size === 2) return "EVM + Solana";
    return families.has("Solana") ? "Solana" : "EVM";
  }, [selectedChains]);
  const chainSummary = useMemo(() => {
    if (selectedChainLabels.length === 0) return "Auto / multichain";
    if (selectedChainLabels.length <= 3) return selectedChainLabels.join(", ");
    return `${selectedChainLabels.slice(0, 3).join(", ")} +${
      selectedChainLabels.length - 3
    }`;
  }, [selectedChainLabels]);
  const customSelectedChains = useMemo(
    () =>
      selectedChains.filter(
        (chain) => !MCP_CHAIN_OPTIONS.some((option) => option.id === chain)
      ),
    [selectedChains]
  );

  const applyChainMode = useCallback((mode: MpcChainMode) => {
    setChainMode(mode);
    if (mode === "auto") {
      setSelectedChains([...DEFAULT_MCP_CHAINS]);
      return;
    }
    if (mode === "evm") {
      setSelectedChains([...EVM_MCP_CHAINS]);
      return;
    }
    if (mode === "solana") {
      setSelectedChains([...SOLANA_MCP_CHAINS]);
    }
  }, []);
  const trackSuggestionInteraction = useCallback(
    async (payload: {
      selected?: boolean;
      executed?: boolean;
      saved?: boolean;
      convertedToSegment?: boolean;
      convertedToCampaign?: boolean;
      metadata?: Record<string, unknown>;
    }) => {
      if (!activeSuggestionId) return;
      try {
        await intelligenceService.trackQuerySuggestion(
          activeSuggestionId,
          payload
        );
      } catch {
        // Analytics should never block the main query flow.
      }
    },
    [activeSuggestionId]
  );
  const toggleChainSelection = useCallback((chainId: string) => {
    setChainMode("custom");
    setSelectedChains((current) =>
      current.includes(chainId)
        ? current.filter((chain) => chain !== chainId)
        : [...current, chainId]
    );
  }, []);
  const addCustomChain = useCallback(() => {
    if (normalizedCustomChainInput.length === 0) return;
    setChainMode("custom");
    setSelectedChains((current) =>
      current.includes(normalizedCustomChainInput)
        ? current
        : [...current, normalizedCustomChainInput]
    );
    setCustomChainInput("");
  }, [normalizedCustomChainInput]);
  const removeChainSelection = useCallback((chainId: string) => {
    setChainMode("custom");
    setSelectedChains((current) =>
      current.filter((chain) => chain !== chainId)
    );
  }, []);
  const buildMcpRequest = useCallback(
    (prompt: string) => ({
      conversationId: activeConversationId ?? undefined,
      message: prompt,
      prompt,
      protocol: selectedProtocol?.name,
      chain: selectedChains.length === 1 ? primaryChain : undefined,
      chains: selectedChains.length > 0 ? selectedChains : undefined,
      contractAddresses:
        Array.isArray(selectedProtocol?.contractAddresses) &&
        selectedProtocol.contractAddresses.length > 0
          ? selectedProtocol.contractAddresses
          : undefined,
      mode: "best" as const,
      useProjectSettings: true,
      useProtocolRegistry: true,
    }),
    [
      activeConversationId,
      primaryChain,
      selectedChains,
      selectedProtocol?.contractAddresses,
      selectedProtocol?.name,
    ]
  );

  const validateMutation = useMutation({
    mutationFn: async () => {
      if (trimmedSqlQuery.length === 0) {
        throw new Error("Write a SQL query first");
      }
      return intelligenceService.validateQuery({ query: trimmedSqlQuery });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to validate query";
      toast.error(message);
    },
  });

  const runMutation = useMutation({
    mutationFn: async () => {
      if (trimmedSqlQuery.length === 0) {
        throw new Error("Write a SQL query first");
      }
      return intelligenceService.runQuery({ query: trimmedSqlQuery });
    },
    onSuccess: (res) => {
      setQueryId(res.queryId);
      setHasRunQuery(true);
      setPage(1);
      setSelectedRows([]);
      trackSuggestionInteraction({
        executed: true,
        metadata: { source: "sql-run" },
      });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to run query";
      toast.error(message);
    },
  });

  const mcpMutation = useMutation<
    IntelligenceGoldrushMcpQueryResponse,
    Error,
    string
  >({
    mutationFn: async (prompt) => {
      const trimmedPrompt = prompt.trim();
      if (trimmedPrompt.length === 0) {
        throw new Error("Write a message first");
      }
      const request = buildMcpRequest(trimmedPrompt);
      setStreamActivity([]);
      setStreamFallbackUsed(false);

      const collectedSteps: IntelligenceGoldrushMcpStep[] = [];
      let streamFinalResponse: IntelligenceGoldrushMcpQueryResponse | undefined;
      let streamFailed = false;
      const streamAbortController = new AbortController();

      const streamPromise = intelligenceService
        .streamGoldrushMcpQuery(request, {
          signal: streamAbortController.signal,
          onEvent: (event) => {
            const eventConversationId = extractConversationId(event.data);
            if (eventConversationId) {
              setActiveConversationId(eventConversationId);
            }
            const activityEntry = toStreamActivityEntry(event);
            setStreamActivity((prev) =>
              [
                ...prev.filter(
                  (entry) =>
                    !(
                      entry.label === activityEntry.label &&
                      entry.detail === activityEntry.detail &&
                      entry.tone === activityEntry.tone
                    )
                ),
                {
                  id: `${event.type ?? "event"}-${prev.length}-${Date.now()}`,
                  ...activityEntry,
                },
              ].slice(-4)
            );

            const nextStep = toStreamStep(event);
            if (
              nextStep &&
              !collectedSteps.some(
                (step) =>
                  step.toolName === nextStep.toolName &&
                  step.description === nextStep.description
              )
            ) {
              collectedSteps.push(nextStep);
            }

            const maybeResponse = toStreamFinalResponse(event, collectedSteps);
            if (maybeResponse) {
              streamFinalResponse = maybeResponse;
            }
          },
        })
        .catch((error) => {
          if (isAbortError(error)) return;
          streamFailed = true;
          setStreamFallbackUsed(true);
        });

      const [planResult, queryResult] = await Promise.allSettled([
        intelligenceService.planGoldrushMcp(request),
        intelligenceService.queryGoldrushMcp(request),
      ]);

      streamAbortController.abort();
      await streamPromise;

      const queryResponse =
        queryResult.status === "fulfilled" ? queryResult.value : null;
      if (queryResponse) {
        if (typeof queryResponse.conversationId === "string") {
          setActiveConversationId(queryResponse.conversationId);
        }
        if (
          planResult.status === "fulfilled" &&
          (queryResponse.plan === undefined || queryResponse.plan === null)
        ) {
          return {
            ...queryResponse,
            plan: planResult.value,
          };
        }
        return queryResponse;
      }

      if (streamFinalResponse) {
        setStreamFallbackUsed(true);
        if (typeof streamFinalResponse.conversationId === "string") {
          setActiveConversationId(streamFinalResponse.conversationId);
        }
        if (
          planResult.status === "fulfilled" &&
          (streamFinalResponse.plan === undefined ||
            streamFinalResponse.plan === null)
        ) {
          return {
            ...streamFinalResponse,
            plan: planResult.value,
          };
        }
        return streamFinalResponse;
      }

      if (streamFailed) {
        setStreamFallbackUsed(true);
      }

      if (queryResult.status === "rejected") {
        throw queryResult.reason;
      }

      throw new Error("Failed to generate an MCP response");
    },
    onSuccess: (res: IntelligenceGoldrushMcpQueryResponse) => {
      if (
        typeof res.conversationId === "string" &&
        res.conversationId.length > 0
      ) {
        setActiveConversationId(res.conversationId);
      }
      const assistantToolSteps = Array.isArray(res.steps)
        ? res.steps.slice(0, 4).map((step) => ({
            toolName:
              typeof step.toolName === "string" ? step.toolName : undefined,
            title: typeof step.title === "string" ? step.title : undefined,
            description:
              typeof step.description === "string"
                ? step.description
                : undefined,
          }))
        : undefined;
      const structuredResult = isStructuredResult(res.structuredResult)
        ? {
            ...res.structuredResult,
            rows: normalizeStructuredRows(res.structuredResult.rows),
          }
        : null;
      const assistantMessage =
        res.status === "needs_clarification" &&
        typeof res.question === "string" &&
        res.question.trim().length > 0
          ? {
              id: `assistant-${Date.now()}`,
              role: "assistant" as const,
              content: res.question,
              kind: "question" as const,
              rationale:
                typeof res.rationale === "string" ? res.rationale : undefined,
              confidence:
                typeof res.confidence === "number" ? res.confidence : undefined,
              queryReady: false,
              toolSteps: assistantToolSteps,
              mode: res.mode,
              conversationId: res.conversationId,
              structuredResult: null,
            }
          : res.status === "answered" &&
              (structuredResult ||
                (typeof res.answer === "string" &&
                  res.answer.trim().length > 0))
            ? {
                id: `assistant-${Date.now()}`,
                role: "assistant" as const,
                content: typeof res.answer === "string" ? res.answer : "",
                kind: "answer" as const,
                rationale:
                  typeof res.rationale === "string" ? res.rationale : undefined,
                confidence:
                  typeof res.confidence === "number"
                    ? res.confidence
                    : undefined,
                queryReady:
                  typeof res.queryId === "string" && res.queryId.length > 0,
                toolSteps: assistantToolSteps,
                mode: res.mode,
                conversationId: res.conversationId,
                structuredResult,
              }
            : null;

      if (assistantMessage) {
        setChatMessages((prev) => [...prev, assistantMessage]);
      }

      if (typeof res.queryId === "string" && res.queryId.length > 0) {
        setQueryId(res.queryId);
        setHasRunQuery(true);
        setPage(1);
        setSelectedRows([]);
      } else {
        setQueryId(null);
        setHasRunQuery(false);
      }
    },
    onError: (err) => {
      const errorReport = toMcpFailureReport(err, {
        prompt: lastSubmittedChatPrompt,
        conversationId: activeConversationId,
      });
      const { message } = errorReport;
      console.error("[intelligence] MCP chat failure", errorReport, err);
      setStreamActivity((prev) => [
        ...prev.slice(-3),
        {
          id: `stream-error-${Date.now()}`,
          label: "Error",
          detail: message,
          tone: "error",
        },
      ]);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          kind: "error",
          content:
            "I couldn't complete that MCP request. Please try again or refine the prompt.",
          rationale: message,
          errorReport,
          queryReady: false,
        },
      ]);
      toast.error(message);
    },
  });
  const submitChatPrompt = useCallback(
    (prompt: string) => {
      const trimmedPrompt = prompt.trim();
      if (trimmedPrompt.length === 0) return;

      setChatMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: "user",
          content: trimmedPrompt,
        },
      ]);
      setLastSubmittedChatPrompt(trimmedPrompt);
      setChatPrompt("");
      mcpMutation.mutate(trimmedPrompt);
    },
    [mcpMutation]
  );

  useEffect(() => {
    if (activeSurface !== "chat") return;
    const node = chatThreadEndRef.current;
    if (!node || typeof node.scrollIntoView !== "function") return;
    node.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeSurface, chatMessages.length, mcpMutation.isPending]);

  const suggestionsMutation = useMutation({
    mutationFn: async () => {
      if (trimmedAssistantPrompt.length === 0) {
        throw new Error("Write a prompt first");
      }
      return intelligenceService.getQuerySuggestions({
        prompt: trimmedAssistantPrompt,
        protocol: selectedProtocol?.name,
        sector: selectedSector,
        chain: selectedChains.length === 1 ? primaryChain : undefined,
        contractAddresses:
          Array.isArray(selectedProtocol?.contractAddresses) &&
          selectedProtocol.contractAddresses.length > 0
            ? selectedProtocol.contractAddresses
            : undefined,
        includeSql: true,
        limit: 3,
        mode: "best",
      });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to load query ideas";
      toast.error(message);
    },
  });

  const generateSqlMutation = useMutation({
    mutationFn: async () => {
      if (trimmedAssistantPrompt.length === 0) {
        throw new Error("Write a prompt first");
      }
      return intelligenceService.generateSql({
        prompt: trimmedAssistantPrompt,
        mode: "best",
      });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to generate SQL";
      toast.error(message);
    },
  });

  const statusQuery = useQuery({
    queryKey: ["intelligence", "query", queryId, "status"],
    queryFn: async () =>
      queryId ? intelligenceService.getQueryStatus(queryId) : null,
    enabled: !!queryId,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (q) => {
      const s = (q.state.data as { status?: string } | null)?.status;
      return s === "completed" || s === "failed" ? false : 1000;
    },
  });

  const resultsQuery = useQuery({
    queryKey: ["intelligence", "query", queryId, "results", { page, limit }],
    queryFn: async () =>
      queryId
        ? intelligenceService.getQueryResults(queryId, { page, limit })
        : null,
    enabled: !!queryId && statusQuery.data?.status === "completed",
    retry: false,
    refetchOnWindowFocus: false,
  });

  const summaryQuery = useQuery({
    queryKey: ["intelligence", "query", queryId, "summary"],
    queryFn: async () =>
      queryId ? intelligenceService.getQuerySummary(queryId) : null,
    enabled: !!queryId && statusQuery.data?.status === "completed",
    retry: false,
    refetchOnWindowFocus: false,
  });

  const saveReportMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!queryId) throw new Error("No query to save");
      return intelligenceService.saveQuery(queryId, { name });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["intelligence", "reports"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["intelligence", "reports", "metrics"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["intelligence", "reports", "summary"],
      });
      toast.success("Report saved");
      trackSuggestionInteraction({
        saved: true,
        metadata: { destination: "report" },
      });
      setActiveTab("reports");
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to save report";
      toast.error(message);
    },
  });

  const createSegmentMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!queryId) throw new Error("No query to use");
      return intelligenceService.createSegmentFromQuery({ queryId, name });
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: ["intelligence", "segments"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["intelligence", "segments", "metrics"],
      });
      trackSuggestionInteraction({
        convertedToSegment: true,
        metadata: { destination: "segment" },
      });
      setActiveTab("segments");
      window.location.href = `/intelligence/segments/detail/${res.segmentId}`;
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to create segment";
      toast.error(message);
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (subject: string) => {
      if (!queryId) throw new Error("No query to use");
      return intelligenceService.createCampaignFromQuery({ queryId, subject });
    },
    onSuccess: (res) => {
      trackSuggestionInteraction({
        convertedToCampaign: true,
        metadata: { destination: "campaign" },
      });
      window.location.href = `/campaigns/editor?campaign=${encodeURIComponent(
        res.campaignId
      )}`;
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to create campaign";
      toast.error(message);
    },
  });

  const latestRunData = runMutation.data;
  const status = statusQuery.data?.status ?? latestRunData?.status ?? "";
  const isQueryRunning =
    runMutation.isPending ||
    mcpMutation.isPending ||
    status === "running" ||
    statusQuery.isFetching;

  const isSqlRunning =
    runMutation.isPending ||
    (!mcpMutation.isPending &&
      (status === "running" || statusQuery.isFetching));

  const rows = useMemo(() => {
    const raw = resultsQuery.data?.rows ?? latestRunData?.rows ?? [];
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map(asRecord);
  }, [latestRunData?.rows, resultsQuery.data?.rows]);

  const columns = useMemo(() => {
    const cols = latestRunData?.columns;
    if (Array.isArray(cols) && cols.length > 0) {
      return cols
        .map((c) =>
          isJsonObject(c) && typeof c.name === "string" ? c.name : ""
        )
        .filter((c) => c.length > 0);
    }
    return columnsFromRows(rows);
  }, [latestRunData?.columns, rows]);

  const totalRows =
    typeof resultsQuery.data?.total === "number"
      ? resultsQuery.data.total
      : typeof latestRunData?.totalRows === "number"
        ? latestRunData.totalRows
        : 0;

  const pageCount = Math.max(1, Math.ceil(Math.max(0, totalRows) / limit));

  const starters = useMemo(
    () => startersQuery.data?.items ?? [],
    [startersQuery.data?.items]
  );
  const suggestionItems = useMemo(
    () => suggestionsMutation.data?.suggestions ?? [],
    [suggestionsMutation.data?.suggestions]
  );
  const suggestionTotals = useMemo(() => {
    const totals = suggestionsAnalyticsQuery.data?.totals;
    return isJsonObject(totals) ? (totals as Record<string, unknown>) : {};
  }, [suggestionsAnalyticsQuery.data?.totals]);
  const topProtocols = useMemo(() => {
    const items = suggestionsAnalyticsQuery.data?.topProtocols;
    return Array.isArray(items)
      ? items.filter((item): item is Record<string, unknown> =>
          isJsonObject(item)
        )
      : [];
  }, [suggestionsAnalyticsQuery.data?.topProtocols]);
  const activeTopProtocol =
    typeof topProtocols[0]?.name === "string"
      ? String(topProtocols[0].name)
      : (selectedProtocol?.name ?? "Any protocol");
  const reasoningTimeline = useMemo(
    () =>
      streamActivity.length > 0
        ? streamActivity.slice(-4)
        : getFallbackReasoningActivity(streamFallbackUsed),
    [streamActivity, streamFallbackUsed]
  );
  const renderConversionActions = () => (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
      <div className="mb-3">
        <div className="text-sm font-medium text-foreground">
          Convert this result
        </div>
        <div className="text-xs text-muted-foreground">
          Save the analysis or move it straight into activation.
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => openNameDialog("report")}
          disabled={saveReportMutation.isPending}
          className="justify-start rounded-xl"
        >
          Save report
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => openNameDialog("segment")}
          disabled={createSegmentMutation.isPending}
          className="justify-start rounded-xl"
        >
          Create segment
        </Button>
        <Button
          type="button"
          onClick={() => openNameDialog("campaign")}
          disabled={createCampaignMutation.isPending}
          className="justify-start rounded-xl"
        >
          Launch campaign
        </Button>
      </div>
    </div>
  );
  const renderStructuredRowsTable = (
    structuredRows: StructuredResultRow[],
    preferredColumns?: string[]
  ) => {
    const allColumns = columnsFromRows(structuredRows);
    const selectedColumns =
      preferredColumns && preferredColumns.length > 0
        ? preferredColumns.filter((column) => allColumns.includes(column))
        : allColumns;
    const visibleColumns = selectedColumns.slice(0, 5);

    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/60">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border/60 text-sm">
            <thead className="bg-white/[0.03]">
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {prettifyColumnLabel(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {structuredRows.slice(0, 8).map((row) => {
                const rowKey = createStructuredRowKey(
                  row,
                  visibleColumns,
                  "structured-row"
                );
                return (
                  <tr key={rowKey} className="bg-background/30">
                    {visibleColumns.map((column) => (
                      <td
                        key={`${rowKey}-${column}`}
                        className="px-4 py-3 align-top text-foreground/92"
                      >
                        {column.toLowerCase().includes("hash") ||
                        column.toLowerCase().includes("address")
                          ? asIdentifierText(row[column])
                          : asDisplayText(row[column])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  const renderStructuredResult = (
    structuredResult: IntelligenceGoldrushMcpStructuredResult
  ) => {
    const structuredRows = normalizeStructuredRows(structuredResult.rows);
    const holderColumn = findPreferredColumn(structuredRows, [
      "holder",
      "wallet_address",
      "wallet",
      "address",
      "owner",
      "name",
      "label",
    ]);
    const amountColumn = findPreferredColumn(structuredRows, [
      "balance",
      "amount",
      "quantity",
      "tokens",
      "value",
    ]);
    const shareColumn = findPreferredColumn(structuredRows, [
      "share",
      "percent",
      "percentage",
      "ownership",
      "pct",
    ]);
    const assetColumn = findPreferredColumn(structuredRows, [
      "symbol",
      "asset",
      "token",
      "currency",
      "name",
    ]);
    const usdValueColumn = findPreferredColumn(structuredRows, [
      "value_usd",
      "usd_value",
      "quote",
      "value",
      "price_usd",
    ]);
    const chainColumn = findPreferredColumn(structuredRows, [
      "chain",
      "network",
    ]);
    const hashColumn = findPreferredColumn(structuredRows, [
      "tx_hash",
      "transaction_hash",
      "hash",
      "signature",
    ]);
    const fromColumn = findPreferredColumn(structuredRows, [
      "from_address",
      "from",
      "sender",
    ]);
    const toColumn = findPreferredColumn(structuredRows, [
      "to_address",
      "to",
      "recipient",
    ]);
    const timeColumn = findPreferredColumn(structuredRows, [
      "block_signed_at",
      "timestamp",
      "time",
      "date",
    ]);
    const transactionValueColumn = findPreferredColumn(structuredRows, [
      "value_usd",
      "usd_value",
      "amount",
      "value",
      "gas_spent",
    ]);
    const transactionTypeColumn = findPreferredColumn(structuredRows, [
      "method",
      "action",
      "type",
      "event",
    ]);
    const baseFeeColumn = findPreferredColumn(structuredRows, [
      "base_fee",
      "base_fee_gwei",
      "basefee",
      "basefee_gwei",
    ]);
    const standardFeeColumn = findPreferredColumn(structuredRows, [
      "standard",
      "average",
      "propose",
      "proposed",
    ]);
    const fastFeeColumn = findPreferredColumn(structuredRows, [
      "fast",
      "rapid",
      "instant",
      "priority",
    ]);
    const slowFeeColumn = findPreferredColumn(structuredRows, [
      "slow",
      "safe_low",
      "safelow",
      "low",
    ]);

    if (structuredRows.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 px-4 py-8 text-sm text-muted-foreground">
          This result was answered, but there were no structured rows to render.
        </div>
      );
    }

    switch (structuredResult.kind) {
      case "token_holders": {
        const shareValues = structuredRows
          .map((row) => (shareColumn ? asNumber(row[shareColumn]) : null))
          .filter((value): value is number => value !== null);
        const maxShare = Math.max(...shareValues, 0);

        return (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="overflow-hidden rounded-2xl border border-primary/15 bg-[linear-gradient(180deg,rgba(33,49,86,0.52),rgba(14,22,39,0.82))]">
              <div className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Ranked holders
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Stable table view powered by `structuredResult.rows`
                  </div>
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                  Top {structuredRows.length}
                </span>
              </div>
              <div className="divide-y divide-white/6">
                {structuredRows.slice(0, 8).map((row, index) => {
                  const shareValue =
                    shareColumn !== null ? asNumber(row[shareColumn]) : null;
                  const normalizedShare =
                    shareValue === null
                      ? 0
                      : shareValue > 0 && shareValue <= 1
                        ? shareValue * 100
                        : shareValue;
                  const width =
                    normalizedShare > 0 && maxShare > 0
                      ? Math.max(10, (normalizedShare / maxShare) * 100)
                      : 0;
                  const rowKey = createStructuredRowKey(
                    row,
                    [holderColumn, amountColumn, shareColumn, chainColumn],
                    "holder"
                  );

                  return (
                    <div
                      key={rowKey}
                      className="grid gap-3 px-5 py-4 md:grid-cols-[auto_minmax(0,1fr)_auto]"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/8 text-xs font-semibold text-foreground">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {holderColumn
                            ? asIdentifierText(row[holderColumn])
                            : `Holder ${index + 1}`}
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(87,115,255,0.95),rgba(88,211,255,0.9))]"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {amountColumn
                            ? formatCompactNumber(row[amountColumn])
                            : "—"}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {shareColumn
                            ? formatPercentValue(row[shareColumn])
                            : "Share unavailable"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Result profile
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-xl border border-border/50 bg-card/70 p-3">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Rows
                    </div>
                    <div className="mt-2 text-lg font-semibold text-foreground">
                      {structuredRows.length.toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-card/70 p-3">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Coverage
                    </div>
                    <div className="mt-2 text-sm font-medium text-foreground">
                      {chainColumn && structuredRows[0]
                        ? asDisplayText(structuredRows[0][chainColumn])
                        : chainCoverageLabel}
                    </div>
                  </div>
                </div>
              </div>
              {renderStructuredRowsTable(structuredRows, [
                holderColumn ?? "",
                amountColumn ?? "",
                shareColumn ?? "",
                chainColumn ?? "",
              ])}
            </div>
          </div>
        );
      }
      case "wallet_balances":
      case "multichain_balances":
      case "historical_wallet_balances":
      case "native_token_balance":
      case "bitcoin_hd_wallet_balances":
      case "bitcoin_non_hd_wallet_balances":
      case "portfolio_value": {
        return (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {structuredRows.slice(0, 6).map((row, index) => {
                const rowKey = createStructuredRowKey(
                  row,
                  [assetColumn, chainColumn, amountColumn, usdValueColumn],
                  "balance"
                );
                return (
                  <div
                    key={rowKey}
                    className="rounded-2xl border border-border/60 bg-[linear-gradient(180deg,rgba(28,36,59,0.9),rgba(14,19,33,0.96))] p-4 shadow-[0_20px_60px_-40px_rgba(70,120,255,0.42)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {assetColumn
                            ? asDisplayText(row[assetColumn])
                            : `Asset ${index + 1}`}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {chainColumn
                            ? asDisplayText(row[chainColumn])
                            : chainCoverageLabel}
                        </div>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Balance
                      </span>
                    </div>
                    <div className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                      {amountColumn ? asDisplayText(row[amountColumn]) : "—"}
                    </div>
                    <div className="mt-2 text-sm text-primary">
                      {usdValueColumn
                        ? formatUsdValue(row[usdValueColumn])
                        : "Value unavailable"}
                    </div>
                  </div>
                );
              })}
            </div>
            {renderStructuredRowsTable(structuredRows, [
              assetColumn ?? "",
              amountColumn ?? "",
              usdValueColumn ?? "",
              chainColumn ?? "",
            ])}
          </div>
        );
      }
      case "transactions":
      case "transaction":
      case "transaction_summary":
      case "multichain_transactions":
      case "block_transactions":
      case "bitcoin_transactions":
      case "erc20_token_transfers":
      case "log_events_by_address":
      case "log_events_by_topic": {
        return (
          <div className="space-y-3">
            {structuredRows.slice(0, 6).map((row, index) => {
              const rowKey = createStructuredRowKey(
                row,
                [
                  hashColumn,
                  timeColumn,
                  fromColumn,
                  toColumn,
                  transactionTypeColumn,
                ],
                "transaction"
              );
              return (
                <div
                  key={rowKey}
                  className="rounded-2xl border border-border/60 bg-[linear-gradient(180deg,rgba(26,33,53,0.96),rgba(14,19,32,0.96))] p-4 shadow-[0_18px_60px_-42px_rgba(58,171,255,0.35)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                        {transactionTypeColumn
                          ? asDisplayText(row[transactionTypeColumn])
                          : "Transaction"}
                      </span>
                      {chainColumn ? (
                        <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                          {asDisplayText(row[chainColumn])}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {timeColumn
                        ? formatTimestamp(row[timeColumn])
                        : `Event ${index + 1}`}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="font-mono text-sm text-foreground">
                      {hashColumn
                        ? asIdentifierText(row[hashColumn])
                        : `Tx ${index + 1}`}
                    </div>
                    <div className="text-sm text-primary">
                      {transactionValueColumn
                        ? formatUsdValue(row[transactionValueColumn])
                        : "Value unavailable"}
                    </div>
                  </div>
                  {(fromColumn ?? toColumn) && (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-border/50 bg-card/60 p-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          From
                        </div>
                        <div className="mt-2 text-sm text-foreground">
                          {fromColumn ? asIdentifierText(row[fromColumn]) : "—"}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border/50 bg-card/60 p-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          To
                        </div>
                        <div className="mt-2 text-sm text-foreground">
                          {toColumn ? asIdentifierText(row[toColumn]) : "—"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }
      case "gas_prices": {
        return (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {structuredRows.slice(0, 6).map((row, index) => {
              const rowKey = createStructuredRowKey(
                row,
                [
                  chainColumn,
                  slowFeeColumn,
                  standardFeeColumn,
                  fastFeeColumn,
                  baseFeeColumn,
                ],
                "gas"
              );
              return (
                <div
                  key={rowKey}
                  className="rounded-2xl border border-border/60 bg-[linear-gradient(180deg,rgba(31,39,63,0.96),rgba(14,19,31,0.96))] p-4 shadow-[0_20px_60px_-42px_rgba(130,96,255,0.44)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-foreground">
                      {chainColumn
                        ? asDisplayText(row[chainColumn])
                        : `Network ${index + 1}`}
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Fees
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/50 bg-card/60 p-3">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Slow
                      </div>
                      <div className="mt-2 text-lg font-semibold text-foreground">
                        {slowFeeColumn
                          ? asDisplayText(row[slowFeeColumn])
                          : "—"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-card/60 p-3">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Standard
                      </div>
                      <div className="mt-2 text-lg font-semibold text-foreground">
                        {standardFeeColumn
                          ? asDisplayText(row[standardFeeColumn])
                          : "—"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-card/60 p-3">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Fast
                      </div>
                      <div className="mt-2 text-lg font-semibold text-foreground">
                        {fastFeeColumn
                          ? asDisplayText(row[fastFeeColumn])
                          : "—"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-card/60 p-3">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Base fee
                      </div>
                      <div className="mt-2 text-lg font-semibold text-foreground">
                        {baseFeeColumn
                          ? asDisplayText(row[baseFeeColumn])
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      default:
        return renderStructuredRowsTable(structuredRows);
    }
  };

  useEffect(() => {
    if (!queryId) return;
    setSelectedRows([]);
  }, [queryId]);

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }, []);

  const toggleAllRows = useCallback(() => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((_r, i) => String(i)));
    }
  }, [rows, selectedRows.length]);

  const openNameDialog = useCallback(
    (kind: "report" | "segment" | "campaign") => {
      setNameDialogKind(kind);
      setNameDialogValue("");
      setNameDialogOpen(true);
    },
    []
  );

  const submitNameDialog = useCallback(() => {
    if (nameDialogKind === "campaign") {
      setNameDialogOpen(false);
      createCampaignMutation.mutate(nameDialogValue.trim());
      return;
    }
    const trimmed = nameDialogValue.trim();
    if (trimmed.length === 0) {
      toast.error("Name is required");
      return;
    }
    setNameDialogOpen(false);
    if (nameDialogKind === "report") {
      saveReportMutation.mutate(trimmed);
      return;
    }
    createSegmentMutation.mutate(trimmed);
  }, [
    createCampaignMutation,
    createSegmentMutation,
    nameDialogKind,
    nameDialogValue,
    saveReportMutation,
  ]);

  const loadSqlIntoEditor = useCallback(
    (nextQuery: string, suggestionId?: string) => {
      if (suggestionId) {
        setActiveSuggestionId(suggestionId);
        intelligenceService.trackQuerySuggestion(suggestionId, {
          selected: true,
          metadata: { source: "query-helper" },
        });
      }
      setSqlQuery(nextQuery);
      setQueryId(null);
      setHasRunQuery(false);
      setPage(1);
      setSelectedRows([]);
      validateMutation.reset();
      runMutation.reset();
      mcpMutation.reset();
      setStreamActivity([]);
      setStreamFallbackUsed(false);
    },
    [mcpMutation, runMutation, validateMutation]
  );

  return (
    <div className="space-y-4">
      {activeSurface === "chat" ? (
        <div className="relative overflow-hidden rounded-[32px] border border-primary/15 bg-[linear-gradient(180deg,rgba(7,11,22,0.985),rgba(5,8,18,0.985))] shadow-[0_44px_140px_-72px_rgba(55,98,255,0.78)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,123,255,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(46,164,255,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_24%,transparent_76%,rgba(255,255,255,0.02))]" />
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(119,137,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(119,137,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative grid min-h-[760px] grid-rows-[auto_1fr_auto]">
            <div className="flex items-start justify-between border-b border-white/8 px-5 py-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <HugeiconsIcon
                      icon={Message01Icon}
                      className="h-4.5 w-4.5"
                    />
                  </div>
                  <div>
                    <div className="mt-1 text-sm font-medium text-foreground">
                      Intelligence Chat
                    </div>
                  </div>
                </div>
                {activeConversationId ? (
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Thread {truncateMiddle(activeConversationId, 6, 4)}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                        >
                          <HugeiconsIcon
                            icon={Settings02Icon}
                            className="h-4 w-4"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-[360px] rounded-2xl border-border/70 bg-card/95 p-4 backdrop-blur"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <HugeiconsIcon
                                icon={Settings02Icon}
                                className="h-4 w-4"
                              />
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground">
                                MCP agent settings
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {chainCoverageLabel} · Focus {activeTopProtocol}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                              Protocol
                              <Input
                                value={protocolSearch}
                                onChange={(e) =>
                                  setProtocolSearch(e.target.value)
                                }
                                placeholder="Search protocol registry"
                              />
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedProtocolId("")}
                                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                  selectedProtocolId.length === 0
                                    ? "border-primary/40 bg-primary/10 text-foreground"
                                    : "border-border bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                }`}
                              >
                                Any protocol
                              </button>
                              {protocols.slice(0, 4).map((protocol) => (
                                <button
                                  key={protocol.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedProtocolId(protocol.id)
                                  }
                                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                    selectedProtocolId === protocol.id
                                      ? "border-primary/40 bg-primary/10 text-foreground"
                                      : "border-border bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                  }`}
                                >
                                  {protocol.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid gap-3 border-border/60 pt-4 sm:grid-cols-2">
                            <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                              Sector
                              <select
                                value={selectedSector}
                                onChange={(e) =>
                                  setSelectedSector(
                                    e.target
                                      .value as (typeof SUGGESTION_SECTORS)[number]
                                  )
                                }
                                className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-normal tracking-normal text-foreground focus:outline-none"
                              >
                                {SUGGESTION_SECTORS.map((sector) => (
                                  <option key={sector} value={sector}>
                                    {sector.replace("_", " ")}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <div className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                              Coverage
                              <div className="flex h-10 items-center rounded-lg border border-border bg-background px-3 text-sm font-normal tracking-normal text-foreground">
                                {chainCoverageLabel}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 border-t border-border/60 pt-4">
                            <div className="space-y-2">
                              <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                Mode
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(
                                  [
                                    ["auto", "Auto"],
                                    ["evm", "EVM"],
                                    ["solana", "Solana"],
                                    ["custom", "Custom"],
                                  ] as Array<[MpcChainMode, string]>
                                ).map(([mode, label]) => (
                                  <button
                                    key={mode}
                                    type="button"
                                    onClick={() =>
                                      mode === "custom"
                                        ? setChainMode("custom")
                                        : applyChainMode(mode)
                                    }
                                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                      chainMode === mode
                                        ? "border-primary/40 bg-primary/10 text-foreground"
                                        : "border-border bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                Chains
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {chainSummary}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {MCP_CHAIN_OPTIONS.map((chain) => (
                                <button
                                  key={chain.id}
                                  type="button"
                                  onClick={() => toggleChainSelection(chain.id)}
                                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                    selectedChainSet.has(chain.id)
                                      ? "border-primary/40 bg-primary/10 text-foreground"
                                      : "border-border bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                                  }`}
                                >
                                  {chain.label}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={customChainInput}
                                onChange={(e) =>
                                  setCustomChainInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addCustomChain();
                                  }
                                }}
                                placeholder="Add custom chain slug"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={addCustomChain}
                                disabled={
                                  normalizedCustomChainInput.length === 0
                                }
                                className="shrink-0"
                              >
                                <HugeiconsIcon
                                  icon={Add01Icon}
                                  className="mr-2 h-4 w-4"
                                />
                                Add
                              </Button>
                            </div>
                            {customSelectedChains.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {customSelectedChains.map((chain) => (
                                  <button
                                    key={chain}
                                    type="button"
                                    onClick={() => removeChainSelection(chain)}
                                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                                  >
                                    {chain}
                                    <HugeiconsIcon
                                      icon={Cancel01Icon}
                                      className="h-3 w-3"
                                    />
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>

                          <div className="grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                Tracked
                              </div>
                              <div className="mt-2 text-lg font-semibold text-foreground">
                                {typeof suggestionTotals.selected === "number"
                                  ? suggestionTotals.selected.toLocaleString()
                                  : "—"}
                              </div>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                Executed
                              </div>
                              <div className="mt-2 text-lg font-semibold text-foreground">
                                {typeof suggestionTotals.executed === "number"
                                  ? suggestionTotals.executed.toLocaleString()
                                  : "—"}
                              </div>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                Top protocol
                              </div>
                              <div className="mt-2 truncate text-sm font-medium text-foreground">
                                {activeTopProtocol}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>Agent settings</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-6">
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
                {chatMessages.length > 0 ? (
                  <>
                    {chatMessages.map((message) =>
                      message.role === "user" ? (
                        <div key={message.id} className="flex justify-end">
                          <div className="max-w-[78%] rounded-[28px_28px_12px_28px] border border-primary/20 bg-[linear-gradient(180deg,rgba(92,112,255,0.28),rgba(66,88,224,0.4))] px-4 py-3 text-sm text-primary-foreground shadow-[0_22px_60px_-28px_rgba(86,112,255,0.7)] backdrop-blur">
                            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground/75">
                              You
                            </div>
                            <div className="mt-1 leading-6">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={message.id} className="flex justify-start">
                          <div className="flex max-w-[92%] items-end gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] border text-xs font-semibold ${
                                message.kind === "error"
                                  ? "border-red-400/25 bg-red-400/10 text-red-300"
                                  : "border-primary/20 bg-primary/10 text-primary"
                              }`}
                            >
                              {message.kind === "error" ? "!" : "AI"}
                            </div>
                            <div className="overflow-hidden rounded-[28px_28px_28px_12px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,21,38,0.98),rgba(8,13,26,0.98))] shadow-[0_28px_90px_-46px_rgba(45,102,255,0.5)]">
                              <div className="flex flex-wrap items-center gap-2 border-b border-white/8 px-5 py-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                                  <HugeiconsIcon
                                    icon={SparklesIcon}
                                    className="h-4 w-4"
                                  />
                                </div>
                                <div className="text-sm font-medium text-foreground">
                                  {message.kind === "question"
                                    ? "I needs one detail"
                                    : message.kind === "error"
                                      ? "I hit an error"
                                      : "I replied"}
                                </div>
                                {typeof message.confidence === "number" ? (
                                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                                    Confidence{" "}
                                    {Math.round(message.confidence * 100)}%
                                  </span>
                                ) : null}
                                {message.queryReady ? (
                                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-300">
                                    Query ready
                                  </span>
                                ) : null}
                              </div>

                              <div className="space-y-5 px-5 py-5">
                                {message.structuredResult ? (
                                  <div className="space-y-4">
                                    <div className="rounded-[24px] border border-primary/15 bg-[linear-gradient(180deg,rgba(59,89,220,0.12),rgba(16,22,39,0.38))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                                      <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                          <div className="text-[11px] uppercase tracking-[0.16em] text-primary/80">
                                            Stable UI contract
                                          </div>
                                          <div className="mt-1 text-sm font-medium text-foreground">
                                            {message.structuredResult.title ??
                                              prettifyColumnLabel(
                                                message.structuredResult.kind
                                              )}
                                          </div>
                                          <div className="mt-1 text-xs text-muted-foreground">
                                            Stable renderer:{" "}
                                            {prettifyColumnLabel(
                                              message.structuredResult.kind
                                            )}
                                          </div>
                                        </div>
                                        <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                                          {message.structuredResult.rows.length.toLocaleString()}{" "}
                                          rows
                                        </span>
                                      </div>
                                      {message.content.trim().length > 0 ? (
                                        <p className="mt-3 text-sm leading-6 text-foreground/90">
                                          {message.content}
                                        </p>
                                      ) : message.structuredResult.summary ? (
                                        <p className="mt-3 text-sm leading-6 text-foreground/90">
                                          {message.structuredResult.summary}
                                        </p>
                                      ) : null}
                                    </div>

                                    {renderStructuredResult(
                                      message.structuredResult
                                    )}

                                    {message.queryReady
                                      ? renderConversionActions()
                                      : null}
                                  </div>
                                ) : message.content.trim().length > 0 ? (
                                  <div className="text-[15px] leading-7 text-foreground/95">
                                    {message.content}
                                  </div>
                                ) : null}

                                {message.rationale ? (
                                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                      Reasoning frame
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                      {message.rationale}
                                    </p>
                                  </div>
                                ) : null}

                                {message.kind === "error" &&
                                message.errorReport ? (
                                  <div className="rounded-[24px] border border-red-400/20 bg-red-400/5 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="text-[11px] uppercase tracking-[0.16em] text-red-200/90">
                                        Bug report
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const report = message.errorReport;
                                          if (!report) return;
                                          navigator.clipboard
                                            .writeText(
                                              formatMcpFailureReport(report)
                                            )
                                            .catch(() => {
                                              // Copy failure should not block the visible bug report.
                                            });
                                          toast.success("Bug details copied");
                                        }}
                                        className="inline-flex items-center gap-1 rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[11px] font-medium text-red-100 transition-colors hover:bg-red-400/15"
                                      >
                                        <HugeiconsIcon
                                          icon={Copy01Icon}
                                          className="h-3.5 w-3.5"
                                        />
                                        Copy
                                      </button>
                                    </div>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                      <div>
                                        <div className="text-[11px] uppercase tracking-[0.14em] text-red-200/70">
                                          Status
                                        </div>
                                        <div className="mt-1 text-sm text-red-50">
                                          {message.errorReport.statusCode ??
                                            "Unknown"}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-[11px] uppercase tracking-[0.14em] text-red-200/70">
                                          Time
                                        </div>
                                        <div className="mt-1 text-sm text-red-50">
                                          {message.errorReport.at}
                                        </div>
                                      </div>
                                      {message.errorReport.requestId ? (
                                        <div>
                                          <div className="text-[11px] uppercase tracking-[0.14em] text-red-200/70">
                                            Request ID
                                          </div>
                                          <div className="mt-1 break-all font-mono text-xs text-red-50">
                                            {message.errorReport.requestId}
                                          </div>
                                        </div>
                                      ) : null}
                                      {message.errorReport.conversationId ? (
                                        <div>
                                          <div className="text-[11px] uppercase tracking-[0.14em] text-red-200/70">
                                            Conversation ID
                                          </div>
                                          <div className="mt-1 break-all font-mono text-xs text-red-50">
                                            {message.errorReport.conversationId}
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className="mt-3">
                                      <div className="text-[11px] uppercase tracking-[0.14em] text-red-200/70">
                                        Failure
                                      </div>
                                      <div className="mt-1 text-sm leading-6 text-red-50">
                                        {message.errorReport.message}
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {Array.isArray(message.toolSteps) &&
                                message.toolSteps.length > 0 ? (
                                  <div className="grid gap-3 md:grid-cols-2">
                                    {message.toolSteps.map((step, index) => (
                                      <div
                                        key={
                                          step.title ??
                                          step.toolName ??
                                          step.description ??
                                          "tool-step"
                                        }
                                        className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                            {index + 1}
                                          </div>
                                          <div className="text-sm font-medium text-foreground">
                                            {step.title ??
                                              step.toolName ??
                                              `Step ${index + 1}`}
                                          </div>
                                        </div>
                                        {step.description ? (
                                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            {step.description}
                                          </p>
                                        ) : null}
                                      </div>
                                    ))}
                                  </div>
                                ) : null}

                                <div className="flex flex-wrap items-center gap-2 border-t border-white/8 pt-3 text-[11px] text-muted-foreground">
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                                    <Zap className="h-3 w-3 text-primary" />
                                    {message.mode === "deterministic_fallback"
                                      ? "Deterministic fallback"
                                      : "Dynamic MCP routing"}
                                  </span>
                                  {message.queryReady ? (
                                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-primary">
                                      Turn into report, campaign, or segment
                                      below
                                    </span>
                                  ) : message.kind === "question" ? (
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                                      Reply below to continue this thread
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    {mcpMutation.isPending ? (
                      <McpTypingIndicator
                        activity={reasoningTimeline}
                        recovering={streamFallbackUsed}
                      />
                    ) : null}
                  </>
                ) : (
                  <div className="flex flex-col items-center px-4 py-10 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_20px_50px_-28px_rgba(86,112,255,0.8)]">
                      <HugeiconsIcon icon={SparklesIcon} className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 max-w-md text-xl font-medium tracking-[-0.02em] text-foreground">
                      Ask anything about onchain activity
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                      Trace token holders, compare wallets, analyze gas, or
                      explain protocol activity. The agent streams its
                      reasoning, then returns a clean, structured answer.
                    </p>

                    <div className="mt-6 grid w-full max-w-xl gap-2.5 sm:grid-cols-2">
                      {[
                        {
                          title: "Top holders by token",
                          prompt:
                            "Show me the top 10 holders for this token contract.",
                        },
                        {
                          title: "Wallet balances across chains",
                          prompt:
                            "Compare this wallet's balances across EVM and Solana.",
                        },
                        {
                          title: "Recent transactions by wallet",
                          prompt:
                            "List the most recent transactions for this wallet.",
                        },
                        {
                          title: "Current gas snapshots",
                          prompt:
                            "What are the current gas prices across major chains?",
                        },
                      ].map((chip) => (
                        <button
                          key={chip.title}
                          type="button"
                          onClick={() => submitChatPrompt(chip.prompt)}
                          className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.06]"
                        >
                          <span>{chip.title}</span>
                          <HugeiconsIcon
                            icon={ArrowUp01Icon}
                            className="h-4 w-4 rotate-45 text-muted-foreground transition-colors group-hover:text-primary"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-[#050913] px-3 py-2">
                      <div className="ocs-anim-hash-flicker truncate font-mono text-[10px] leading-5 tracking-[0.12em] text-primary/60">
                        {createStableLineKeys(
                          buildMatrixFrame(1, 60),
                          "empty-matrix"
                        )
                          .map(({ line }) => line)
                          .join("")}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatThreadEndRef} />
              </div>
            </div>

            <div className="border-t border-white/8 px-5 py-4 backdrop-blur">
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
                <div className="flex items-end gap-2 rounded-[24px] border border-white/12 bg-white/[0.04] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/25">
                  <textarea
                    id="mcp-chat-input"
                    aria-label="MCP chat input"
                    value={chatPrompt}
                    onChange={(e) => setChatPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (mcpMutation.isPending) return;
                        submitChatPrompt(chatPrompt);
                      }
                    }}
                    rows={1}
                    className="max-h-44 min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                    placeholder="Ask anything about onchain activity…"
                  />
                  <Button
                    type="button"
                    aria-label="Send"
                    onClick={() => submitChatPrompt(chatPrompt)}
                    disabled={
                      mcpMutation.isPending || chatPrompt.trim().length === 0
                    }
                    className="h-11 w-11 shrink-0 rounded-full bg-[linear-gradient(135deg,#5c70ff,#4258e0)] p-0 shadow-[0_14px_34px_-16px_rgba(86,112,255,0.9)] transition-all hover:shadow-[0_18px_40px_-14px_rgba(86,112,255,1)]"
                  >
                    {mcpMutation.isPending ? (
                      <HugeiconsIcon
                        icon={Loading02Icon}
                        className="h-4 w-4 animate-spin"
                      />
                    ) : (
                      <HugeiconsIcon icon={ArrowUp01Icon} className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(180deg,rgba(8,13,25,0.98),rgba(4,8,17,0.98))] shadow-[0_28px_80px_-48px_rgba(66,118,255,0.75)] transition-shadow focus-within:shadow-[0_28px_90px_-40px_rgba(66,118,255,0.9)]">
            {/* ambient glow */}
            <div className="ocs-anim-float-glow pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
            {/* editor window header */}
            <div className="relative flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </span>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CodeIcon}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="font-mono text-xs text-primary/90">
                    query.sql
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-400 md:inline">
                  Postgres · org-scoped
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label="AI SQL assistant"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/25"
                    >
                      <HugeiconsIcon
                        icon={SparklesIcon}
                        className="h-3.5 w-3.5"
                      />
                      AI assist
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-[420px] rounded-2xl border-border/70 bg-card/95 p-4 backdrop-blur"
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <HugeiconsIcon
                            icon={SparklesIcon}
                            className="h-4 w-4 text-primary"
                          />
                          AI SQL assistant
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Describe what you want — generate SQL, get ideas, or
                          start from a template.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <textarea
                          value={assistantPrompt}
                          onChange={(e) => setAssistantPrompt(e.target.value)}
                          placeholder="e.g. Find dormant high-value wallets that have an email on file"
                          className="min-h-[70px] w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={() => generateSqlMutation.mutate()}
                            disabled={
                              generateSqlMutation.isPending ||
                              trimmedAssistantPrompt.length === 0
                            }
                            className="flex-1"
                          >
                            {generateSqlMutation.isPending ? (
                              <HugeiconsIcon
                                icon={Loading02Icon}
                                className="mr-2 h-4 w-4 animate-spin"
                              />
                            ) : (
                              <HugeiconsIcon
                                icon={SparklesIcon}
                                className="mr-2 h-4 w-4"
                              />
                            )}
                            Generate SQL
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => suggestionsMutation.mutate()}
                            disabled={
                              suggestionsMutation.isPending ||
                              trimmedAssistantPrompt.length === 0
                            }
                          >
                            {suggestionsMutation.isPending ? (
                              <HugeiconsIcon
                                icon={Loading02Icon}
                                className="h-4 w-4 animate-spin"
                              />
                            ) : (
                              "Ideas"
                            )}
                          </Button>
                        </div>
                      </div>

                      {generateSqlMutation.data?.sql ? (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                          {generateSqlMutation.data.explanation ? (
                            <p className="text-xs leading-5 text-muted-foreground">
                              {generateSqlMutation.data.explanation}
                            </p>
                          ) : null}
                          <pre className="mt-2 max-h-32 overflow-auto rounded-md bg-background p-2 font-mono text-[11px] leading-5 text-foreground">
                            {generateSqlMutation.data.sql}
                          </pre>
                          <Button
                            type="button"
                            size="sm"
                            className="mt-2"
                            onClick={() =>
                              loadSqlIntoEditor(
                                generateSqlMutation.data?.sql ?? ""
                              )
                            }
                          >
                            Use this SQL
                          </Button>
                        </div>
                      ) : null}

                      {suggestionItems.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            Suggestions
                          </div>
                          {suggestionItems.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() =>
                                s.sqlDraft
                                  ? loadSqlIntoEditor(s.sqlDraft, s.id)
                                  : setAssistantPrompt(s.prompt ?? s.title)
                              }
                              className="w-full rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary/30 hover:bg-muted/40"
                            >
                              <div className="text-sm font-medium text-foreground">
                                {s.title}
                              </div>
                              {s.reason ? (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {s.reason}
                                </p>
                              ) : null}
                            </button>
                          ))}
                        </div>
                      ) : null}

                      {starters.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            Starter queries
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {starters.slice(0, 6).map((starter) => (
                              <button
                                key={starter.id}
                                type="button"
                                onClick={() => loadSqlIntoEditor(starter.query)}
                                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                              >
                                {starter.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </PopoverContent>
                </Popover>
                <button
                  onClick={() => navigator.clipboard.writeText(sqlQuery)}
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-100"
                  aria-label="Copy SQL"
                >
                  <HugeiconsIcon icon={Copy01Icon} className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => validateMutation.mutate()}
                  disabled={validateMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  {validateMutation.isPending ? (
                    <HugeiconsIcon
                      icon={Loading02Icon}
                      className="h-3.5 w-3.5 animate-spin"
                    />
                  ) : (
                    <Zap className="h-3.5 w-3.5" />
                  )}
                  Validate
                </button>
                <button
                  onClick={() => runMutation.mutate()}
                  disabled={isQueryRunning}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_12px_30px_-12px_rgba(86,112,255,0.9)] transition-all hover:bg-primary/90 hover:shadow-[0_16px_36px_-12px_rgba(86,112,255,1)] disabled:opacity-50"
                >
                  {isQueryRunning ? (
                    <HugeiconsIcon
                      icon={Loading02Icon}
                      className="h-3.5 w-3.5 animate-spin"
                    />
                  ) : (
                    <HugeiconsIcon icon={PlayIcon} className="h-3.5 w-3.5" />
                  )}
                  Run
                </button>
              </div>
            </div>
            {/* editor body */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(122,140,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(122,140,255,0.18)_1px,transparent_1px)] [background-size:22px_22px]" />
              {/* blockchain chain accent gutter */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-9 flex-col items-center justify-start gap-3 border-r border-white/5 bg-white/[0.02] py-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-primary/40"
                  />
                ))}
              </div>
              <textarea
                aria-label="SQL query editor"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="relative z-10 h-[260px] w-full resize-none bg-transparent py-4 pl-12 pr-4 font-mono text-sm leading-6 text-sky-50 caret-primary placeholder:text-slate-500 focus:outline-none"
                placeholder={`SELECT\n  wallet,\n  email\nFROM users\nLIMIT 50;`}
                spellCheck={false}
              />
            </div>
            {/* footer */}
            <div className="relative flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] text-slate-400">
              <span>Read-only SELECT against your organization data.</span>
              <span className="font-mono">
                {sqlQuery.length === 0
                  ? "0 lines"
                  : `${sqlQuery.split("\n").length} lines`}{" "}
                · {sqlQuery.length} chars
              </span>
            </div>
          </div>
        </>
      )}

      {activeSurface === "sql" && validateMutation.data ? (
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">
              {validateMutation.data.valid
                ? "Valid query"
                : "Query needs attention"}
            </span>
            {schemaQuery.data ? (
              <span className="text-xs text-muted-foreground">
                Schema loaded
              </span>
            ) : null}
          </div>
          {Array.isArray(validateMutation.data.suggestions) &&
          validateMutation.data.suggestions.length > 0 ? (
            <ul className="mt-2 list-disc pl-5 text-muted-foreground">
              {validateMutation.data.suggestions.slice(0, 6).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {isSqlRunning ? <SqlBlockchainLoader query={sqlQuery} /> : null}

      {hasRunQuery && !isSqlRunning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/30 px-4 py-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">
                {typeof totalRows === "number" ? totalRows.toLocaleString() : 0}{" "}
                results
              </span>
              {summaryQuery.data?.winbackPotential ? (
                <span className="text-sm text-muted-foreground">
                  Win-back potential:{" "}
                  <span className="font-medium text-primary">
                    {summaryQuery.data.winbackPotential}
                  </span>
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {selectedRows.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {selectedRows.length} selected
                  <button
                    onClick={() => setSelectedRows([])}
                    className="ml-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted/40"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" />
                    Clear
                  </button>
                </span>
              )}
              {queryId ? (
                <>
                  <button
                    onClick={() => {
                      openNameDialog("report");
                    }}
                    disabled={saveReportMutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
                  >
                    Save report
                  </button>
                  <button
                    onClick={() => {
                      openNameDialog("segment");
                    }}
                    disabled={createSegmentMutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:shadow-[0_0_16px_rgba(var(--primary),0.4)] disabled:opacity-50"
                  >
                    <HugeiconsIcon icon={Add01Icon} className="h-3.5 w-3.5" />
                    Create segment
                  </button>
                  <button
                    onClick={() => {
                      openNameDialog("campaign");
                    }}
                    disabled={createCampaignMutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
                  >
                    <HugeiconsIcon icon={Mail01Icon} className="h-3.5 w-3.5" />
                    Create campaign
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        rows.length > 0 && selectedRows.length === rows.length
                      }
                      onChange={toggleAllRows}
                    />
                  </th>
                  {columns.slice(0, 8).map((c) => (
                    <th key={c} className="px-4 py-3">
                      {c}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const email = typeof row.email === "string" ? row.email : "";
                  const key =
                    typeof row.id === "string" && row.id.length > 0
                      ? row.id
                      : String(idx);
                  return (
                    <tr
                      key={key}
                      className="border-b border-border/50 transition-colors hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(String(idx))}
                          onChange={() => toggleRowSelection(String(idx))}
                        />
                      </td>
                      {columns.slice(0, 8).map((c) => (
                        <td key={c} className="px-4 py-3">
                          {typeof row[c] === "string" ||
                          typeof row[c] === "number"
                            ? String(row[c])
                            : row[c] === null || row[c] === undefined
                              ? ""
                              : isJsonObject(row[c])
                                ? "[object]"
                                : Array.isArray(row[c])
                                  ? "[array]"
                                  : String(row[c])}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {email.length > 0 ? (
                            <button
                              className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                              onClick={() => openEmailComposer({ email })}
                            >
                              <HugeiconsIcon
                                icon={Mail01Icon}
                                className="mr-1 inline-block h-3.5 w-3.5"
                              />
                              Email
                            </button>
                          ) : null}
                          <button
                            className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                JSON.stringify(row, null, 2)
                              )
                            }
                          >
                            <HugeiconsIcon
                              icon={Copy01Icon}
                              className="mr-1 inline-block h-3.5 w-3.5"
                            />
                            Copy
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {queryId && status === "completed" && pageCount > 1 ? (
            <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
              <span className="text-muted-foreground">
                Page {page} of {pageCount}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page >= pageCount}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </motion.div>
      )}

      {(hasRunQuery || chatMessages.length > 0) &&
      (historyQuery.data?.length ?? 0) > 0 ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 text-sm font-medium text-foreground">
            Recent queries
          </div>
          <div className="space-y-2">
            {(historyQuery.data ?? []).slice(0, 5).map((h) => {
              const item = isJsonObject(h)
                ? (h as Record<string, unknown>)
                : {};
              const qid =
                typeof item.queryId === "string"
                  ? item.queryId
                  : typeof item.id === "string"
                    ? item.id
                    : "";
              const q = typeof item.query === "string" ? item.query : "";
              const s = typeof item.status === "string" ? item.status : "";
              if (!qid || q.length === 0) return null;
              return (
                <button
                  key={qid}
                  type="button"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-sm hover:bg-muted/40"
                  onClick={() => {
                    setQueryId(qid);
                    setHasRunQuery(true);
                    if (q.length > 0) setSqlQuery(q);
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {qid}
                    </span>
                    <span className="text-xs text-muted-foreground">{s}</span>
                  </div>
                  {q.length > 0 ? (
                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {q}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>
              {nameDialogKind === "report"
                ? "Save report"
                : nameDialogKind === "segment"
                  ? "Create segment"
                  : "Create campaign"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              value={nameDialogValue}
              onChange={(e) => setNameDialogValue(e.target.value)}
              placeholder={
                nameDialogKind === "campaign"
                  ? "Campaign subject (optional)"
                  : "Name"
              }
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNameDialog();
              }}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNameDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={submitNameDialog}
                disabled={
                  nameDialogKind !== "campaign" &&
                  nameDialogValue.trim().length === 0
                }
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
