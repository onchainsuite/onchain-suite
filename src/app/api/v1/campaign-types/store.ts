type CampaignTypeRecord = {
  id: string;
  label: string;
  channels: string[];
  supportsSchedule: boolean;
  supportsSequence: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
};

type OrgStore = Map<string, CampaignTypeRecord>;

const getGlobalStore = () => {
  const g = globalThis as unknown as {
    __onchainCampaignTypeStore?: Map<string, OrgStore>;
  };
  g.__onchainCampaignTypeStore ??= new Map<string, OrgStore>();
  return g.__onchainCampaignTypeStore;
};

const seedDefaults = (): CampaignTypeRecord[] => {
  const now = new Date().toISOString();
  return [
    {
      id: "EMAIL_BLAST",
      label: "Email Blast",
      channels: ["email"],
      supportsSchedule: true,
      supportsSequence: false,
      isSystem: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "DRIP_CAMPAIGN",
      label: "Drip Campaign",
      channels: ["email"],
      supportsSchedule: true,
      supportsSequence: true,
      isSystem: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "SMART_SENDING",
      label: "Smart Campaign",
      channels: ["inapp", "telegram", "discord", "x"],
      supportsSchedule: true,
      supportsSequence: false,
      isSystem: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const campaignTypeStore = {
  list(orgId: string): CampaignTypeRecord[] {
    const globalStore = getGlobalStore();
    const orgStore = globalStore.get(orgId);
    if (!orgStore) {
      const next = new Map<string, CampaignTypeRecord>();
      for (const record of seedDefaults()) next.set(record.id, record);
      globalStore.set(orgId, next);
      return Array.from(next.values());
    }
    return Array.from(orgStore.values());
  },

  get(orgId: string, id: string): CampaignTypeRecord | null {
    const globalStore = getGlobalStore();
    const orgStore = globalStore.get(orgId);
    if (!orgStore) {
      const seeded = new Map<string, CampaignTypeRecord>();
      for (const record of seedDefaults()) seeded.set(record.id, record);
      globalStore.set(orgId, seeded);
      return seeded.get(id) ?? null;
    }
    return orgStore.get(id) ?? null;
  },

  create(
    orgId: string,
    record: Omit<CampaignTypeRecord, "createdAt" | "updatedAt">
  ): CampaignTypeRecord {
    const globalStore = getGlobalStore();
    const existing =
      globalStore.get(orgId) ?? new Map<string, CampaignTypeRecord>();
    if (!globalStore.has(orgId)) {
      for (const seeded of seedDefaults()) existing.set(seeded.id, seeded);
      globalStore.set(orgId, existing);
    }
    const now = new Date().toISOString();
    const next: CampaignTypeRecord = {
      ...record,
      createdAt: now,
      updatedAt: now,
    };
    existing.set(next.id, next);
    return next;
  },

  update(
    orgId: string,
    id: string,
    patch: Partial<Omit<CampaignTypeRecord, "id" | "createdAt" | "isSystem">>
  ): CampaignTypeRecord | null {
    const globalStore = getGlobalStore();
    const orgStore =
      globalStore.get(orgId) ?? new Map<string, CampaignTypeRecord>();
    if (!globalStore.has(orgId)) {
      for (const seeded of seedDefaults()) orgStore.set(seeded.id, seeded);
      globalStore.set(orgId, orgStore);
    }
    const current = orgStore.get(id);
    if (!current) return null;
    const updatedAt = new Date().toISOString();
    const next: CampaignTypeRecord = {
      ...current,
      ...patch,
      id: current.id,
      isSystem: current.isSystem,
      createdAt: current.createdAt,
      updatedAt,
    };
    orgStore.set(id, next);
    return next;
  },

  delete(
    orgId: string,
    id: string
  ): { deleted: boolean; reason?: "SYSTEM" | "NOT_FOUND" } {
    const globalStore = getGlobalStore();
    const orgStore =
      globalStore.get(orgId) ?? new Map<string, CampaignTypeRecord>();
    if (!globalStore.has(orgId)) {
      for (const seeded of seedDefaults()) orgStore.set(seeded.id, seeded);
      globalStore.set(orgId, orgStore);
    }
    const current = orgStore.get(id);
    if (!current) return { deleted: false, reason: "NOT_FOUND" };
    if (current.isSystem) return { deleted: false, reason: "SYSTEM" };
    orgStore.delete(id);
    return { deleted: true };
  },
};

export type { CampaignTypeRecord };
