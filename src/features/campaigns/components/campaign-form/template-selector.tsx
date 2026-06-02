"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Check,
  FileText,
  Grid3x3,
  LayoutList,
  MoreVertical,
  Plus,
  Search,
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
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";

import { cn, getSelectedOrganizationId } from "@/lib/utils";

import type { CampaignFormData } from "../../validations";
import { templatesService } from "@/features/templates/templates.service";

interface TemplateSelectorProps {
  form: UseFormReturn<CampaignFormData>;
  onCreateEditor?: () => void;
  onSelectTemplate?: (templateId: string) => void;
}

type SortMode = "used" | "recent" | "oldest" | "name";
type TabMode = "library" | "saved";

type TemplateCard = {
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

  const templates = useMemo<TemplateCard[]>(() => {
    if (!templatesQuery.isSuccess) return [];
    if (!Array.isArray(templatesQuery.data)) return [];

    const mapped = templatesQuery.data.map((t) => ({
      id: t.id,
      title: t.name,
      updatedAtMs: t.updatedAt ? new Date(t.updatedAt).getTime() : 0,
      date: t.updatedAt ? new Date(t.updatedAt).toLocaleString() : "Saved",
      preview: t.previewUrl ?? "",
    }));

    const byId = new Map(mapped.map((t) => [t.id, t]));

    if (sortMode === "used") {
      const usedSorted = Object.entries(recents)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => byId.get(id))
        .filter((t): t is TemplateCard => Boolean(t));
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

  const recentTemplates = useMemo<TemplateCard[]>(() => {
    if (templates.length === 0) return [];
    const byId = new Map(templates.map((t) => [t.id, t]));
    return Object.entries(recents)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => byId.get(id))
      .filter((t): t is TemplateCard => Boolean(t))
      .slice(0, 6);
  }, [recents, templates]);

  const markTemplateUsed = (templateId: string) => {
    const next = { ...readRecents(), [templateId]: Date.now() };
    writeRecents(next);
    setRecents(next);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Templates
          </h2>
          <div className="text-sm text-muted-foreground">
            {tab === "library"
              ? "Browse recommended templates from the public Email Library."
              : "Manage templates you’ve created and saved."}
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
          <Button
            type="button"
            onClick={onCreateEditor}
            className="w-full rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create template
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0 rounded-xl">
            <MoreVertical className="h-4 w-4" />
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
                  <button
                    key={temp.id}
                    type="button"
                    onClick={() => {
                      markTemplateUsed(temp.id);
                      form.setValue("selectedTemplate", temp.id);
                      onSelectTemplate?.(temp.id);
                    }}
                    className={cn(
                      "group relative w-[220px] shrink-0 overflow-hidden rounded-2xl border-2 bg-card text-left transition-all duration-300 hover:shadow-lg",
                      selectedTemplate === temp.id
                        ? "border-primary shadow-lg ring-2 ring-primary/20"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <div className="aspect-3/2 bg-muted relative overflow-hidden">
                      <Image
                        src={temp.preview || "/placeholder.svg"}
                        alt={temp.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {selectedTemplate === temp.id ? (
                        <div className="absolute top-3 right-3 bg-primary rounded-full p-1.5 shadow-lg">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      ) : null}
                    </div>
                    <div className="p-3">
                      <div className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {temp.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {temp.date}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "library" ? (
            <div className="text-sm font-medium text-foreground">
              Public Email Library
            </div>
          ) : (
            <div className="text-sm font-medium text-foreground">
              Email Saved
            </div>
          )}

          <div
            className={cn(
              "gap-4 transition-all duration-300",
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2"
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
                  "group cursor-pointer rounded-2xl border-2 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg",
                  selectedTemplate === temp.id
                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className="aspect-3/2 bg-muted relative overflow-hidden">
                  <Image
                    src={temp.preview || "/placeholder.svg"}
                    alt={temp.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {selectedTemplate === temp.id ? (
                    <div className="absolute top-3 right-3 bg-primary rounded-full p-1.5 shadow-lg">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  ) : null}
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {temp.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{temp.date}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
