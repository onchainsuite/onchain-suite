"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  GeneralSettings,
  NotificationSettings,
  SecuritySettings,
  SessionSettings,
} from "@/3ridge/3ridge-auth/components";

export function AuthSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Authentication Settings
          </h1>
          <p className="text-pretty text-muted-foreground">
            Configure global authentication settings and security policies
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="general" className="whitespace-nowrap">
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="whitespace-nowrap">
            Security
          </TabsTrigger>
          <TabsTrigger value="sessions" className="whitespace-nowrap">
            Sessions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="whitespace-nowrap">
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <SessionSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
