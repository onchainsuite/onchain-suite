"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  CancelCircleIcon,
  Delete02Icon,
  FloppyDiskIcon,
  Loading02Icon,
  Orbit01Icon,
  Refresh01Icon,
  Search01Icon,
  Target01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, DollarSign } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  Background,
  type Connection,
  ConnectionLineType,
  Controls,
  type Edge,
  MarkerType,
  MiniMap,
  type Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { isJsonObject } from "@/lib/utils";

import "reactflow/dist/style.css";
import { automationService } from "../../automation.service";
import { Confetti } from "../confetti";
import {
  BranchNode,
  EmailNode,
  PlaceholderNode,
  TriggerNode,
  WaitNode,
} from "./nodes";
import {
  actionNodes,
  emailTemplates as fallbackEmailTemplates,
  eventTypes,
  mockContracts,
  triggerNodes,
} from "@/features/automation/data";
import {
  autoLayoutNodes,
  getAutomationData,
  getInitialEdges,
  getInitialNodes,
  isValidConnection,
} from "@/features/automation/utils";
import {
  buildTriggerContractPatch,
  resolveContractCatalog,
} from "@/features/automation/utils/contracts";
import { projectSettingsService } from "@/features/settings/project-settings.service";

// This is a known benign error with ReactFlow that can be safely ignored
if (typeof window === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originalError = (window as any).onerror;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).onerror = (
    message: string | Event,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ) => {
    if (
      typeof message === "string" &&
      message.includes("ResizeObserver loop")
    ) {
      return true; // Suppress the error
    }
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    return false;
  };
}

const nodeTypes = {
  trigger: TriggerNode,
  wait: WaitNode,
  branch: BranchNode,
  email: EmailNode,
  placeholder: PlaceholderNode,
};

const asString = (v: unknown): string => (typeof v === "string" ? v : "");

const asNumber = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim().length > 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const pickArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (isJsonObject(payload) && Array.isArray(payload.items))
    return payload.items;
  if (isJsonObject(payload) && Array.isArray(payload.data)) return payload.data;
  return [];
};

const pickText = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
};

const asBoolean = (value: unknown): boolean => value === true;

type PathPerformanceRow = {
  path: string;
  entries: number;
  conversions: number;
  rate: number;
  revenue: number;
};

type RecentEntryRow = {
  id: string;
  wallet: string;
  email: string;
  timestamp: string;
  outcome: string;
  revenue: number;
  path: string;
};

const EDGE_COLORS = {
  default: "#38bdf8",
  success: "#22c55e",
  danger: "#f97316",
} as const;

type BuilderSchemaFieldOption = {
  label: string;
  value: string;
};

type BuilderSchemaField = {
  key: string;
  label: string;
  description?: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options: BuilderSchemaFieldOption[];
};

const PROPERTY_LABEL_CLASS =
  "text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400";

const PROPERTY_INPUT_CLASS =
  "w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400/40 focus:outline-none";

const PROPERTY_HINT_CLASS = "text-[11px] leading-5 text-slate-500";

const INTERNAL_SCHEMA_KEYS = new Set([
  "label",
  "schema",
  "stats",
  "nodeType",
  "triggerType",
  "actionType",
  "template",
  "templateId",
  "templateName",
  "contract",
  "contractAddress",
  "event",
]);

const normalizeSchemaFieldOptions = (
  value: unknown
): BuilderSchemaFieldOption[] =>
  pickArray(value)
    .map((option) => {
      if (typeof option === "string" || typeof option === "number") {
        return {
          label: String(option),
          value: String(option),
        };
      }
      if (!isJsonObject(option)) return null;
      const record = option as Record<string, unknown>;
      const resolvedValue = pickText(
        record.value,
        record.id,
        record.key,
        record.name
      );
      if (resolvedValue.length === 0) return null;
      return {
        value: resolvedValue,
        label:
          pickText(record.label, record.name, record.title, resolvedValue) ||
          resolvedValue,
      };
    })
    .filter((option): option is BuilderSchemaFieldOption => Boolean(option));

const normalizeSchemaFields = (schema: unknown): BuilderSchemaField[] => {
  if (!isJsonObject(schema)) return [];
  const record = schema as Record<string, unknown>;
  return pickArray(record.fields)
    .map<BuilderSchemaField | null>((field) => {
      if (!isJsonObject(field)) return null;
      const entry = field as Record<string, unknown>;
      const key = pickText(entry.key, entry.name, entry.id);
      if (key.length === 0 || INTERNAL_SCHEMA_KEYS.has(key)) return null;
      const rawType = pickText(
        entry.type,
        entry.inputType,
        entry.component,
        entry.kind,
        "text"
      ).toLowerCase();
      const description = pickText(
        entry.description,
        entry.helpText,
        entry.helperText
      );
      const placeholder = pickText(entry.placeholder);
      return {
        key,
        label: pickText(entry.label, entry.title, key) || key,
        description: description || undefined,
        type: rawType,
        required: asBoolean(entry.required),
        placeholder: placeholder || undefined,
        options: normalizeSchemaFieldOptions(entry.options ?? entry.enum),
      };
    })
    .filter((field): field is BuilderSchemaField => Boolean(field));
};

