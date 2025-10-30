"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  APIKeysTab,
  AppearanceSettingsTab,
  GeneralSettingsTab,
  NotificationSettingsTab,
  OrganizationSettingsTab,
  SecuritySettingsTab,
  TeamSettingsTab,
} from "@/3ridge/settings/components";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-pretty text-muted-foreground">
            Manage your project settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="general" className="whitespace-nowrap">
            General
          </TabsTrigger>
          <TabsTrigger value="organization" className="whitespace-nowrap">
            Organization
          </TabsTrigger>
          <TabsTrigger value="team" className="whitespace-nowrap">
            Team
          </TabsTrigger>
          <TabsTrigger value="notifications" className="whitespace-nowrap">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="whitespace-nowrap">
            Security
          </TabsTrigger>
          <TabsTrigger value="api" className="whitespace-nowrap">
            API Keys
          </TabsTrigger>
          <TabsTrigger value="appearance" className="whitespace-nowrap">
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettingsTab />
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <OrganizationSettingsTab />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <TeamSettingsTab />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettingsTab />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecuritySettingsTab />
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <APIKeysTab />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <AppearanceSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
