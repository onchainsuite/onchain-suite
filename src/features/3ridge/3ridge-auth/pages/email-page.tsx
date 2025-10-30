"use client";

import {
  CheckCircle2,
  Mail,
  Search,
  Settings2,
  TrendingUp,
} from "lucide-react";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  EmailActivityItem,
  EmailAuthSettings,
  EmailProviderSettings,
  EmailTemplatesList,
  ZKSyncConfig,
} from "@/3ridge/3ridge-auth/components";

const recentEmails = [
  {
    email: "user@example.com",
    type: "Verification",
    status: "delivered" as const,
    time: "1 min ago",
  },
  {
    email: "dev@startup.io",
    type: "Magic Link",
    status: "delivered" as const,
    time: "3 min ago",
  },
  {
    email: "admin@company.com",
    type: "Password Reset",
    status: "failed" as const,
    time: "8 min ago",
  },
  {
    email: "test@domain.com",
    type: "Verification",
    status: "delivered" as const,
    time: "15 min ago",
  },
];

export function EmailAuthPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Email Authentication
          </h1>
          <p className="text-pretty text-muted-foreground">
            Manage email-based authentication with zk-sync verification
          </p>
        </div>
        <Button className="gap-2 shrink-0">
          <Settings2 className="h-4 w-4" />
          Configure SMTP
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Emails Sent"
          value="45,892"
          description="+8.2% from last month"
          icon={Mail}
          variant="primary"
        />
        <StatCard
          title="Verified Accounts"
          value="38,234"
          description="+12.1% from last month"
          icon={CheckCircle2}
          variant="primary"
        />
        <StatCard
          title="Verification Rate"
          value="83.3%"
          description="+2.4% from last month"
          icon={TrendingUp}
          variant="primary"
        />
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="settings" className="whitespace-nowrap">
            Settings
          </TabsTrigger>
          <TabsTrigger value="templates" className="whitespace-nowrap">
            Templates
          </TabsTrigger>
          <TabsTrigger value="activity" className="whitespace-nowrap">
            Activity
          </TabsTrigger>
          <TabsTrigger value="zk-config" className="whitespace-nowrap">
            zk-Sync Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <EmailProviderSettings />
            <EmailAuthSettings />
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <EmailTemplatesList />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <CardTitle>Recent Email Activity</CardTitle>
                  <CardDescription>
                    Latest email authentication events
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search emails..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEmails.map((email) => (
                  <EmailActivityItem key={v7()} {...email} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zk-config" className="space-y-4">
          <ZKSyncConfig
            title="zk-Sync Email Verification"
            description="Configure zero-knowledge proof verification for email authentication"
            authType="email"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