const CreateAutomationContent = () => {
  const params = useParams();
  const automationId = params?.id as string;
  const isNew = automationId === "new-id";

  const queryClient = useQueryClient();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    getInitialNodes(automationId)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    getInitialEdges(automationId)
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");
  const [automationData, setAutomationData] = useState(
    getAutomationData(automationId)
  );
  const [showNodeSelector, setShowNodeSelector] = useState<{
    show: boolean;
    x: number;
    y: number;
    sourceNode?: string;
  }>({ show: false, x: 0, y: 0 });
  const [jsonFieldDrafts, setJsonFieldDrafts] = useState<
    Record<string, string>
  >({});

  const { project } = useReactFlow();

  const hydrateBuilderState = useCallback(
    (payload: unknown) => {
      const record = isJsonObject(payload)
        ? (payload as Record<string, unknown>)
        : null;
      const nextNodes = pickArray(record?.nodes) as Node[];
      const nextEdges = pickArray(record?.edges) as Edge[];
      setNodes(nextNodes);
      setEdges(nextEdges);
      if (record) {
        setAutomationData((prev) => ({
          ...prev,
          status: asString(record.status) || prev.status,
        }));
      }
      setSelectedNode(null);
      setShowNodeSelector({ show: false, x: 0, y: 0 });
    },
    [setEdges, setNodes]
  );

  const resolvedTriggerNodes = useMemo(() => {
    return triggerNodes;
  }, []);

  const resolvedActionNodes = useMemo(() => {
    return actionNodes;
  }, []);

  const triggersQuery = useQuery({
    queryKey: ["automations", "builder", "triggers"],
    queryFn: async () => {
      try {
        const primary = await automationService.listTriggerTypes();
        const primaryItems = pickArray(primary);
        if (primaryItems.length > 0) return primaryItems;
        const alias = await automationService.listAvailableTriggers();
        return pickArray(alias);
      } catch {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const actionsQuery = useQuery({
    queryKey: ["automations", "builder", "actions"],
    queryFn: async () => {
      try {
        const res = await automationService.listActionTypes();
        return pickArray(res);
      } catch {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const emailTemplatesQuery = useQuery({
    queryKey: ["automations", "builder", "email-templates"],
    queryFn: async () => {
      try {
        const res = await automationService.listBuilderEmailTemplates();
        return pickArray(res);
      } catch {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const triggerCatalog = useMemo(() => {
    const fetched = triggersQuery.data ?? [];
    if (fetched.length === 0) return resolvedTriggerNodes;
    const normalized = fetched
      .map((t) => {
        if (!isJsonObject(t)) return null;
        const rec = t as Record<string, unknown>;
        const type = asString(rec.type) || asString(rec.id);
        if (type.length === 0) return null;
        const label = asString(rec.label) || asString(rec.name) || type;
        const description = asString(rec.description);
        return {
          type,
          label,
          description,
          icon: <HugeiconsIcon icon={Target01Icon} className="h-4 w-4" />,
        };
      })
      .filter((x): x is (typeof triggerNodes)[number] => !!x);
    return normalized.length > 0 ? normalized : resolvedTriggerNodes;
  }, [resolvedTriggerNodes, triggersQuery.data]);

  const actionCatalog = useMemo(() => {
    const fetched = actionsQuery.data ?? [];
    if (fetched.length === 0) return resolvedActionNodes;
    const normalized = fetched
      .map((a) => {
        if (!isJsonObject(a)) return null;
        const rec = a as Record<string, unknown>;
        const type = asString(rec.type) || asString(rec.id);
        if (type.length === 0) return null;
        const label = asString(rec.label) || asString(rec.name) || type;
        const description = asString(rec.description);
        return {
          type,
          label,
          description,
          icon: <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />,
        };
      })
      .filter((x): x is (typeof actionNodes)[number] => !!x);
    return normalized.length > 0 ? normalized : resolvedActionNodes;
  }, [actionsQuery.data, resolvedActionNodes]);

  const emailTemplateOptions = useMemo<
    Array<{
      id: string;
      name: string;
      subject: string;
      category: string;
      previewText: string;
      body: string;
      source?: string;
    }>
  >(() => {
    const fetched = emailTemplatesQuery.data ?? [];
    if (fetched.length === 0) {
      return fallbackEmailTemplates.map((template) => ({
        ...template,
        source: undefined,
      }));
    }

    const normalized = fetched
      .map((template) => {
        if (!isJsonObject(template)) return null;
        const record = template as Record<string, unknown>;
        const id = pickText(record.id, record.templateId, record.slug);
        const name = pickText(record.name, record.title, record.subject);
        if (id.length === 0 || name.length === 0) return null;
        const description = pickText(
          record.previewText,
          record.description,
          record.summary
        );
        return {
          id,
          name,
          subject: pickText(record.subject, name),
          category: pickText(record.category, record.folder, "Template"),
          previewText: description,
          body: pickText(record.body, record.html),
          source: pickText(record.source, record.provider),
        };
      })
      .filter(
        (
          template
        ): template is {
          id: string;
          name: string;
          subject: string;
          category: string;
          previewText: string;
          body: string;
          source: string;
        } => Boolean(template)
      );

    return normalized.length > 0
      ? normalized
      : fallbackEmailTemplates.map((template) => ({
          ...template,
          source: undefined,
        }));
  }, [emailTemplatesQuery.data]);

  const projectSettingsQuery = useQuery({
    queryKey: ["project-settings", "automations"],
    queryFn: () => projectSettingsService.getProjectSettings(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const contractCatalog = useMemo(() => {
    return resolveContractCatalog(
      projectSettingsQuery.data?.contractAddresses,
      mockContracts
    );
  }, [projectSettingsQuery.data?.contractAddresses]);

  const automationDetailQuery = useQuery({
    queryKey: ["automations", "detail", automationId],
    queryFn: () => automationService.getAutomation(automationId),
    enabled:
      !isNew && typeof automationId === "string" && automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const builderQuery = useQuery({
    queryKey: ["automations", automationId, "builder"],
    queryFn: () => automationService.getBuilder(automationId),
    enabled:
      !isNew && typeof automationId === "string" && automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const lastEditedQuery = useQuery({
    queryKey: ["automations", automationId, "last-edited"],
    queryFn: () => automationService.getLastEdited(automationId),
    enabled:
      !isNew && typeof automationId === "string" && automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const publishMutation = useMutation({
    mutationFn: async () => automationService.publishAutomation(automationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["automations"] });
      await automationDetailQuery.refetch();
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to publish";
      toast.error(message);
    },
  });

  const previewMutation = useMutation({
    mutationFn: async () => {
      const triggerNode = nodes.find((n) => n.type === "trigger");
      const trigger = isJsonObject(triggerNode?.data)
        ? (triggerNode?.data as Record<string, unknown>)
        : {};
      return automationService.previewAutomation(automationId, { trigger });
    },
    onSuccess: (res) => {
      const raw = (res as Record<string, unknown>).matches;
      const matches = typeof raw === "number" ? raw : asNumber(raw);
      toast.info(`Preview matches: ${matches.toLocaleString()}`);
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to preview";
      toast.error(message);
    },
  });

  const statsOverviewQuery = useQuery({
    queryKey: ["automations", automationId, "stats"],
    queryFn: () => automationService.getStatsOverview(automationId),
    enabled:
      !isNew &&
      activeTab === "stats" &&
      typeof automationId === "string" &&
      automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const statsPerformanceQuery = useQuery({
    queryKey: ["automations", automationId, "performance"],
    queryFn: () => automationService.getPerformance(automationId),
    enabled:
      !isNew &&
      activeTab === "stats" &&
      typeof automationId === "string" &&
      automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const statsPreviewQuery = useQuery({
    queryKey: ["automations", automationId, "stats", "preview"],
    queryFn: () => automationService.getStatsPreview(automationId),
    enabled:
      !isNew &&
      activeTab === "stats" &&
      typeof automationId === "string" &&
      automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const statsTimeSeriesQuery = useQuery({
    queryKey: ["automations", automationId, "stats", "time-series", "30days"],
    queryFn: () =>
      automationService.getStatsTimeSeries(automationId, { period: "30days" }),
    enabled:
      !isNew &&
      activeTab === "stats" &&
      typeof automationId === "string" &&
      automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const statsPathsQuery = useQuery({
    queryKey: ["automations", automationId, "stats", "paths"],
    queryFn: () => automationService.getStatsPaths(automationId),
    enabled:
      !isNew &&
      activeTab === "stats" &&
      typeof automationId === "string" &&
      automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const statsEntriesQuery = useQuery({
    queryKey: ["automations", automationId, "stats", "entries"],
    queryFn: () =>
      automationService.listStatsEntries(automationId, { page: 1, limit: 10 }),
    enabled:
      !isNew &&
      activeTab === "stats" &&
      typeof automationId === "string" &&
      automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const statsRevenueQuery = useQuery({
    queryKey: ["automations", automationId, "stats", "revenue"],
    queryFn: () => automationService.getStatsRevenue(automationId),
    enabled:
      !isNew &&
      activeTab === "stats" &&
      typeof automationId === "string" &&
      automationId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const statsOverview =
    statsOverviewQuery.data ??
    statsPerformanceQuery.data ??
    statsPreviewQuery.data ??
    {};
  const statsEntries = asNumber(
    (statsOverview as Record<string, unknown>).entries
  );
  const statsConversions = asNumber(
    (statsOverview as Record<string, unknown>).conversions
  );
  const statsRevenue =
    asNumber(
      (statsRevenueQuery.data as Record<string, unknown> | undefined)?.revenue
    ) || asNumber((statsOverview as Record<string, unknown>).revenue);
  const statsConvRate =
    asNumber((statsOverview as Record<string, unknown>).conversionRate) ||
    (statsEntries > 0
      ? Math.round((statsConversions / statsEntries) * 1000) / 10
      : 0);

  const chartData = useMemo(() => {
    const list = pickArray((statsTimeSeriesQuery.data as unknown) ?? []);
    const mapped = list
      .map((r) => {
        if (!isJsonObject(r)) return null;
        const rec = r as Record<string, unknown>;
        return {
          date: asString(rec.date) || asString(rec.at) || "—",
          entries: asNumber(rec.entries),
          conversions: asNumber(rec.conversions),
          revenue: asNumber(rec.revenue),
        };
      })
      .filter(
        (
          x
        ): x is {
          date: string;
          entries: number;
          conversions: number;
          revenue: number;
        } => !!x
      );
    return mapped;
  }, [statsTimeSeriesQuery.data]);

  const pathRows = useMemo(() => {
    const list = pickArray((statsPathsQuery.data as unknown) ?? []);
    const mapped = list
      .map((p) => {
        if (!isJsonObject(p)) return null;
        const rec = p as Record<string, unknown>;
        const rate = asNumber(rec.rate ?? rec.conversionRate);
        return {
          path: asString(rec.path) || "Path",
          entries: asNumber(rec.entries),
          conversions: asNumber(rec.conversions),
          rate,
          revenue: asNumber(rec.revenue),
        };
      })
      .filter((x): x is PathPerformanceRow => !!x);
    return mapped;
  }, [statsPathsQuery.data]);

  const recentRows = useMemo(() => {
    const list = pickArray((statsEntriesQuery.data as unknown) ?? []);
    const mapped = list
      .map((e) => {
        if (!isJsonObject(e)) return null;
        const rec = e as Record<string, unknown>;
        return {
          id: asString(rec.id) || asString(rec.entryId) || crypto.randomUUID(),
          wallet: asString(rec.wallet) || "—",
          email: asString(rec.email) || "—",
          timestamp: asString(rec.timestamp ?? rec.at) || "—",
          outcome: asString(rec.outcome ?? rec.status) || "entered",
          revenue: asNumber(rec.revenue),
          path: asString(rec.path) || "—",
        };
      })
      .filter((x): x is RecentEntryRow => !!x);
    return mapped;
  }, [statsEntriesQuery.data]);

  const isStatsLoading =
    !isNew &&
    activeTab === "stats" &&
    [
      statsOverviewQuery,
      statsPerformanceQuery,
      statsPreviewQuery,
      statsTimeSeriesQuery,
      statsPathsQuery,
      statsEntriesQuery,
      statsRevenueQuery,
    ].some((query) => query.isLoading || query.isFetching);

  const selectedNodeDetails = useMemo(
    () => nodes.find((n) => n.id === selectedNode) ?? null,
    [nodes, selectedNode]
  );
  const selectedNodeData = useMemo(
    () =>
      isJsonObject(selectedNodeDetails?.data)
        ? (selectedNodeDetails.data as Record<string, unknown>)
        : {},
    [selectedNodeDetails]
  );
  const selectedTemplate = useMemo(() => {
    const templateId = asString(selectedNodeData.templateId);
    return (
      emailTemplateOptions.find((template) => template.id === templateId) ??
      null
    );
  }, [emailTemplateOptions, selectedNodeData]);
  const selectedNodeStats = useMemo(
    () =>
      isJsonObject(selectedNodeData.stats)
        ? (selectedNodeData.stats as Record<string, unknown>)
        : {},
    [selectedNodeData]
  );
  const selectedNodeSchemaType = useMemo(
    () =>
      pickText(
        selectedNodeData.nodeType,
        selectedNodeData.triggerType,
        selectedNodeData.actionType,
        selectedNodeData.type,
        selectedNodeDetails?.type
      ),
    [selectedNodeData, selectedNodeDetails?.type]
  );
  const selectedNodeSchemaQuery = useQuery({
    queryKey: [
      "automations",
      "builder",
      "schema",
      selectedNodeDetails?.type,
      selectedNodeSchemaType,
    ],
    queryFn: async () => {
      if (selectedNodeDetails?.type === "trigger") {
        return automationService.getTriggerSchema(selectedNodeSchemaType);
      }
      return automationService.getActionSchema(selectedNodeSchemaType);
    },
    enabled:
      Boolean(selectedNode) &&
      Boolean(selectedNodeSchemaType) &&
      selectedNodeDetails?.type !== undefined &&
      selectedNodeDetails?.type !== "placeholder" &&
      !isJsonObject(selectedNodeData.schema),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
  const selectedNodeSchemaFields = useMemo(
    () =>
      normalizeSchemaFields(
        isJsonObject(selectedNodeData.schema)
          ? selectedNodeData.schema
          : selectedNodeSchemaQuery.data
      ),
    [selectedNodeData.schema, selectedNodeSchemaQuery.data]
  );

  const updateSelectedNodeData = useCallback(
    (patch: Record<string, unknown>) => {
      if (!selectedNode) return;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== selectedNode) return node;
          const currentData = isJsonObject(node.data)
            ? (node.data as Record<string, unknown>)
            : {};
          return {
            ...node,
            data: {
              ...currentData,
              ...patch,
            },
          };
        })
      );
    },
    [selectedNode, setNodes]
  );

  const updateSchemaFieldValue = useCallback(
    (field: BuilderSchemaField, value: unknown) => {
      updateSelectedNodeData({ [field.key]: value });
    },
    [updateSelectedNodeData]
  );

  useEffect(() => {
    if (isNew) return;
    const detail = automationDetailQuery.data;
    if (!detail || !isJsonObject(detail)) return;
    setAutomationData((prev) => ({
      ...prev,
      id: automationId,
      name: asString(detail.name) || prev.name,
      description: asString(detail.description) || prev.description,
      status: asString(detail.status) || prev.status,
      createdAt:
        asString(detail.updatedAt ?? detail.createdAt) || prev.createdAt,
      lastTriggered: asString(detail.lastTriggered) || prev.lastTriggered,
    }));
  }, [automationDetailQuery.data, automationId, isNew]);

  useEffect(() => {
    if (isNew) return;
    const payload = builderQuery.data;
    if (!payload || !isJsonObject(payload)) return;
    hydrateBuilderState(payload);
  }, [builderQuery.data, hydrateBuilderState, isNew]);

  useEffect(() => {
    if (!selectedNode) return;
    if (nodes.some((node) => node.id === selectedNode)) return;
    setSelectedNode(null);
    setShowNodeSelector({ show: false, x: 0, y: 0 });
  }, [nodes, selectedNode]);

  useEffect(() => {
    setJsonFieldDrafts({});
  }, [selectedNode]);

  useEffect(() => {
    if (!selectedNodeSchemaQuery.data) return;
    if (isJsonObject(selectedNodeData.schema)) return;
    updateSelectedNodeData({ schema: selectedNodeSchemaQuery.data });
  }, [
    selectedNodeData.schema,
    selectedNodeSchemaQuery.data,
    updateSelectedNodeData,
  ]);

  const validateMutation = useMutation({
    mutationFn: async () => {
      if (isNew) return { errors: [], warnings: [] };
      return automationService.validateBuilder(automationId, {
        nodes,
        edges,
      });
    },
  });

  const selectedTriggerRuntimeType = useMemo(() => {
    if (selectedNodeDetails?.type !== "trigger") return null;
    const nodeType = pickText(
      selectedNodeData.nodeType,
      selectedNodeData.triggerType,
      selectedNodeData.type
    ).toLowerCase();
    const label = pickText(selectedNodeData.label).toLowerCase();

    if (nodeType.includes("segment") || label.includes("segment")) {
      return "segment_entered" as const;
    }
    if (nodeType.includes("email") || label.includes("email")) {
      return "email_opened" as const;
    }
    if (nodeType.includes("health") || label.includes("health")) {
      return "health_threshold" as const;
    }
    return "onchain_event" as const;
  }, [selectedNodeData, selectedNodeDetails?.type]);

  const runtimeTriggerMutation = useMutation({
    mutationFn: async () => {
      if (isNew || !selectedNode || selectedNodeDetails?.type !== "trigger") {
        throw new Error("Save the automation before sending a test trigger");
      }

      const sourceEventId = `preview-${selectedNode}-${Date.now()}`;
      const sharedPayload = {
        automationId,
        triggerNodeId: selectedNode,
        preview: true,
      };

      switch (selectedTriggerRuntimeType) {
        case "segment_entered":
          return automationService.triggerSegmentEntered({
            segmentId:
              asString(selectedNodeData.segmentId) || "preview-segment",
            email: "preview@onchainsuite.com",
            sourceEventId,
            payload: sharedPayload,
          });
        case "email_opened":
          return automationService.triggerEmailOpened({
            campaignId: automationId,
            email: "preview@onchainsuite.com",
            sourceEventId,
            payload: sharedPayload,
          });
        case "health_threshold":
          return automationService.triggerHealthThreshold({
            score: asNumber(selectedNodeData.score) || 75,
            email: "preview@onchainsuite.com",
            sourceEventId,
            payload: sharedPayload,
          });
        default:
          return automationService.triggerOnchainEvent({
            chain: asString(selectedNodeData.chain) || "base-mainnet",
            event: asString(selectedNodeData.event) || "contract.interaction",
            contractAddress:
              asString(selectedNodeData.contractAddress) || undefined,
            walletAddress: "0x000000000000000000000000000000000000dEaD",
            sourceEventId,
            payload: sharedPayload,
          });
      }
    },
    onSuccess: (result) => {
      const entries = asNumber(
        (result as Record<string, unknown> | undefined)?.entries
      );
      const matched = asNumber(
        (result as Record<string, unknown> | undefined)?.matchedAutomations
      );
      const parts = [
        matched > 0 ? `${matched.toLocaleString()} matching automations` : null,
        entries > 0 ? `${entries.toLocaleString()} entries queued` : null,
      ].filter((part): part is string => Boolean(part));
      toast.success(
        parts.length > 0
          ? `Test trigger sent: ${parts.join(" · ")}`
          : "Test trigger sent"
      );
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to send test trigger";
      toast.error(message);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const name =
        typeof automationData.name === "string"
          ? automationData.name.trim()
          : "";
      if (name.length === 0) throw new Error("Automation name is required");

      if (isNew) {
        const created = await automationService.createAutomation({
          name,
          description: automationData.description ?? "",
          builder: { nodes, edges },
        });
        const createdId = created.automationId;
        if (createdId) {
          await automationService.saveBuilder(createdId, { nodes, edges });
        }
        return { createdId };
      }

      await automationService.updateAutomation(automationId, {
        name,
        description: automationData.description ?? "",
      });
      const builder = await automationService.saveBuilder(automationId, {
        nodes,
        edges,
      });
      return { createdId: null as string | null, builder };
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["automations"] });
      setIsSaving(false);
      if ("builder" in res && res.builder) {
        hydrateBuilderState(res.builder);
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      if (res.createdId) {
        window.location.href = `/automations/${res.createdId}`;
      }
    },
    onError: (err) => {
      setIsSaving(false);
      const message = err instanceof Error ? err.message : "Failed to save";
      toast.error(message);
    },
  });

  const draftSaveMutation = useMutation({
    mutationFn: async () => {
      if (isNew) return;
      await automationService.saveBuilderDraft(automationId, { nodes, edges });
    },
  });

  useEffect(() => {
    if (isNew) return;
    const t = window.setTimeout(() => {
      draftSaveMutation.mutate();
    }, 1000);
    return () => window.clearTimeout(t);
  }, [automationId, draftSaveMutation, edges, isNew, nodes]);

  const discardMutation = useMutation({
    mutationFn: async () => {
      if (isNew) return;
      return automationService.discardBuilder(automationId);
    },
    onSuccess: async (payload) => {
      if (isNew) return;
      if (payload) {
        hydrateBuilderState(payload);
        return;
      }
      await builderQuery.refetch();
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (isNew) return null;
      return automationService.resetBuilder(automationId);
    },
    onSuccess: async (payload) => {
      if (isNew) return;
      if (payload) {
        hydrateBuilderState(payload);
        toast.success("Builder reset to a blank persisted state");
        return;
      }
      await builderQuery.refetch();
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to reset";
      toast.error(message);
    },
  });

  const onConnect = useCallback(
    (params: Connection) => {
      const validation = isValidConnection(params, nodes, edges);
      if (!validation.valid) {
        toast.error(validation.message);
        return;
      }

      const edgeColor =
        params.sourceHandle === "yes"
          ? EDGE_COLORS.success
          : params.sourceHandle === "no"
            ? EDGE_COLORS.danger
            : EDGE_COLORS.default;

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: ConnectionLineType.SmoothStep,
            animated: true,
            style: { stroke: edgeColor, strokeWidth: 2.5 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: edgeColor,
            },
          },
          eds
        )
      );
    },
    [edges, nodes, setEdges]
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const validation = await validateMutation.mutateAsync();
      const errors = pickArray(
        isJsonObject(validation) ? validation.errors : undefined
      );
      if (errors.length > 0) {
        setIsSaving(false);
        toast.error("Builder has validation errors");
        return;
      }
      saveMutation.mutate();
    } catch (err) {
      setIsSaving(false);
      const message = err instanceof Error ? err.message : "Failed to save";
      toast.error(message);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("application/label");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = project({
        x: event.clientX - 200, // Adjust for sidebar
        y: event.clientY - 64, // Adjust for header
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type:
          type === "onchain"
            ? "trigger"
            : type.includes("email")
              ? "email"
              : type,
        position,
        data: {
          label,
          nodeType: type,
          ...(type === "onchain" && {
            contract: "Select Contract",
            event: "Select Event",
          }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    if (node.type === "placeholder") {
      setShowNodeSelector({
        show: true,
        x: node.position.x,
        y: node.position.y,
        sourceNode: node.id,
      });
    } else {
      setShowNodeSelector({ show: false, x: 0, y: 0 });
    }
  };

  const handlePaneClick = () => {
    setSelectedNode(null);
    setShowNodeSelector({ show: false, x: 0, y: 0 });
  };

  const addNode = (type: string, label: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type:
        type === "onchain"
          ? "trigger"
          : type.includes("email")
            ? "email"
            : type,
      position: { x: 0, y: 0 }, // Will be calculated
      data: { label, nodeType: type },
    };

    const layout = autoLayoutNodes(nodes, newNode);
    newNode.position = layout;

    setNodes((nds) => nds.concat(newNode));
    setShowNodeSelector({ show: false, x: 0, y: 0 });
    setSelectedNode(newNode.id);

    if (!isNew) {
      const schemaType = type;
      const loadSchema = async () => {
        try {
          const schema =
            newNode.type === "trigger"
              ? await automationService.getTriggerSchema(schemaType)
              : await automationService.getActionSchema(schemaType);
          setNodes((nds) =>
            nds.map((n) =>
              n.id === newNode.id
                ? {
                    ...n,
                    data: { ...(n.data as Record<string, unknown>), schema },
                  }
                : n
            )
          );
        } catch (_e) {
          String(_e);
        }
      };
      loadSchema().catch(() => undefined);
    }
  };

  const builderNodeCount = nodes.length;
  const builderConnectionCount = edges.length;
  const builderErrorCount = pickArray(
    isJsonObject(validateMutation.data)
      ? validateMutation.data.errors
      : undefined
  ).length;

  return (
    <motion.div
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      initial="initial"
      animate="animate"
      className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[28px] border border-sky-500/10 bg-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.45)]"
    >
      <Confetti show={!showConfetti} />

      {/* Header */}
      <header className="flex h-20 items-center justify-between border-b border-sky-500/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/automations"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/15 bg-slate-900/70 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
          </Link>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={automationData.name}
                onChange={(e) =>
                  setAutomationData({ ...automationData, name: e.target.value })
                }
                className="bg-transparent text-sm font-semibold tracking-tight text-white focus:outline-none"
              />
              <span className="flex items-center gap-1 rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-sky-200">
                <CheckCircle2 className="h-3 w-3" />
                {draftSaveMutation.isPending ? "Autosaving" : "Builder Ready"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span>
                Last edited{" "}
                {typeof (
                  lastEditedQuery.data as { lastEditedAt?: unknown } | null
                )?.lastEditedAt === "string"
                  ? String(
                      (lastEditedQuery.data as { lastEditedAt: string })
                        .lastEditedAt
                    )
                  : automationData.createdAt}
              </span>
              <span className="text-slate-600">/</span>
              <span>{builderNodeCount} nodes</span>
              <span className="text-slate-600">/</span>
              <span>{builderConnectionCount} links</span>
              <span className="text-slate-600">/</span>
              <span>{builderErrorCount} validation issues</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-[220px] grid-cols-2 border border-sky-500/10 bg-slate-900/70">
              <TabsTrigger value="builder" className="text-xs">
                Builder
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-xs">
                Stats
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-6 w-px bg-slate-800" />

          {!isNew && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
              onClick={() => previewMutation.mutate()}
              disabled={previewMutation.isPending}
            >
              Preview
            </button>
          )}

          {!isNew && automationData.status === "draft" && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 transition-colors hover:bg-sky-400 disabled:opacity-50"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending ? (
                <HugeiconsIcon
                  icon={Loading02Icon}
                  className="h-3.5 w-3.5 animate-spin"
                />
              ) : null}
              Publish
            </button>
          )}

          {!isNew ? (
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-medium text-amber-100 transition-colors hover:bg-amber-400/15 disabled:opacity-50"
              onClick={() => resetMutation.mutate()}
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? (
                <HugeiconsIcon
                  icon={Loading02Icon}
                  className="h-3.5 w-3.5 animate-spin"
                />
              ) : (
                <HugeiconsIcon icon={Refresh01Icon} className="h-3.5 w-3.5" />
              )}
              Reset Canvas
            </button>
          ) : null}

          <button
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            onClick={() => {
              if (isNew) {
                setNodes([]);
                setEdges([]);
                setSelectedNode(null);
                setShowNodeSelector({ show: false, x: 0, y: 0 });
                return;
              }
              discardMutation.mutate();
            }}
          >
            <HugeiconsIcon icon={CancelCircleIcon} className="h-3.5 w-3.5" />
            {isNew ? "Clear Draft" : "Discard Draft"}
          </button>
          <button
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 transition-colors hover:bg-sky-400 disabled:opacity-80"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <HugeiconsIcon
                icon={Loading02Icon}
                className="h-3.5 w-3.5 animate-spin"
              />
            ) : (
              <HugeiconsIcon icon={FloppyDiskIcon} className="h-3.5 w-3.5" />
            )}
            Save Changes
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === "builder" ? (
          <>
            {/* Sidebar */}
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex flex-col border-r border-border bg-card"
                >
                  <div className="p-4">
                    <div className="relative">
                      <HugeiconsIcon
                        icon={Search01Icon}
                        className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Search nodes..."
                        className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-4 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Triggers
                        </h3>
                        <div className="space-y-2">
                          {triggerCatalog.map((node) => (
                            <div
                              key={node.type}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData(
                                  "application/reactflow",
                                  node.type
                                );
                                e.dataTransfer.setData(
                                  "application/label",
                                  node.label
                                );
                              }}
                              className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/50 bg-background p-3 transition-all hover:border-primary/50 hover:shadow-sm active:cursor-grabbing"
                            >
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary`}
                              >
                                {node.icon}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {node.label}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {node.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Actions
                        </h3>
                        <div className="space-y-2">
                          {actionCatalog.map((node) => (
                            <div
                              key={node.type}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData(
                                  "application/reactflow",
                                  node.type
                                );
                                e.dataTransfer.setData(
                                  "application/label",
                                  node.label
                                );
                              }}
                              className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/50 bg-background p-3 transition-all hover:border-secondary/50 hover:shadow-sm active:cursor-grabbing"
                            >
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground`}
                              >
                                {node.icon}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {node.label}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {node.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Canvas Area */}
            <div className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(15,23,42,0.92))]">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] flex items-center justify-between px-6 py-4">
                <div className="rounded-full border border-sky-500/15 bg-slate-950/75 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-sky-200 backdrop-blur">
                  Automation Graph
                </div>
                <div className="rounded-full border border-slate-800 bg-slate-950/75 px-3 py-1 text-[11px] text-slate-400 backdrop-blur">
                  Connect triggers to waits, branches, and actions
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute left-4 top-16 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 text-slate-300 shadow-lg transition-colors hover:bg-slate-900 hover:text-white"
              >
                {sidebarOpen ? (
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
                ) : (
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                )}
              </button>

              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
                defaultEdgeOptions={{
                  type: ConnectionLineType.SmoothStep,
                  animated: true,
                  style: { stroke: EDGE_COLORS.default, strokeWidth: 2.5 },
                }}
                connectionLineStyle={{
                  stroke: EDGE_COLORS.default,
                  strokeWidth: 2.5,
                }}
                snapToGrid
                snapGrid={[24, 24]}
                fitView
              >
                <Background
                  color="rgba(148,163,184,0.16)"
                  gap={24}
                  size={1.2}
                />
                <Controls className="border-slate-800 bg-slate-950/80 text-slate-200" />
                <MiniMap
                  className="border border-slate-800 bg-slate-950/80"
                  maskColor="rgba(15, 23, 42, 0.35)"
                />
              </ReactFlow>

              {!isNew && builderQuery.isLoading ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/50 px-6 backdrop-blur-[2px]">
                  <div className="rounded-2xl border border-sky-500/10 bg-slate-950/95 px-5 py-4 shadow-xl">
                    <div className="flex items-center gap-3 text-sm text-slate-100">
                      <HugeiconsIcon
                        icon={Loading02Icon}
                        className="h-4 w-4 animate-spin text-primary"
                      />
                      Loading automation builder...
                    </div>
                  </div>
                </div>
              ) : null}

              {nodes.length === 0 ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
                  <div className="pointer-events-auto w-full max-w-lg rounded-[28px] border border-sky-500/10 bg-slate-950/90 p-7 text-center shadow-[0_32px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200">
                      <HugeiconsIcon icon={Orbit01Icon} className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
                      Start from a clean canvas
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Add your first trigger to begin this automation, or drag
                      triggers and actions from the left panel onto the canvas.
                    </p>
                    <div className="mt-5 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const [firstTrigger] = triggerCatalog;
                          if (!firstTrigger) {
                            setSidebarOpen(true);
                            return;
                          }
                          addNode(firstTrigger.type, firstTrigger.label);
                        }}
                        className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-sky-400"
                      >
                        Add first trigger
                      </button>
                      <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
                      >
                        Browse blocks
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Node Selector for Placeholders */}
              {showNodeSelector.show && (
                <div
                  className="absolute z-20 w-64 rounded-2xl border border-sky-500/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur"
                  style={{
                    left: showNodeSelector.x + 250, // Offset from node
                    top: showNodeSelector.y,
                  }}
                >
                  <p className="mb-2 px-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Add Action
                  </p>
                  <div className="space-y-1">
                    {actionCatalog.map((node) => (
                      <button
                        key={node.type}
                        onClick={() => addNode(node.type, node.label)}
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-900"
                      >
                        <div className="scale-75">{node.icon}</div>
                        <span>{node.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Properties Panel */}
            <AnimatePresence>
              {selectedNode &&
                !selectedNodeDetails?.type?.includes("placeholder") && (
                  <motion.div
                    initial={{ x: 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 320, opacity: 0 }}
                    className="w-80 border-l border-sky-500/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-6"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="font-semibold tracking-tight text-white">
                        Properties
                      </h3>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-900 hover:text-white"
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          className="h-4 w-4"
                        />
                      </button>
                    </div>

                    {/* Properties Content based on node type */}
                    <div className="space-y-6">
                      {/* Common fields */}
                      <div className="space-y-2">
                        <label className={PROPERTY_LABEL_CLASS}>Label</label>
                        <input
                          type="text"
                          className={PROPERTY_INPUT_CLASS}
                          value={asString(selectedNodeData.label)}
                          onChange={(e) =>
                            updateSelectedNodeData({ label: e.target.value })
                          }
                        />
                      </div>

                      {/* Specific fields */}
                      {selectedNodeDetails?.type === "trigger" && (
                        <>
                          <div className="space-y-2">
                            <label className={PROPERTY_LABEL_CLASS}>
                              Contract
                            </label>
                            <select
                              className={PROPERTY_INPUT_CLASS}
                              value={
                                asString(selectedNodeData.contractAddress) ||
                                asString(selectedNodeData.contract)
                              }
                              onChange={(e) => {
                                updateSelectedNodeData(
                                  buildTriggerContractPatch(
                                    e.target.value,
                                    contractCatalog
                                  )
                                );
                              }}
                            >
                              <option value="">Select contract</option>
                              {contractCatalog.map((c) => (
                                <option key={c.address} value={c.address}>
                                  {c.name} ({c.chain})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className={PROPERTY_LABEL_CLASS}>
                              Event
                            </label>
                            <select
                              className={PROPERTY_INPUT_CLASS}
                              value={asString(selectedNodeData.event)}
                              onChange={(e) =>
                                updateSelectedNodeData({
                                  event: e.target.value,
                                })
                              }
                            >
                              <option value="">Select event</option>
                              {eventTypes.map((e) => (
                                <option key={e} value={e}>
                                  {e}
                                </option>
                              ))}
                            </select>
                          </div>
                          {!isNew ? (
                            <div className="rounded-2xl border border-sky-500/10 bg-sky-400/5 p-3.5">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-xs font-medium text-slate-100">
                                    Test runtime trigger
                                  </div>
                                  <div className="mt-1 text-[11px] leading-5 text-slate-400">
                                    Sends a preview event through the backend
                                    runtime ingestion endpoint for this trigger
                                    type.
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    runtimeTriggerMutation.mutate()
                                  }
                                  disabled={runtimeTriggerMutation.isPending}
                                  className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-900 disabled:opacity-50"
                                >
                                  {runtimeTriggerMutation.isPending
                                    ? "Sending..."
                                    : "Send test event"}
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}

                      {selectedNodeDetails?.type === "email" && (
                        <>
                          <div className="space-y-2">
                            <label className={PROPERTY_LABEL_CLASS}>
                              Template
                            </label>
                            <select
                              className={PROPERTY_INPUT_CLASS}
                              value={asString(selectedNodeData.templateId)}
                              onChange={(e) => {
                                const template =
                                  emailTemplateOptions.find(
                                    (item) => item.id === e.target.value
                                  ) ?? null;
                                updateSelectedNodeData({
                                  templateId: e.target.value,
                                  templateName: template?.name ?? "",
                                  subject: template?.subject ?? "",
                                  previewText: template?.previewText ?? "",
                                });
                              }}
                            >
                              <option value="">Select template</option>
                              {emailTemplateOptions.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {selectedTemplate?.category ||
                          selectedTemplate?.source ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedTemplate?.category ? (
                                <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-400">
                                  {selectedTemplate.category}
                                </span>
                              ) : null}
                              {"source" in (selectedTemplate ?? {}) &&
                              typeof selectedTemplate?.source === "string" &&
                              selectedTemplate.source.length > 0 ? (
                                <span className="rounded-full border border-sky-500/20 bg-sky-400/10 px-2.5 py-1 text-[11px] text-sky-200">
                                  {selectedTemplate.source}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                            <p className="mb-2 text-xs font-medium text-slate-400">
                              Preview
                            </p>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-slate-100">
                                Subject:{" "}
                                {(selectedTemplate?.subject ??
                                  asString(selectedNodeData.subject)) ||
                                  "Select a template"}
                              </p>
                              <p className="text-xs text-slate-400">
                                {(selectedTemplate?.previewText ??
                                  asString(selectedNodeData.previewText)) ||
                                  "Template preview text will appear here."}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedNodeSchemaQuery.isFetching ||
                      selectedNodeSchemaFields.length > 0 ||
                      selectedNodeSchemaQuery.error instanceof Error ? (
                        <div className="space-y-4 rounded-[20px] border border-slate-800 bg-slate-950/70 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-200">
                                Backend Config
                              </div>
                              <div className="mt-1 text-[11px] leading-5 text-slate-500">
                                Powered by the automation trigger/action schema
                                endpoint.
                              </div>
                            </div>
                            {selectedNodeSchemaQuery.isFetching ? (
                              <HugeiconsIcon
                                icon={Loading02Icon}
                                className="h-4 w-4 animate-spin text-sky-300"
                              />
                            ) : null}
                          </div>

                          {selectedNodeSchemaQuery.error instanceof Error ? (
                            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-[11px] leading-5 text-amber-100">
                              Failed to load backend schema:{" "}
                              {selectedNodeSchemaQuery.error.message}
                            </div>
                          ) : null}

                          {selectedNodeSchemaFields.map((field) => {
                            const rawValue = selectedNodeData[field.key];
                            const jsonDraftKey = `${selectedNode ?? "node"}:${field.key}`;

                            if (
                              field.options.length > 0 ||
                              field.type === "select" ||
                              field.type === "enum"
                            ) {
                              return (
                                <div key={field.key} className="space-y-2">
                                  <label className={PROPERTY_LABEL_CLASS}>
                                    {field.label}
                                    {field.required ? " *" : ""}
                                  </label>
                                  <select
                                    className={PROPERTY_INPUT_CLASS}
                                    value={pickText(rawValue)}
                                    onChange={(e) =>
                                      updateSchemaFieldValue(
                                        field,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">
                                      {field.placeholder ??
                                        `Select ${field.label}`}
                                    </option>
                                    {field.options.map((option) => (
                                      <option
                                        key={`${field.key}-${option.value}`}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  {field.description ? (
                                    <p className={PROPERTY_HINT_CLASS}>
                                      {field.description}
                                    </p>
                                  ) : null}
                                </div>
                              );
                            }

                            if (
                              field.type === "boolean" ||
                              field.type === "toggle"
                            ) {
                              return (
                                <label
                                  key={field.key}
                                  className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3"
                                >
                                  <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-400"
                                    checked={asBoolean(rawValue)}
                                    onChange={(e) =>
                                      updateSchemaFieldValue(
                                        field,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span className="space-y-1">
                                    <span className="block text-sm font-medium text-slate-100">
                                      {field.label}
                                    </span>
                                    {field.description ? (
                                      <span className="block text-[11px] leading-5 text-slate-500">
                                        {field.description}
                                      </span>
                                    ) : null}
                                  </span>
                                </label>
                              );
                            }

                            if (
                              field.type === "object" ||
                              field.type === "array" ||
                              field.type === "json"
                            ) {
                              const jsonValue =
                                jsonFieldDrafts[jsonDraftKey] ??
                                (rawValue === undefined
                                  ? ""
                                  : JSON.stringify(rawValue, null, 2));
                              const isJsonInvalid =
                                jsonValue.trim().length > 0 &&
                                (() => {
                                  try {
                                    JSON.parse(jsonValue);
                                    return false;
                                  } catch {
                                    return true;
                                  }
                                })();

                              return (
                                <div key={field.key} className="space-y-2">
                                  <label className={PROPERTY_LABEL_CLASS}>
                                    {field.label}
                                    {field.required ? " *" : ""}
                                  </label>
                                  <textarea
                                    rows={5}
                                    className={PROPERTY_INPUT_CLASS}
                                    placeholder={
                                      field.placeholder ??
                                      `Enter valid JSON for ${field.label}`
                                    }
                                    value={jsonValue}
                                    onChange={(e) => {
                                      const nextValue = e.target.value;
                                      setJsonFieldDrafts((prev) => ({
                                        ...prev,
                                        [jsonDraftKey]: nextValue,
                                      }));
                                      if (nextValue.trim().length === 0) {
                                        updateSchemaFieldValue(
                                          field,
                                          field.type === "array" ? [] : {}
                                        );
                                        return;
                                      }
                                      try {
                                        updateSchemaFieldValue(
                                          field,
                                          JSON.parse(nextValue)
                                        );
                                      } catch {
                                        // Keep draft local until the JSON becomes valid.
                                      }
                                    }}
                                  />
                                  {field.description ? (
                                    <p className={PROPERTY_HINT_CLASS}>
                                      {field.description}
                                    </p>
                                  ) : null}
                                  {isJsonInvalid ? (
                                    <p className="text-[11px] text-amber-300">
                                      Enter valid JSON to apply this field.
                                    </p>
                                  ) : null}
                                </div>
                              );
                            }

                            const inputType =
                              field.type === "number" ||
                              field.type === "integer"
                                ? "number"
                                : field.type === "date"
                                  ? "date"
                                  : "text";
                            const isTextarea =
                              field.type === "textarea" ||
                              field.type === "multiline" ||
                              field.type === "long_text";

                            return (
                              <div key={field.key} className="space-y-2">
                                <label className={PROPERTY_LABEL_CLASS}>
                                  {field.label}
                                  {field.required ? " *" : ""}
                                </label>
                                {isTextarea ? (
                                  <textarea
                                    rows={4}
                                    className={PROPERTY_INPUT_CLASS}
                                    placeholder={field.placeholder}
                                    value={String(rawValue ?? "")}
                                    onChange={(e) =>
                                      updateSchemaFieldValue(
                                        field,
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  <input
                                    type={inputType}
                                    className={PROPERTY_INPUT_CLASS}
                                    placeholder={field.placeholder}
                                    value={
                                      rawValue === undefined ||
                                      rawValue === null
                                        ? ""
                                        : String(rawValue)
                                    }
                                    onChange={(e) =>
                                      updateSchemaFieldValue(
                                        field,
                                        inputType === "number"
                                          ? e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                          : e.target.value
                                      )
                                    }
                                  />
                                )}
                                {field.description ? (
                                  <p className={PROPERTY_HINT_CLASS}>
                                    {field.description}
                                  </p>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                          <div className="rounded-full bg-sky-400/10 p-2">
                            <CheckCircle2 className="h-4 w-4 text-sky-300" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-100">
                              Total Conversions
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {asNumber(selectedNodeStats.conversions)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                          <div className="rounded-full bg-sky-400/10 p-2">
                            <HugeiconsIcon
                              icon={UserGroupIcon}
                              className="h-4 w-4 text-sky-300"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-100">
                              Active Users
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {asNumber(selectedNodeStats.active)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                          <div className="rounded-full bg-violet-400/10 p-2">
                            <HugeiconsIcon
                              icon={Target01Icon}
                              className="h-4 w-4 text-violet-300"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-100">
                              Click Rate
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {asNumber(selectedNodeStats.clickRate)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                          <div className="rounded-full bg-emerald-400/10 p-2">
                            <DollarSign className="h-4 w-4 text-emerald-300" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-100">
                              Revenue
                            </div>
                            <div className="text-2xl font-bold text-white">
                              ${asNumber(selectedNodeStats.revenue)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="border-t border-slate-800 pt-6">
                        <button
                          onClick={() => {
                            setNodes((nds) =>
                              nds.filter((n) => n.id !== selectedNode)
                            );
                            setEdges((eds) =>
                              eds.filter(
                                (edge) =>
                                  edge.source !== selectedNode &&
                                  edge.target !== selectedNode
                              )
                            );
                            setSelectedNode(null);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 py-2.5 text-sm font-medium text-red-100 transition-colors hover:bg-red-400/15"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            className="h-4 w-4"
                          />
                          Delete Node
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </>
        ) : (
          /* Stats Tab Content */
          <div className="flex-1 overflow-y-auto bg-muted/10 p-6">
            <div className="mx-auto max-w-6xl space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    label: "Entries",
                    value: statsEntries.toLocaleString(),
                    change: "—",
                    icon: (
                      <HugeiconsIcon
                        icon={UserGroupIcon}
                        className="h-4 w-4 text-blue-500"
                      />
                    ),
                  },
                  {
                    label: "Conversions",
                    value: statsConversions.toLocaleString(),
                    change: "—",
                    icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
                  },
                  {
                    label: "Conv. Rate",
                    value: `${statsConvRate}%`,
                    change: "—",
                    icon: (
                      <HugeiconsIcon
                        icon={Target01Icon}
                        className="h-4 w-4 text-purple-500"
                      />
                    ),
                  },
                  {
                    label: "Revenue",
                    value:
                      statsRevenue > 0
                        ? `$${(statsRevenue / 1000).toFixed(0)}k`
                        : "—",
                    change: "—",
                    icon: <DollarSign className="h-4 w-4 text-amber-500" />,
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: "easeOut" },
                      },
                    }}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        {stat.label}
                      </span>
                      <div className="rounded-full bg-muted p-1.5">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span
                        className={`text-xs font-medium ${
                          stat.change.startsWith("+")
                            ? "text-primary"
                            : "text-destructive"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="mb-6 font-semibold">Performance Over Time</h3>
                  <div className="h-[300px] w-full">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="colorRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="var(--primary)"
                                stopOpacity={0.1}
                              />
                              <stop
                                offset="95%"
                                stopColor="var(--primary)"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--primary)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            No performance data yet
                          </div>
                          <div className="mt-2 text-sm leading-6 text-muted-foreground">
                            Entries and revenue trends appear here once the
                            automation starts processing users.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="mb-6 font-semibold">Path Performance</h3>
                  {pathRows.length > 0 ? (
                    <div className="space-y-6">
                      {pathRows.map((path) => (
                        <div key={path.path} className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-muted-foreground">
                              {path.path}
                            </span>
                            <span className="font-bold text-primary">
                              {path.rate}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${path.rate}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{path.entries} entries</span>
                            <span>
                              ${(path.revenue / 1000).toFixed(1)}k rev
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          No path data yet
                        </div>
                        <div className="mt-2 text-sm leading-6 text-muted-foreground">
                          Branch outcomes and conversion paths appear here after
                          the automation runs.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border px-6 py-4">
                  <h3 className="font-semibold">Recent Entries</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Path</th>
                        <th className="px-6 py-3 text-right">Revenue</th>
                        <th className="px-6 py-3 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRows.length > 0 ? (
                        recentRows.map((entry) => (
                          <tr
                            key={entry.id}
                            className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/50"
                            onClick={() => {
                              if (isNew) return;
                              automationService
                                .getStatsEntryDetails(automationId, entry.id)
                                .then((data) => {
                                  const text = JSON.stringify(data, null, 2);
                                  navigator.clipboard
                                    .writeText(text)
                                    .then(() => toast.success("Copied details"))
                                    .catch(() => toast.error("Failed to copy"));
                                })
                                .catch((_e) => String(_e));
                            }}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                  <HugeiconsIcon
                                    icon={UserGroupIcon}
                                    className="h-4 w-4"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{entry.wallet}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {entry.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                  entry.outcome === "converted"
                                    ? "bg-primary/10 text-primary"
                                    : entry.outcome === "exited"
                                      ? "bg-destructive/10 text-destructive"
                                      : "bg-secondary text-secondary-foreground"
                                }`}
                              >
                                {entry.outcome}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {entry.path}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-primary">
                              {entry.revenue > 0 ? `$${entry.revenue}` : "-"}
                            </td>
                            <td className="px-6 py-4 text-right text-muted-foreground">
                              {entry.timestamp}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-16 text-center text-sm text-muted-foreground"
                          >
                            No entries yet. This table will populate after the
                            automation begins processing users.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {isStatsLoading &&
              chartData.length === 0 &&
              pathRows.length === 0 &&
              recentRows.length === 0 ? (
                <div className="rounded-xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm">
                  Loading automation stats...
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export function CreateAutomation() {
  return (
    <ReactFlowProvider>
      <CreateAutomationContent />
    </ReactFlowProvider>
  );
}
