"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { isJsonObject } from "@/lib/utils";

export interface UserProfilePreferenceField {
  id: "productUpdates" | "tips" | "marketing" | "zkIntegration";
  label: string;
  value: boolean;
  payloadKey?: string;
}

export interface UserProfileData {
  rawProfile: Record<string, unknown>;
  fullName: string;
  email: string;
  firstName: string;
  lastName: string;
  timezone: string;
  updatedAt?: string;
  passwordChangedAt?: string;
  twoFactorEnabled: boolean;
  preferences: UserProfilePreferenceField[];
}

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
};

const pickBoolean = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "enabled", "on", "yes"].includes(normalized)) {
        return true;
      }
      if (["false", "0", "disabled", "off", "no"].includes(normalized)) {
        return false;
      }
    }
  }
  return false;
};

const splitName = (fullName: string) => {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }

  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
};

const unwrapProfilePayload = (payload: unknown) => {
  const root =
    isJsonObject(payload) && "data" in payload
      ? (payload.data ?? payload)
      : payload;

  if (isJsonObject(root) && isJsonObject(root.user)) {
    return root.user as Record<string, unknown>;
  }

  return isJsonObject(root) ? (root as Record<string, unknown>) : {};
};

const preferenceContainers = (
  profile: Record<string, unknown>
): Array<{ type: "root" | "nested"; value: Record<string, unknown> }> => {
  const nestedCandidates = [
    profile.preferences,
    profile.settings,
    profile.notificationPreferences,
    profile.emailPreferences,
    profile.notifications,
    profile.communicationPreferences,
  ];

  return [
    { type: "root", value: profile },
    ...nestedCandidates
      .filter((candidate) => isJsonObject(candidate))
      .map((candidate) => ({
        type: "nested" as const,
        value: candidate as Record<string, unknown>,
      })),
  ];
};

const resolvePreference = (
  profile: Record<string, unknown>,
  config: {
    id: UserProfilePreferenceField["id"];
    label: string;
    keys: string[];
  }
): UserProfilePreferenceField | null => {
  for (const container of preferenceContainers(profile)) {
    for (const key of config.keys) {
      if (!(key in container.value)) continue;
      return {
        id: config.id,
        label: config.label,
        value: pickBoolean(container.value[key]),
        payloadKey: container.type === "root" ? key : undefined,
      };
    }
  }

  return null;
};

const normalizeUserProfile = (
  payload: unknown,
  sessionUser: Record<string, unknown> | null,
  fallbackTimezone: string
): UserProfileData => {
  const profile = unwrapProfilePayload(payload);
  const firstName = pickString(profile.firstName, sessionUser?.firstName);
  const lastName = pickString(profile.lastName, sessionUser?.lastName);
  const fullName =
    pickString(profile.name) ||
    pickString(`${firstName} ${lastName}`.trim(), sessionUser?.name);
  const email = pickString(profile.email, sessionUser?.email);
  const timezone =
    pickString(profile.timezone, sessionUser?.timezone) || fallbackTimezone;
  const split = splitName(fullName);

  const preferences = [
    resolvePreference(profile, {
      id: "productUpdates",
      label: "Product updates and announcements",
      keys: [
        "productUpdatesAndAnnouncements",
        "productUpdates",
        "announcements",
        "announcementEmails",
      ],
    }),
    resolvePreference(profile, {
      id: "tips",
      label: "Tips and best practices",
      keys: ["tipsAndBestPractices", "tipsEmails", "bestPracticesEmails"],
    }),
    resolvePreference(profile, {
      id: "marketing",
      label: "Marketing and promotional emails",
      keys: ["marketingEmails", "promotionalEmails"],
    }),
    resolvePreference(profile, {
      id: "zkIntegration",
      label: "ZK integration",
      keys: ["zkIntegration", "zk_integration"],
    }),
  ].filter((item): item is UserProfilePreferenceField => Boolean(item));

  return {
    rawProfile: profile,
    fullName,
    email,
    firstName: firstName || split.firstName,
    lastName: lastName || split.lastName,
    timezone,
    updatedAt: pickString(profile.updatedAt, profile.updated_at) || undefined,
    passwordChangedAt:
      pickString(
        profile.passwordChangedAt,
        profile.passwordUpdatedAt,
        profile.lastPasswordChangeAt
      ) || undefined,
    twoFactorEnabled: pickBoolean(
      profile.twoFactorEnabled,
      sessionUser?.twoFactorEnabled
    ),
    preferences,
  };
};

export function useUserProfile() {
  const { data: session, isPending } = authClient.useSession();
  const fallbackTimezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );
  const sessionUser = useMemo(
    () =>
      isJsonObject(session?.user)
        ? (session.user as Record<string, unknown>)
        : null,
    [session?.user]
  );

  const query = useQuery({
    queryKey: ["settings", "profile"],
    queryFn: async () => {
      const response = await apiClient.get("/user/profile", {
        headers: {
          "x-onchain-silent-error": "1",
        },
      });
      return normalizeUserProfile(response.data, sessionUser, fallbackTimezone);
    },
    enabled: !isPending,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    data: query.data,
  };
}
