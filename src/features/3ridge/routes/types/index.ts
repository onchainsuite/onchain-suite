// Types
export type PolicyStatus = "active" | "inactive";
export type PolicyType = "security" | "access" | "rate-limit" | "custom";

export interface Policy {
  id: string;
  name: string;
  status: PolicyStatus;
  type: PolicyType;
  description: string;
  rules: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  borderColor: string;
  gradientFrom: string;
  iconColor: string;
}

export interface PolicyCardProps {
  policy: Policy;
}

export interface SecurityToggleProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

export interface AccessControlToggleProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

export interface SimulationResult {
  status: string;
  statusCode: number;
  responseTime: string;
  response: Record<string, unknown>;
}
