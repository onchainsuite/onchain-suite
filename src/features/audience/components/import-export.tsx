"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  FileJson,
  FileText,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  type AudienceExportJobStatus,
  type AudienceImportExportFormat,
  type AudienceImportJobStatus,
  audienceService,
} from "@/features/audience/audience.service";

const fieldOptions = [
  { value: "", label: "Skip this column" },
  { value: "email", label: "Email" },
  { value: "name", label: "Name" },
  { value: "wallet", label: "Wallet Address" },
  { value: "tags", label: "Tags" },
  { value: "status", label: "Status" },
  { value: "chain", label: "Chain" },
  { value: "notes", label: "Notes" },
  { value: "custom", label: "Custom Field" },
];

type ImportStep = "upload" | "mapping" | "complete";
type ActiveTab = "import" | "export";

interface CSVColumn {
  header: string;
  sample: string[];
  mappedTo: string;
}

type ImportHistoryStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

type ExportHistoryStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

interface ImportHistoryItem {
  jobId: string;
  fileName: string;
  format: AudienceImportExportFormat;
  createdAt: string;
  status: ImportHistoryStatus;
  processedRows?: number;
  totalRows?: number;
  createdCount?: number;
  updatedCount?: number;
  errorCount?: number;
}

interface ExportHistoryItem {
  jobId: string;
  format: AudienceImportExportFormat;
  createdAt: string;
  status: ExportHistoryStatus;
  processedRows?: number;
  totalRows?: number;
  fileSizeBytes?: number;
}

const steps = [
  { id: "upload", label: "Upload" },
  { id: "mapping", label: "Map Fields" },
  { id: "complete", label: "Complete" },
];

const IMPORT_HISTORY_KEY = "onchain.audience.importHistory.v1";
const EXPORT_HISTORY_KEY = "onchain.audience.exportHistory.v1";

const safeJsonParse = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const toIsoNow = () => new Date().toISOString();

const toHumanBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  const fixed = value >= 10 || idx === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${fixed} ${units[idx]}`;
};

const formatShortDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const readFileSnippetText = async (file: File, bytes: number) => {
  const blob = file.slice(0, Math.max(0, bytes));
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsText(blob);
  });
};

export default function ImportExportPage() {
  const [dragActive, setDragActive] = useState(false);
  const [importStep, setImportStep] = useState<ImportStep>("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("import");
  const [importJobId, setImportJobId] = useState<string | null>(null);
  const [exportJobId, setExportJobId] = useState<string | null>(null);
  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([]);
  const [filePreviewText, setFilePreviewText] = useState<string>("");
  const [filePreviewError, setFilePreviewError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCsvFile = Boolean(uploadedFile?.name?.toLowerCase().endsWith(".csv"));
  const isJsonFile = Boolean(
    uploadedFile?.name?.toLowerCase().endsWith(".json")
  );
  const selectedImportFormat: AudienceImportExportFormat | null = isCsvFile
    ? "csv"
    : isJsonFile
      ? "json"
      : null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  useEffect(() => {
    const rawImports =
      typeof window !== "undefined"
        ? window.localStorage.getItem(IMPORT_HISTORY_KEY)
        : null;
    const parsedImports =
      typeof rawImports === "string" ? safeJsonParse(rawImports) : null;
    const importsArray = Array.isArray(parsedImports) ? parsedImports : [];
    setImportHistory(
      importsArray
        .filter((x) => x && typeof x === "object")
        .slice(0, 50) as ImportHistoryItem[]
    );

    const rawExports =
      typeof window !== "undefined"
        ? window.localStorage.getItem(EXPORT_HISTORY_KEY)
        : null;
    const parsedExports =
      typeof rawExports === "string" ? safeJsonParse(rawExports) : null;
    const exportsArray = Array.isArray(parsedExports) ? parsedExports : [];
    setExportHistory(
      exportsArray
        .filter((x) => x && typeof x === "object")
        .slice(0, 50) as ExportHistoryItem[]
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      IMPORT_HISTORY_KEY,
      JSON.stringify(importHistory.slice(0, 50))
    );
  }, [importHistory]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      EXPORT_HISTORY_KEY,
      JSON.stringify(exportHistory.slice(0, 50))
    );
  }, [exportHistory]);

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    const [headerLine] = lines;
    const headers = headerLine
      .split(",")
      .map((h) => h.trim().replace(/^"|"$/g, ""));

    const columns: CSVColumn[] = headers.map((header, index) => {
      const samples: string[] = [];
      for (let i = 1; i < Math.min(4, lines.length); i++) {
        const values = lines[i]
          .split(",")
          .map((v) => v.trim().replace(/^"|"$/g, ""));
        if (values[index]) samples.push(values[index]);
      }

      let autoMap = "";
      const headerLower = header.toLowerCase();
      if (headerLower.includes("email")) autoMap = "email";
      else if (headerLower.includes("name")) autoMap = "name";
      else if (
        headerLower.includes("wallet") ||
        headerLower.includes("address")
      )
        autoMap = "wallet";
      else if (headerLower.includes("tag")) autoMap = "tags";
      else if (headerLower.includes("status")) autoMap = "status";
      else if (headerLower.includes("chain")) autoMap = "chain";

      return { header, sample: samples, mappedTo: autoMap };
    });

    return columns;
  };

  const handleFileSelect = (file: File) => {
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".csv") && !lower.endsWith(".json")) {
      toast.error("Only CSV and JSON files are supported");
      return;
    }
    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error("File too large (max 25MB)");
      return;
    }

    setUploadedFile(file);
    setImportJobId(null);
    setFilePreviewError("");
    setFilePreviewText("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (file.name.toLowerCase().endsWith(".csv")) {
        const columns = parseCSV(text);
        setCsvColumns(columns);
        setImportStep("mapping");
        return;
      }

      setCsvColumns([]);
      setImportStep("mapping");
    };
    reader.readAsText(file.slice(0, 200_000));

    (async () => {
      try {
        const snippet = await readFileSnippetText(file, 50_000);
        if (file.name.toLowerCase().endsWith(".json")) {
          const parsed = safeJsonParse(snippet);
          if (Array.isArray(parsed)) {
            const preview = parsed.slice(0, 3);
            setFilePreviewText(JSON.stringify(preview, null, 2));
            return;
          }
          if (parsed && typeof parsed === "object") {
            const obj = parsed as Record<string, unknown>;
            const data = Array.isArray(obj.data) ? obj.data.slice(0, 3) : null;
            if (data) {
              setFilePreviewText(JSON.stringify(data, null, 2));
              return;
            }
          }
        }
        const lines = snippet.split(/\r?\n/).slice(0, 12).join("\n");
        setFilePreviewText(lines);
      } catch (e) {
        setFilePreviewError(
          e instanceof Error ? e.message : "Preview unavailable"
        );
      }
    })().catch(() => undefined);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const [file] = Array.from(e.dataTransfer.files);
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".json"))) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const updateMapping = (index: number, value: string) => {
    setCsvColumns((prev) =>
      prev.map((col, i) => (i === index ? { ...col, mappedTo: value } : col))
    );
  };

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!uploadedFile) throw new Error("No file selected");
      const lower = uploadedFile.name.toLowerCase();
      const format: AudienceImportExportFormat | undefined = lower.endsWith(
        ".csv"
      )
        ? "csv"
        : lower.endsWith(".json")
          ? "json"
          : undefined;
      if (!format) throw new Error("Unsupported file type");

      const mapping: Record<string, string> = {};
      if (format === "csv") {
        for (const col of csvColumns) {
          const target = col.mappedTo?.trim();
          if (!target) continue;
          if (target === "custom") {
            const key = col.header.trim().replace(/\s+/g, "_");
            mapping[col.header] = `attributes.${key}`;
            continue;
          }
          mapping[col.header] = target;
        }
      }

      const res = await audienceService.createImportJob({
        file: uploadedFile,
        format,
        mapping: format === "csv" ? mapping : undefined,
      });

      const jobId =
        typeof res.jobId === "string" && res.jobId.length > 0
          ? res.jobId
          : typeof (res as unknown as { id?: unknown }).id === "string"
            ? String((res as unknown as { id?: unknown }).id)
            : typeof (res as unknown as { jobId?: unknown }).jobId === "string"
              ? String((res as unknown as { jobId?: unknown }).jobId)
              : null;

      if (!jobId)
        throw new Error("Import job started but no jobId was returned");
      return { jobId };
    },
    onMutate: () => {
      setIsImporting(true);
    },
    onSuccess: ({ jobId }) => {
      setImportJobId(jobId);
      if (uploadedFile && selectedImportFormat) {
        const entry: ImportHistoryItem = {
          jobId,
          fileName: uploadedFile.name,
          format: selectedImportFormat,
          createdAt: toIsoNow(),
          status: "queued",
        };
        setImportHistory((prev) =>
          [entry, ...prev.filter((x) => x.jobId !== jobId)].slice(0, 50)
        );
      }
      toast.success("Import started");
    },
    onError: (e: unknown) => {
      const message = e instanceof Error ? e.message : "Import failed";
      toast.error(message);
    },
    onSettled: () => {
      setIsImporting(false);
    },
  });

  const importStatusQuery = useQuery({
    queryKey: ["audience", "imports", importJobId],
    queryFn: async () => {
      if (!importJobId) return null;
      return audienceService.getImportJob(importJobId);
    },
    enabled: Boolean(importJobId),
    refetchInterval: (q) => {
      const data = q.state.data as AudienceImportJobStatus | null | undefined;
      const state = String(data?.state ?? "");
      if (!data) return 1500;
      if (state === "queued" || state === "processing") return 1500;
      return false;
    },
  });

  const importStatus = importStatusQuery.data ?? null;

  useEffect(() => {
    if (!importJobId || !importStatus) return;
    const state = String(importStatus.state ?? "") as ImportHistoryStatus;
    setImportHistory((prev) => {
      const next = prev.map((x) => {
        if (x.jobId !== importJobId) return x;
        const updated: ImportHistoryItem = {
          ...x,
          status: state || x.status,
          processedRows: importStatus.processedRows ?? x.processedRows,
          totalRows: importStatus.totalRows ?? x.totalRows,
          createdCount: importStatus.createdCount ?? x.createdCount,
          updatedCount: importStatus.updatedCount ?? x.updatedCount,
          errorCount: importStatus.errorCount ?? x.errorCount,
        };
        return updated;
      });
      return next;
    });
  }, [importJobId, importStatus]);

  const cancelImportMutation = useMutation({
    mutationFn: async () => {
      if (!importJobId) return;
      await audienceService.cancelImportJob(importJobId);
    },
    onSuccess: () => {
      if (importJobId) {
        setImportHistory((prev) =>
          prev.map((x) =>
            x.jobId === importJobId ? { ...x, status: "cancelled" } : x
          )
        );
      }
      toast.success("Import cancelled");
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Failed to cancel import"),
  });

  const downloadImportErrorsMutation = useMutation({
    mutationFn: async () => {
      if (!importJobId) throw new Error("Missing jobId");
      const blob = await audienceService.downloadImportErrors(importJobId);
      return blob;
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audience-import-errors-${importJobId ?? "job"}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Failed to download errors"),
  });

  const exportMutation = useMutation({
    mutationFn: async (format: AudienceImportExportFormat) => {
      const res = await audienceService.createExportJob({ format });
      const jobId =
        typeof res.jobId === "string" && res.jobId.length > 0
          ? res.jobId
          : typeof (res as unknown as { id?: unknown }).id === "string"
            ? String((res as unknown as { id?: unknown }).id)
            : null;
      if (!jobId)
        throw new Error("Export job started but no jobId was returned");
      return { jobId, format };
    },
    onSuccess: ({ jobId, format }) => {
      setExportJobId(jobId);
      const entry: ExportHistoryItem = {
        jobId,
        format,
        createdAt: toIsoNow(),
        status: "queued",
      };
      setExportHistory((prev) =>
        [entry, ...prev.filter((x) => x.jobId !== jobId)].slice(0, 50)
      );
      toast.success("Export started");
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Export failed"),
  });

  const exportStatusQuery = useQuery({
    queryKey: ["audience", "exports", exportJobId],
    queryFn: async () => {
      if (!exportJobId) return null;
      return audienceService.getExportJob(exportJobId);
    },
    enabled: Boolean(exportJobId),
    refetchInterval: (q) => {
      const data = q.state.data as AudienceExportJobStatus | null | undefined;
      const state = String(data?.state ?? "");
      if (!data) return 1500;
      if (state === "queued" || state === "processing") return 1500;
      return false;
    },
  });

  const exportStatus = exportStatusQuery.data ?? null;

  useEffect(() => {
    if (!exportJobId || !exportStatus) return;
    const state = String(exportStatus.state ?? "") as ExportHistoryStatus;
    setExportHistory((prev) =>
      prev.map((x) => {
        if (x.jobId !== exportJobId) return x;
        return {
          ...x,
          status: state || x.status,
          processedRows: exportStatus.processedRows ?? x.processedRows,
          totalRows: exportStatus.totalRows ?? x.totalRows,
          fileSizeBytes: exportStatus.fileSizeBytes ?? x.fileSizeBytes,
          format:
            (exportStatus.format as AudienceImportExportFormat | undefined) ??
            x.format,
        };
      })
    );
  }, [exportJobId, exportStatus]);

  const cancelExportMutation = useMutation({
    mutationFn: async () => {
      if (!exportJobId) return;
      await audienceService.cancelExportJob(exportJobId);
    },
    onSuccess: () => {
      if (exportJobId) {
        setExportHistory((prev) =>
          prev.map((x) =>
            x.jobId === exportJobId ? { ...x, status: "cancelled" } : x
          )
        );
      }
      toast.success("Export cancelled");
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Failed to cancel export"),
  });

  const downloadExportMutation = useMutation({
    mutationFn: async () => {
      if (!exportJobId) throw new Error("Missing jobId");
      const blob = await audienceService.downloadExport(exportJobId);
      return blob;
    },
    onSuccess: (blob) => {
      const ext =
        (exportStatus?.format ?? "").toString().toLowerCase() === "json"
          ? "json"
          : "csv";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audience-export-${exportJobId ?? "job"}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Failed to download export"),
  });

  const handleImport = () => {
    importMutation.mutateAsync().catch(() => undefined);
  };

  const resetImport = () => {
    setImportStep("upload");
    setUploadedFile(null);
    setCsvColumns([]);
    setImportResult(null);
    setImportJobId(null);
  };

  const mappedCount = csvColumns.filter((c) => c.mappedTo).length;

  useEffect(() => {
    if (!importStatus) return;
    const state = String(importStatus.state ?? "");
    if (state === "completed") {
      const success =
        (importStatus.createdCount ?? 0) + (importStatus.updatedCount ?? 0);
      const failed = importStatus.errorCount ?? 0;
      setImportResult({ success, failed });
      setImportStep("complete");
      return;
    }
    if (state === "failed") {
      toast.error("Import failed");
    }
  }, [importStatus]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen gap-2 bg-(--color-background) p-2 text-(--color-text) md:gap-4 md:p-4"
    >
      <main className="flex-1 px-4 py-5 md:px-8">
        <div className="mx-auto max-w-5xl space-y-5">
          <Link
            href="/audience"
            className="mb-6 inline-flex items-center gap-2 text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text)"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Audience
          </Link>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-transparent to-primary/5 p-10 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Import / Export
                </h1>
                <p className="mt-2 text-(--color-text-muted)">
                  Bulk import contacts or export your audience data
                </p>
              </div>
              {importStep === "upload" && (
                <div className="flex items-center gap-1 rounded-lg bg-(--color-card) p-1">
                  <button
                    onClick={() => setActiveTab("import")}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                      activeTab === "import"
                        ? "bg-primary text-primary-foreground"
                        : "text-(--color-text-muted) hover:text-(--color-text)"
                    }`}
                  >
                    Import
                  </button>
                  <button
                    onClick={() => setActiveTab("export")}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                      activeTab === "export"
                        ? "bg-primary text-primary-foreground"
                        : "text-(--color-text-muted) hover:text-(--color-text)"
                    }`}
                  >
                    Export
                  </button>
                </div>
              )}
            </div>

            {importStep !== "upload" && (
              <div className="mt-8 flex items-center justify-center">
                {steps.map((step, index) => {
                  const stepIndex = steps.findIndex((s) => s.id === importStep);
                  const currentIndex = steps.findIndex((s) => s.id === step.id);
                  const isActive = step.id === importStep;
                  const isCompleted = currentIndex < stepIndex;
                  const isLast = index === steps.length - 1;

                  return (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => {
                          if (isCompleted && step.id === "upload")
                            resetImport();
                        }}
                        disabled={!isCompleted}
                        className={`flex items-center gap-3 ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                            isCompleted
                              ? "bg-primary text-primary-foreground"
                              : isActive
                                ? "bg-primary/20 text-primary ring-2 ring-primary/50"
                                : "bg-(--color-elevated) text-(--color-text-muted)"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isActive
                              ? "text-primary"
                              : isCompleted
                                ? "text-(--color-text)"
                                : "text-(--color-text-muted)"
                          }`}
                        >
                          {step.label}
                        </span>
                      </button>
                      {!isLast && (
                        <div
                          className={`mx-4 h-0.5 w-16 rounded-full transition-colors ${
                            isCompleted ? "bg-primary" : "bg-(--color-border)"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {importStep === "upload" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-10"
            >
              {activeTab === "import" && (
                <section>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-20 text-center transition-all shadow-md hover:shadow-lg ${
                      dragActive
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-(--color-border) hover:border-primary/50 hover:bg-(--color-card)"
                    }`}
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium">
                      Drop files here or click to upload
                    </p>
                    <p className="mt-2 text-sm text-(--color-text-muted)">
                      Supports CSV and JSON formats
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                    >
                      Select File
                    </button>
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-(--color-text-muted)">
                        Import history
                      </h3>
                      {importHistory.length > 0 && (
                        <button
                          onClick={() => setImportHistory([])}
                          className="text-xs text-(--color-text-muted) hover:text-(--color-text)"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {importHistory.length === 0 ? (
                      <div className="rounded-2xl border border-(--color-border) bg-(--color-card) p-6 text-sm text-(--color-text-muted)">
                        No imports yet. Upload a CSV or JSON file to get
                        started.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {importHistory.slice(0, 10).map((item) => (
                          <div
                            key={item.jobId}
                            className="flex items-center justify-between gap-3 rounded-xl border border-(--color-border) bg-(--color-card) p-4"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {item.format === "json" ? (
                                <FileJson className="h-5 w-5 text-(--color-text-muted)" />
                              ) : (
                                <FileText className="h-5 w-5 text-(--color-text-muted)" />
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                  {item.fileName}
                                </p>
                                <p className="mt-0.5 text-xs text-(--color-text-muted)">
                                  {formatShortDate(item.createdAt)} ·{" "}
                                  {String(item.status)}
                                  {typeof item.processedRows === "number"
                                    ? ` · ${item.processedRows.toLocaleString()} processed`
                                    : ""}
                                  {typeof item.errorCount === "number" &&
                                  item.errorCount > 0
                                    ? ` · ${item.errorCount.toLocaleString()} errors`
                                    : ""}
                                </p>
                              </div>
                            </div>
                            {item.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                            ) : item.status === "failed" ? (
                              <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                            ) : (
                              <div className="h-5 w-5 shrink-0 rounded-full bg-primary/10" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === "export" && (
                <section>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      onClick={() => exportMutation.mutate("csv")}
                      disabled={exportMutation.isPending}
                      className="group flex items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-card) p-6 text-left transition-all hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-elevated) transition-colors group-hover:bg-primary/10">
                        <FileText className="h-6 w-6 text-(--color-text-muted) transition-colors group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Export as CSV</p>
                        <p className="mt-0.5 text-sm text-(--color-text-muted)">
                          Spreadsheet compatible
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => exportMutation.mutate("json")}
                      disabled={exportMutation.isPending}
                      className="group flex items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-card) p-6 text-left transition-all hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-elevated) transition-colors group-hover:bg-primary/10">
                        <FileJson className="h-6 w-6 text-(--color-text-muted) transition-colors group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Export as JSON</p>
                        <p className="mt-0.5 text-sm text-(--color-text-muted)">
                          Developer friendly
                        </p>
                      </div>
                    </button>
                  </div>

                  {exportJobId && (
                    <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-card) p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">Export job</p>
                          <p className="mt-1 text-xs text-(--color-text-muted) break-all">
                            {exportJobId}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => cancelExportMutation.mutate()}
                            disabled={
                              cancelExportMutation.isPending ||
                              ["completed", "failed", "cancelled"].includes(
                                String(exportStatus?.state ?? "")
                              )
                            }
                            className="rounded-xl border border-(--color-border) px-3 py-2 text-xs font-medium hover:bg-(--color-elevated) disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => downloadExportMutation.mutate()}
                            disabled={
                              downloadExportMutation.isPending ||
                              String(exportStatus?.state ?? "") !== "completed"
                            }
                            className="rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-(--color-elevated)">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${Math.max(0, Math.min(100, Number(exportStatus?.progress ?? (String(exportStatus?.state ?? "") === "completed" ? 100 : 0))))}%`,
                            }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-(--color-text-muted)">
                          Status: {String(exportStatus?.state ?? "queued")}
                          {typeof exportStatus?.processedRows === "number"
                            ? ` · ${exportStatus.processedRows.toLocaleString()} processed`
                            : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-(--color-text-muted)">
                        Export history
                      </h3>
                      {exportHistory.length > 0 && (
                        <button
                          onClick={() => setExportHistory([])}
                          className="text-xs text-(--color-text-muted) hover:text-(--color-text)"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {exportHistory.length === 0 ? (
                      <div className="rounded-2xl border border-(--color-border) bg-(--color-card) p-6 text-sm text-(--color-text-muted)">
                        No exports yet. Choose CSV or JSON to generate your
                        first export.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {exportHistory.slice(0, 10).map((item) => (
                          <div
                            key={item.jobId}
                            className="flex items-center justify-between gap-3 rounded-xl border border-(--color-border) bg-(--color-card) p-4"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {item.format === "json" ? (
                                <FileJson className="h-5 w-5 text-(--color-text-muted)" />
                              ) : (
                                <FileText className="h-5 w-5 text-(--color-text-muted)" />
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                  audience-export-{item.jobId}.{item.format}
                                </p>
                                <p className="mt-0.5 text-xs text-(--color-text-muted)">
                                  {formatShortDate(item.createdAt)} ·{" "}
                                  {String(item.status)}
                                  {typeof item.fileSizeBytes === "number"
                                    ? ` · ${toHumanBytes(item.fileSizeBytes)}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                            {item.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                            ) : item.status === "failed" ? (
                              <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                            ) : (
                              <div className="h-5 w-5 shrink-0 rounded-full bg-primary/10" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {importStep === "mapping" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">
                    {selectedImportFormat === "csv"
                      ? "Map CSV Columns"
                      : "Import JSON"}
                  </h2>
                  <p className="mt-1 text-sm text-(--color-text-muted)">
                    {uploadedFile?.name}
                    {selectedImportFormat === "csv"
                      ? ` · ${mappedCount} of ${csvColumns.length} columns mapped`
                      : ""}
                  </p>
                </div>
                <button
                  onClick={resetImport}
                  className="rounded-xl p-2 text-(--color-text-muted) transition-colors hover:bg-(--color-card)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {uploadedFile && (
                <div className="mb-6 rounded-2xl border border-(--color-border) bg-(--color-card) p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Preview</p>
                      <p className="mt-1 text-xs text-(--color-text-muted)">
                        {uploadedFile.name} · {toHumanBytes(uploadedFile.size)}
                        {selectedImportFormat
                          ? ` · ${selectedImportFormat.toUpperCase()}`
                          : ""}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {selectedImportFormat === "json" ? (
                        <FileJson className="h-5 w-5 text-(--color-text-muted)" />
                      ) : (
                        <FileText className="h-5 w-5 text-(--color-text-muted)" />
                      )}
                    </div>
                  </div>
                  {filePreviewError.length > 0 ? (
                    <div className="mt-4 rounded-xl border border-(--color-border) bg-(--color-elevated) p-4 text-sm text-destructive">
                      {filePreviewError}
                    </div>
                  ) : (
                    <pre className="mt-4 max-h-64 overflow-auto rounded-xl border border-(--color-border) bg-(--color-elevated) p-4 text-xs text-(--color-text-muted)">
                      {filePreviewText.length > 0
                        ? filePreviewText
                        : "Preview unavailable."}
                    </pre>
                  )}
                </div>
              )}

              {selectedImportFormat === "csv" ? (
                <div className="space-y-3">
                  {csvColumns.map((column, index) => (
                    <div
                      key={column.header}
                      className="flex items-center gap-4 rounded-xl border border-(--color-border) bg-(--color-card) p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{column.header}</p>
                        <p className="mt-1 text-xs text-(--color-text-muted) font-mono truncate">
                          {column.sample.slice(0, 2).join(", ")}
                          {column.sample.length > 2 && "..."}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-(--color-text-muted) shrink-0" />
                      <div className="w-48 shrink-0">
                        <select
                          value={column.mappedTo}
                          onChange={(e) => updateMapping(index, e.target.value)}
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-background) px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        >
                          {fieldOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-6 shrink-0">
                        {column.mappedTo && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-(--color-border) bg-(--color-card) p-6 text-sm text-(--color-text-muted)">
                  Ready to import JSON file. No field mapping is required.
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-(--color-border) pt-6">
                <p className="text-sm text-(--color-text-muted)">
                  {selectedImportFormat === "csv"
                    ? mappedCount > 0
                      ? `Ready to import ${mappedCount} fields`
                      : "Map at least one column to continue"
                    : "Ready to import"}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={resetImport}
                    className="rounded-xl border border-(--color-border) px-4 py-2 text-sm font-medium hover:bg-(--color-card)"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={
                      isImporting ||
                      importMutation.isPending ||
                      !uploadedFile ||
                      !selectedImportFormat ||
                      (selectedImportFormat === "csv" && mappedCount === 0)
                    }
                    className="rounded-xl bg-emerald-500 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isImporting || importMutation.isPending
                      ? "Importing..."
                      : "Import Data"}
                  </button>
                </div>
              </div>

              {importJobId && (
                <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-card) p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Import job</p>
                      <p className="mt-1 text-xs text-(--color-text-muted) break-all">
                        {importJobId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cancelImportMutation.mutate()}
                        disabled={
                          cancelImportMutation.isPending ||
                          ["completed", "failed", "cancelled"].includes(
                            String(importStatus?.state ?? "")
                          )
                        }
                        className="rounded-xl border border-(--color-border) px-3 py-2 text-xs font-medium hover:bg-(--color-elevated) disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => downloadImportErrorsMutation.mutate()}
                        disabled={
                          downloadImportErrorsMutation.isPending ||
                          !importStatus ||
                          (importStatus.errorCount ?? 0) <= 0
                        }
                        className="rounded-xl bg-(--color-elevated) px-3 py-2 text-xs font-medium hover:bg-(--color-border) disabled:opacity-50"
                      >
                        Download errors
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-(--color-elevated)">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{
                          width: `${Math.max(0, Math.min(100, Number(importStatus?.progress ?? (String(importStatus?.state ?? "") === "completed" ? 100 : 0))))}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-(--color-text-muted)">
                      Status: {String(importStatus?.state ?? "queued")}
                      {typeof importStatus?.processedRows === "number"
                        ? ` · ${importStatus.processedRows.toLocaleString()} processed`
                        : ""}
                      {typeof importStatus?.createdCount === "number"
                        ? ` · ${importStatus.createdCount.toLocaleString()} created`
                        : ""}
                      {typeof importStatus?.updatedCount === "number"
                        ? ` · ${importStatus.updatedCount.toLocaleString()} updated`
                        : ""}
                      {typeof importStatus?.errorCount === "number"
                        ? ` · ${importStatus.errorCount.toLocaleString()} errors`
                        : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {importStep === "complete" && importResult && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-semibold">Import Complete</h2>
              <p className="mt-3 text-(--color-text-muted)">
                Successfully imported {importResult.success.toLocaleString()}{" "}
                profiles
                {importResult.failed > 0 && ` · ${importResult.failed} failed`}
              </p>
              <div className="mt-10 flex gap-3">
                <button
                  onClick={resetImport}
                  className="rounded-xl border border-(--color-border) px-5 py-2.5 text-sm font-medium hover:bg-(--color-card)"
                >
                  Import More
                </button>
                {importJobId && importResult.failed > 0 && (
                  <button
                    onClick={() => downloadImportErrorsMutation.mutate()}
                    disabled={downloadImportErrorsMutation.isPending}
                    className="rounded-xl border border-(--color-border) px-5 py-2.5 text-sm font-medium hover:bg-(--color-card) disabled:opacity-50"
                  >
                    Download errors
                  </button>
                )}
                <Link
                  href="/audience"
                  className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  View Audience
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
