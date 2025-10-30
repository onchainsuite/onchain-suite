import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AIDashboardBuilder,
  AISummaryCard,
  AlertHighlights,
  CrossChain,
  KPIGrid,
  LiveTracker,
  MiniChartWidgets,
} from "../components";

export function OnchainOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-balance">
          Overview Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Unified analytics and AI-powered insights
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="live">Live Tracker</TabsTrigger>
          <TabsTrigger value="cross-chain">Cross-Chain</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AIDashboardBuilder />
          <KPIGrid />
          <div className="grid gap-6 md:grid-cols-2">
            <AISummaryCard />
            <AlertHighlights />
          </div>
          <MiniChartWidgets />
        </TabsContent>

        <TabsContent value="live">
          <LiveTracker />
        </TabsContent>

        <TabsContent value="cross-chain">
          <CrossChain />
        </TabsContent>
      </Tabs>
    </div>
  );
}
