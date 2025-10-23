export const publicRoutes = {
  home: "/",
} as const;

export const authRoutes = {
  login: "/auth/signin",
  register: "/auth/signup",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyAccount: "/auth/verify-account",
  onboarding: "/onboarding",
} as const;

export const r3tainRoutes = {
  home: "/dashboard",
  campaigns: "/campaigns",
  newCampaign: "/campaigns/new",
  campaign: (id: string | number) => `/campaigns/${id}`,
  editCampaign: (id: string | number) => `/campaigns/${id}/edit`,
  automation: "/automation",
  flows: "/automation/flows",
  templates: "/automation/templates",
  analytics: "/analytics",
  reports: "/analytics/reports",
  community: "/community",
  addSubscribers: "/community/add-subscribers",
  subscribers: "/community/subscribers",
  addSingleSubscriber: "/community/subscribers/add",
  segments: "/community/segments",
  surveys: "/community/surveys",
  subscriberPreferences: "/community/subscriber-preferences",
  inbox: "/community/inbox",
  tags: "/community/tags",
  notifications: "/notifications",
  billing: "/billing",
  profile: "/profile",
  settings: "/settings",
} as const;

export const privateRoutes = {
  home: "/dashboard",
} as const;
