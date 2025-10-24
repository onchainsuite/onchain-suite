"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { HelpTooltip } from "../help-tooltip";

interface PreferenceItemProps {
  id: string;
  label: string;
  description: string;
  helpText: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function PreferenceItem({
  id,
  label,
  description,
  helpText,
  checked,
  onCheckedChange,
}: PreferenceItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <Label htmlFor={id}>{label}</Label>
          <HelpTooltip content={helpText} side="right" />
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
