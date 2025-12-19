"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, Brain, Trash2, Send } from "lucide-react";

interface SegmentsTabProps {
  savedSegments: any[];
  onDeleteSegment: (id: string) => void;
  openEmailComposer: (recipient: any | null) => void;
}

export function SegmentsTab({ savedSegments, onDeleteSegment, openEmailComposer }: SegmentsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

  const filteredSegments = useMemo(
    () => savedSegments.filter((seg) => seg.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [savedSegments, searchQuery]
  );

  const selectedSegment = savedSegments.find((s: any) => s.id === selectedSegmentId);

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search segments..."
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link
            href="/intelligence/segments/create"
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
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
                <span className="text-xs text-muted-foreground">{filteredSegments.length} results</span>
                <div className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs">
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px]">email matched</span>
                  <span className="text-muted-foreground">84%</span>
                </div>
              </div>
            </div>
          </div>

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
              {filteredSegments.map((segment: any, i: number) => (
                <tr
                  key={segment.id}
                  className={`border-b border-border/50 transition-colors ${
                    selectedSegmentId === segment.id ? "bg-indigo-500/5" : "hover:bg-secondary/30"
                  }`}
                  onClick={() => setSelectedSegmentId(segment.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                        <Brain className="h-4 w-4" />
                      </div>
                      <div>
                        <Link href={`/intelligence/segments/detail/${segment.id}`} className="text-sm font-medium hover:underline">
                          {segment.name}
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-indigo-500/10 text-indigo-600">
                            Segment
                          </span>
                          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-600">
                            Emailable
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{segment.matchCount?.toLocaleString() || 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-sm font-medium text-emerald-600">84%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-emerald-600">{segment.revenue || "+$45k"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">2d ago</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSegment(segment.id);
                      }}
                      className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSegment && (
        <div className="w-[360px] shrink-0 space-y-4 hidden lg:block">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground">{selectedSegment.name}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Profiles</p>
                <p className="text-xl font-semibold">{selectedSegment.matchCount || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email Match</p>
                <p className="text-xl font-semibold text-emerald-600">84%</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => openEmailComposer(null)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
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
