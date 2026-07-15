"use client";

import {
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  InformationCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { type CampaignAudienceEstimate } from "../../campaigns.service";
import {
  getEstimatedRecipientsFromSelection,
  partitionAudienceSelection,
  resolveTagsToProfileIds,
} from "../../lib/audience";
import {
  isRateLimitError,
  seedAudienceSyncCache,
  syncAudienceSettings,
} from "../../lib/audience-sync";
import type { List, Segment } from "../../types";
import type { CampaignFormData } from "../../validations";
import { AudienceSelector } from "./audience-selector";
import { PRIVATE_ROUTES } from "@/shared/config/app-routes";

interface AudienceStepProps {
  form: UseFormReturn<CampaignFormData>;
  campaignId?: string | null;
  canSync?: boolean;
  lists?: List[];
  /** Audience tags as pickable pseudo-lists (`tag:<name>` ids). */
  tags?: List[];
  segments?: Segment[];
  segmentsLoading?: boolean;
  segmentsError?: string | null;
}

const getEstimatedRecipientsValue = (estimate: CampaignAudienceEstimate) => {
  // Canonical field per POST /campaigns/{id}/audience/estimate, with legacy
  // fallbacks for older response shapes.
  if (typeof estimate.recipientCount === "number") {
    return estimate.recipientCount;
  }
  if (typeof estimate.estimatedRecipients === "number") {
    return estimate.estimatedRecipients;
  }
  if (typeof estimate.recipients === "number") {
    return estimate.recipients;
  }
  return null;
};

export function AudienceStep({
  form,
  campaignId,
  canSync = false,
  lists = [],
  tags = [],
  segments = [],
  segmentsLoading = false,
  segmentsError,
}: AudienceStepProps) {
  const UTM_HELP_URL =
    "https://support.google.com/analytics/answer/1033863?hl=en";
  const accountSettingsHref = `${PRIVATE_ROUTES.SETTINGS}?tab=account`;
  const selectedAudiences = form.watch("selectedAudiences");
  const smartSending = form.watch("smartSending");
  const trackingParameters = form.watch("trackingParameters");
  const utmSource = form.watch("utmSource");
  const utmMedium = form.watch("utmMedium");
  const utmCampaign = form.watch("utmCampaign");
  const utmTerm = form.watch("utmTerm");
  const utmContent = form.watch("utmContent");
  const [estimatedRecipients, setEstimatedRecipients] = useState<number | null>(
    null
  );
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncSequenceRef = useRef(0);

  const selectedSegmentIds = useMemo(
    () => new Set(segments.map((segment) => segment.id)),
    [segments]
  );
  const localEstimatedRecipients = useMemo(
    () =>
      getEstimatedRecipientsFromSelection(
        selectedAudiences,
        [...lists, ...tags],
        segments
      ),
    [lists, tags, segments, selectedAudiences]
  );
  const unresolvedSelectionCount = useMemo(
    () =>
      selectedAudiences.filter(
        (selectedId) =>
          !lists.some((list) => list.id === selectedId) &&
          !tags.some((tag) => tag.id === selectedId) &&
          !selectedSegmentIds.has(selectedId)
      ).length,
    [lists, tags, selectedAudiences, selectedSegmentIds]
  );

  // Assemble the UTM object sent to the backend (only when tracking is on and
  // at least one value is set). Keys map to utm_source/medium/campaign/…
  const utmParams = useMemo(() => {
    if (!trackingParameters) return undefined;
    const out: Record<string, string> = {};
    const add = (key: string, value: string | undefined) => {
      const trimmed = (value ?? "").trim();
      if (trimmed.length > 0) out[key] = trimmed;
    };
    add("source", utmSource);
    add("medium", utmMedium);
    add("campaign", utmCampaign);
    add("term", utmTerm);
    add("content", utmContent);
    return Object.keys(out).length > 0 ? out : undefined;
  }, [
    trackingParameters,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
  ]);

  // Live autosync. The backend rate-limits these endpoints (3 requests/10s),
  // so this only sends payloads that actually changed (see audience-sync.ts):
  // the first run seeds the change cache from hydrated state and just fetches
  // the recipient estimate; later runs write only the changed settings. A 429
  // is retried once after the limit window instead of surfacing an error.
  const hasSeededSyncRef = useRef(false);
  useEffect(() => {
    if (!campaignId || !canSync) return;

    const currentSequence = syncSequenceRef.current + 1;
    syncSequenceRef.current = currentSequence;
    setIsSyncing(true);
    setSyncError(null);

    let retryTimeout: number | undefined;

    const buildPayloads = async () => {
      const { listIds, segmentIds, profileIds, tagNames } =
        partitionAudienceSelection(selectedAudiences, segments, lists);
      // Tag selections expand to the tagged contacts' profile ids — the
      // backend audience contract only knows profiles + segments.
      const tagProfileIds = await resolveTagsToProfileIds(tagNames);
      const mergedProfileIds = Array.from(
        new Set([...profileIds, ...tagProfileIds])
      );
      return {
        audience: { listIds, segmentIds, profileIds: mergedProfileIds },
        tracking: {
          smartSending: Boolean(smartSending),
          trackingParameters: Boolean(trackingParameters),
          ...(utmParams ? { utm: utmParams } : {}),
        },
      };
    };

    const run = async (attempt: number) => {
      const payloads = await buildPayloads();
      if (syncSequenceRef.current !== currentSequence) return;
      const isFirstRun = !hasSeededSyncRef.current;
      if (isFirstRun) {
        seedAudienceSyncCache(campaignId, payloads.audience, payloads.tracking);
        hasSeededSyncRef.current = true;
      }
      try {
        const { estimate } = await syncAudienceSettings(campaignId, {
          ...payloads,
          forceEstimate: isFirstRun,
        });
        if (syncSequenceRef.current !== currentSequence) return;
        if (estimate) {
          setEstimatedRecipients(getEstimatedRecipientsValue(estimate));
        }
        setIsSyncing(false);
      } catch (error) {
        if (syncSequenceRef.current !== currentSequence) return;
        if (isRateLimitError(error) && attempt === 0) {
          // The budget resets every 10s — retry once after the window.
          retryTimeout = window.setTimeout(() => {
            run(1).catch(() => undefined);
          }, 11_000);
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "Failed to sync audience settings";
        setSyncError(message);
        setIsSyncing(false);
      }
    };

    const timeout = window.setTimeout(() => {
      run(0).catch(() => undefined);
    }, 800);

    return () => {
      window.clearTimeout(timeout);
      if (retryTimeout !== undefined) window.clearTimeout(retryTimeout);
    };
  }, [
    campaignId,
    canSync,
    lists,
    tags,
    segments,
    selectedAudiences,
    smartSending,
    trackingParameters,
    utmParams,
  ]);

  const displayedEstimatedRecipients =
    estimatedRecipients ?? localEstimatedRecipients;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20">
          <UserGroupIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-balance">
            Audience & Tracking
          </h2>
          <p className="text-base text-muted-foreground text-pretty">
            Define who will receive your campaign and tracking settings
          </p>
        </div>
      </div>

      {/* Audience Section */}
      <div className="space-y-6 p-4 sm:p-6 bg-muted/30 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserGroupIcon
              aria-hidden="true"
              className="h-5 w-5 text-foreground"
            />
            <h3 className="text-xl font-semibold text-foreground">Audience</h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-border bg-background">
              {isSyncing ? (
                <ArrowPathIcon
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin"
                />
              ) : (
                <span className="text-sm font-semibold">
                  {displayedEstimatedRecipients}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Estimated recipients</span>
              <InformationCircleIcon aria-hidden="true" className="h-4 w-4" />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="selectedAudiences"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Send to</FormLabel>
              <FormControl>
                <AudienceSelector
                  value={field.value}
                  onChange={field.onChange}
                  lists={lists}
                  tags={tags}
                  segments={segments}
                  isSegmentsLoading={segmentsLoading}
                  unresolvedSelectionCount={unresolvedSelectionCount}
                />
              </FormControl>
              <FormDescription>
                Campaigns send to segments — named groups of contacts (like
                &quot;test-cohort&quot;) created in Intelligence → Segments.
                Individual contacts aren&apos;t selected here; add them to a
                segment first.{" "}
                <a
                  href={UTM_HELP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Learn more about UTM
                </a>
                .
              </FormDescription>
              {segmentsError ? (
                <p className="text-sm text-amber-400">
                  Failed to load saved segments: {segmentsError}
                </p>
              ) : null}
              {syncError ? (
                <p className="text-sm text-amber-400">
                  Failed to sync audience settings: {syncError}
                </p>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Don't Send To Section */}
      <div className="space-y-4 p-4 sm:p-6 bg-muted/30 rounded-2xl border border-border">
        <Label className="text-base font-medium text-foreground">
          Don&apos;t send to
        </Label>
        <FormField
          control={form.control}
          name="smartSending"
          render={({ field }) => (
            <FormItem className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Run on Smart Sending
                  </FormLabel>
                </div>
                <FormDescription>
                  This campaign will not be sent to profiles who received a
                  message from you in the last{" "}
                  <span className="font-medium text-foreground">10 hours</span>.
                  Smart Sending (thresholds) can be updated in{" "}
                  <Link
                    href={accountSettingsHref}
                    className="text-primary hover:underline"
                  >
                    account settings
                  </Link>
                  .
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Tracking Section */}
      <div className="space-y-4 p-4 sm:p-6 bg-muted/30 rounded-2xl border border-border">
        <div className="flex items-center gap-2">
          <ArrowTrendingUpIcon
            aria-hidden="true"
            className="h-5 w-5 text-foreground"
          />
          <h3 className="text-xl font-semibold text-foreground">Tracking</h3>
        </div>

        <FormField
          control={form.control}
          name="trackingParameters"
          render={({ field }) => (
            <FormItem className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Include tracking parameters
                  </FormLabel>
                </div>
                <FormDescription>
                  Links in this campaign will include audience tracking
                  information, called UTM parameters. This allows bounce
                  tracking within third-party analytics tools such as Google
                  Analytics.{" "}
                  <a
                    href={UTM_HELP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Learn more about UTM
                  </a>
                  .
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {trackingParameters ? (
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
            {(
              [
                {
                  name: "utmSource",
                  label: "Source",
                  placeholder: "onchain_suite",
                },
                { name: "utmMedium", label: "Medium", placeholder: "email" },
                {
                  name: "utmCampaign",
                  label: "Campaign",
                  placeholder: "spring_launch",
                },
                { name: "utmTerm", label: "Term", placeholder: "optional" },
                {
                  name: "utmContent",
                  label: "Content",
                  placeholder: "optional",
                },
              ] as const
            ).map((f) => (
              <FormField
                key={f.name}
                control={form.control}
                name={f.name}
                render={({ field }) => (
                  <FormItem
                    className={f.name === "utmContent" ? "sm:col-span-2" : ""}
                  >
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      utm_{f.label.toLowerCase()}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder={f.placeholder}
                        className="h-9 rounded-lg bg-card"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            <p className="text-[11px] leading-5 text-muted-foreground sm:col-span-2">
              Example:{" "}
              <span className="font-mono text-foreground">
                ?utm_source={(utmSource ?? "").trim() || "onchain_suite"}
                &amp;utm_medium={(utmMedium ?? "").trim() || "email"}
                {utmCampaign?.trim()
                  ? `&utm_campaign=${utmCampaign.trim()}`
                  : ""}
              </span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
