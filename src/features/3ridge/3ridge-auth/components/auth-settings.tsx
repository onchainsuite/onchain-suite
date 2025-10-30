/* eslint-disable no-console */
import { Bell, Key, Settings, Shield } from "lucide-react";

import {
  type SelectOption,
  SettingInput,
  SettingsCard,
  SettingSelect,
  SettingSwitch,
} from "./settings";

export function GeneralSettings() {
  const authMethods: SelectOption[] = [
    { value: "wallet", label: "Wallet" },
    { value: "email", label: "Email" },
    { value: "oauth", label: "OAuth" },
    { value: "biometric", label: "Biometric" },
  ];

  return (
    <SettingsCard
      icon={Settings}
      title="General Settings"
      description="Configure basic authentication behavior"
      onSave={() => console.log("Save general settings")}
    >
      <SettingSwitch
        label="Allow Multiple Auth Methods"
        description="Users can link multiple authentication methods"
        defaultChecked
      />
      <SettingSwitch
        label="Require Email Verification"
        description="New users must verify their email"
        defaultChecked
      />
      <SettingSwitch
        label="Enable Guest Access"
        description="Allow unauthenticated users limited access"
      />
      <SettingSelect
        label="Default Authentication Method"
        defaultValue="wallet"
        options={authMethods}
      />
      <SettingInput
        label="Login Page URL"
        defaultValue="https://3ridge.io/login"
      />
      <SettingInput label="Redirect After Login" defaultValue="/dashboard" />
    </SettingsCard>
  );
}

export function SecuritySettings() {
  const passwordPolicies: SelectOption[] = [
    { value: "basic", label: "Basic (8+ characters)" },
    { value: "strong", label: "Strong (12+ chars, mixed case, numbers)" },
    { value: "enterprise", label: "Enterprise (16+ chars, all requirements)" },
  ];

  return (
    <SettingsCard
      icon={Shield}
      title="Security Policies"
      description="Configure security and access control policies"
      onSave={() => console.log("Save security settings")}
    >
      <SettingSwitch
        label="Require Multi-Factor Authentication"
        description="Force MFA for all users"
      />
      <SettingSwitch
        label="Enable Rate Limiting"
        description="Limit authentication attempts"
        defaultChecked
      />
      <SettingSwitch
        label="IP Allowlist"
        description="Restrict access to specific IP addresses"
      />
      <SettingSwitch
        label="Device Fingerprinting"
        description="Track and verify user devices"
        defaultChecked
      />
      <SettingSelect
        label="Password Policy"
        defaultValue="strong"
        options={passwordPolicies}
      />
      <SettingInput label="Max Login Attempts" type="number" defaultValue="5" />
      <SettingInput
        label="Account Lockout Duration (minutes)"
        type="number"
        defaultValue="30"
      />
    </SettingsCard>
  );
}

export function SessionSettings() {
  return (
    <SettingsCard
      icon={Key}
      title="Session Management"
      description="Configure session behavior and token settings"
      onSave={() => console.log("Save session settings")}
    >
      <SettingSwitch
        label="Remember Me Option"
        description="Allow users to stay logged in"
        defaultChecked
      />
      <SettingSwitch
        label="Concurrent Sessions"
        description="Allow multiple active sessions per user"
        defaultChecked
      />
      <SettingSwitch
        label="Auto-Logout on Inactivity"
        description="Automatically log out inactive users"
        defaultChecked
      />
      <SettingInput
        label="Session Duration (hours)"
        type="number"
        defaultValue="24"
      />
      <SettingInput
        label="Inactivity Timeout (minutes)"
        type="number"
        defaultValue="30"
      />
      <SettingInput
        label="Refresh Token Expiry (days)"
        type="number"
        defaultValue="30"
      />
      <SettingInput
        label="Max Concurrent Sessions"
        type="number"
        defaultValue="5"
      />
    </SettingsCard>
  );
}

export function NotificationSettings() {
  return (
    <SettingsCard
      icon={Bell}
      title="Notification Settings"
      description="Configure authentication-related notifications"
      onSave={() => console.log("Save notification settings")}
    >
      <SettingSwitch
        label="New Login Notifications"
        description="Notify users of new login attempts"
        defaultChecked
      />
      <SettingSwitch
        label="Failed Login Alerts"
        description="Alert users of failed login attempts"
        defaultChecked
      />
      <SettingSwitch
        label="Password Change Notifications"
        description="Notify users when password is changed"
        defaultChecked
      />
      <SettingSwitch
        label="New Device Alerts"
        description="Alert users when logging in from new device"
        defaultChecked
      />
      <SettingSwitch
        label="Security Event Notifications"
        description="Notify admins of security events"
        defaultChecked
      />
      <SettingInput
        label="Notification Email"
        type="email"
        defaultValue="security@3ridge.io"
      />
    </SettingsCard>
  );
}
