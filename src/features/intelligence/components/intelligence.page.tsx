"use client";

import { useCallback, useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { type Segment } from "../types";
import { QueryTab } from "./query";
import { ReportsTab } from "./reports";
import { SegmentsTab } from "./segments";

const initialSegments: Segment[] = [
  { name: "Base Whales", profiles: 342, revenue: "+$127k", id: "1" },
  { name: "Active Traders", profiles: 1847, revenue: "+$89k", id: "2" },
  { name: "NFT Collectors", profiles: 2341, revenue: "+$45k", id: "3" },
];

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState("query");
  const [savedSegments, setSavedSegments] =
    useState<Segment[]>(initialSegments);

  useEffect(() => {
    const stored = localStorage.getItem("saved-segments");
    if (stored) {
      setSavedSegments(JSON.parse(stored));
    }
  }, []);

  const handleDeleteSegment = useCallback(
    (id: string) => {
      const newSegments = savedSegments.filter((s) => s.id !== id);
      setSavedSegments(newSegments);
      localStorage.setItem("saved-segments", JSON.stringify(newSegments));
    },
    [savedSegments]
  );

  const openEmailComposer = useCallback((_recipient: unknown) => {
    // setEmailRecipient(recipient);
    // setShowEmailComposer(true);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Intelligence
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Analyze on-chain data and create targeted segments.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="rounded-xl border border-border bg-card p-1">
          <TabsTrigger value="query" className="rounded-lg">
            Query
          </TabsTrigger>
          <TabsTrigger value="segments" className="rounded-lg">
            Segments
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {savedSegments.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="space-y-4">
          <QueryTab
            openEmailComposer={openEmailComposer}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <SegmentsTab
            savedSegments={savedSegments}
            onDeleteSegment={handleDeleteSegment}
            openEmailComposer={openEmailComposer}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsTab setActiveTab={setActiveTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
