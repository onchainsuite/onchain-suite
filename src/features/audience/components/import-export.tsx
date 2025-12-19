"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileJson,
  FileText,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useRef, useState } from "react";

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

const recentExports = [
  {
    name: "all_profiles_nov2025.csv",
    date: "Nov 28, 2025",
    size: "2.4 MB",
    status: "completed",
  },
  {
    name: "high_value_segment.json",
    date: "Nov 25, 2025",
    size: "856 KB",
    status: "completed",
  },
];

const recentImports = [
  {
    name: "newsletter_subscribers.csv",
    date: "Nov 27, 2025",
    records: 1247,
    status: "completed",
  },
  {
    name: "wallet_list.json",
    date: "Nov 22, 2025",
    records: 589,
    status: "failed",
  },
];

type ImportStep = "upload" | "mapping" | "complete";
type ActiveTab = "import" | "export";

interface CSVColumn {
  header: string;
  sample: string[];
  mappedTo: string;
}

const steps = [
  { id: "upload", label: "Upload" },
  { id: "mapping", label: "Map Fields" },
  { id: "complete", label: "Complete" },
];

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

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
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const columns = parseCSV(text);
      setCsvColumns(columns);
      setImportStep("mapping");
    };
    reader.readAsText(file);
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

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setImportResult({ success: 1247, failed: 3 });
      setImportStep("complete");
    }, 2000);
  };

  const resetImport = () => {
    setImportStep("upload");
    setUploadedFile(null);
    setCsvColumns([]);
    setImportResult(null);
  };

  const mappedCount = csvColumns.filter((c) => c.mappedTo).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen gap-2 bg-(--color-background) p-2 text-(--color-text) md:gap-4 md:p-4"
    >
      <main className="flex-1 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
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

                  {recentImports.length > 0 && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-sm font-medium text-(--color-text-muted)">
                        Recent Imports
                      </h3>
                      <div className="space-y-2">
                        {recentImports.map((file) => (
                          <div
                            key={file.name}
                            className="flex items-center justify-between rounded-xl border border-(--color-border) bg-(--color-card) p-4"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-(--color-text-muted)" />
                              <div>
                                <p className="text-sm font-medium">
                                  {file.name}
                                </p>
                                <p className="text-xs text-(--color-text-muted)">
                                  {file.date} · {file.records.toLocaleString()}{" "}
                                  records
                                </p>
                              </div>
                            </div>
                            {file.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {activeTab === "export" && (
                <section>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button className="group flex items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-card) p-6 text-left transition-all hover:border-primary/50 hover:bg-primary/5">
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
                    <button className="group flex items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-card) p-6 text-left transition-all hover:border-primary/50 hover:bg-primary/5">
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

                  {recentExports.length > 0 && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-sm font-medium text-(--color-text-muted)">
                        Recent Exports
                      </h3>
                      <div className="space-y-2">
                        {recentExports.map((file) => (
                          <div
                            key={file.name}
                            className="flex items-center justify-between rounded-xl border border-(--color-border) bg-(--color-card) p-4"
                          >
                            <div className="flex items-center gap-3">
                              {file.name.endsWith(".csv") ? (
                                <FileText className="h-5 w-5 text-(--color-text-muted)" />
                              ) : (
                                <FileJson className="h-5 w-5 text-(--color-text-muted)" />
                              )}
                              <div>
                                <p className="text-sm font-medium">
                                  {file.name}
                                </p>
                                <p className="text-xs text-(--color-text-muted)">
                                  {file.date} · {file.size}
                                </p>
                              </div>
                            </div>
                            <button className="rounded-lg p-2 text-(--color-text-muted) transition-colors hover:bg-(--color-card) hover:text-(--color-text)">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </motion.div>
          )}

          {importStep === "mapping" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Map CSV Columns</h2>
                  <p className="mt-1 text-sm text-(--color-text-muted)">
                    {uploadedFile?.name} · {mappedCount} of {csvColumns.length}{" "}
                    columns mapped
                  </p>
                </div>
                <button
                  onClick={resetImport}
                  className="rounded-xl p-2 text-(--color-text-muted) transition-colors hover:bg-(--color-card)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

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

              <div className="mt-8 flex items-center justify-between border-t border-(--color-border) pt-6">
                <p className="text-sm text-(--color-text-muted)">
                  {mappedCount > 0
                    ? `Ready to import ${mappedCount} fields`
                    : "Map at least one column to continue"}
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
                    disabled={mappedCount === 0 || isImporting}
                    className="rounded-xl bg-emerald-500 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isImporting ? "Importing..." : "Import Data"}
                  </button>
                </div>
              </div>
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
