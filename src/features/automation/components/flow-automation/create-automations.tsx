"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Loader2,
  Save,
  Search,
  Target,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
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
import { projectSettingsService } from "@/features/settings/project-settings.service";

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
  emailTemplates,
  eventTypes,
  mockContracts,
  pathPerformance,
  recentEntries,
  statsChartData,
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

  const { project } = useReactFlow();

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
          icon: <Target className="h-4 w-4" />,
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
          icon: <ChevronRight className="h-4 w-4" />,
        };
      })
      .filter((x): x is (typeof actionNodes)[number] => !!x);
    return normalized.length > 0 ? normalized : resolvedActionNodes;
  }, [actionsQuery.data, resolvedActionNodes]);

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
    if (list.length === 0) return statsChartData;
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
    return mapped.length > 0 ? mapped : statsChartData;
  }, [statsTimeSeriesQuery.data]);

  const pathRows = useMemo(() => {
    const list = pickArray((statsPathsQuery.data as unknown) ?? []);
    if (list.length === 0) return pathPerformance;
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
      .filter((x): x is (typeof pathPerformance)[number] => !!x);
    return mapped.length > 0 ? mapped : pathPerformance;
  }, [statsPathsQuery.data]);

  const recentRows = useMemo(() => {
    const list = pickArray((statsEntriesQuery.data as unknown) ?? []);
    if (list.length === 0) return recentEntries;
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
      .filter((x): x is (typeof recentEntries)[number] => !!x);
    return mapped.length > 0 ? mapped : recentEntries;
  }, [statsEntriesQuery.data]);

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
      emailTemplates.find((template) => template.id === templateId) ?? null
    );
  }, [selectedNodeData]);
  const selectedNodeStats = useMemo(
    () =>
      isJsonObject(selectedNodeData.stats)
        ? (selectedNodeData.stats as Record<string, unknown>)
        : {},
    [selectedNodeData]
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
    const nodesArr = pickArray((payload as Record<string, unknown>).nodes);
    const edgesArr = pickArray((payload as Record<string, unknown>).edges);
    if (nodesArr.length > 0) setNodes(nodesArr as Node[]);
    if (edgesArr.length > 0) setEdges(edgesArr as Edge[]);
  }, [builderQuery.data, isNew, setEdges, setNodes]);

  const validateMutation = useMutation({
    mutationFn: async () => {
      if (isNew) return { errors: [], warnings: [] };
      return automationService.validateBuilder(automationId, {
        nodes,
        edges,
      });
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
      await automationService.saveBuilder(automationId, { nodes, edges });
      return { createdId: null as string | null };
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["automations"] });
      setIsSaving(false);
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
      await automationService.discardBuilder(automationId);
    },
    onSuccess: async () => {
      if (isNew) return;
      await builderQuery.refetch();
    },
  });

  const onConnect = useCallback(
    (params: Connection) => {
      const validation = isValidConnection(params, nodes);
      if (!validation.valid) {
        // Could show toast error here
        console.warn(validation.message);
        return;
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: ConnectionLineType.SmoothStep,
            animated: true,
            style: { stroke: "#64748b", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#64748b",
            },
          },
          eds
        )
      );
    },
    [nodes, setEdges]
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
      data: { label },
    };

    const layout = autoLayoutNodes(nodes, newNode);
    newNode.position = layout;

    setNodes((nds) => nds.concat(newNode));
    setShowNodeSelector({ show: false, x: 0, y: 0 });

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

  return (
    <motion.div
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      initial="initial"
      animate="animate"
      className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm"
    >
      <Confetti show={!showConfetti} />

      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/automations"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={automationData.name}
                onChange={(e) =>
                  setAutomationData({ ...automationData, name: e.target.value })
                }
                className="bg-transparent text-sm font-semibold text-foreground focus:outline-none"
              />
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                <CheckCircle2 className="h-3 w-3" />
                Saved
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Last edited{" "}
              {typeof (
                lastEditedQuery.data as { lastEditedAt?: unknown } | null
              )?.lastEditedAt === "string"
                ? String(
                    (lastEditedQuery.data as { lastEditedAt: string })
                      .lastEditedAt
                  )
                : automationData.createdAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="builder" className="text-xs">
                Builder
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-xs">
                Stats
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-6 w-px bg-border" />

          {!isNew && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              onClick={() => previewMutation.mutate()}
              disabled={previewMutation.isPending}
            >
              Preview
            </button>
          )}

          {!isNew && automationData.status === "draft" && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : null}
              Publish
            </button>
          )}

          <button
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => {
              if (isNew) {
                setNodes(getInitialNodes("new-id"));
                setEdges(getInitialEdges("new-id"));
                return;
              }
              discardMutation.mutate();
            }}
          >
            <XCircle className="h-3.5 w-3.5" />
            Discard
          </button>
          <button
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
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
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
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
            <div className="relative flex-1 bg-muted/10">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background shadow-sm transition-colors hover:bg-muted"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
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
                  style: { stroke: "#64748b", strokeWidth: 2 },
                }}
                connectionLineStyle={{ stroke: "#64748b", strokeWidth: 2 }}
                fitView
              >
                <Background color="#94a3b8" gap={16} size={1} />
                <Controls className="bg-background border-border" />
                <MiniMap
                  className="bg-background border-border"
                  maskColor="rgba(0, 0, 0, 0.1)"
                />
              </ReactFlow>

              {/* Node Selector for Placeholders */}
              {showNodeSelector.show && (
                <div
                  className="absolute z-20 w-64 rounded-xl border border-border bg-card p-2 shadow-xl"
                  style={{
                    left: showNodeSelector.x + 250, // Offset from node
                    top: showNodeSelector.y,
                  }}
                >
                  <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                    Add Action
                  </p>
                  <div className="space-y-1">
                    {actionCatalog.map((node) => (
                      <button
                        key={node.type}
                        onClick={() => addNode(node.type, node.label)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
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
                    className="w-80 border-l border-border bg-card p-6"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="font-semibold">Properties</h3>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="rounded-full p-1 hover:bg-muted"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Properties Content based on node type */}
                    <div className="space-y-6">
                      {/* Common fields */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          Label
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
                            <label className="text-xs font-medium text-muted-foreground">
                              Contract
                            </label>
                            <select
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
                            <label className="text-xs font-medium text-muted-foreground">
                              Event
                            </label>
                            <select
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
                        </>
                      )}

                      {selectedNodeDetails?.type === "email" && (
                        <>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                              Template
                            </label>
                            <select
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                              value={asString(selectedNodeData.templateId)}
                              onChange={(e) => {
                                const template =
                                  emailTemplates.find(
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
                              {emailTemplates.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="rounded-lg bg-muted p-3">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                              Preview
                            </p>
                            <div className="space-y-1">
                              <p className="text-xs font-medium">
                                Subject:{" "}
                                {(selectedTemplate?.subject ??
                                  asString(selectedNodeData.subject)) ||
                                  "Select a template"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(selectedTemplate?.previewText ??
                                  asString(selectedNodeData.previewText)) ||
                                  "Template preview text will appear here."}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              Total Conversions
                            </div>
                            <div className="text-2xl font-bold text-foreground">
                              {asNumber(selectedNodeStats.conversions)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              Active Users
                            </div>
                            <div className="text-2xl font-bold text-foreground">
                              {asNumber(selectedNodeStats.active)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                          <div className="rounded-full bg-secondary/10 p-2">
                            <Target className="h-4 w-4 text-secondary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              Click Rate
                            </div>
                            <div className="text-2xl font-bold text-foreground">
                              {asNumber(selectedNodeStats.clickRate)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              Revenue
                            </div>
                            <div className="text-2xl font-bold text-foreground">
                              ${asNumber(selectedNodeStats.revenue)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-6 border-t border-border">
                        <button
                          onClick={() => {
                            setNodes((nds) =>
                              nds.filter((n) => n.id !== selectedNode)
                            );
                            setSelectedNode(null);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
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
                    icon: <Users className="h-4 w-4 text-blue-500" />,
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
                    icon: <Target className="h-4 w-4 text-purple-500" />,
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
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="mb-6 font-semibold">Path Performance</h3>
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
                          <span>${(path.revenue / 1000).toFixed(1)}k rev</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      {recentRows.map((entry) => (
                        <tr
                          key={entry.id}
                          className="border-b border-border/50 transition-colors hover:bg-muted/50 cursor-pointer"
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
                                <Users className="h-4 w-4" />
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
