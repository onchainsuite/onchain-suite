"use client";

import {
  ArrowLeftIcon,
  ArrowsRightLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  CubeIcon,
  CursorArrowRaysIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  EyeIcon,
  PaperAirplaneIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { isJsonObject } from "@/lib/utils";

import {
  type AudienceProfile,
  type AudienceProfileActivityEvent,
  type AudienceProfileContractActivity,
  type AudienceProfileEmailEvent,
  type AudienceProfileTransaction,
  audienceService,
} from "@/features/audience/audience.service";
import {
  deriveDisplayName,
  extractWalletFields,
  hashHue,
  isSyntheticWalletEmail,
  normalizeTags,
  shortenWallet,
} from "@/features/audience/utils";

const formatUsd = (value: number | undefined) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${Math.round(value)}`;
  }
};

const activityIconForType = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("open")) return EyeIcon;
  if (t.includes("click")) return CursorArrowRaysIcon;
  if (t.includes("tx") || t.includes("swap") || t.includes("stake"))
    return CubeIcon;
  if (t.includes("tag")) return TagIcon;
  if (t.includes("profile")) return CheckCircleIcon;
  return ArrowsRightLeftIcon;
};

export function ProfileDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [copiedWallet, setCopiedWallet] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "activity" | "emails" | "transactions"
  >("activity");

  const hasId = id.length > 0;

  const profileQuery = useQuery({
    queryKey: [
      "audience",
      "profile",
      id,
      { include: "tags,attributes,wallets,health,lastAction" },
    ],
    queryFn: () =>
      audienceService.getProfile(id, {
        include: "tags,attributes,wallets,health,lastAction",
      }) as unknown as Promise<AudienceProfile>,
    enabled: hasId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const churnQuery = useQuery({
    queryKey: ["audience", "profile", id, "churn"],
    queryFn: () => audienceService.getProfileChurn(id),
    enabled: hasId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const contractActivityQuery = useQuery({
    queryKey: ["audience", "profile", id, "contract-activity", { limit: 10 }],
    queryFn: () =>
      audienceService.getProfileContractActivity(id, { limit: 10 }),
    enabled: hasId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const dappStatsQuery = useQuery({
    queryKey: ["audience", "profile", id, "dapp-stats"],
    queryFn: () => audienceService.getProfileDappStats(id),
    enabled: hasId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const emailsQuery = useQuery({
    queryKey: ["audience", "profile", id, "emails", { limit: 50 }],
    queryFn: () => audienceService.getProfileEmails(id, { limit: 50 }),
    enabled: hasId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const transactionsQuery = useQuery({
    queryKey: ["audience", "profile", id, "transactions", { limit: 25 }],
    queryFn: () => audienceService.getProfileTransactions(id, { limit: 25 }),
    enabled: hasId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const activityQuery = useQuery({
    queryKey: ["audience", "profile", id, "activity", { limit: 50 }],
    queryFn: () => audienceService.getProfileActivity(id, { limit: 50 }),
    enabled: hasId && activeTab === "activity",
    retry: false,
    refetchOnWindowFocus: false,
  });

  const profile = profileQuery.data;
  const tags = useMemo(() => normalizeTags(profile?.tags), [profile?.tags]);
  const { walletFull, wallet } = useMemo(
    () => extractWalletFields(profile),
    [profile]
  );

  const email = typeof profile?.email === "string" ? profile.email.trim() : "";
  // Wallet-only contacts carry a synthetic placeholder email — treat them as
  // having no email channel (channel-aware reachability, wallet-first).
  const hasEmailChannel = email.length > 0 && !isSyntheticWalletEmail(email);
  const name = useMemo(() => {
    return deriveDisplayName({
      name: profile?.name,
      fullName: (profile as unknown as { fullName?: unknown })?.fullName,
      email,
      wallet: walletFull,
      walletAddress: walletFull,
    });
  }, [email, profile, walletFull]);

  const status = typeof profile?.status === "string" ? profile.status : "";

  const intelligenceSegments = useMemo(() => {
    const attr = isJsonObject(profile?.attributes) ? profile?.attributes : {};
    const direct = (profile as unknown as { intelligenceSegments?: unknown })
      ?.intelligenceSegments;
    const pick = (v: unknown) =>
      Array.isArray(v) ? v.filter((s) => typeof s === "string") : [];
    const fromDirect = pick(direct);
    const fromAttr = pick(
      isJsonObject(attr)
        ? (attr as Record<string, unknown>).intelligenceSegments
        : undefined
    );
    return (fromDirect.length ? fromDirect : fromAttr) as string[];
  }, [profile]);

  const emailStats = useMemo(() => {
    const direct = (profile as unknown as { emailStats?: unknown })?.emailStats;
    const obj = isJsonObject(direct)
      ? (direct as Record<string, unknown>)
      : null;
    if (
      obj &&
      typeof obj.openRate === "number" &&
      typeof obj.clickRate === "number"
    ) {
      return {
        openRate: obj.openRate as number,
        clickRate: obj.clickRate as number,
      };
    }
    const items = emailsQuery.data?.items ?? [];
    const sent = items.length;
    const opened = items.filter(
      (e) => !!e.openedAt || String(e.status).includes("open")
    ).length;
    const clicked = items.filter(
      (e) => !!e.clickedAt || String(e.status).includes("click")
    ).length;
    const openRate = sent > 0 ? Math.round((opened / sent) * 1000) / 10 : 0;
    const clickRate = sent > 0 ? Math.round((clicked / sent) * 1000) / 10 : 0;
    return { openRate, clickRate };
  }, [emailsQuery.data, profile]);

  const onchainSummary = useMemo(() => {
    // Prefer the derived dapp-stats endpoint (true totals), then any summary
    // embedded on the profile, then fall back to the loaded transactions page.
    const dappStats = dappStatsQuery.data;
    if (
      dappStats &&
      typeof dappStats.transactions_count === "number" &&
      typeof dappStats.total_volume_usd === "number"
    ) {
      return {
        totalTxns: dappStats.transactions_count,
        totalVolumeUsd: dappStats.total_volume_usd,
      };
    }
    const direct = (profile as unknown as { onchainSummary?: unknown })
      ?.onchainSummary;
    const obj = isJsonObject(direct)
      ? (direct as Record<string, unknown>)
      : null;
    const totalTxns =
      obj && typeof obj.totalTxns === "number"
        ? (obj.totalTxns as number)
        : (transactionsQuery.data?.items?.length ?? 0);
    const totalVolumeUsd =
      obj && typeof obj.totalVolumeUsd === "number"
        ? (obj.totalVolumeUsd as number)
        : (transactionsQuery.data?.items ?? []).reduce((sum, t) => {
            const v = typeof t.valueUsd === "number" ? t.valueUsd : 0;
            return sum + v;
          }, 0);
    return { totalTxns, totalVolumeUsd };
  }, [dappStatsQuery.data, profile, transactionsQuery.data]);

  const copyWallet = () => {
    if (!walletFull) return;
    navigator.clipboard.writeText(walletFull).catch(() => undefined);
    setCopiedWallet(true);
    window.setTimeout(() => setCopiedWallet(false), 2000);
  };

  const getStatusStyles = (value: string) => {
    switch (value) {
      case "verified":
        return "bg-primary/10 text-primary border-primary/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  const getStatusIcon = (value: string) => {
    switch (value) {
      case "verified":
        return <CheckCircleIcon className="h-3 w-3" aria-hidden="true" />;
      case "pending":
        return <ClockIcon className="h-3 w-3" aria-hidden="true" />;
      default:
        return <ExclamationCircleIcon className="h-3 w-3" aria-hidden="true" />;
    }
  };

  const isLoading =
    profileQuery.isLoading ||
    churnQuery.isLoading ||
    contractActivityQuery.isLoading ||
    emailsQuery.isLoading ||
    transactionsQuery.isLoading;

  return (
    <div className="space-y-6" aria-busy={isLoading}>
      <Link
        href="/audience"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Back to Audience
      </Link>

      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-14 w-14 rounded-full skeleton-wave" />
          ) : (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold text-white shadow-lg"
              style={{
                backgroundColor: `hsl(${hashHue(profile?.id ?? id)}, 70%, 50%)`,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="h-7 w-56 rounded skeleton-wave" />
              ) : (
                <>
                  <h1 className="text-2xl font-light tracking-tight text-foreground">
                    {name}
                  </h1>
                  {status.length > 0 && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(status)}`}
                    >
                      {getStatusIcon(status)}
                      {status}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              {isLoading ? (
                <>
                  <div className="h-4 w-40 rounded skeleton-wave" />
                  <div className="h-4 w-4 rounded skeleton-wave" />
                  <div className="h-4 w-32 rounded skeleton-wave" />
                </>
              ) : (
                <>
                  <span>{hasEmailChannel ? email : "No email"}</span>
                  {wallet.length > 0 && (
                    <>
                      <span className="text-muted-foreground/50">|</span>
                      <span
                        className="font-mono text-xs text-muted-foreground/70"
                        title={walletFull}
                      >
                        {wallet}
                      </span>
                    </>
                  )}
                  {walletFull.length > 0 && (
                    <>
                      <button
                        onClick={copyWallet}
                        className="hover:text-foreground transition-colors"
                        aria-label="Copy wallet address"
                      >
                        {copiedWallet ? (
                          <CheckCircleIcon
                            className="h-3.5 w-3.5 text-primary"
                            aria-hidden="true"
                          />
                        ) : (
                          <ClipboardDocumentIcon
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                      <a
                        href={`https://etherscan.io/address/${walletFull}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                        aria-label="Open wallet in explorer"
                      >
                        <ArrowTopRightOnSquareIcon
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </a>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {hasEmailChannel ? (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
            Send Email
          </a>
        ) : (
          <button
            disabled
            title="This contact has no email channel — reach them with an in-app push instead."
            className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground opacity-50"
          >
            <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
            Send Email
          </button>
        )}
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {isLoading ? (
          <>
            <div className="h-7 w-20 rounded-full skeleton-wave" />
            <div className="h-7 w-28 rounded-full skeleton-wave" />
            <div className="h-7 w-24 rounded-full skeleton-wave" />
          </>
        ) : tags.length > 0 ? (
          tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">No tags</span>
        )}
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {intelligenceSegments.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CursorArrowRaysIcon
                className="h-5 w-5 text-secondary"
                aria-hidden="true"
              />
              <h3 className="text-sm font-medium text-foreground">
                Intelligence Segments
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {intelligenceSegments.map((seg) => (
                <span
                  key={seg}
                  className="rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary"
                >
                  {seg}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CubeIcon className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="text-sm font-medium text-foreground">
              Contract Activity
            </h3>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <>
                <div className="h-5 w-full rounded skeleton-wave" />
                <div className="h-5 w-full rounded skeleton-wave" />
                <div className="h-5 w-2/3 rounded skeleton-wave" />
              </>
            ) : (contractActivityQuery.data?.items ?? []).length > 0 ? (
              (contractActivityQuery.data?.items ?? []).map(
                (cl: AudienceProfileContractActivity) => (
                  <div
                    key={cl.contractAddress}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate font-medium text-foreground">
                        {cl.contractName?.length
                          ? cl.contractName
                          : shortenWallet(cl.contractAddress)}
                      </span>
                      {cl.label?.length ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {cl.label}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-muted-foreground">
                      {typeof cl.volumeUsd === "number"
                        ? formatUsd(cl.volumeUsd)
                        : ""}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                No contract activity
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ExclamationCircleIcon
              className={`h-5 w-5 ${
                churnQuery.data?.risk === "high"
                  ? "text-destructive"
                  : churnQuery.data?.risk === "medium"
                    ? "text-secondary"
                    : "text-primary"
              }`}
              aria-hidden="true"
            />
            <h3 className="text-sm font-medium text-foreground">
              Churn Prediction
            </h3>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-5 w-full rounded skeleton-wave" />
              <div className="h-5 w-2/3 rounded skeleton-wave" />
            </div>
          ) : churnQuery.data ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    churnQuery.data.risk === "high"
                      ? "bg-destructive/10 text-destructive"
                      : churnQuery.data.risk === "medium"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  {churnQuery.data.risk === "high"
                    ? "High Risk"
                    : churnQuery.data.risk === "medium"
                      ? "Medium Risk"
                      : "Low Risk"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Score: {churnQuery.data.score}/100
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Predicted LTV</span>
                <span className="font-semibold text-foreground">
                  {typeof churnQuery.data.predictedLtvUsd === "number"
                    ? formatUsd(churnQuery.data.predictedLtvUsd)
                    : "Not available"}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No churn prediction
            </div>
          )}
        </div>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email Open Rate
          </p>
          <p className="mt-2 text-3xl font-light text-foreground">
            {emailStats.openRate}%
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Click Rate
          </p>
          <p className="mt-2 text-3xl font-light text-foreground">
            {emailStats.clickRate}%
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Txns
          </p>
          <p className="mt-2 text-3xl font-light text-foreground">
            {onchainSummary.totalTxns}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Volume
          </p>
          <p className="mt-2 text-3xl font-light text-foreground">
            {onchainSummary.totalVolumeUsd > 0
              ? formatUsd(onchainSummary.totalVolumeUsd)
              : "Not available"}
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-1 border-b border-border">
        {(["activity", "emails", "transactions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "activity"
              ? "Activity Timeline"
              : tab === "emails"
                ? "Email History"
                : "Transactions"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {activeTab === "activity" && (
          <div className="space-y-4">
            {activityQuery.isLoading ? (
              <>
                <div className="h-16 w-full rounded-xl skeleton-wave" />
                <div className="h-16 w-full rounded-xl skeleton-wave" />
                <div className="h-16 w-2/3 rounded-xl skeleton-wave" />
              </>
            ) : (activityQuery.data?.items ?? []).length > 0 ? (
              (activityQuery.data?.items ?? []).map(
                (item: AudienceProfileActivityEvent) => {
                  const Icon = activityIconForType(item.type);
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {item.title}
                        </p>
                        {item.description?.length ? (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-xs text-muted-foreground/70">
                        {item.at}
                      </span>
                    </div>
                  );
                }
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                No activity yet
              </div>
            )}
          </div>
        )}

        {activeTab === "emails" && (
          <div className="space-y-3">
            {emailsQuery.isLoading ? (
              <>
                <div className="h-16 w-full rounded-xl skeleton-wave" />
                <div className="h-16 w-full rounded-xl skeleton-wave" />
                <div className="h-16 w-2/3 rounded-xl skeleton-wave" />
              </>
            ) : (emailsQuery.data?.items ?? []).length > 0 ? (
              (emailsQuery.data?.items ?? []).map(
                (emailItem: AudienceProfileEmailEvent) => (
                  <div
                    key={emailItem.id}
                    className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        {String(emailItem.status) === "clicked" ? (
                          <CursorArrowRaysIcon
                            className="h-4 w-4 text-primary"
                            aria-hidden="true"
                          />
                        ) : String(emailItem.status) === "opened" ? (
                          <EyeIcon
                            className="h-4 w-4 text-secondary"
                            aria-hidden="true"
                          />
                        ) : (
                          <PaperAirplaneIcon
                            className="h-4 w-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {emailItem.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sent {emailItem.sentAt}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        String(emailItem.status) === "clicked"
                          ? "bg-primary/20 text-primary"
                          : String(emailItem.status) === "opened"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {emailItem.status}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                No email history
              </div>
            )}
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="space-y-3">
            {transactionsQuery.isLoading ? (
              <>
                <div className="h-16 w-full rounded-xl skeleton-wave" />
                <div className="h-16 w-full rounded-xl skeleton-wave" />
                <div className="h-16 w-2/3 rounded-xl skeleton-wave" />
              </>
            ) : (transactionsQuery.data?.items ?? []).length > 0 ? (
              (transactionsQuery.data?.items ?? []).map(
                (tx: AudienceProfileTransaction) => (
                  <div
                    key={tx.hash}
                    className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <CubeIcon
                          className="h-4 w-4 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {shortenWallet(tx.hash)}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {shortenWallet(tx.from)} → {shortenWallet(tx.to)}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-medium text-foreground">
                        {typeof tx.valueUsd === "number"
                          ? formatUsd(tx.valueUsd)
                          : tx.value}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {tx.blockTimestamp}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                No transactions
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
