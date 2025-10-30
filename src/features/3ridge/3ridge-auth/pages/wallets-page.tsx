"use client";

import { Plus, Search, Shield, Wallet, Zap } from "lucide-react";
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
  RecentConnectionItem,
  WalletProviderCard,
  ZKSyncConfigForm,
} from "@/3ridge/3ridge-auth/components";
import { recentConnections, walletProviders } from "@/3ridge/3ridge-auth/data";

export function WalletsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Wallet Authentication
          </h1>
          <p className="text-pretty text-muted-foreground">
            Manage Web3 wallet providers with zk-sync verification
          </p>
        </div>
        <Button className="gap-2 sm:shrink-0">
          <Plus className="h-4 w-4" />
          Add Provider
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Connections"
          value="32,298"
          description="+12.5% from last month"
          icon={Wallet}
          borderColor="border-primary/20"
          bgGradient="bg-gradient-to-br from-primary/5 to-transparent"
        />
        <StatCard
          title="zk-Synced Wallets"
          value="28,764"
          description="89.1% verification rate"
          icon={Shield}
          iconColor="text-teal-500"
          borderColor="border-teal-500/20"
          bgGradient="bg-gradient-to-br from-teal-500/5 to-transparent"
        />
        <StatCard
          title="Active Sessions"
          value="1,847"
          description="Real-time connections"
          icon={Zap}
          iconColor="text-violet-500"
          borderColor="border-violet-500/20"
          bgGradient="bg-gradient-to-br from-violet-500/5 to-transparent"
        />
      </div>

      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="providers" className="whitespace-nowrap">
            Providers
          </TabsTrigger>
          <TabsTrigger value="recent" className="whitespace-nowrap">
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="zk-config" className="whitespace-nowrap">
            zk-Sync Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <CardTitle>Wallet Providers</CardTitle>
                  <CardDescription>
                    Configure and manage supported wallet providers
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64 sm:shrink-0">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search providers..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletProviders.map((provider) => (
                  <WalletProviderCard key={provider.name} {...provider} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Connections</CardTitle>
              <CardDescription>
                Latest wallet authentication attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentConnections.map((connection) => (
                  <RecentConnectionItem key={v7()} {...connection} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zk-config" className="space-y-4">
          <ZKSyncConfigForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
