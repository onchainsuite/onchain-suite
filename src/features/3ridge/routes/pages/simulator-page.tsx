"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AuthFlowTestingTab,
  EventSimulationTab,
  SimulatorPageHeader,
  SimulatorStats,
  WebhookTestingTab,
} from "../components";
import { type SimulationResult } from "@/3ridge/routes/types";

export function SimulatorPage() {
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);

  const runSimulation = () => {
    setSimulationResult({
      status: "success",
      statusCode: 200,
      responseTime: "142ms",
      response: {
        event: "auth.login",
        user: "0x742d...3f4a",
        timestamp: new Date().toISOString(),
        metadata: {
          method: "wallet",
          ip: "192.168.1.1",
          device: "Chrome on macOS",
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <SimulatorPageHeader />
      <SimulatorStats />

      <Tabs defaultValue="event" className="space-y-4">
        <TabsList>
          <TabsTrigger value="event">Event Simulation</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Testing</TabsTrigger>
          <TabsTrigger value="flow">Auth Flow Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="event" className="space-y-4">
          <EventSimulationTab onRun={runSimulation} result={simulationResult} />
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <WebhookTestingTab />
        </TabsContent>

        <TabsContent value="flow" className="space-y-4">
          <AuthFlowTestingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
