export const publicRoutes = {
  HOME: "/",
} as const;

export const AUTH_ROUTES = {
  LOGIN: "/auth/signin",
  REGISTER: "/auth/signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_ACCOUNT: "/auth/verify-account",
  ONBOARDING: "/onboarding",
} as const;

export const PRIVATE_ROUTES = {
  DASHBOARD: "/dashboard",
  CAMPAIGNS: "/campaigns",
  NEW_CAMPAIGN: "/campaigns/new",
  CAMPAIGN: (id: string | number) => `/campaigns/${id}`,
  EDIT_CAMPAIGN: (id: string | number) => `/campaigns/${id}/edit`,
  INBOX: "/inbox",
  NEW_INBOX: "/inbox/new",
  INBOX_MESSAGES: (id: string | number) => `/inbox/${id}`,
  INBOX_MESSAGE: (id: string | number) => `/inbox/${id}/messages/${id}`,
  AUTOMATIONS: "/automations",
  NEW_AUTOMATION: "/automations/new",
  AUTOMATION: (id: string | number) => `/automations/${id}` as const,
  EDIT_AUTOMATION: (id: string | number) => `/automations/${id}/edit` as const,
  AUDIENCE: "/audience",
  SEGMENTS: "/audience/segments",
  NEW_SEGMENT: "/audience/segments/new",
  SEGMENT: (id: string | number) => `/audience/segments/${id}` as const,
  EDIT_SEGMENT: (id: string | number) =>
    `/audience/segments/${id}/edit` as const,
  COMMUNITY: "/community",
  INTELLIGENCE: "/intelligence",
  ANALYTICS: "/intelligence/analytics",
  ADVANCED_ANALYTICS: "/intelligence/analytics/advanced",
  INTELLIGENCE_SEGMENTS: "/intelligence/segments",
  INTELLIGENCE_SEGMENT: (id: string | number) =>
    `/intelligence/segments/${id}` as const,
  INTELLIGENCE_REPORTS: "/intelligence/reports",
  SETTINGS: "/settings",
  NOTIFICATIONS: "settings/notifications",
  BILLING: "settings/billing",
  PROFILE: "settings/profile",
  REWARDS: "settings/rewards",
  INTEGRATIONS: "settings/integrations",
} as const;
