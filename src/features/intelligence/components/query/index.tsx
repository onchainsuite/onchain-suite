"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Code,
  Copy,
  Loader2,
  Mail,
  Play,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";

import { isJsonObject } from "@/lib/utils";

import { intelligenceService } from "../../intelligence.service";

const DEFAULT_SQL_QUERY = "";

const asRecord = (row: unknown): Record<string, unknown> =>
  isJsonObject(row) ? (row as Record<string, unknown>) : { value: row };

const columnsFromRows = (rows: Array<Record<string, unknown>>) => {
  const keys = new Set<string>();
  for (const r of rows) {
    Object.keys(r).forEach((k) => keys.add(k));
  }
  return Array.from(keys);
};

interface QueryTabProps {
  openEmailComposer: (recipient: unknown) => void;
  setActiveTab: (tab: string) => void;
}

export function QueryTab({ openEmailComposer, setActiveTab }: QueryTabProps) {
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
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [openHelperTab, setOpenHelperTab] = useState<
    "generate" | "starters" | null
  >(null);
  const trimmedSqlQuery = sqlQuery.trim();
  const trimmedAssistantPrompt = assistantPrompt.trim();

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
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to run query";
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

  const status = statusQuery.data?.status ?? runMutation.data?.status ?? "";
  const isQueryRunning =
    runMutation.isPending || status === "running" || statusQuery.isFetching;

  const rows = useMemo(() => {
    const raw = resultsQuery.data?.rows ?? runMutation.data?.rows ?? [];
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map(asRecord);
  }, [resultsQuery.data?.rows, runMutation.data?.rows]);

  const columns = useMemo(() => {
    const cols = runMutation.data?.columns;
    if (Array.isArray(cols) && cols.length > 0) {
      return cols
        .map((c) =>
          isJsonObject(c) && typeof c.name === "string" ? c.name : ""
        )
        .filter((c) => c.length > 0);
    }
    return columnsFromRows(rows);
  }, [rows, runMutation.data?.columns]);

  const totalRows =
    typeof resultsQuery.data?.total === "number"
      ? resultsQuery.data.total
      : typeof runMutation.data?.totalRows === "number"
        ? runMutation.data.totalRows
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
    (nextQuery: string) => {
      setSqlQuery(nextQuery);
      setQueryId(null);
      setHasRunQuery(false);
      setPage(1);
      setSelectedRows([]);
      validateMutation.reset();
      runMutation.reset();
    },
    [runMutation, validateMutation]
  );

  const toggleHelperTab = useCallback(
    (tab: "generate" | "starters") => {
      setOpenHelperTab((current) => (current === tab ? null : tab));
    },
    []
  );

  return (
    <div className="space-y-4">
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
              Describe the audience or behavior you want to find, then review the
              generated SQL before running it.
            </p>
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
                        loadSqlIntoEditor(generateSqlMutation.data?.sql ?? "")
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
                            loadSqlIntoEditor(suggestion.sqlDraft ?? "")
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

      {validateMutation.data ? (
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
