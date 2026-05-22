import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { ReactElement } from "react";

export type NormalizedTag = string;

export function getStatusIcon(status: string): ReactElement {
  switch (status) {
    case "verified":
      return <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
    case "pending":
      return <Clock className="h-3.5 w-3.5 text-secondary" />;
    default:
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
  }
}

export function getHealthColor(score: number): string {
  if (score >= 70) return "text-primary";
  if (score >= 40) return "text-secondary";
  return "text-destructive";
}

export function getHealthBarColor(score: number): string {
  if (score >= 70) return "bg-primary";
  if (score >= 40) return "bg-secondary";
  return "bg-destructive";
}

export function normalizeTags(input: unknown): NormalizedTag[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((t) => {
      if (typeof t === "string") return t;
      if (t && typeof t === "object") {
        const obj = t as Record<string, unknown>;
        const candidate = obj.name ?? obj.label ?? obj.value ?? obj.id ?? "";
        return typeof candidate === "string" ? candidate : String(candidate);
      }
      return "";
    })
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export function shortenWallet(input: unknown): string {
  if (typeof input !== "string") return "";
  const s = input.trim();
  if (s.length === 0) return "";
  if (!s.startsWith("0x") || s.length < 10) return s;
  if (s.length <= 18) return s;
  return `${s.slice(0, 6)}…${s.slice(-4)}`;
}

export function extractWalletFields(input: unknown): {
  walletFull: string;
  wallet: string;
} {
  if (!input || typeof input !== "object") {
    return { walletFull: "", wallet: "" };
  }
  const obj = input as Record<string, unknown>;
  const candidates: unknown[] = [
    obj.wallet,
    obj.walletAddress,
    obj.wallet_address,
    obj.address,
  ];
  const nestedCandidates = [obj.wallet, obj.walletAddress].flatMap((v) => {
    if (!v || typeof v !== "object") return [];
    const nested = v as Record<string, unknown>;
    return [nested.address, nested.walletAddress, nested.wallet];
  });
  const arrayCandidates = [
    obj.wallets,
    obj.addresses,
    obj.walletAddresses,
  ].flatMap((v) => {
    if (!Array.isArray(v)) return [];
    return v.flatMap((item) => {
      if (typeof item === "string") return [item];
      if (!item || typeof item !== "object") return [];
      const nested = item as Record<string, unknown>;
      return [
        nested.address,
        nested.walletAddress,
        nested.wallet_address,
        nested.wallet,
      ];
    });
  });

  const all = [...candidates, ...nestedCandidates, ...arrayCandidates];

  const walletFull = (
    all.find(
      (v): v is string => typeof v === "string" && v.trim().length > 0
    ) ?? ""
  ).trim();
  return { walletFull, wallet: shortenWallet(walletFull) };
}

const toTitleCase = (value: string) => {
  return value
    .split(/[\s._-]+/g)
    .filter((p) => p.length > 0)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
};

export function deriveDisplayName(input: {
  name?: unknown;
  fullName?: unknown;
  email?: unknown;
  wallet?: unknown;
  walletAddress?: unknown;
}): string {
  const name =
    typeof input.name === "string" && input.name.trim().length > 0
      ? input.name.trim()
      : typeof input.fullName === "string" && input.fullName.trim().length > 0
        ? input.fullName.trim()
        : "";
  if (name.length > 0) return name;

  if (typeof input.email === "string" && input.email.includes("@")) {
    const local = input.email.split("@")[0] ?? "";
    const cleaned = local.replace(/\+/g, " ").trim();
    const next = cleaned.length > 0 ? toTitleCase(cleaned) : "";
    if (next.length > 0) return next;
  }

  const wallet =
    typeof input.wallet === "string"
      ? input.wallet
      : typeof input.walletAddress === "string"
        ? input.walletAddress
        : "";
  const short = shortenWallet(wallet);
  if (short.length > 0) return short;

  return "Unnamed profile";
}

export function hashHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  const next = Math.abs(hash) % 360;
  return Number.isFinite(next) ? next : 210;
}
