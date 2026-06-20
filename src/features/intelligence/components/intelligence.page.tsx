"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { intelligenceService } from "../intelligence.service";
import { QueryTab } from "./query";
import { ReportsTab } from "./reports";
import { SegmentsTab } from "./segments";

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState("chat");

  const metricsQuery = useQuery({
    queryKey: ["intelligence", "metrics"],
    queryFn: () => intelligenceService.getMetrics(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const segmentsMetricsQuery = useQuery({
    queryKey: ["intelligence", "segments", "metrics"],
    queryFn: () => intelligenceService.getSegmentsMetrics(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const reportsMetricsQuery = useQuery({
    queryKey: ["intelligence", "reports", "metrics"],
    queryFn: () => intelligenceService.getReportsMetrics(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const reportsSummaryQuery = useQuery({
    queryKey: ["intelligence", "reports", "summary"],
    queryFn: () => intelligenceService.getReportsSummary(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const openEmailComposer = useCallback((_recipient: unknown) => {
    // setEmailRecipient(recipient);
    // setShowEmailComposer(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analyze on-chain data and create targeted segments.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
            <span className="text-muted-foreground">Score</span>{" "}
            <span className="font-medium text-foreground">
              {typeof metricsQuery.data?.score === "number"
                ? metricsQuery.data.score
                : "—"}
            </span>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
            <span className="text-muted-foreground">Revenue</span>{" "}
            <span className="font-medium text-foreground">
              {typeof metricsQuery.data?.revenuePotential === "number"
                ? `$${metricsQuery.data.revenuePotential.toLocaleString()}`
                : "—"}
            </span>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
            <span className="text-muted-foreground">Segments</span>{" "}
            <span className="font-medium text-foreground">
              {typeof segmentsMetricsQuery.data?.segmentsCount === "number"
                ? segmentsMetricsQuery.data.segmentsCount.toLocaleString()
                : "—"}
            </span>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
            <span className="text-muted-foreground">Reports</span>{" "}
            <span className="font-medium text-foreground">
              {typeof (
                reportsMetricsQuery.data as Record<string, unknown> | undefined
              )?.reportsCount === "number"
                ? (
                    reportsMetricsQuery.data as { reportsCount: number }
                  ).reportsCount.toLocaleString()
                : typeof (
                      reportsSummaryQuery.data as
                        | Record<string, unknown>
                        | undefined
                    )?.summary === "string"
                  ? String(
                      (
                        reportsSummaryQuery.data as {
                          summary: string;
                        }
                      ).summary
                    )
                  : "—"}
            </span>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="rounded-xl border border-border bg-card p-1">
          <TabsTrigger value="chat" className="rounded-lg">
            Chat
          </TabsTrigger>
          <TabsTrigger value="sql" className="rounded-lg">
            SQL
          </TabsTrigger>
          <TabsTrigger value="segments" className="rounded-lg">
            Segments
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {typeof segmentsMetricsQuery.data?.segmentsCount === "number"
                ? segmentsMetricsQuery.data.segmentsCount
                : "—"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg">
            Reports
          </TabsTrigger>
        </TabsList>

        {activeTab === "chat" || activeTab === "sql" ? (
          <div className="space-y-4">
            <QueryTab
              activeSurface={activeTab === "chat" ? "chat" : "sql"}
              openEmailComposer={openEmailComposer}
              setActiveTab={setActiveTab}
            />
          </div>
        ) : null}

        <TabsContent value="segments" className="space-y-4">
          <SegmentsTab
            openEmailComposer={openEmailComposer}
            savedSegments={[]}
            onDeleteSegment={() => {}}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsTab setActiveTab={setActiveTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
