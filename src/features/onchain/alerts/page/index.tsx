"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

import {
  AlertExplanationDialog,
  AlertsTable,
  AlertStatsSummary,
} from "@/onchain/alerts/components";
import { alerts } from "@/onchain/alerts/data";
import { type Alert, type FilterOption } from "@/onchain/alerts/types";

export function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");

  const filteredAlerts =
    filter === "all"
      ? alerts
      : alerts.filter((a) => a.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-balance">
          Smart Alert Center
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage automated alerts
        </p>
      </div>

      <AlertStatsSummary alerts={alerts} />

      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>Recent notifications and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as FilterOption)}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="snoozed">Snoozed</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-4">
              <AlertsTable
                alerts={filteredAlerts}
                onExplainClick={setSelectedAlert}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertExplanationDialog
        alert={selectedAlert}
        open={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
}
