"use client";

import { AlertTriangle, CheckCircle2, Plus, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

import { CreateRuleForm, EventRuleCard } from "@/3ridge/event/components";
import { eventRules } from "@/3ridge/event/data";

export function EventRulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Event Rules
          </h1>
          <p className="text-pretty text-muted-foreground">
            Configure automated actions based on authentication events
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Active Rules"
          value="12"
          description="4 inactive rules"
          icon={Zap}
          variant="primary"
        />
        <StatCard
          title="Rules Triggered"
          value="1,847"
          description="Last 30 days"
          icon={CheckCircle2}
          variant="teal"
        />
        <StatCard
          title="Blocked Events"
          value="234"
          description="Prevented attacks"
          icon={AlertTriangle}
          variant="red"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Rules</CardTitle>
          <CardDescription>
            Manage automated event-based rules and actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {eventRules.map((rule) => (
            <EventRuleCard key={rule.id} {...rule} />
          ))}
        </CardContent>
      </Card>

      <CreateRuleForm />
    </div>
  );
}
