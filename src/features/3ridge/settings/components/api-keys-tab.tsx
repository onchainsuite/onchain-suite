import { Key } from "lucide-react";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const apiKeys = [
  {
    name: "Production Key",
    key: "3r_prod_••••••••••••••••",
    created: "2024-01-01",
    lastUsed: "2 hours ago",
  },
  {
    name: "Development Key",
    key: "3r_dev_••••••••••••••••",
    created: "2024-01-10",
    lastUsed: "5 min ago",
  },
];

export function APIKeysTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for programmatic access
              </CardDescription>
            </div>
          </div>
          <Button>Create API Key</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {apiKeys.map((apiKey) => (
            <div
              key={v7()}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div>
                <p className="font-medium">{apiKey.name}</p>
                <p className="font-mono text-sm text-muted-foreground">
                  {apiKey.key}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created {apiKey.created} • Last used {apiKey.lastUsed}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Rotate
                </Button>
                <Button variant="ghost" size="sm">
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
