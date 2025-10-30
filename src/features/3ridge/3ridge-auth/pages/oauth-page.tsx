"use client";
import { Plus, Settings2, Shield, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  OAuthConfigSettings,
  ProviderCard,
  ZKSyncConfig,
} from "@/3ridge/3ridge-auth/components";
import { oauthProviders } from "@/3ridge/3ridge-auth/data";

export function OAuthPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            OAuth Authentication
          </h1>
          <p className="text-pretty text-muted-foreground">
            Manage social login providers with zk-sync verification
          </p>
        </div>
        <Button className="gap-2 sm:shrink-0">
          <Plus className="h-4 w-4" />
          Add Provider
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="OAuth Connections"
          value="39,611"
          description="+15.3% from last month"
          icon={Shield}
          variant="primary"
        />
        <StatCard
          title="Active Providers"
          value="3"
          description="Google, GitHub, Twitter"
          icon={Settings2}
          variant="teal"
        />
        <StatCard
          title="Success Rate"
          value="96.8%"
          description="+2.1% improvement"
          icon={TrendingUp}
          variant="violet"
        />
      </div>

      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="providers" className="whitespace-nowrap">
            Providers
          </TabsTrigger>
          <TabsTrigger value="configuration" className="whitespace-nowrap">
            Configuration
          </TabsTrigger>
          <TabsTrigger value="zk-config" className="whitespace-nowrap">
            zk-Sync Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {oauthProviders.map((provider) => (
              <ProviderCard key={provider.name} {...provider} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <OAuthConfigSettings />
        </TabsContent>

        <TabsContent value="zk-config" className="space-y-4">
          <ZKSyncConfig
            title="zk-Sync OAuth Configuration"
            description="Configure zero-knowledge proof verification for OAuth authentication"
            authType="oauth"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
