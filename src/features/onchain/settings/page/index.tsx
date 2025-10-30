/* eslint-disable no-console */
"use client";

import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AccessControlTab,
  ApiKeysTab,
  IntegrationsTab,
  NotificationsTab,
  ProjectConfigTab,
} from "@/onchain/settings/components";
import { type UserRole } from "@/onchain/settings/types";

export function SettingsPage() {
  const [role, setRole] = useState<UserRole>("admin");

  const handleSave = () => {
    console.log("Settings saved");
    // In a real app, show toast notification
  };

  const handleRevokeApiKey = (id: string) => {
    console.log("Revoking API key:", id);
    // In a real app, make API call to revoke key
  };

  const handleGenerateApiKey = () => {
    console.log("Generating new API key");
    // In a real app, make API call to generate key
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole as UserRole);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-balance">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your project configuration and preferences
        </p>
      </div>

      <Tabs defaultValue="project" className="space-y-6">
        <TabsList>
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <ProjectConfigTab onSave={handleSave} />
        <IntegrationsTab onSave={handleSave} />
        <ApiKeysTab
          onRevoke={handleRevokeApiKey}
          onGenerate={handleGenerateApiKey}
        />
        <AccessControlTab role={role} onRoleChange={handleRoleChange} />
        <NotificationsTab onSave={handleSave} />
      </Tabs>
    </div>
  );
}
