"use client";

import type { AxiosError } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

export interface ProjectSettingsAddressRow {
  chain?: string;
  address: string;
  label?: string;
}

export interface ProjectSettingsFormData {
  name: string;
  email: string;
  phone: string;
  taxId: string;
  address: string;
  timezone: string;
  tokenTicker: string;
  primaryChains: string[];
  contractAddresses: ProjectSettingsAddressRow[];
  treasuryWallets: ProjectSettingsAddressRow[];
  teamWallets: ProjectSettingsAddressRow[];
}

const DEFAULT_PROJECT_SETTINGS: ProjectSettingsFormData = {
  name: "",
  email: "",
  phone: "",
  taxId: "",
  address: "",
  timezone: "UTC",
  tokenTicker: "",
  primaryChains: [],
  contractAddresses: [],
  treasuryWallets: [],
  teamWallets: [],
};

const unwrapData = (payload: unknown): unknown => {
  if (isJsonObject(payload) && "data" in payload) {
    return payload.data ?? payload;
  }
  return payload;
};

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry) => entry.length > 0);
};

const normalizeAddressRows = (
  value: unknown,
  options?: { requireChain?: boolean }
): ProjectSettingsAddressRow[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!isJsonObject(entry)) return null;
      const row = entry as Record<string, unknown>;
      const chain = pickString(row.chain, row.network);
      const address = pickString(
        row.address,
        row.contractAddress,
        row.walletAddress
      );
      const label = pickString(row.label, row.name);
      if (address.length === 0) return null;
      if (options?.requireChain && chain.length === 0) return null;
      return {
        ...(chain ? { chain } : {}),
        address,
        ...(label ? { label } : {}),
      } satisfies ProjectSettingsAddressRow;
    })
    .filter((row): row is ProjectSettingsAddressRow => Boolean(row));
};

const normalizeLegacyOrganization = (
  payload: unknown
): ProjectSettingsFormData => {
  const root = unwrapData(payload);
  const org = isJsonObject(root) ? root : {};
  const settings = isJsonObject(org.settings) ? org.settings : {};
  const metadata = isJsonObject(org.metadata) ? org.metadata : {};
  const projectMeta = isJsonObject(metadata.project)
    ? metadata.project
    : isJsonObject(metadata.protocol)
      ? metadata.protocol
      : {};

  return {
    name: pickString(org.name, projectMeta.projectName),
    email: pickString(settings.billingEmail),
    phone: pickString(settings.phone),
    taxId: pickString(settings.taxId),
    address: pickString(settings.address),
    timezone: pickString(settings.timezone) || "UTC",
    tokenTicker: pickString(projectMeta.tokenTicker),
    primaryChains: toStringArray(projectMeta.primaryChains),
    contractAddresses: normalizeAddressRows(
      projectMeta.contractAddresses ?? projectMeta.contracts,
      { requireChain: true }
    ),
    treasuryWallets: normalizeAddressRows(
      projectMeta.treasuryWallets ?? projectMeta.treasury
    ),
    teamWallets: normalizeAddressRows(
      projectMeta.teamWallets ?? projectMeta.deployerWallets
    ),
  };
};

export const normalizeProjectSettings = (
  payload: unknown
): ProjectSettingsFormData => {
  const root = unwrapData(payload);
  if (!isJsonObject(root)) return { ...DEFAULT_PROJECT_SETTINGS };

  const contractAddresses = normalizeAddressRows(
    root.contractAddresses ?? root.contracts,
    { requireChain: true }
  );
  const treasuryWallets = normalizeAddressRows(
    root.treasuryWallets ?? root.treasury
  );
  const teamWallets = normalizeAddressRows(
    root.teamWallets ?? root.deployerWallets
  );

  return {
    name: pickString(root.projectName, root.name),
    email: pickString(root.billingEmail),
    phone: pickString(root.phone),
    taxId: pickString(root.taxId),
    address: pickString(root.address),
    timezone: pickString(root.timezone) || "UTC",
    tokenTicker: pickString(root.tokenTicker),
    primaryChains: toStringArray(root.primaryChains),
    contractAddresses,
    treasuryWallets,
    teamWallets,
  };
};

const getHeaders = (organizationId?: string) => {
  const orgId = organizationId ?? getSelectedOrganizationId() ?? null;
  return {
    ...(orgId ? { "x-org-id": orgId } : {}),
    "x-onchain-silent-error": "1",
  };
};

const sanitizeRows = (
  rows: ProjectSettingsAddressRow[],
  options?: { requireChain?: boolean }
) => {
  return rows
    .map((row) => ({
      chain: pickString(row.chain),
      address: pickString(row.address),
      label: pickString(row.label),
    }))
    .filter((row) => {
      if (row.address.length === 0) return false;
      if (options?.requireChain && row.chain.length === 0) return false;
      return true;
    })
    .map((row) => ({
      ...(row.chain ? { chain: row.chain } : {}),
      address: row.address,
      ...(row.label ? { label: row.label } : {}),
    }));
};

const toSavePayload = (values: ProjectSettingsFormData) => ({
  projectName: pickString(values.name),
  billingEmail: pickString(values.email),
  phone: pickString(values.phone),
  taxId: pickString(values.taxId),
  address: pickString(values.address),
  timezone: pickString(values.timezone) || "UTC",
  tokenTicker: pickString(values.tokenTicker),
  primaryChains: toStringArray(values.primaryChains),
  contractAddresses: sanitizeRows(values.contractAddresses, {
    requireChain: true,
  }),
  treasuryWallets: sanitizeRows(values.treasuryWallets),
  teamWallets: sanitizeRows(values.teamWallets),
});

const extractErrorMessage = (error: unknown, fallback: string) => {
  const err = error as AxiosError<unknown>;
  const data = err.response?.data;
  const nestedError =
    isJsonObject(data) && isJsonObject(data.error) ? data.error : undefined;
  const message = isJsonObject(nestedError)
    ? nestedError.message
    : isJsonObject(data)
      ? data.message
      : typeof data === "string"
        ? data
        : err.message;
  return typeof message === "string" && message.trim().length > 0
    ? message
    : fallback;
};

export const projectSettingsService = {
  async getProjectSettings(organizationId?: string) {
    try {
      const response = await apiClient.get("/organization/project-settings", {
        headers: getHeaders(organizationId),
      });
      return normalizeProjectSettings(response.data);
    } catch (error) {
      try {
        const fallback = await apiClient.get("/organization", {
          headers: getHeaders(organizationId),
        });
        return normalizeLegacyOrganization(fallback.data);
      } catch {
        throw new Error(
          extractErrorMessage(error, "Failed to load project settings")
        );
      }
    }
  },

  async saveProjectSettings(
    values: ProjectSettingsFormData,
    organizationId?: string
  ) {
    try {
      const payload = toSavePayload(values);
      const response = await apiClient.put(
        "/organization/project-settings",
        payload,
        {
          headers: getHeaders(organizationId),
        }
      );
      const normalized = normalizeProjectSettings(response.data);
      return {
        ...payload,
        ...normalized,
        name: normalized.name || payload.projectName,
        email: normalized.email || payload.billingEmail,
      } satisfies ProjectSettingsFormData;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to update project settings"),
        {
          cause: error,
        }
      );
    }
  },
};
