"use client";

import { Activity, CheckCircle2, Shield, Webhook } from "lucide-react";

import { StatCard } from "@/ui/stat-card";

import {
  AIBuilderCard,
  RecentEventsCard,
  RecentUsersTable,
  SystemHealthCard,
} from "@/3ridge/overview/components";

export function BridgeOverview() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* AI Builder Hero Section */}
      <AIBuilderCard />

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="24,583"
          icon={Activity}
          trend={{ value: "+12.5%", label: "from last month" }}
        />
        <StatCard
          title="Active Sessions"
          value="1,429"
          icon={Shield}
          trend={{ value: "+8.2%", label: "from last hour" }}
        />
        <StatCard
          title="Webhooks Sent"
          value="89,234"
          icon={Webhook}
          trend={{ value: "+23.1%", label: "from last week" }}
        />
        <StatCard
          title="Proofs Verified"
          value="12,847"
          icon={CheckCircle2}
          trend={{ value: "+15.7%", label: "from last week" }}
        />
      </div>

      {/* Recent Users Table */}
      <RecentUsersTable />

      {/* Recent Events & Integrations */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentEventsCard />
        <SystemHealthCard />
      </div>
    </div>
  );
}
