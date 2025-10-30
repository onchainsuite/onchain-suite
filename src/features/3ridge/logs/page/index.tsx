"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  LogConfiguration,
  LogsStats,
  LogTabContent,
  PageHeader,
} from "@/3ridge/logs/components";
import { logs } from "@/3ridge/logs/data";

export function LogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader />
      <LogsStats />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all" className="whitespace-nowrap">
            All Logs
          </TabsTrigger>
          <TabsTrigger value="errors" className="whitespace-nowrap">
            Errors
          </TabsTrigger>
          <TabsTrigger value="warnings" className="whitespace-nowrap">
            Warnings
          </TabsTrigger>
          <TabsTrigger value="info" className="whitespace-nowrap">
            Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <LogTabContent
            title="Log Stream"
            description="Real-time system logs and events"
            logs={logs}
          />
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <LogTabContent
            title="Error Logs"
            description="Critical errors and failures"
            filterLevel="error"
            logs={logs}
          />
        </TabsContent>

        <TabsContent value="warnings" className="space-y-4">
          <LogTabContent
            title="Warning Logs"
            description="Warnings and potential issues"
            filterLevel="warning"
            logs={logs}
          />
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <LogTabContent
            title="Info Logs"
            description="General information and successful operations"
            filterLevel="info"
            logs={logs}
          />
        </TabsContent>
      </Tabs>

      <LogConfiguration />
    </div>
  );
}
