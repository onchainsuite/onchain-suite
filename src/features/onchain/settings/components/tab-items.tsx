import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  type ApiKey,
  type Integration,
  type IntegrationStatus,
  type SectionHeaderProps,
  type ToggleSettingProps,
} from "@/onchain/settings/types";

// Components
export function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-primary" />
      <CardTitle>{title}</CardTitle>
    </div>
  );
}

export function ToggleSetting({
  title,
  description,
  defaultChecked,
  disabled,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} disabled={disabled} />
    </div>
  );
}

export function ApiKeyItem({
  apiKey,
  onRevoke,
}: {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="font-mono text-sm font-semibold">{apiKey.key}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Created on {apiKey.createdDate}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{apiKey.status}</Badge>
        <Button variant="ghost" size="sm" onClick={() => onRevoke(apiKey.id)}>
          Revoke
        </Button>
      </div>
    </div>
  );
}

export function IntegrationInput({
  integration,
}: {
  integration: Integration;
}) {
  const getStatusVariant = (
    status: IntegrationStatus
  ): "secondary" | "outline" => {
    return status === "Connected" ? "secondary" : "outline";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={integration.id}>{integration.label}</Label>
      <div className="flex gap-2">
        <Input
          id={integration.id}
          type="password"
          placeholder={integration.placeholder}
          className="font-mono"
        />
        <Badge variant={getStatusVariant(integration.status)}>
          {integration.status}
        </Badge>
      </div>
    </div>
  );
}
