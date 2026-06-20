"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Code,
  Copy,
  Loader2,
  Mail,
  MessageSquareText,
  Play,
  Plus,
  Settings2,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";

import { isJsonObject } from "@/lib/utils";

import { intelligenceService } from "../../intelligence.service";

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

const MCP_QUICK_PROMPTS = [
  "Find the most active Base wallets interacting with Aerodrome this week",
  "Show NFT holders with high transaction volume and email coverage",
  "Which wallets look ready for a win-back campaign this month?",
] as const;

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
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      kind?: "answer" | "question";
      rationale?: string;
      confidence?: number;
      queryReady?: boolean;
      toolSteps?: Array<{
        toolName?: string;
        title?: string;
        description?: string;
      }>;
    }>
  >([]);
  const [openHelperTab, setOpenHelperTab] = useState<
    "generate" | "starters" | null
  >(null);
  const [protocolSearch, setProtocolSearch] = useState("");
  const [selectedProtocolId, setSelectedProtocolId] = useState("");
  const [selectedSector, setSelectedSector] =
    useState<(typeof SUGGESTION_SECTORS)[number]>("general");
  const [selectedChain, setSelectedChain] = useState("base-mainnet");
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(
    null
  );
  const trimmedSqlQuery = sqlQuery.trim();
  const trimmedChatPrompt = chatPrompt.trim();
  const trimmedAssistantPrompt = assistantPrompt.trim();
  const normalizedProtocolSearch = protocolSearch.trim();

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
        chain: selectedChain,
      },
    ],
    queryFn: () =>
      intelligenceService.listQueryProtocols({
        search:
          normalizedProtocolSearch.length > 0
            ? normalizedProtocolSearch
            : undefined,
        sector: selectedSector === "general" ? undefined : selectedSector,
        chain: selectedChain.length > 0 ? selectedChain : undefined,
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

  const mcpMutation = useMutation({
    mutationFn: async () => {
      if (trimmedChatPrompt.length === 0) {
        throw new Error("Write a message first");
      }
      return intelligenceService.queryGoldrushMcp({
        prompt: trimmedChatPrompt,
        protocol: selectedProtocol?.name,
        chain: selectedChain,
        contractAddresses:
          Array.isArray(selectedProtocol?.contractAddresses) &&
          selectedProtocol.contractAddresses.length > 0
            ? selectedProtocol.contractAddresses
            : undefined,
        mode: "best",
        useProjectSettings: true,
        useProtocolRegistry: true,
      });
    },
    onSuccess: (res) => {
      const assistantMessage =
        typeof res.answer === "string" && res.answer.trim().length > 0
          ? {
              id: `assistant-${Date.now()}`,
              role: "assistant" as const,
              content: res.answer,
              kind: "answer" as const,
              rationale:
                typeof res.rationale === "string" ? res.rationale : undefined,
              confidence:
                typeof res.confidence === "number" ? res.confidence : undefined,
              queryReady:
                typeof res.queryId === "string" && res.queryId.length > 0,
              toolSteps: Array.isArray(res.steps)
                ? res.steps.slice(0, 4).map((step) => ({
                    toolName:
                      typeof step.toolName === "string"
                        ? step.toolName
                        : undefined,
                    title:
                      typeof step.title === "string" ? step.title : undefined,
                    description:
                      typeof step.description === "string"
                        ? step.description
                        : undefined,
                  }))
                : undefined,
            }
          : typeof res.question === "string" && res.question.trim().length > 0
            ? {
                id: `assistant-${Date.now()}`,
                role: "assistant" as const,
                content: res.question,
                kind: "question" as const,
                rationale:
                  typeof res.rationale === "string" ? res.rationale : undefined,
                confidence:
                  typeof res.confidence === "number"
                    ? res.confidence
                    : undefined,
                queryReady: false,
                toolSteps: Array.isArray(res.steps)
                  ? res.steps.slice(0, 4).map((step) => ({
                      toolName:
                        typeof step.toolName === "string"
                          ? step.toolName
                          : undefined,
                      title:
                        typeof step.title === "string" ? step.title : undefined,
                      description:
                        typeof step.description === "string"
                          ? step.description
                          : undefined,
                    }))
                  : undefined,
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
      const message =
        err instanceof Error ? err.message : "Failed to run MCP chat";
      toast.error(message);
    },
  });

  const suggestionsMutation = useMutation({
    mutationFn: async () => {
      if (trimmedAssistantPrompt.length === 0) {
        throw new Error("Write a prompt first");
      }
      return intelligenceService.getQuerySuggestions({
        prompt: trimmedAssistantPrompt,
        protocol: selectedProtocol?.name,
        sector: selectedSector,
        chain: selectedChain,
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
  const latestMcpResponse = mcpMutation.data;
  const status = statusQuery.data?.status ?? latestRunData?.status ?? "";
  const isQueryRunning =
    runMutation.isPending ||
    mcpMutation.isPending ||
    status === "running" ||
    statusQuery.isFetching;

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
  const loweredColumns = useMemo(
    () => columns.map((column) => column.toLowerCase()),
    [columns]
  );
  const latestAssistantMessageId = useMemo(
    () =>
      [...chatMessages]
        .reverse()
        .find((message) => message.role === "assistant")?.id ?? null,
    [chatMessages]
  );
  const primaryIdentityColumn = useMemo(() => {
    const preferred = [
      "name",
      "title",
      "label",
      "wallet",
      "wallet_address",
      "address",
      "email",
      "holder",
      "user",
      "account",
    ];
    const lowered = columns.map((column) => ({
      raw: column,
      normalized: column.toLowerCase(),
    }));
    for (const preferredKey of preferred) {
      const match = lowered.find(
        (column) =>
          column.normalized === preferredKey ||
          column.normalized.includes(preferredKey)
      );
      if (match) return match.raw;
    }
    return columns[0] ?? null;
  }, [columns]);
  const metricColumns = useMemo(() => {
    const scored = columns
      .map((column) => {
        const values = rows
          .map((row) => asNumber(row[column]))
          .filter((value): value is number => value !== null);
        return {
          column,
          values,
          count: values.length,
        };
      })
      .filter((entry) => entry.count > 0);

    const preferred = ["score", "value", "amount", "count", "volume", "ltv"];
    scored.sort((a, b) => {
      const aPriority = preferred.findIndex((key) =>
        a.column.toLowerCase().includes(key)
      );
      const bPriority = preferred.findIndex((key) =>
        b.column.toLowerCase().includes(key)
      );
      const normalizedA = aPriority === -1 ? 999 : aPriority;
      const normalizedB = bPriority === -1 ? 999 : bPriority;
      if (normalizedA !== normalizedB) return normalizedA - normalizedB;
      return b.count - a.count;
    });

    return scored;
  }, [columns, rows]);
  const primaryMetric = metricColumns[0] ?? null;
  const resultArchetype = useMemo(() => {
    const hasWalletSignal = loweredColumns.some(
      (column) =>
        column.includes("wallet") ||
        column.includes("address") ||
        column.includes("ens")
    );
    const hasNftSignal = loweredColumns.some(
      (column) =>
        column.includes("nft") ||
        column.includes("collection") ||
        column.includes("token_id") ||
        column.includes("rarity")
    );
    const hasProtocolSignal = loweredColumns.some(
      (column) =>
        column.includes("protocol") ||
        column.includes("pool") ||
        column.includes("contract") ||
        column.includes("project")
    );
    const hasCampaignSignal = loweredColumns.some(
      (column) =>
        column.includes("email") ||
        column.includes("engagement") ||
        column.includes("ltv") ||
        column.includes("winback") ||
        column.includes("segment")
    );

    if (hasNftSignal) return "nft";
    if (hasProtocolSignal) return "protocol";
    if (hasWalletSignal && !hasCampaignSignal) return "wallet";
    if (hasCampaignSignal) return "campaign";
    return "general";
  }, [loweredColumns]);
  const averagePrimaryMetric = useMemo(() => {
    if (!primaryMetric || primaryMetric.values.length === 0) return null;
    const total = primaryMetric.values.reduce((sum, value) => sum + value, 0);
    return total / primaryMetric.values.length;
  }, [primaryMetric]);
  const chatPreviewRows = useMemo(() => {
    if (!primaryIdentityColumn) return [];
    return rows.slice(0, 4).map((row, index) => ({
      id: `${primaryIdentityColumn}-${index}`,
      label: asDisplayText(row[primaryIdentityColumn]),
      metric:
        primaryMetric && primaryMetric.column !== primaryIdentityColumn
          ? asDisplayText(row[primaryMetric.column])
          : null,
    }));
  }, [primaryIdentityColumn, primaryMetric, rows]);
  const distributionRows = useMemo(() => {
    if (!primaryIdentityColumn || !primaryMetric) return [];
    const maxValue = Math.max(...primaryMetric.values, 0);
    return rows
      .map((row, index) => {
        const numericValue = asNumber(row[primaryMetric.column]);
        if (numericValue === null) return null;
        return {
          id: `${primaryMetric.column}-${index}`,
          label: asDisplayText(row[primaryIdentityColumn]),
          value: numericValue,
          width:
            maxValue > 0 ? Math.max(8, (numericValue / maxValue) * 100) : 8,
        };
      })
      .filter(
        (
          item
        ): item is {
          id: string;
          label: string;
          value: number;
          width: number;
        } => item !== null
      )
      .slice(0, 5);
  }, [primaryIdentityColumn, primaryMetric, rows]);
  const querySummaryLine =
    typeof summaryQuery.data?.summary === "string" &&
    summaryQuery.data.summary.trim().length > 0
      ? summaryQuery.data.summary
      : null;
  const walletCoverage = useMemo(() => {
    const walletColumn = columns.find((column) =>
      column.toLowerCase().includes("wallet")
    );
    if (!walletColumn || rows.length === 0) return null;
    const covered = rows.filter((row) => {
      const value = row[walletColumn];
      return value !== null && value !== undefined && value !== "";
    }).length;
    return Math.round((covered / rows.length) * 100);
  }, [columns, rows]);
  const emailCoverage = useMemo(() => {
    const emailColumn = columns.find((column) =>
      column.toLowerCase().includes("email")
    );
    if (!emailColumn || rows.length === 0) return null;
    const covered = rows.filter((row) => {
      const value = row[emailColumn];
      return value !== null && value !== undefined && value !== "";
    }).length;
    return Math.round((covered / rows.length) * 100);
  }, [columns, rows]);
  const strongestColumn = useMemo(() => {
    if (!primaryMetric) return null;
    return prettifyColumnLabel(primaryMetric.column);
  }, [primaryMetric]);
  const nftCollectionColumn = useMemo(
    () =>
      columns.find((column) => {
        const normalized = column.toLowerCase();
        return normalized.includes("collection") || normalized.includes("nft");
      }) ?? primaryIdentityColumn,
    [columns, primaryIdentityColumn]
  );
  const protocolColumn = useMemo(
    () =>
      columns.find((column) => {
        const normalized = column.toLowerCase();
        return (
          normalized.includes("protocol") ||
          normalized.includes("project") ||
          normalized.includes("pool")
        );
      }) ?? primaryIdentityColumn,
    [columns, primaryIdentityColumn]
  );

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
    },
    [mcpMutation, runMutation, validateMutation]
  );

  const toggleHelperTab = useCallback((tab: "generate" | "starters") => {
    setOpenHelperTab((current) => (current === tab ? null : tab));
  }, []);

  return (
    <div className="space-y-4">
      {activeSurface === "chat" ? (
        <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,123,255,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(46,164,255,0.10),transparent_28%)]" />
          <div className="relative grid min-h-[720px] grid-rows-[auto_1fr_auto]">
            <div className="flex items-start justify-between border-b border-border/60 px-5 py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <MessageSquareText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Intelligence Chat
                    </div>
                    <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Default MCP agent
                    </div>
                  </div>
                </div>
                <p className="max-w-[56ch] text-sm text-muted-foreground">
                  Ask naturally. The agent chooses the right GoldRush MCP path,
                  then hands query-backed results into reports, segments, and
                  campaigns.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
                  <span>Focus:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {activeTopProtocol}
                  </span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-[360px] rounded-2xl border-border/70 bg-card/95 p-4 backdrop-blur"
                      >
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              MCP settings
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Keep the canvas clean while still steering
                              protocol, sector, and chain context.
                            </p>
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

                          <div className="grid gap-3 sm:grid-cols-2">
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
                            <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                              Chain
                              <Input
                                value={selectedChain}
                                onChange={(e) =>
                                  setSelectedChain(e.target.value)
                                }
                                placeholder="base-mainnet"
                              />
                            </label>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-3">
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

            <div className="overflow-y-auto px-5 py-5">
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
                {chatMessages.length > 0 ? (
                  chatMessages.map((message) =>
                    message.role === "user" ? (
                      <div key={message.id} className="flex justify-end">
                        <div className="max-w-[78%] rounded-[24px] bg-primary px-4 py-3 text-sm text-primary-foreground shadow-[0_12px_30px_-16px_rgba(86,112,255,0.75)]">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div key={message.id} className="max-w-[92%]">
                        <div className="overflow-hidden rounded-[28px] border border-border/70 bg-[linear-gradient(180deg,rgba(25,32,51,0.98),rgba(15,20,35,0.96))] shadow-[0_24px_80px_-40px_rgba(45,102,255,0.45)]">
                          <div className="flex flex-wrap items-center gap-2 border-b border-white/6 px-5 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <div className="text-sm font-medium text-foreground">
                              {message.kind === "question"
                                ? "Clarification needed"
                                : "MCP analysis"}
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
                            <div className="text-[15px] leading-7 text-foreground/95">
                              {message.content}
                            </div>

                            {message.id === latestAssistantMessageId &&
                            message.queryReady &&
                            status === "completed" ? (
                              <div className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                  <div className="rounded-2xl border border-primary/20 bg-primary/8 p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                      Audience size
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                                      {totalRows.toLocaleString()}
                                    </div>
                                  </div>
                                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                      Opportunity score
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                                      {typeof summaryQuery.data?.score ===
                                      "number"
                                        ? summaryQuery.data.score
                                        : averagePrimaryMetric !== null
                                          ? averagePrimaryMetric.toFixed(1)
                                          : "—"}
                                    </div>
                                  </div>
                                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                      Win-back
                                    </div>
                                    <div className="mt-2 text-lg font-medium text-foreground">
                                      {summaryQuery.data?.winbackPotential ??
                                        "—"}
                                    </div>
                                  </div>
                                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                      Lead metric
                                    </div>
                                    <div className="mt-2 text-lg font-medium text-foreground">
                                      {primaryMetric
                                        ? prettifyColumnLabel(
                                            primaryMetric.column
                                          )
                                        : "No numeric signal"}
                                    </div>
                                  </div>
                                </div>

                                {querySummaryLine ? (
                                  <div className="rounded-2xl border border-border/60 bg-white/[0.03] p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                      Summary
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-foreground/90">
                                      {querySummaryLine}
                                    </p>
                                  </div>
                                ) : null}

                                {resultArchetype === "wallet" ? (
                                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                      <div className="mb-3 flex items-center justify-between gap-3">
                                        <div>
                                          <div className="text-sm font-medium text-foreground">
                                            Wallet cohort leaderboard
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Most relevant wallets from the MCP
                                            run
                                          </div>
                                        </div>
                                        {walletCoverage !== null ? (
                                          <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                                            {walletCoverage}% wallet coverage
                                          </span>
                                        ) : null}
                                      </div>
                                      {chatPreviewRows.length > 0 ? (
                                        <div className="space-y-2">
                                          {chatPreviewRows.map((row) => (
                                            <div
                                              key={row.id}
                                              className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/70 px-3 py-3"
                                            >
                                              <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-medium text-foreground">
                                                  {row.label}
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                  Wallet-level candidate for
                                                  activation
                                                </div>
                                              </div>
                                              {row.metric ? (
                                                <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                  {row.metric}
                                                </div>
                                              ) : null}
                                            </div>
                                          ))}
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className="space-y-4">
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Wallet signal mix
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                          <div className="rounded-xl border border-border/50 bg-card/70 p-3">
                                            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                              Primary signal
                                            </div>
                                            <div className="mt-2 text-sm font-medium text-foreground">
                                              {strongestColumn ?? "—"}
                                            </div>
                                          </div>
                                          <div className="rounded-xl border border-border/50 bg-card/70 p-3">
                                            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                              Cohort size
                                            </div>
                                            <div className="mt-2 text-sm font-medium text-foreground">
                                              {totalRows.toLocaleString()}{" "}
                                              wallets
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Relative wallet strength
                                        </div>
                                        {distributionRows.length > 0 ? (
                                          <div className="space-y-3">
                                            {distributionRows.map((row) => (
                                              <div
                                                key={row.id}
                                                className="space-y-1.5"
                                              >
                                                <div className="flex items-center justify-between gap-3 text-xs">
                                                  <span className="truncate text-muted-foreground">
                                                    {row.label}
                                                  </span>
                                                  <span className="font-medium text-foreground">
                                                    {row.value.toLocaleString()}
                                                  </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                                  <div
                                                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(79,111,255,0.95),rgba(60,178,255,0.9))]"
                                                    style={{
                                                      width: `${row.width}%`,
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {resultArchetype === "nft" ? (
                                  <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                                    <div className="space-y-4">
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Collection spotlight
                                        </div>
                                        <div className="rounded-2xl border border-primary/20 bg-primary/8 p-4">
                                          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                            Featured collection
                                          </div>
                                          <div className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                                            {nftCollectionColumn && rows[0]
                                              ? asDisplayText(
                                                  rows[0][nftCollectionColumn]
                                                )
                                              : "—"}
                                          </div>
                                          <div className="mt-2 text-sm text-muted-foreground">
                                            Highlighting the highest-signal NFT
                                            result returned by MCP.
                                          </div>
                                        </div>
                                      </div>
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Holder preview
                                        </div>
                                        {chatPreviewRows.length > 0 ? (
                                          <div className="space-y-2">
                                            {chatPreviewRows.map((row) => (
                                              <div
                                                key={row.id}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/70 px-3 py-3"
                                              >
                                                <div className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                                                  {row.label}
                                                </div>
                                                {row.metric ? (
                                                  <span className="text-xs text-muted-foreground">
                                                    {row.metric}
                                                  </span>
                                                ) : null}
                                              </div>
                                            ))}
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                      <div className="mb-3 text-sm font-medium text-foreground">
                                        Collection distribution
                                      </div>
                                      {distributionRows.length > 0 ? (
                                        <div className="space-y-3">
                                          {distributionRows.map((row) => (
                                            <div
                                              key={row.id}
                                              className="space-y-1.5"
                                            >
                                              <div className="flex items-center justify-between gap-3 text-xs">
                                                <span className="truncate text-muted-foreground">
                                                  {row.label}
                                                </span>
                                                <span className="font-medium text-foreground">
                                                  {row.value.toLocaleString()}
                                                </span>
                                              </div>
                                              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                                <div
                                                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(165,104,255,0.95),rgba(79,111,255,0.9))]"
                                                  style={{
                                                    width: `${row.width}%`,
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="rounded-xl border border-dashed border-border/60 px-3 py-6 text-sm text-muted-foreground">
                                          No collection-level numeric breakdown
                                          found.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : null}

                                {resultArchetype === "protocol" ? (
                                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                      <div className="mb-3 flex items-center justify-between gap-3">
                                        <div>
                                          <div className="text-sm font-medium text-foreground">
                                            Protocol activity board
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            MCP-ranked activity across
                                            contracts, pools, or projects
                                          </div>
                                        </div>
                                        {protocolColumn ? (
                                          <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                                            {prettifyColumnLabel(
                                              protocolColumn
                                            )}
                                          </span>
                                        ) : null}
                                      </div>
                                      {chatPreviewRows.length > 0 ? (
                                        <div className="space-y-2">
                                          {chatPreviewRows.map((row) => (
                                            <div
                                              key={row.id}
                                              className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/70 px-3 py-3"
                                            >
                                              <div className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                                                {row.label}
                                              </div>
                                              {row.metric ? (
                                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                  {row.metric}
                                                </span>
                                              ) : null}
                                            </div>
                                          ))}
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className="space-y-4">
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Protocol momentum
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                          <div className="rounded-xl border border-border/50 bg-card/70 p-3">
                                            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                              Active chain
                                            </div>
                                            <div className="mt-2 text-sm font-medium text-foreground">
                                              {selectedChain}
                                            </div>
                                          </div>
                                          <div className="rounded-xl border border-border/50 bg-card/70 p-3">
                                            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                              Lead metric
                                            </div>
                                            <div className="mt-2 text-sm font-medium text-foreground">
                                              {strongestColumn ?? "—"}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Activity distribution
                                        </div>
                                        {distributionRows.length > 0 ? (
                                          <div className="space-y-3">
                                            {distributionRows.map((row) => (
                                              <div
                                                key={row.id}
                                                className="space-y-1.5"
                                              >
                                                <div className="flex items-center justify-between gap-3 text-xs">
                                                  <span className="truncate text-muted-foreground">
                                                    {row.label}
                                                  </span>
                                                  <span className="font-medium text-foreground">
                                                    {row.value.toLocaleString()}
                                                  </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                                  <div
                                                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(67,188,155,0.92),rgba(79,111,255,0.92))]"
                                                    style={{
                                                      width: `${row.width}%`,
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {resultArchetype === "campaign" ? (
                                  <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                                    <div className="space-y-4">
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Audience readiness
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                          <div className="rounded-xl border border-border/50 bg-card/70 p-3">
                                            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                              Email coverage
                                            </div>
                                            <div className="mt-2 text-lg font-semibold text-foreground">
                                              {emailCoverage !== null
                                                ? `${emailCoverage}%`
                                                : "—"}
                                            </div>
                                          </div>
                                          <div className="rounded-xl border border-border/50 bg-card/70 p-3">
                                            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                              Best signal
                                            </div>
                                            <div className="mt-2 text-sm font-medium text-foreground">
                                              {strongestColumn ?? "—"}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Activation shortlist
                                        </div>
                                        {chatPreviewRows.length > 0 ? (
                                          <div className="space-y-2">
                                            {chatPreviewRows.map((row) => (
                                              <div
                                                key={row.id}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/70 px-3 py-3"
                                              >
                                                <div className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                                                  {row.label}
                                                </div>
                                                {row.metric ? (
                                                  <span className="text-xs text-muted-foreground">
                                                    {row.metric}
                                                  </span>
                                                ) : null}
                                              </div>
                                            ))}
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Campaign opportunity
                                        </div>
                                        <p className="text-sm leading-6 text-muted-foreground">
                                          This result already looks
                                          campaign-friendly. Save the analysis,
                                          materialize a segment, or send it
                                          directly into campaign setup while
                                          intent is still high.
                                        </p>
                                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                              openNameDialog("report")
                                            }
                                            disabled={
                                              saveReportMutation.isPending
                                            }
                                            className="justify-start rounded-xl"
                                          >
                                            Save report
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                              openNameDialog("segment")
                                            }
                                            disabled={
                                              createSegmentMutation.isPending
                                            }
                                            className="justify-start rounded-xl"
                                          >
                                            Create segment
                                          </Button>
                                          <Button
                                            type="button"
                                            onClick={() =>
                                              openNameDialog("campaign")
                                            }
                                            disabled={
                                              createCampaignMutation.isPending
                                            }
                                            className="justify-start rounded-xl"
                                          >
                                            Launch campaign
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3 text-sm font-medium text-foreground">
                                          Audience distribution
                                        </div>
                                        {distributionRows.length > 0 ? (
                                          <div className="space-y-3">
                                            {distributionRows.map((row) => (
                                              <div
                                                key={row.id}
                                                className="space-y-1.5"
                                              >
                                                <div className="flex items-center justify-between gap-3 text-xs">
                                                  <span className="truncate text-muted-foreground">
                                                    {row.label}
                                                  </span>
                                                  <span className="font-medium text-foreground">
                                                    {row.value.toLocaleString()}
                                                  </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                                  <div
                                                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,114,182,0.92),rgba(79,111,255,0.92))]"
                                                    style={{
                                                      width: `${row.width}%`,
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="rounded-xl border border-dashed border-border/60 px-3 py-6 text-sm text-muted-foreground">
                                            No campaign scoring distribution
                                            found in this result.
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {resultArchetype === "general" ? (
                                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                      <div className="mb-3 flex items-center justify-between gap-3">
                                        <div>
                                          <div className="text-sm font-medium text-foreground">
                                            Cohort snapshot
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Top rows from the live result set
                                          </div>
                                        </div>
                                        {primaryIdentityColumn ? (
                                          <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                                            {prettifyColumnLabel(
                                              primaryIdentityColumn
                                            )}
                                          </span>
                                        ) : null}
                                      </div>

                                      {chatPreviewRows.length > 0 ? (
                                        <div className="space-y-2">
                                          {chatPreviewRows.map((row) => (
                                            <div
                                              key={row.id}
                                              className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/70 px-3 py-3"
                                            >
                                              <div className="min-w-0 flex-1 text-sm font-medium text-foreground">
                                                <div className="truncate">
                                                  {row.label}
                                                </div>
                                              </div>
                                              {row.metric ? (
                                                <div className="text-xs text-muted-foreground">
                                                  {row.metric}
                                                </div>
                                              ) : null}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="rounded-xl border border-dashed border-border/60 px-3 py-6 text-sm text-muted-foreground">
                                          No cohort preview available yet.
                                        </div>
                                      )}
                                    </div>

                                    <div className="space-y-4">
                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3">
                                          <div className="text-sm font-medium text-foreground">
                                            Signal distribution
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Relative strength across the first
                                            result rows
                                          </div>
                                        </div>

                                        {distributionRows.length > 0 ? (
                                          <div className="space-y-3">
                                            {distributionRows.map((row) => (
                                              <div
                                                key={row.id}
                                                className="space-y-1.5"
                                              >
                                                <div className="flex items-center justify-between gap-3 text-xs">
                                                  <span className="truncate text-muted-foreground">
                                                    {row.label}
                                                  </span>
                                                  <span className="font-medium text-foreground">
                                                    {row.value.toLocaleString()}
                                                  </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                                  <div
                                                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(79,111,255,0.95),rgba(60,178,255,0.9))]"
                                                    style={{
                                                      width: `${row.width}%`,
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="rounded-xl border border-dashed border-border/60 px-3 py-6 text-sm text-muted-foreground">
                                            No numeric signal found in the
                                            current rows.
                                          </div>
                                        )}
                                      </div>

                                      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                        <div className="mb-3">
                                          <div className="text-sm font-medium text-foreground">
                                            Recommended next move
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Convert the result while the
                                            audience is fresh
                                          </div>
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-3">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                              openNameDialog("report")
                                            }
                                            disabled={
                                              saveReportMutation.isPending
                                            }
                                            className="justify-start rounded-xl"
                                          >
                                            Save report
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                              openNameDialog("segment")
                                            }
                                            disabled={
                                              createSegmentMutation.isPending
                                            }
                                            className="justify-start rounded-xl"
                                          >
                                            Create segment
                                          </Button>
                                          <Button
                                            type="button"
                                            onClick={() =>
                                              openNameDialog("campaign")
                                            }
                                            disabled={
                                              createCampaignMutation.isPending
                                            }
                                            className="justify-start rounded-xl"
                                          >
                                            Launch campaign
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {resultArchetype !== "campaign" &&
                                resultArchetype !== "general" ? (
                                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                    <div className="mb-3">
                                      <div className="text-sm font-medium text-foreground">
                                        Convert this result
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Save the analysis or move it straight
                                        into activation.
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
                                        onClick={() =>
                                          openNameDialog("segment")
                                        }
                                        disabled={
                                          createSegmentMutation.isPending
                                        }
                                        className="justify-start rounded-xl"
                                      >
                                        Create segment
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={() =>
                                          openNameDialog("campaign")
                                        }
                                        disabled={
                                          createCampaignMutation.isPending
                                        }
                                        className="justify-start rounded-xl"
                                      >
                                        Launch campaign
                                      </Button>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            ) : null}

                            {message.rationale ? (
                              <div className="rounded-2xl border border-border/60 bg-white/[0.03] p-4">
                                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                  Reasoning frame
                                </div>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                  {message.rationale}
                                </p>
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
                                    className="rounded-2xl border border-border/60 bg-background/60 p-4"
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

                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                  Execution mode
                                </div>
                                <div className="mt-2 text-sm font-medium text-foreground">
                                  {latestMcpResponse?.mode ===
                                  "deterministic_fallback"
                                    ? "Deterministic fallback"
                                    : "Dynamic MCP routing"}
                                </div>
                              </div>
                              <div
                                className={`rounded-2xl border p-4 ${
                                  message.queryReady
                                    ? "border-primary/20 bg-primary/8"
                                    : "border-border/60 bg-background/60"
                                }`}
                              >
                                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                  Next action
                                </div>
                                <div className="mt-2 text-sm font-medium text-foreground">
                                  {message.queryReady
                                    ? "Create a report, campaign, or segment from the live result set below."
                                    : "Refine the prompt or switch to SQL if you want tighter control."}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-[28px] border border-border/70 bg-[linear-gradient(180deg,rgba(23,28,44,0.95),rgba(13,17,30,0.95))] px-6 py-8 shadow-[0_30px_90px_-40px_rgba(45,102,255,0.45)]">
                    <div className="max-w-2xl">
                      <div className="text-sm font-medium text-foreground">
                        Start with a natural request
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Ask the agent for wallets, behavior, protocol activity,
                        or audience opportunities. It will decide the right MCP
                        tool path and surface a query-backed result when
                        available.
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {MCP_QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => setChatPrompt(prompt)}
                          className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border/60 bg-card/80 px-5 py-4 backdrop-blur">
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
                {queryId ? (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
                    MCP resolved to a saved query result. Keep chatting, or use
                    the actions below to turn it into a report, campaign, or
                    segment.
                  </div>
                ) : null}
                <div className="rounded-[26px] border border-border/70 bg-background/90 p-2 shadow-[0_20px_60px_-40px_rgba(45,102,255,0.55)]">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end">
                    <textarea
                      aria-label="MCP chat input"
                      value={chatPrompt}
                      onChange={(e) => setChatPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (
                            trimmedChatPrompt.length === 0 ||
                            mcpMutation.isPending
                          ) {
                            return;
                          }
                          setChatMessages((prev) => [
                            ...prev,
                            {
                              id: `user-${Date.now()}`,
                              role: "user",
                              content: trimmedChatPrompt,
                            },
                          ]);
                          setChatPrompt("");
                          mcpMutation.mutate();
                        }
                      }}
                      className="min-h-[76px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                      placeholder="Ask MCP to uncover an audience, explain a wallet cohort, or map protocol behavior"
                    />
                    <div className="flex items-center justify-between gap-2 px-1 pb-1 md:justify-end">
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {selectedChain}
                        </span>
                        <span className="mx-2 text-border">/</span>
                        <span>{activeTopProtocol}</span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => {
                          if (trimmedChatPrompt.length === 0) {
                            toast.error("Write a message first");
                            return;
                          }
                          setChatMessages((prev) => [
                            ...prev,
                            {
                              id: `user-${Date.now()}`,
                              role: "user",
                              content: trimmedChatPrompt,
                            },
                          ]);
                          setChatPrompt("");
                          mcpMutation.mutate();
                        }}
                        disabled={mcpMutation.isPending}
                        className="rounded-full px-4"
                      >
                        {mcpMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowUp className="mr-2 h-4 w-4" />
                        )}
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  SQL Query
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(sqlQuery)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => validateMutation.mutate()}
                  disabled={validateMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 disabled:opacity-50"
                >
                  {validateMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Zap className="h-3.5 w-3.5" />
                  )}
                  Validate
                </button>
                <button
                  onClick={() => runMutation.mutate()}
                  disabled={isQueryRunning}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isQueryRunning ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                  Run
                </button>
              </div>
            </div>
            <div className="border-b border-border/60 bg-background/80 px-4 py-2 text-xs text-muted-foreground">
              Write a SQL query and run it against your organization data.
            </div>
            <textarea
              aria-label="SQL query editor"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="h-[260px] w-full resize-none bg-background px-4 py-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              placeholder={`SELECT\n  wallet,\n  email\nFROM users\nLIMIT 50;`}
              spellCheck={false}
            />
          </div>

          <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-expanded={openHelperTab === "generate"}
                  aria-controls="generate-sql-panel"
                  onClick={() => toggleHelperTab("generate")}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    openHelperTab === "generate"
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate SQL
                  {openHelperTab === "generate" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  aria-expanded={openHelperTab === "starters"}
                  aria-controls="starter-queries-panel"
                  onClick={() => toggleHelperTab("starters")}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    openHelperTab === "starters"
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Code className="h-4 w-4" />
                  Starter Queries
                  {openHelperTab === "starters" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Open a helper only when you need ideas or a starting point.
              </p>
            </div>

            {openHelperTab === "generate" ? (
              <div id="generate-sql-panel" className="p-4">
                <p className="text-sm text-muted-foreground">
                  Describe the audience or behavior you want to find, then
                  review the generated SQL before running it.
                </p>
                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
                  <Input
                    value={protocolSearch}
                    onChange={(e) => setProtocolSearch(e.target.value)}
                    placeholder="Search protocol registry"
                  />
                  <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Sector
                    <select
                      value={selectedSector}
                      onChange={(e) =>
                        setSelectedSector(
                          e.target.value as (typeof SUGGESTION_SECTORS)[number]
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
                  <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Chain
                    <Input
                      value={selectedChain}
                      onChange={(e) => setSelectedChain(e.target.value)}
                      placeholder="base-mainnet"
                    />
                  </label>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
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
                  {protocols.slice(0, 6).map((protocol) => (
                    <button
                      key={protocol.id}
                      type="button"
                      onClick={() => setSelectedProtocolId(protocol.id)}
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

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-sm">
                    <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Suggestions tracked
                    </div>
                    <div className="mt-2 text-xl font-semibold text-foreground">
                      {typeof suggestionTotals.selected === "number"
                        ? suggestionTotals.selected.toLocaleString()
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-sm">
                    <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Suggestions executed
                    </div>
                    <div className="mt-2 text-xl font-semibold text-foreground">
                      {typeof suggestionTotals.executed === "number"
                        ? suggestionTotals.executed.toLocaleString()
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-sm">
                    <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Top protocol
                    </div>
                    <div className="mt-2 text-sm font-medium text-foreground">
                      {typeof topProtocols[0]?.name === "string"
                        ? String(topProtocols[0].name)
                        : (selectedProtocol?.name ?? "—")}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2 lg:flex-row">
                  <Input
                    value={assistantPrompt}
                    onChange={(e) => setAssistantPrompt(e.target.value)}
                    placeholder="Find dormant high-value users with email addresses"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => suggestionsMutation.mutate()}
                    disabled={suggestionsMutation.isPending}
                  >
                    {suggestionsMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Get ideas
                  </Button>
                  <Button
                    type="button"
                    onClick={() => generateSqlMutation.mutate()}
                    disabled={generateSqlMutation.isPending}
                  >
                    {generateSqlMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Generate SQL
                  </Button>
                </div>

                {generateSqlMutation.data ? (
                  <div className="mt-4 rounded-xl border border-border/70 bg-background/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Generated draft
                        </div>
                        {generateSqlMutation.data.explanation ? (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {generateSqlMutation.data.explanation}
                          </p>
                        ) : null}
                      </div>
                      {generateSqlMutation.data.sql ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            loadSqlIntoEditor(
                              generateSqlMutation.data?.sql ?? ""
                            )
                          }
                        >
                          Use in editor
                        </Button>
                      ) : null}
                    </div>
                    {generateSqlMutation.data.sql ? (
                      <pre className="mt-3 overflow-x-auto rounded-lg border border-border/60 bg-card p-3 font-mono text-xs text-foreground">
                        {generateSqlMutation.data.sql}
                      </pre>
                    ) : null}
                    {Array.isArray(generateSqlMutation.data.warnings) &&
                    generateSqlMutation.data.warnings.length > 0 ? (
                      <ul className="mt-3 list-disc pl-5 text-xs text-muted-foreground">
                        {generateSqlMutation.data.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                {suggestionItems.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {suggestionItems.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="rounded-xl border border-border/70 bg-background/80 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {suggestion.title}
                            </div>
                            {suggestion.reason ? (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {suggestion.reason}
                              </p>
                            ) : null}
                          </div>
                          {suggestion.sqlDraft ? (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                loadSqlIntoEditor(
                                  suggestion.sqlDraft ?? "",
                                  suggestion.id
                                )
                              }
                            >
                              Use draft
                            </Button>
                          ) : null}
                        </div>
                        {Array.isArray(suggestion.tags) &&
                        suggestion.tags.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {suggestion.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {openHelperTab === "starters" ? (
              <div id="starter-queries-panel" className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Starter queries
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start from a saved SQL pattern and adapt it to your needs.
                    </p>
                  </div>
                  {startersQuery.isFetching ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : null}
                </div>

                <div className="mt-4 space-y-3">
                  {starters.length > 0 ? (
                    starters.map((starter) => (
                      <button
                        key={starter.id}
                        type="button"
                        className="w-full rounded-xl border border-border/70 bg-background/80 p-4 text-left transition-colors hover:bg-muted/40"
                        onClick={() => loadSqlIntoEditor(starter.query)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {starter.title}
                            </div>
                            {starter.description ? (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {starter.description}
                              </p>
                            ) : null}
                          </div>
                          {starter.category ? (
                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                              {starter.category}
                            </span>
                          ) : null}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
                      No starter queries available yet.
                    </div>
                  )}
                </div>
              </div>
            ) : null}
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

      {hasRunQuery && (
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
                    <X className="h-3 w-3" />
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
                    <Plus className="h-3.5 w-3.5" />
                    Create segment
                  </button>
                  <button
                    onClick={() => {
                      openNameDialog("campaign");
                    }}
                    disabled={createCampaignMutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
                  >
                    <Mail className="h-3.5 w-3.5" />
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
                              <Mail className="mr-1 inline-block h-3.5 w-3.5" />
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
                            <Copy className="mr-1 inline-block h-3.5 w-3.5" />
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

      {(historyQuery.data?.length ?? 0) > 0 ? (
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
