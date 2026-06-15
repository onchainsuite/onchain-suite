"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Check,
  FileText,
  Grid3x3,
  LayoutList,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";

import {
  cn,
  extractEmailContent,
  getSelectedOrganizationId,
  isJsonObject,
} from "@/lib/utils";

import type { CampaignFormData } from "../../validations";
import {
  templatesService,
  type TemplateItem,
} from "@/features/templates/templates.service";

interface TemplateSelectorProps {
  form: UseFormReturn<CampaignFormData>;
  onCreateEditor?: (opts?: { templateName?: string }) => void;
  onSelectTemplate?: (templateId: string) => void;
}

type SortMode = "used" | "recent" | "oldest" | "name";
type TabMode = "library" | "saved";

type TemplateRow = {
  raw: TemplateItem;
  id: string;
  title: string;
  updatedAtMs: number;
  date: string;
  preview: string;
};

const RECENTS_KEY = "onchain.templates.recents.v1";

const readRecents = (): Record<string, number> => {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(RECENTS_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const entries = Object.entries(parsed as Record<string, unknown>);
    const out: Record<string, number> = {};
    for (const [k, v] of entries) {
      if (typeof k !== "string" || k.trim().length === 0) continue;
      if (typeof v !== "number" || !Number.isFinite(v)) continue;
      out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
};

const writeRecents = (recents: Record<string, number>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  window.dispatchEvent(new Event("onchain:templates-recents"));
};

function TemplatesEmptyState({
  title,
  description,
  onCreate,
}: {
  title: string;
  description: string;
  onCreate?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {onCreate ? (
        <div className="mt-6 flex w-full max-w-xs">
          <Button
            type="button"
            onClick={onCreate}
            className="w-full rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Create first template
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function TemplateSelector({
  form,
  onCreateEditor,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [tab, setTab] = useState<TabMode>("library");
  const [sortMode, setSortMode] = useState<SortMode>("used");
  const [templateSearch, setTemplateSearch] = useState("");
  const [recents, setRecents] = useState<Record<string, number>>({});
  const [htmlCache, setHtmlCache] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const orgId = getSelectedOrganizationId();

  const selectedTemplate = form.watch("selectedTemplate");
  const templatesQuery = useQuery({
    queryKey: ["templates", "list", orgId, tab, templateSearch, sortMode],
    queryFn: () =>
      templatesService.list(
        templateSearch.trim().length > 0
          ? {
              search: templateSearch.trim(),
              sort: sortMode,
              folder: tab === "saved" ? "saved" : undefined,
              limit: 50,
            }
          : {
              sort: sortMode,
              folder: tab === "saved" ? "saved" : undefined,
              limit: 50,
            },
        orgId ?? undefined
      ),
    retry: false,
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  useEffect(() => {
    const onUpdate = () => templatesQuery.refetch();
    window.addEventListener("onchain:templates-updated", onUpdate);
    return () =>
      window.removeEventListener("onchain:templates-updated", onUpdate);
  }, [templatesQuery]);

  useEffect(() => {
    setRecents(readRecents());
    const onUpdate = () => setRecents(readRecents());
    window.addEventListener("storage", onUpdate);
    window.addEventListener("onchain:templates-recents", onUpdate);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("onchain:templates-recents", onUpdate);
    };
  }, []);

  const extractTemplateName = (raw: unknown): string => {
    const obj = isJsonObject(raw) ? raw : {};
    const name = obj.name ?? obj.title ?? "Untitled";
    return typeof name === "string" && name.trim().length > 0
      ? name.trim()
      : "Untitled";
  };

  const extractUpdatedAtMs = (raw: unknown): number => {
    const obj = isJsonObject(raw) ? raw : {};
    const updatedAt = obj.updatedAt ?? obj.createdAt ?? null;
    if (typeof updatedAt !== "string" || updatedAt.trim().length === 0)
      return 0;
    const ms = new Date(updatedAt).getTime();
    return Number.isFinite(ms) ? ms : 0;
  };

  const extractPreviewUrl = (raw: unknown): string => {
    return extractEmailContent(raw).previewUrl ?? "";
  };

  const formatTemplateDate = (raw: unknown): string => {
    const obj = isJsonObject(raw) ? raw : {};
    const updatedAt = obj.updatedAt ?? obj.createdAt ?? null;
    if (typeof updatedAt !== "string" || updatedAt.trim().length === 0) {
      return "Saved";
    }
    const dt = new Date(updatedAt);
    if (Number.isNaN(dt.getTime())) return "Saved";
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const extractHtmlFromTemplate = (raw: unknown): string => {
    return extractEmailContent(raw).html ?? "";
  };

  const templates = useMemo<TemplateRow[]>(() => {
    if (!templatesQuery.isSuccess) return [];
    if (!Array.isArray(templatesQuery.data)) return [];

    const mapped: TemplateRow[] = templatesQuery.data
      .filter((t): t is TemplateItem => Boolean(t && typeof t.id === "string"))
      .map((t) => ({
        raw: t,
        id: t.id,
        title: extractTemplateName(t),
        updatedAtMs: extractUpdatedAtMs(t),
        date: formatTemplateDate(t),
        preview: extractPreviewUrl(t),
      }))
      .filter((t) => t.id.trim().length > 0);

    const byId = new Map(mapped.map((t) => [t.id, t]));

    if (sortMode === "used") {
      const usedSorted = Object.entries(recents)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => byId.get(id))
        .filter((t): t is TemplateRow => Boolean(t));
      const remaining = mapped
        .filter((t) => !recents[t.id])
        .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
      return [...usedSorted, ...remaining];
    }

    if (sortMode === "name") {
      return mapped.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortMode === "oldest") {
      return mapped.sort((a, b) => a.updatedAtMs - b.updatedAtMs);
    }

    return mapped.sort((a, b) => b.updatedAtMs - a.updatedAtMs);
  }, [recents, sortMode, templatesQuery.data, templatesQuery.isSuccess]);

  const recentTemplates = useMemo<TemplateRow[]>(() => {
    if (templates.length === 0) return [];
    const byId = new Map(templates.map((t) => [t.id, t]));
    return Object.entries(recents)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => byId.get(id))
      .filter((t): t is TemplateRow => Boolean(t))
      .slice(0, 6);
  }, [recents, templates]);

  const markTemplateUsed = (templateId: string) => {
    const next = { ...readRecents(), [templateId]: Date.now() };
    writeRecents(next);
    setRecents(next);
  };

  const renameMutation = useMutation({
    mutationFn: async (payload: { id: string; name: string }) => {
      return templatesService.update(
        payload.id,
        { name: payload.name },
        orgId ?? undefined
      );
    },
    onSuccess: () => {
      window.dispatchEvent(new Event("onchain:templates-updated"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await templatesService.remove(id, orgId ?? undefined);
      return id;
    },
    onSuccess: () => {
      window.dispatchEvent(new Event("onchain:templates-updated"));
    },
  });

  const openPreview = async (template: { id: string; title: string }) => {
    setPreviewTitle(template.title);
    setPreviewHtml("");
    setPreviewOpen(true);
    setPreviewLoading(true);
    try {
      const full = await templatesService.get(template.id, orgId ?? undefined);
      const html = extractHtmlFromTemplate(full);
      setPreviewHtml(html);
      setHtmlCache((prev) =>
        html.length > 0 ? { ...prev, [template.id]: html } : prev
      );
    } catch {
      setPreviewHtml("");
    } finally {
      setPreviewLoading(false);
    }
  };

  const ensureHtmlCached = async (template: { id: string; raw: unknown }) => {
    if (htmlCache[template.id]) return;
    const fromRaw = extractHtmlFromTemplate(template.raw);
    if (fromRaw.trim().length > 0) {
      setHtmlCache((prev) => ({ ...prev, [template.id]: fromRaw }));
      return;
    }
    try {
      const full = await templatesService.get(template.id, orgId ?? undefined);
      const html = extractHtmlFromTemplate(full);
      if (html.trim().length > 0) {
        setHtmlCache((prev) => ({ ...prev, [template.id]: html }));
      }
    } catch {
      String("");
    }
  };

  return (
    <div className="space-y-6 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Templates</h2>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
          <Button
            type="button"
            onClick={() => {
              const suggested = String(
                form.getValues("emailSubject") ?? ""
              ).trim();
              setCreateName(suggested);
              setCreateOpen(true);
            }}
            className="w-full rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabMode)}
        className="w-full"
      >
        <TabsList className="bg-muted rounded-xl p-1 w-fit">
          <TabsTrigger
            value="library"
            className="rounded-lg data-[state=active]:bg-background"
          >
            Email Library
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="rounded-lg data-[state=active]:bg-background"
          >
            Email Saved
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={templateSearch}
            onChange={(e) => setTemplateSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-border bg-background transition-all duration-300"
          />
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={cn(
                "h-8 w-8 rounded-lg transition-all duration-300",
                viewMode === "grid" && "bg-background shadow-sm"
              )}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={cn(
                "h-8 w-8 rounded-lg transition-all duration-300",
                viewMode === "list" && "bg-background shadow-sm"
              )}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={sortMode}
            onValueChange={(v) => setSortMode(v as SortMode)}
          >
            <SelectTrigger className="h-10 w-[190px] rounded-xl border-border bg-background sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="used">Used most recently</SelectItem>
              <SelectItem value="recent">Edited most recently</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {templatesQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Loading templates...
        </div>
      ) : templatesQuery.isError ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="text-sm text-muted-foreground">
            Failed to load templates.
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => templatesQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        </div>
      ) : templates.length === 0 ? (
        templateSearch.trim().length > 0 ? (
          <TemplatesEmptyState
            title="No templates match your search"
            description="Try a different keyword or clear the search to see all templates."
          />
        ) : (
          <TemplatesEmptyState
            title={
              tab === "library"
                ? "No library templates"
                : "No saved templates yet"
            }
            description={
              tab === "library"
                ? "There are no public templates available right now."
                : "Create your first template to reuse it across campaigns."
            }
            onCreate={tab === "saved" ? onCreateEditor : undefined}
          />
        )
      ) : (
        <>
          {tab === "saved" && recentTemplates.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">
                Used most recently
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recentTemplates.map((temp) => (
                  <div
                    key={temp.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      markTemplateUsed(temp.id);
                      form.setValue("selectedTemplate", temp.id);
                      onSelectTemplate?.(temp.id);
                    }}
                    onMouseEnter={() => {
                      if (!temp.preview) ensureHtmlCached(temp);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        markTemplateUsed(temp.id);
                        form.setValue("selectedTemplate", temp.id);
                        onSelectTemplate?.(temp.id);
                      }
                    }}
                    className={cn(
                      "group relative w-[220px] shrink-0 overflow-hidden rounded-2xl border bg-card text-left transition-all duration-300 hover:shadow-lg",
                      selectedTemplate === temp.id
                        ? "border-primary shadow-lg ring-2 ring-primary/20"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      {temp.preview ? (
                        <Image
                          src={temp.preview || "/placeholder.svg"}
                          alt={temp.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : htmlCache[temp.id] ? (
                        <div className="absolute inset-0 bg-white overflow-hidden">
                          <iframe
                            title={`Template preview ${temp.title}`}
                            sandbox="allow-same-origin"
                            srcDoc={htmlCache[temp.id]}
                            className="absolute top-0 left-0 origin-top-left"
                            style={{
                              width: "600px",
                              height: "820px",
                              transform: "scale(0.32)",
                              transformOrigin: "top left",
                              border: "none",
                              pointerEvents: "none",
                            }}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                          Preview
                        </div>
                      )}
                      {selectedTemplate === temp.id ? (
                        <div className="absolute top-3 right-3 bg-primary rounded-full p-1.5 shadow-lg">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 border-t border-border px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-foreground">
                          {temp.title}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openPreview({ id: temp.id, title: temp.title });
                            }}
                          >
                            Preview
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              "gap-4 transition-all duration-300",
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                : "flex flex-col"
            )}
          >
            {templates.map((temp) => (
              <div
                key={temp.id}
                onClick={() => {
                  markTemplateUsed(temp.id);
                  form.setValue("selectedTemplate", temp.id);
                  onSelectTemplate?.(temp.id);
                }}
                onMouseEnter={() => {
                  if (!temp.preview) ensureHtmlCached(temp);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    markTemplateUsed(temp.id);
                    form.setValue("selectedTemplate", temp.id);
                    onSelectTemplate?.(temp.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className={cn(
                  "group cursor-pointer overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg",
                  selectedTemplate === temp.id
                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {temp.preview ? (
                    <Image
                      src={temp.preview || "/placeholder.svg"}
                      alt={temp.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : htmlCache[temp.id] ? (
                    <div className="absolute inset-0 bg-white overflow-hidden">
                      <iframe
                        title={`Template preview ${temp.title}`}
                        sandbox="allow-same-origin"
                        srcDoc={htmlCache[temp.id]}
                        className="absolute top-0 left-0 origin-top-left"
                        style={{
                          width: "600px",
                          height: "820px",
                          transform: "scale(0.32)",
                          transformOrigin: "top left",
                          border: "none",
                          pointerEvents: "none",
                        }}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                      Preview
                    </div>
                  )}
                  {selectedTemplate === temp.id ? (
                    <div className="absolute top-3 right-3 bg-primary rounded-full p-1.5 shadow-lg">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {temp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{temp.date}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview({ id: temp.id, title: temp.title });
                        }}
                      >
                        Preview
                      </DropdownMenuItem>
                      {tab === "saved" ? (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameId(temp.id);
                              setRenameValue(temp.title);
                              setRenameOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(temp.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewTitle || "Template preview"}</DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] overflow-hidden rounded-xl border border-border bg-white">
            {previewLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading preview…
              </div>
            ) : previewHtml.trim().length > 0 ? (
              <iframe
                title="Template HTML preview"
                sandbox="allow-same-origin allow-scripts"
                srcDoc={previewHtml}
                className="h-full w-full"
                style={{ border: "none" }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No preview available.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Name your template</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">
              Template name
            </div>
            <Input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="e.g. Welcome series – Email 1"
              className="h-10 rounded-xl bg-background"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              disabled={!onCreateEditor || createName.trim().length === 0}
              onClick={() => {
                const name = createName.trim();
                setCreateOpen(false);
                onCreateEditor?.({ templateName: name });
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename template</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">
              Template name
            </div>
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="h-10 rounded-xl bg-background"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setRenameOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              disabled={
                !renameId ||
                renameValue.trim().length === 0 ||
                renameMutation.isPending
              }
              onClick={() => {
                if (!renameId) return;
                const nextName = renameValue.trim();
                renameMutation.mutate(
                  { id: renameId, name: nextName },
                  {
                    onSuccess: () => {
                      setRenameOpen(false);
                      setRenameId(null);
                    },
                  }
                );
              }}
            >
              {renameMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
