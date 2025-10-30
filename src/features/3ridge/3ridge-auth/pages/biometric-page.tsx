"use client";
import { Fingerprint, Shield, Smartphone, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  BiometricMethodCard,
  BiometricSecuritySettings,
  ZKSyncConfig,
} from "@/3ridge/3ridge-auth/components";
import { biometricMethods } from "@/3ridge/3ridge-auth/data";

export function BiometricPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Biometric Authentication
          </h1>
          <p className="text-pretty text-muted-foreground">
            Manage biometric authentication with zk-sync verification
          </p>
        </div>
        <Button className="gap-2 sm:shrink-0">
          <Shield className="h-4 w-4" />
          Security Settings
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Biometric Users"
          value="20,557"
          description="+18.2% from last month"
          icon={Fingerprint}
          variant="primary"
        />
        <StatCard
          title="Success Rate"
          value="98.4%"
          description="Industry-leading accuracy"
          icon={TrendingUp}
          variant="teal"
        />
        <StatCard
          title="Active Methods"
          value="3"
          description="Fingerprint, Face ID, Touch ID"
          icon={Smartphone}
          variant="violet"
        />
      </div>

      <Tabs defaultValue="methods" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="methods" className="whitespace-nowrap">
            Methods
          </TabsTrigger>
          <TabsTrigger value="security" className="whitespace-nowrap">
            Security
          </TabsTrigger>
          <TabsTrigger value="zk-config" className="whitespace-nowrap">
            zk-Sync Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {biometricMethods.map((method) => (
              <BiometricMethodCard key={method.name} {...method} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <BiometricSecuritySettings />
        </TabsContent>

        <TabsContent value="zk-config" className="space-y-4">
          <ZKSyncConfig
            title="zk-Sync Biometric Configuration"
            description="Configure zero-knowledge proof verification for biometric authentication"
            authType="biometric"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
