"use client";

import { Brain, Plus, Search, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  intelligenceService,
  type IntelligenceSegment,
} from "../../intelligence.service";
import { type Segment } from "../../types";

interface SegmentsTabProps {
  openEmailComposer: (recipient: unknown | null) => void;
  savedSegments?: Segment[];
  onDeleteSegment?: (segmentId: string) => void;
}

const toUiSegment = (input: IntelligenceSegment): Segment => {
  const size =
    typeof input.size === "number"
      ? input.size
      : typeof input.matchCount === "number"
        ? input.matchCount
        : undefined;
  const lastUpdated =
    typeof input.updatedAt === "string"
      ? input.updatedAt
      : typeof input.lastUsedAt === "string"
        ? input.lastUsedAt
        : undefined;
  return {
    id: input.id,
    name: input.name,
    matchCount: size,
    lastUpdated,
    isEmailable: true,
  };
};

export function SegmentsTab({ openEmailComposer }: SegmentsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
    null
  );

  const queryClient = useQueryClient();
  const normalizedSearch = searchQuery.trim();

  const segmentsQuery = useQuery({
    queryKey: ["intelligence", "segments", { search: normalizedSearch }],
    queryFn: async () => {
      const res = await intelligenceService.listSegments({
        search: normalizedSearch.length > 0 ? normalizedSearch : undefined,
        page: 1,
        limit: 100,
      });
      const root = Array.isArray(res)
        ? res
        : ((res as { items?: IntelligenceSegment[] }).items ?? []);
      return (Array.isArray(root) ? root : []).map(toUiSegment);
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const selectedSegment = useMemo(
    () => segmentsQuery.data?.find((seg) => seg.id === selectedSegmentId),
    [segmentsQuery.data, selectedSegmentId]
  );

  const deleteMutation = useMutation({
    mutationFn: async (segmentId: string) => {
      await intelligenceService.deleteSegment(segmentId);
    },
    onSuccess: async () => {
      setSelectedSegmentId(null);
      await queryClient.invalidateQueries({
        queryKey: ["intelligence", "segments"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["intelligence", "segments", "metrics"],
      });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to delete segment";
      window.alert(message);
    },
  });

  const segmentDetailQuery = useQuery({
    queryKey: ["intelligence", "segments", selectedSegmentId],
    queryFn: async () => {
      if (!selectedSegmentId) return null;
      return intelligenceService.getSegment(selectedSegmentId);
    },
    enabled: !!selectedSegmentId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const segmentSize =
    typeof segmentDetailQuery.data?.size === "number"
      ? segmentDetailQuery.data.size
      : (selectedSegment?.matchCount ?? 0);

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search segments..."
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link
            href="/intelligence/segments/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            New segment
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Saved Segments</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {(segmentsQuery.data?.length ?? 0).toLocaleString()} results
                </span>
              </div>
            </div>
          </div>

          {(segmentsQuery.data?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                <Brain className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No segments yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {searchQuery.length > 0
                  ? "Try a different search term."
                  : "Create your first segment to start targeting the right users."}
              </p>
              {searchQuery.length === 0 && (
                <Link
                  href="/intelligence/segments/create"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  New segment
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full hidden md:table">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Profiles</th>
                  <th className="px-4 py-3">Match Rate</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(segmentsQuery.data ?? []).map((segment) => (
                  <tr
                    key={segment.id}
                    className={`border-b border-border/50 transition-colors ${
                      selectedSegmentId === segment.id
                        ? "bg-primary/5"
                        : "hover:bg-secondary/30"
                    } cursor-pointer`}
                    onClick={() => setSelectedSegmentId(segment.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedSegmentId(segment.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Brain className="h-4 w-4" />
                        </div>
                        <div>
                          <Link
                            href={`/intelligence/segments/detail/${segment.id}`}
                            className="text-sm font-medium hover:underline"
                          >
                            {segment.name}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                              Segment
                            </span>
                            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                              Emailable
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">
                        {(segment.matchCount ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-secondary">
                          <div className="h-full rounded-full bg-primary" />
                        </div>
                        <span className="text-sm font-medium text-primary">
                          —
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-primary">
                        {segment.revenue ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {segment.lastUpdated ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const ok = window.confirm(
                            `Delete segment "${segment.name}"? This cannot be undone.`
                          );
                          if (!ok) return;
                          deleteMutation.mutate(segment.id);
                        }}
                        disabled={deleteMutation.isPending}
                        className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedSegment && (
        <div className="w-[360px] shrink-0 space-y-4 hidden lg:block">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground">
              {selectedSegment.name}
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Profiles</p>
                <p className="text-xl font-semibold">
                  {segmentSize.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email Match</p>
                <p className="text-xl font-semibold text-secondary-foreground">
                  —
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => openEmailComposer(null)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
                Send Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
