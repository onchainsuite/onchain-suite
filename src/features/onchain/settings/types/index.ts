export type UserRole = "admin" | "partner" | "pro" | "standard";
export type ApiKeyStatus = "Active" | "Revoked";
export type IntegrationStatus = "Connected" | "Not Connected";

export interface ApiKey {
  id: string;
  key: string;
  createdDate: string;
  status: ApiKeyStatus;
}

export interface Integration {
  id: string;
  label: string;
  placeholder: string;
  status: IntegrationStatus;
}

export interface Permission {
  id: string;
  title: string;
  description: string;
  defaultChecked: boolean;
  disabled?: (role: UserRole) => boolean;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}

export interface NetworkOption {
  value: string;
  label: string;
}

export interface SectionHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

export interface ToggleSettingProps {
  title: string;
  description: string;
  defaultChecked: boolean;
  disabled?: boolean;
}
