"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReportsTab } from "./reports";
import { SegmentsTab } from "./segments";
import { QueryTab } from "./query";

const initialSegments = [
  { name: "Base Whales", profiles: 342, revenue: "+$127k", id: "1" },
  { name: "Active Traders", profiles: 1847, revenue: "+$89k", id: "2" },
  { name: "NFT Collectors", profiles: 2341, revenue: "+$45k", id: "3" },
];

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState("query");
  const [savedSegments, setSavedSegments] = useState<any[]>(initialSegments);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("saved-segments");
    if (stored) {
      setSavedSegments(JSON.parse(stored));
    }
  }, []);

  const handleDeleteSegment = useCallback((id: string) => {
    const newSegments = savedSegments.filter((s) => s.id !== id);
    setSavedSegments(newSegments);
    localStorage.setItem("saved-segments", JSON.stringify(newSegments));
  }, [savedSegments]);

  const openEmailComposer = useCallback((recipient: any) => {
    setEmailRecipient(recipient);
    setShowEmailComposer(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Intelligence</h1>
              <p className="text-muted-foreground">
                Analyze on-chain data and create targeted segments
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="segments">
                Segments
                <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {savedSegments.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="query" className="space-y-6">
              <QueryTab openEmailComposer={openEmailComposer} setActiveTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="segments" className="space-y-6">
              <SegmentsTab
                savedSegments={savedSegments}
                onDeleteSegment={handleDeleteSegment}
                openEmailComposer={openEmailComposer}
              />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <ReportsTab setActiveTab={setActiveTab} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
