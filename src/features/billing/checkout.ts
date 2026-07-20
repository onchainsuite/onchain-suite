import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

import { billingService, type PlanCheckoutSlug } from "./billing.service";

/**
 * Blockradar crypto checkout flow (docs/backend.md):
 *   POST /billing/checkout/plan → { paymentUrl, reference } → user pays on
 *   the hosted Blockradar page → the deposit webhook upgrades the org plan →
 *   GET /billing/upgrade/blockradar/{reference} reports the outcome.
 *
 * The pending reference is persisted locally so that when the user comes
 * back to the app after paying, we can poll the reference and confirm the
 * upgrade (see PendingCheckoutBanner).
 */

const PENDING_CHECKOUT_KEY = "onchain.billing.pendingCheckout.v1";

export interface PendingCheckout {
  reference: string;
  plan: string;
  startedAt: number;
  /** Human-readable checkout amount (e.g. "49" / "49 USDC"), when known. */
  amount?: string;
}

/** Fired whenever the pending checkout changes, so live UI (the pending
 * checkout banner) can pick it up without a remount. */
export const PENDING_CHECKOUT_EVENT = "onchain:billing-checkout";

const notifyPendingCheckoutChanged = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PENDING_CHECKOUT_EVENT));
};

/** Display plan name → catalog slug for POST /billing/checkout/plan. */
const PLAN_SLUGS: Record<string, PlanCheckoutSlug> = {
  launch: "launch",
  growth: "growth",
  pro: "pro",
};

export const planCheckoutSlug = (planName: string): PlanCheckoutSlug | null => {
  return PLAN_SLUGS[planName.trim().toLowerCase()] ?? null;
};

export const readPendingCheckout = (): PendingCheckout | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PENDING_CHECKOUT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isJsonObject(parsed)) return null;
    if (typeof parsed.reference !== "string" || parsed.reference.length === 0) {
      return null;
    }
    return {
      reference: parsed.reference,
      plan: typeof parsed.plan === "string" ? parsed.plan : "",
      startedAt:
        typeof parsed.startedAt === "number" ? parsed.startedAt : Date.now(),
      amount: typeof parsed.amount === "string" ? parsed.amount : undefined,
    };
  } catch {
    return null;
  }
};

export const writePendingCheckout = (pending: PendingCheckout): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pending));
  notifyPendingCheckoutChanged();
};

export const clearPendingCheckout = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_CHECKOUT_KEY);
  notifyPendingCheckoutChanged();
};

/**
 * Open the hosted payment page in a new tab so the app stays alive to track
 * the payment. Returns false when a popup blocker intervened — callers
 * should fall back to same-tab navigation.
 */
export const openCheckoutInNewTab = (paymentUrl: string): boolean => {
  if (typeof window === "undefined") return false;
  const win = window.open(paymentUrl, "_blank", "noopener,noreferrer");
  return win !== null;
};

export type CheckoutUpgradeStatus = "pending" | "completed" | "failed";

/**
 * Normalize the status of GET /billing/upgrade/blockradar/{reference}. The
 * exact field name varies with response nesting, so scan the usual spots.
 */
export const normalizeUpgradeStatus = (
  payload: unknown
): CheckoutUpgradeStatus => {
  const candidates: unknown[] = [];
  const collect = (value: unknown) => {
    if (!isJsonObject(value)) return;
    candidates.push(value.status, value.state, value.paymentStatus);
    if (isJsonObject(value.data)) collect(value.data);
    if (isJsonObject(value.upgrade)) collect(value.upgrade);
  };
  collect(payload);

  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const value = candidate.trim().toLowerCase();
    if (
      ["completed", "success", "succeeded", "paid", "confirmed"].includes(value)
    ) {
      return "completed";
    }
    if (
      [
        "failed",
        "expired",
        "cancelled",
        "canceled",
        "amount_mismatch",
      ].includes(value)
    ) {
      return "failed";
    }
  }
  return "pending";
};

export interface StartPlanCheckoutResult {
  paymentUrl: string;
  reference: string;
  amount?: string;
  mode?: string;
}

/**
 * Start a Blockradar checkout for a display plan name ("Growth", "Pro", …).
 * Persists the pending reference locally and returns the hosted payment URL
 * to redirect to. Returns null when the plan has no self-serve checkout
 * (e.g. Enterprise — contact sales).
 */
export async function startPlanCheckout(
  planName: string,
  organizationId?: string
): Promise<StartPlanCheckoutResult | null> {
  const slug = planCheckoutSlug(planName);
  if (!slug) return null;

  const orgId = organizationId ?? getSelectedOrganizationId() ?? undefined;
  if (!orgId) throw new Error("No active organization selected.");

  let res;
  try {
    res = await billingService.checkoutPlan({
      plan: slug,
      organizationId: orgId,
      billingCycle: "monthly",
    });
  } catch (error) {
    // "Failed to create payment link" here means the backend couldn't mint
    // the Blockradar link — usually missing operator setup (API key, master
    // wallet, webhook) in this environment, not a user problem.
    const message =
      error instanceof Error ? error.message : "Couldn't start checkout.";
    throw new Error(
      `${message} If this keeps happening, crypto checkout isn't configured for this environment yet — contact support or try again later.`,
      { cause: error }
    );
  }

  const paymentUrl =
    typeof res.paymentUrl === "string" && res.paymentUrl.length > 0
      ? res.paymentUrl
      : "";
  const reference =
    typeof res.reference === "string" && res.reference.length > 0
      ? res.reference
      : "";

  if (!paymentUrl || !reference) {
    throw new Error(
      "Checkout did not return a payment link. Please try again."
    );
  }

  const amount =
    typeof res.amount === "number"
      ? String(res.amount)
      : typeof res.amount === "string" && res.amount.trim().length > 0
        ? res.amount
        : undefined;

  writePendingCheckout({
    reference,
    plan: planName,
    startedAt: Date.now(),
    amount,
  });
  return {
    paymentUrl,
    reference,
    amount,
    mode: typeof res.mode === "string" ? res.mode : undefined,
  };
}
