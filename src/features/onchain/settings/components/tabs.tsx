import { Bell, Database, Key, Save, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";

import {
  ApiKeyItem,
  IntegrationInput,
  SectionHeader,
  ToggleSetting,
} from "./tab-items";
import {
  apiKeys,
  integrations,
  networkOptions,
  notificationSettings,
  permissions,
} from "@/onchain/settings/data";
import { type UserRole } from "@/onchain/settings/types";

export function ProjectConfigTab({ onSave }: { onSave: () => void }) {
  return (
    <TabsContent value="project" className="space-y-6">
      <Card>
        <CardHeader>
          <SectionHeader icon={Database} title="Project Configuration" />
          <CardDescription>Basic project settings and metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input id="projectName" defaultValue="On3hain Analytics" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractAddress">Contract Address</Label>
            <Input
              id="contractAddress"
              placeholder="0x..."
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Token Symbol</Label>
            <Input id="token" placeholder="ETH" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="network">Default Network</Label>
            <Select defaultValue="ethereum">
              <SelectTrigger id="network">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {networkOptions.map((network) => (
                  <SelectItem key={network.value} value={network.value}>
                    {network.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export function IntegrationsTab({ onSave }: { onSave: () => void }) {
  return (
    <TabsContent value="integrations" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integration Keys</CardTitle>
          <CardDescription>
            Manage third-party service integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <IntegrationInput key={integration.id} integration={integration} />
          ))}
          <Button onClick={onSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Keys
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export function ApiKeysTab({
  onRevoke,
  onGenerate,
}: {
  onRevoke: (id: string) => void;
  onGenerate: () => void;
}) {
  return (
    <TabsContent value="api" className="space-y-6">
      <Card>
        <CardHeader>
          <SectionHeader icon={Key} title="API Key Management" />
          <CardDescription>
            Create and manage API keys for programmatic access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <ApiKeyItem key={apiKey.id} apiKey={apiKey} onRevoke={onRevoke} />
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={onGenerate}
          >
            Generate New API Key
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export function AccessControlTab({
  role,
  onRoleChange,
}: {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}) {
  return (
    <TabsContent value="access" className="space-y-6">
      <Card>
        <CardHeader>
          <SectionHeader icon={Shield} title="Role-Based Access Control" />
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Your Role</Label>
            <Select value={role} onValueChange={onRoleChange}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-3">
            <h3 className="text-sm font-semibold">Permissions</h3>
            <div className="space-y-3">
              {permissions.map((permission) => (
                <ToggleSetting
                  key={permission.id}
                  title={permission.title}
                  description={permission.description}
                  defaultChecked={permission.defaultChecked}
                  disabled={
                    permission.disabled ? permission.disabled(role) : false
                  }
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export function NotificationsTab({ onSave }: { onSave: () => void }) {
  return (
    <TabsContent value="notifications" className="space-y-6">
      <Card>
        <CardHeader>
          <SectionHeader icon={Bell} title="Notification Preferences" />
          <CardDescription>
            Configure how you receive alerts and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {notificationSettings.map((setting) => (
              <ToggleSetting
                key={setting.id}
                title={setting.title}
                description={setting.description}
                defaultChecked={setting.defaultChecked}
              />
            ))}
          </div>

          <div className="pt-4 space-y-2">
            <Label htmlFor="email">Notification Email</Label>
            <Input id="email" type="email" defaultValue="admin@on3hain.com" />
          </div>

          <Button onClick={onSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
