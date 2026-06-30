"use client";

import {
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { intelligenceService } from "../intelligence.service";
import { CreditMeter } from "./credit-meter";
import { EnrichmentControl } from "./enrichment-control";
import { QueryTab } from "./query";
import { ReportsTab } from "./reports";
import { SegmentsTab } from "./segments";

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState("chat");

  const segmentsMetricsQuery = useQuery({
    queryKey: ["intelligence", "segments", "metrics"],
    queryFn: () => intelligenceService.getSegmentsMetrics(),
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
        <div className="flex items-center gap-2">
          <CreditMeter />
          <EnrichmentControl />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="h-auto gap-1 rounded-2xl border border-border bg-card p-1.5">
          <TabsTrigger
            value="chat"
            className="gap-2 rounded-xl px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_10px_28px_-14px_rgba(86,112,255,0.9)]"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden="true" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="sql"
            className="gap-2 rounded-xl px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_10px_28px_-14px_rgba(86,112,255,0.9)]"
          >
            <CodeBracketIcon className="h-4 w-4" aria-hidden="true" />
            SQL
          </TabsTrigger>
          <TabsTrigger
            value="segments"
            className="gap-2 rounded-xl px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_10px_28px_-14px_rgba(86,112,255,0.9)]"
          >
            <UserGroupIcon className="h-4 w-4" aria-hidden="true" />
            Segments
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground data-[state=active]:bg-primary-foreground/20">
              {typeof segmentsMetricsQuery.data?.segmentsCount === "number"
                ? segmentsMetricsQuery.data.segmentsCount
                : "—"}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="gap-2 rounded-xl px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_10px_28px_-14px_rgba(86,112,255,0.9)]"
          >
            <ArrowTrendingUpIcon className="h-4 w-4" aria-hidden="true" />
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
