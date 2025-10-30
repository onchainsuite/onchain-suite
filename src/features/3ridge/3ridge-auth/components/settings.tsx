import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

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
import { Switch } from "@/components/ui/switch";

// Types
export interface SettingSwitchProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

export interface SettingInputProps {
  label: string;
  type?: "text" | "email" | "number" | "password";
  defaultValue?: string;
  placeholder?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SettingSelectProps {
  label: string;
  defaultValue: string;
  options: SelectOption[];
}

export interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
  onSave: () => void;
}

// Reusable Components
export function SettingSwitch({
  label,
  description,
  defaultChecked = false,
}: SettingSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

export function SettingInput({
  label,
  type = "text",
  defaultValue,
  placeholder,
}: SettingInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}

export function SettingSelect({
  label,
  defaultValue,
  options,
}: SettingSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
  onSave,
}: SettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        <Button className="w-full" onClick={onSave}>
          Save {title}
        </Button>
      </CardContent>
    </Card>
  );
}
