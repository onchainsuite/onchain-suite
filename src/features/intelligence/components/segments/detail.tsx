"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Mail, TrendingUp } from "lucide-react";

export function SegmentDetailPage() {
  const params = useParams();
  const segmentId = params.id as string;
  const [segment, setSegment] = useState<any>(null);

  useEffect(() => {
    // Mock fetch segment
    const stored = localStorage.getItem("saved-segments");
    if (stored) {
      const segments = JSON.parse(stored);
      const found = segments.find((s: any) => s.id === segmentId);
      setSegment(found);
    }
  }, [segmentId]);

  if (!segment) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Segment not found</h2>
        <Link href="/intelligence" className="text-indigo-500 hover:underline">
          Back to Intelligence
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/intelligence"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{segment.name}</h1>
          <p className="text-sm text-muted-foreground">Segment Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Profiles</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{segment.profiles || segment.matchCount || 0}</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-500">{segment.revenue || "$0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
