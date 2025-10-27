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
  ROOT: "/dashboard",

  R3TAIN: {
    OVERVIEW: "/dashboard/r3tain",

    CAMPAIGNS: "/dashboard/r3tain/campaigns",
    NEW_CAMPAIGN: "/dashboard/r3tain/campaigns/new",
    CAMPAIGN: (id: string | number) => `/dashboard/r3tain/campaigns/${id}`,
    EDIT_CAMPAIGN: (id: string | number) =>
      `/dashboard/r3tain/campaigns/${id}/edit`,

    AUTOMATION: "/dashboard/r3tain/automation",
    FLOWS: "/dashboard/r3tain/automation/flows",
    TEMPLATES: "/dashboard/r3tain/automation/templates",

    ANALYTICS: "/dashboard/r3tain/analytics",
    REPORTS: "/dashboard/r3tain/analytics/reports",

    COMMUNITY: "/dashboard/r3tain/community",
    ADD_SUBSCRIBERS: "/dashboard/r3tain/community/add-subscribers",
    SUBSCRIBERS: "/dashboard/r3tain/community/subscribers",
    ADD_SINGLE_SUBSCRIBER: "/dashboard/r3tain/community/subscribers/add",
    SEGMENTS: "/dashboard/r3tain/community/segments",
    SURVEYS: "/dashboard/r3tain/community/surveys",
    SUBSCRIBER_PREFS: "/dashboard/r3tain/community/subscriber-preferences",
    INBOX: "/dashboard/r3tain/community/inbox",
    TAGS: "/dashboard/r3tain/community/tags",
    SETTINGS: "/dashboard/r3tain/settings",
  },

  BRIDGE: {
    ROOT: "/dashboard/3ridge",

    AUTH: {
      ROOT: "/dashboard/3ridge/auth",
      WALLETS: "/dashboard/3ridge/auth/wallets",
      EMAIL: "/dashboard/3ridge/auth/email",
      OAUTH: "/dashboard/3ridge/auth/oauth",
      BIOMETRIC: "/dashboard/3ridge/auth/biometric",
      SETTINGS: "/dashboard/3ridge/auth/settings",
    },

    PROFILES: {
      ROOT: "/dashboard/3ridge/profiles",
      DETAIL: (id: string) => `/dashboard/3ridge/profiles/${id}`,
      MERGE: "/dashboard/3ridge/profiles/merge",
    },

    EVENTS: {
      ROOT: "/dashboard/3ridge/events",
      LIVE: "/dashboard/3ridge/events/live",
      HISTORY: "/dashboard/3ridge/events/history",
      RULES: "/dashboard/3ridge/events/rules",
    },

    ROUTES: {
      ROOT: "/dashboard/3ridge/routes",
      WEBHOOKS: "/dashboard/3ridge/routes/webhooks",
      SIMULATOR: "/dashboard/3ridge/routes/simulator",
      POLICIES: "/dashboard/3ridge/routes/policies",
    },

    ANALYTICS: {
      ROOT: "/dashboard/3ridge/analytics",
      AUTH: "/dashboard/3ridge/analytics/auth",
      USERS: "/dashboard/3ridge/analytics/users",
      SECURITY: "/dashboard/3ridge/analytics/security",
      CROSSCHAIN: "/dashboard/3ridge/analytics/crosschain",
    },

    PLAYGROUND: {
      ROOT: "/dashboard/3ridge/playground",
      AUTH_FLOW: "/dashboard/3ridge/playground/auth-flow",
      WEBHOOKS: "/dashboard/3ridge/playground/webhooks",
      ZK_PROOFS: "/dashboard/3ridge/playground/zk-proofs",
      CODE: "/dashboard/3ridge/playground/code",
    },

    SDK: {
      ROOT: "/dashboard/3ridge/sdk",
      SETUP: "/dashboard/3ridge/sdk/setup",
      EXAMPLES: "/dashboard/3ridge/sdk/examples",
      CHAINS: "/dashboard/3ridge/sdk/chains",
      API_KEYS: "/dashboard/3ridge/sdk/api-keys",
    },

    INTEGRATIONS: {
      ROOT: "/dashboard/3ridge/integrations",
      R3TAIN: "/dashboard/3ridge/integrations/r3tain",
      ONCH3N: "/dashboard/3ridge/integrations/onch3n",
      THIRDPARTY: "/dashboard/3ridge/integrations/thirdparty",
    },

    SECURITY: {
      ROOT: "/dashboard/3ridge/security",
      CAPTCHA: "/dashboard/3ridge/security/captcha",
      RATE_LIMIT: "/dashboard/3ridge/security/rate-limit",
      ZK_CIRCUITS: "/dashboard/3ridge/security/zk-circuits",
      ALERTS: "/dashboard/3ridge/security/alerts",
    },

    LOGS: {
      ROOT: "/dashboard/3ridge/logs",
      PROOFS: "/dashboard/3ridge/logs/proofs",
      SYNC: "/dashboard/3ridge/logs/sync",
      AUTH: "/dashboard/3ridge/logs/auth",
      API: "/dashboard/3ridge/logs/api",
    },

    SETTINGS: {
      ROOT: "/dashboard/3ridge/settings",
      ORGANIZATION: "/dashboard/3ridge/settings/organization",
      USERS: "/dashboard/3ridge/settings/users",
      API: "/dashboard/3ridge/settings/api",
      NOTIFICATIONS: "/dashboard/3ridge/settings/notifications",
    },
  },

  ONCHAIN: {
    OVERVIEW: "/dashboard/onchain",

    OVERVIEW_LIVE: "/dashboard/onchain/live",

    DATA: "/dashboard/onchain/data",
    DATA_QUERY: "/dashboard/onchain/data/query",
    DATA_CO_BUILD: "/dashboard/onchain/data/co-build",
    DATA_SCHEMA: "/dashboard/onchain/data/schema",

    INSIGHTS: "/dashboard/onchain/insights",
    INSIGHTS_STORY: "/dashboard/onchain/insights/story",

    SEGMENTS: "/dashboard/onchain/segments",
    SEGMENTS_VERSIONED: "/dashboard/onchain/segments/versioned",

    ALERTS: "/dashboard/onchain/alerts",

    SETTINGS: "/dashboard/onchain/settings",
  },

  NOTIFICATIONS: "/dashboard/notifications",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
} as const;
