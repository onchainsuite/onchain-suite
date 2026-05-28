"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { isJsonObject } from "@/lib/utils";

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
import { Skeleton } from "@/components/ui/skeleton";

import { apiClient } from "@/lib/api-client";

import { useTimezones } from "@/shared/hooks/client/use-timezones";

const chainOptions = [
  "Ethereum",
  "Base",
  "Solana",
  "Arbitrum",
  "Optimism",
  "Polygon",
  "BNB Chain",
  "Sei",
  "Algorand",
] as const;

type ChainOption = (typeof chainOptions)[number];

const contractEntrySchema = z.object({
  chain: z.string().min(1, "Chain is required"),
  address: z.string().min(1, "Address is required"),
  label: z.string().optional().or(z.literal("")),
});

const walletEntrySchema = z.object({
  address: z.string().min(1, "Wallet address is required"),
  label: z.string().optional().or(z.literal("")),
});

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Must be a valid E.164 phone number (e.g., +1234567890)"
    )
    .optional()
    .or(z.literal("")),
  taxId: z
    .string()
    .regex(
      /^[A-Z0-9-]{5,20}$/,
      "Invalid Tax ID format (alphanumeric & hyphens, 5-20 chars)"
    )
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(1, "Address is required")
    .optional()
    .or(z.literal("")),
  timezone: z.string().optional(),
  tokenTicker: z
    .string()
    .max(16, "Token ticker is too long")
    .optional()
    .or(z.literal("")),
  primaryChains: z.array(z.string()).optional(),
  contractAddresses: z.array(contractEntrySchema).optional(),
  treasuryWallets: z.array(walletEntrySchema).optional(),
  teamWallets: z.array(walletEntrySchema).optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanyEditForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CompanyFormValues | null>(null);
  const [orgMetadata, setOrgMetadata] = useState<Record<string, unknown>>({});
  const [chainToAdd, setChainToAdd] = useState<ChainOption>("Ethereum");

  const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
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
    },
  });

  const { fields: contractFields, append: appendContract, remove: removeContract } =
    useFieldArray({
      control: form.control,
      name: "contractAddresses",
    });

  const {
    fields: treasuryFields,
    append: appendTreasury,
    remove: removeTreasury,
  } = useFieldArray({
    control: form.control,
    name: "treasuryWallets",
  });

  const { fields: teamFields, append: appendTeam, remove: removeTeam } =
    useFieldArray({
      control: form.control,
      name: "teamWallets",
    });

  const { items: timezones, loading: tzLoading } = useTimezones();

  const primaryChains = form.watch("primaryChains") ?? [];
  const primaryChainsLabel = useMemo(() => {
    if (!Array.isArray(primaryChains) || primaryChains.length === 0) return "";
    return primaryChains.join(", ");
  }, [primaryChains]);

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await apiClient.get("/organization");
        // Handle both direct object and { data: ... } wrapper
        const org = res.data?.data ?? res.data;
        if (org) {
          const settings = org.settings ?? {};
          const metadata =
            isJsonObject(org.metadata) && org.metadata !== null ? org.metadata : {};
          const projectMeta =
            isJsonObject((metadata as Record<string, unknown>).project) &&
            (metadata as Record<string, unknown>).project !== null
              ? ((metadata as Record<string, unknown>).project as Record<
                  string,
                  unknown
                >)
              : isJsonObject((metadata as Record<string, unknown>).protocol) &&
                  (metadata as Record<string, unknown>).protocol !== null
                ? ((metadata as Record<string, unknown>).protocol as Record<
                    string,
                    unknown
                  >)
                : {};

          const tokenTicker =
            typeof projectMeta.tokenTicker === "string" ? projectMeta.tokenTicker : "";
          const primaryChainsRaw = projectMeta.primaryChains;
          const primaryChains =
            Array.isArray(primaryChainsRaw) && primaryChainsRaw.every((c) => typeof c === "string")
              ? (primaryChainsRaw as string[])
              : [];

          const contractAddressesRaw = projectMeta.contractAddresses ?? projectMeta.contracts;
          const contractAddresses = Array.isArray(contractAddressesRaw)
            ? (contractAddressesRaw as unknown[])
                .map((row) => {
                  if (!isJsonObject(row)) return null;
                  const r = row as Record<string, unknown>;
                  const chain = typeof r.chain === "string" ? r.chain : "";
                  const address =
                    typeof r.address === "string"
                      ? r.address
                      : typeof r.contractAddress === "string"
                        ? r.contractAddress
                        : "";
                  const label = typeof r.label === "string" ? r.label : "";
                  if (!chain || !address) return null;
                  return { chain, address, label };
                })
                .filter(Boolean)
            : [];

          const treasuryWalletsRaw = projectMeta.treasuryWallets ?? projectMeta.treasury;
          const treasuryWallets = Array.isArray(treasuryWalletsRaw)
            ? (treasuryWalletsRaw as unknown[])
                .map((row) => {
                  if (!isJsonObject(row)) return null;
                  const r = row as Record<string, unknown>;
                  const address =
                    typeof r.address === "string"
                      ? r.address
                      : typeof r.walletAddress === "string"
                        ? r.walletAddress
                        : "";
                  const label = typeof r.label === "string" ? r.label : "";
                  if (!address) return null;
                  return { address, label };
                })
                .filter(Boolean)
            : [];

          const teamWalletsRaw = projectMeta.teamWallets ?? projectMeta.deployerWallets;
          const teamWallets = Array.isArray(teamWalletsRaw)
            ? (teamWalletsRaw as unknown[])
                .map((row) => {
                  if (!isJsonObject(row)) return null;
                  const r = row as Record<string, unknown>;
                  const address =
                    typeof r.address === "string"
                      ? r.address
                      : typeof r.walletAddress === "string"
                        ? r.walletAddress
                        : "";
                  const label = typeof r.label === "string" ? r.label : "";
                  if (!address) return null;
                  return { address, label };
                })
                .filter(Boolean)
            : [];

          const initialData = {
            name: org.name ?? "",
            email: settings.billingEmail ?? "",
            phone: settings.phone ?? "",
            taxId: settings.taxId ?? "",
            address: settings.address ?? "",
            timezone: settings.timezone ?? "UTC",
            tokenTicker,
            primaryChains,
            contractAddresses,
            treasuryWallets,
            teamWallets,
          };
          setOrgMetadata(metadata as Record<string, unknown>);
          setData(initialData);
          form.reset(initialData);
        } else {
          // If no org found or error, maybe 404
          console.error("Failed to fetch organization");
        }
      } catch {
        toast.error("Failed to load company details");
      } finally {
        setLoading(false);
      }
    }
    fetchOrg();
  }, [form]);

  const onSubmit = async (values: CompanyFormValues) => {
    const previousData = data;
    // Optimistic update
    setData(values);
    setIsEditing(false);

    try {
      const nextMetadata: Record<string, unknown> = { ...orgMetadata };
      const existingProject =
        isJsonObject(nextMetadata.project) && nextMetadata.project !== null
          ? (nextMetadata.project as Record<string, unknown>)
          : {};
      nextMetadata.project = {
        ...existingProject,
        tokenTicker: values.tokenTicker ?? "",
        primaryChains: values.primaryChains ?? [],
        contractAddresses: values.contractAddresses ?? [],
        treasuryWallets: values.treasuryWallets ?? [],
        teamWallets: values.teamWallets ?? [],
      };

      await apiClient.put("/organization", {
        name: values.name,
        settings: {
          billingEmail: values.email,
          phone: values.phone,
          taxId: values.taxId,
          address: values.address,
          timezone: values.timezone,
        },
        metadata: nextMetadata,
      });

      toast.success("Company details updated successfully");
    } catch {
      setData(previousData);
      form.reset(previousData ?? undefined);
      toast.error("Failed to update company details");
      setIsEditing(true); // Re-open edit mode on failure
    }
  };

  if (loading) return <Skeleton className="h-75 w-full rounded-xl" />;

  return (
    <Card className="overflow-hidden border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-medium">Project Settings</CardTitle>
          <CardDescription>
            Manage protocol identity, chains, contracts, and wallets.
          </CardDescription>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="edit-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Project / Protocol Name <span className="text-red-500">*</span>
                  </Label>
                  <Input {...form.register("name")} placeholder="Acme Inc." />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Billing Email</Label>
                  <Input
                    {...form.register("email")}
                    type="email"
                    placeholder="billing@acme.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Token Ticker</Label>
                  <Input
                    {...form.register("tokenTicker")}
                    placeholder="$SUITE"
                    autoCapitalize="characters"
                  />
                  {form.formState.errors.tokenTicker && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.tokenTicker.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Primary Chains</Label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Select
                      value={chainToAdd}
                      onValueChange={(val) => setChainToAdd(val as ChainOption)}
                    >
                      <SelectTrigger className="sm:w-56">
                        <SelectValue placeholder="Select chain" />
                      </SelectTrigger>
                      <SelectContent>
                        {chainOptions.map((chain) => (
                          <SelectItem key={chain} value={chain}>
                            {chain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        const current = form.getValues("primaryChains") ?? [];
                        if (!current.includes(chainToAdd)) {
                          form.setValue("primaryChains", [...current, chainToAdd], {
                            shouldDirty: true,
                          });
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Add chain
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.getValues("primaryChains") ?? []).map((chain) => (
                      <span
                        key={chain}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {chain}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            const current = form.getValues("primaryChains") ?? [];
                            form.setValue(
                              "primaryChains",
                              current.filter((c) => c !== chain),
                              { shouldDirty: true }
                            );
                          }}
                          aria-label={`Remove ${chain}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {(form.getValues("primaryChains") ?? []).length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        Select one or more chains
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone (E.164)</Label>
                  <Input
                    {...form.register("phone")}
                    placeholder="+1234567890"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Tax ID / VAT Number</Label>
                  <Input
                    {...form.register("taxId")}
                    placeholder="US-123456789"
                  />
                  {form.formState.errors.taxId && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.taxId.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    onValueChange={(val) => form.setValue("timezone", val)}
                    defaultValue={form.getValues("timezone")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tzLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          Loading…
                        </div>
                      ) : (
                        timezones.map((tz) => (
                          <SelectItem key={tz.id} value={tz.id}>
                            {tz.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input
                    {...form.register("address")}
                    placeholder="123 Market St, San Francisco, CA 94103"
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Contract Addresses
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Add contracts for on-chain queries and intelligence.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      appendContract({ chain: chainOptions[0], address: "", label: "" })
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add contract
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  {contractFields.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No contracts added
                    </div>
                  ) : (
                    contractFields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="grid gap-3 rounded-xl border border-border/60 bg-card/40 p-3 md:grid-cols-12"
                      >
                        <div className="md:col-span-3">
                          <Label className="sr-only">Chain</Label>
                          <Select
                            onValueChange={(val) =>
                              form.setValue(
                                `contractAddresses.${idx}.chain`,
                                val,
                                { shouldDirty: true }
                              )
                            }
                            defaultValue={form.getValues(`contractAddresses.${idx}.chain`)}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Chain" />
                            </SelectTrigger>
                            <SelectContent>
                              {chainOptions.map((chain) => (
                                <SelectItem key={chain} value={chain}>
                                  {chain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-5">
                          <Label className="sr-only">Address</Label>
                          <Input
                            {...form.register(`contractAddresses.${idx}.address`)}
                            placeholder="0x… or base58…"
                            className="h-11"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Label className="sr-only">Label</Label>
                          <Input
                            {...form.register(`contractAddresses.${idx}.label`)}
                            placeholder="Main Token"
                            className="h-11"
                          />
                        </div>
                        <div className="flex items-center justify-end md:col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeContract(idx)}
                            aria-label="Remove contract"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Treasury Wallets
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Treasury, marketing, team, etc.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => appendTreasury({ address: "", label: "" })}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {treasuryFields.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No wallets added
                      </div>
                    ) : (
                      treasuryFields.map((field, idx) => (
                        <div
                          key={field.id}
                          className="grid gap-3 rounded-xl border border-border/60 bg-card/40 p-3 md:grid-cols-12"
                        >
                          <div className="md:col-span-7">
                            <Label className="sr-only">Wallet address</Label>
                            <Input
                              {...form.register(`treasuryWallets.${idx}.address`)}
                              placeholder="0x…"
                              className="h-11"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <Label className="sr-only">Label</Label>
                            <Input
                              {...form.register(`treasuryWallets.${idx}.label`)}
                              placeholder="Treasury"
                              className="h-11"
                            />
                          </div>
                          <div className="flex items-center justify-end md:col-span-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTreasury(idx)}
                              aria-label="Remove wallet"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Deployer / Team Wallets
                      </p>
                      <p className="text-xs text-muted-foreground">
                        For privilege tracking and intelligence features.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => appendTeam({ address: "", label: "" })}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {teamFields.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No wallets added
                      </div>
                    ) : (
                      teamFields.map((field, idx) => (
                        <div
                          key={field.id}
                          className="grid gap-3 rounded-xl border border-border/60 bg-card/40 p-3 md:grid-cols-12"
                        >
                          <div className="md:col-span-7">
                            <Label className="sr-only">Wallet address</Label>
                            <Input
                              {...form.register(`teamWallets.${idx}.address`)}
                              placeholder="0x…"
                              className="h-11"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <Label className="sr-only">Label</Label>
                            <Input
                              {...form.register(`teamWallets.${idx}.label`)}
                              placeholder="Deployer"
                              className="h-11"
                            />
                          </div>
                          <div className="flex items-center justify-end md:col-span-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTeam(idx)}
                              aria-label="Remove wallet"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset(data ?? undefined);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="view-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Project / Protocol Name
                </p>
                <p className="text-base font-medium">{data?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Token Ticker
                </p>
                <p className="text-base">
                  {(() => {
                    const v = data?.tokenTicker;
                    if (isNonEmptyString(v)) return v;
                    return (
                      <span className="text-muted-foreground/50 italic">
                        Not set
                      </span>
                    );
                  })()}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Primary Chains
                </p>
                <p className="text-base">
                  {primaryChainsLabel.length > 0 ? (
                    primaryChainsLabel
                  ) : (
                    <span className="text-muted-foreground/50 italic">
                      Not set
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Billing Email
                </p>
                <p className="text-base">
                  {(() => {
                    const email = data?.email;
                    if (isNonEmptyString(email)) return email;
                    return (
                      <span className="text-muted-foreground/50 italic">
                        Not set
                      </span>
                    );
                  })()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Phone
                </p>
                <p className="text-base">
                  {(() => {
                    const phone = data?.phone;
                    if (isNonEmptyString(phone)) return phone;
                    return (
                      <span className="text-muted-foreground/50 italic">
                        Not set
                      </span>
                    );
                  })()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Tax ID
                </p>
                <p className="font-mono bg-muted/50 px-2 py-0.5 rounded text-sm w-fit">
                  {(() => {
                    const taxId = data?.taxId;
                    if (isNonEmptyString(taxId)) return taxId;
                    return "Not set";
                  })()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Timezone
                </p>
                <p className="text-base">
                  {(() => {
                    const timezone = data?.timezone;
                    if (isNonEmptyString(timezone)) return timezone;
                    return "UTC";
                  })()}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Address
                </p>
                <p className="text-base">
                  {(() => {
                    const address = data?.address;
                    if (isNonEmptyString(address)) return address;
                    return (
                      <span className="text-muted-foreground/50 italic">
                        Not set
                      </span>
                    );
                  })()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Contract Addresses
                </p>
                <p className="text-base">
                  {(data?.contractAddresses?.length ?? 0) > 0
                    ? `${data?.contractAddresses?.length ?? 0} saved`
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Treasury Wallets
                </p>
                <p className="text-base">
                  {(data?.treasuryWallets?.length ?? 0) > 0
                    ? `${data?.treasuryWallets?.length ?? 0} saved`
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Deployer / Team Wallets
                </p>
                <p className="text-base">
                  {(data?.teamWallets?.length ?? 0) > 0
                    ? `${data?.teamWallets?.length ?? 0} saved`
                    : "Not set"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
