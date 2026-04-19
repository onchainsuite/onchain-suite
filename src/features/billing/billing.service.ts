import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId } from "@/lib/utils";

export type BillingPeriod = "month" | "current";

export type BillingPlanName = "Growth" | "Pro" | "Enterprise";

export interface BillingOverview {
  plan?: BillingPlan;
  usage?: BillingUsageSummary;
  limits?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BillingUsageSummary {
  [key: string]: unknown;
}

export interface BillingUsage {
  period?: BillingPeriod;
  items?: Array<{
    key: string;
    used: number;
    limit?: number;
    unit?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface BillingPlan {
  name?: string;
  status?: string;
  price?: string | number;
  interval?: "month" | "year" | string;
  [key: string]: unknown;
}

export interface BillingPlansResponse {
  plans?: BillingPlan[];
  [key: string]: unknown;
}

export interface UpgradeFiatRequest {
  plan: BillingPlanName;
}

export interface UpgradeBlockradarRequest {
  desiredListSize: number;
  plan?: BillingPlanName;
}

export interface BillingUpgradeResponse {
  success?: boolean;
  checkoutUrl?: string;
  reference?: string;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export type InvoiceStatus = "paid" | "open" | "void" | "uncollectible" | string;

export interface BillingInvoice {
  id: string;
  number?: string;
  status?: InvoiceStatus;
  amount?: number | string;
  currency?: string;
  issuedAt?: string;
  dueAt?: string;
  hostedInvoiceUrl?: string;
  pdfUrl?: string;
  [key: string]: unknown;
}

export interface InvoiceListResponse {
  items?: BillingInvoice[];
  data?: BillingInvoice[];
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: unknown;
}

export interface InvoiceDownloadResponse {
  url?: string;
  [key: string]: unknown;
}

export type PaymentMethodType = "card" | "crypto";

export interface BillingPaymentMethod {
  id: string;
  type: PaymentMethodType;
  brand?: string;
  last4?: string;
  address?: unknown;
  isDefault?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export interface PaymentMethodsListResponse {
  items?: BillingPaymentMethod[];
  data?: BillingPaymentMethod[];
  [key: string]: unknown;
}

export interface AddPaymentMethodRequest {
  type: PaymentMethodType;
  last4?: string;
  brand?: string;
  address?: unknown;
  isDefault?: boolean;
}

export interface SetDefaultPaymentMethodRequest {
  id: string;
}

export interface BillingServiceOptions {
  orgId?: string;
}

const BILLING_TAG = "onchain:billing-api";

const pickOrgId = (options?: BillingServiceOptions): string | null => {
  return options?.orgId ?? getSelectedOrganizationId() ?? null;
};

const toFriendlyMessage = (error: unknown): string => {
  const e = error as AxiosError<any>;
  const status = e?.response?.status;
  const serverMessage =
    e?.response?.data?.error?.message ??
    e?.response?.data?.message ??
    e?.message ??
    "";
  const lowered = String(serverMessage).toLowerCase();

  if (!status)
    return "Network error. Please check your connection and try again.";
  if (status === 401)
    return "You’re not authenticated. Please sign in again and retry.";
  if (status === 403)
    return "You don’t have permission to perform this action.";
  if (status === 400 && lowered.includes("database error"))
    return "Billing is not available for this organization yet. Please try again later.";
  if (status === 404) return "Billing resource not found.";
  if (status === 409) return serverMessage || "Request conflict. Please retry.";
  if (status === 422)
    return serverMessage || "Validation error. Please review your input.";
  if (status === 429)
    return "Too many requests. Please wait a moment and try again.";
  if (status >= 500)
    return "Billing service is temporarily unavailable. Please try again.";
  return serverMessage || "Unexpected billing error. Please try again.";
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class SimpleRateLimiter {
  private lastRunAt = 0;
  private chain: Promise<void> = Promise.resolve();

  constructor(private readonly minIntervalMs: number) {}

  schedule<T>(fn: () => Promise<T>): Promise<T> {
    const run = async () => {
      const now = Date.now();
      const waitFor = Math.max(0, this.minIntervalMs - (now - this.lastRunAt));
      if (waitFor > 0) await sleep(waitFor);
      this.lastRunAt = Date.now();
      return fn();
    };

    const next = this.chain.then(run, run) as Promise<T>;
    this.chain = next.then(
      () => undefined,
      () => undefined
    );
    return next;
  }
}

const limiter = new SimpleRateLimiter(
  process.env.NODE_ENV === "test" ? 0 : 250
);

const logBillingEvent = (detail: Record<string, unknown>) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(BILLING_TAG, { detail }));
  }
};

const shouldRetry = (error: unknown): boolean => {
  const e = error as AxiosError<any>;
  if (!e?.response) return true;
  const status = e.response.status;
  return status === 429 || status >= 500;
};

const requestWithRetry = async <T>(
  config: AxiosRequestConfig,
  opts?: { retries?: number; retryBaseDelayMs?: number }
): Promise<AxiosResponse<T>> => {
  const retries = opts?.retries ?? 2;
  const retryBaseDelayMs = opts?.retryBaseDelayMs ?? 400;

  let attempt = 0;
  for (;;) {
    try {
      return await apiClient.request<T>(config);
    } catch (err) {
      attempt += 1;
      if (attempt > retries || !shouldRetry(err)) throw err;
      const delay = retryBaseDelayMs * 2 ** (attempt - 1);
      await sleep(delay);
    }
  }
};

const billingRequest = async <T>(
  config: AxiosRequestConfig,
  options?: BillingServiceOptions
): Promise<T> => {
  const orgId = pickOrgId(options);
  const headers = {
    ...(config.headers ?? {}),
    ...(orgId ? { "x-org-id": orgId } : {}),
    "x-onchain-silent-error": "1",
  };

  const safeMeta = {
    method: String(config.method ?? "GET").toUpperCase(),
    url: String(config.url ?? ""),
    orgIdPresent: !!orgId,
  };

  return limiter.schedule(async () => {
    const startedAt = Date.now();
    try {
      const res = await requestWithRetry<T>({ ...config, headers });
      logBillingEvent({
        ...safeMeta,
        ok: true,
        status: res.status,
        ms: Date.now() - startedAt,
      });
      const data = (res.data as any)?.data ?? res.data;
      return data as T;
    } catch (error) {
      const e = error as AxiosError<any>;
      logBillingEvent({
        ...safeMeta,
        ok: false,
        status: e?.response?.status ?? null,
        ms: Date.now() - startedAt,
      });
      throw new Error(toFriendlyMessage(error));
    }
  });
};

export const billingService = {
  /**
   * Get overview of current plan, usage, and limits.
   *
   * @example
   * const overview = await billingService.getOverview()
   */
  getOverview(options?: BillingServiceOptions) {
    return billingRequest<BillingOverview>(
      { method: "GET", url: "/billing" },
      options
    );
  },

  /**
   * Get detailed usage statistics.
   *
   * @example
   * const usage = await billingService.getUsage({ period: "month" })
   */
  getUsage(
    params?: { period?: BillingPeriod },
    options?: BillingServiceOptions
  ) {
    return billingRequest<BillingUsage>(
      { method: "GET", url: "/billing/usage", params },
      options
    );
  },

  /**
   * Get current plan and upgrade options.
   */
  getPlan(options?: BillingServiceOptions) {
    return billingRequest<BillingPlan>(
      { method: "GET", url: "/billing/plan" },
      options
    );
  },

  /**
   * List all available plans.
   */
  getPlans(options?: BillingServiceOptions) {
    return billingRequest<BillingPlansResponse>(
      { method: "GET", url: "/billing/plans" },
      options
    );
  },

  /**
   * Upgrade plan using fiat checkout.
   *
   * @example
   * const res = await billingService.upgradeFiat({ plan: "Pro" })
   */
  upgradeFiat(body: UpgradeFiatRequest, options?: BillingServiceOptions) {
    return billingRequest<BillingUpgradeResponse>(
      { method: "POST", url: "/billing/upgrade", data: body },
      options
    );
  },

  /**
   * Upgrade plan using Blockradar (crypto checkout).
   */
  upgradeBlockradar(
    body: UpgradeBlockradarRequest,
    options?: BillingServiceOptions
  ) {
    return billingRequest<BillingUpgradeResponse>(
      { method: "POST", url: "/billing/upgrade/blockradar", data: body },
      options
    );
  },

  /**
   * Check status of a specific Blockradar upgrade reference.
   */
  getBlockradarUpgradeStatus(
    reference: string,
    options?: BillingServiceOptions
  ) {
    return billingRequest<BillingUpgradeResponse>(
      { method: "GET", url: `/billing/upgrade/blockradar/${reference}` },
      options
    );
  },

  /**
   * List invoices.
   */
  listInvoices(
    params?: { page?: number; limit?: number; status?: InvoiceStatus },
    options?: BillingServiceOptions
  ) {
    return billingRequest<InvoiceListResponse>(
      { method: "GET", url: "/billing/invoices", params },
      options
    );
  },

  /**
   * Get single invoice details.
   */
  getInvoice(invoiceId: string, options?: BillingServiceOptions) {
    return billingRequest<BillingInvoice>(
      { method: "GET", url: `/billing/invoices/${invoiceId}` },
      options
    );
  },

  /**
   * Get signed download URL for a PDF invoice.
   */
  getInvoiceDownloadUrl(invoiceId: string, options?: BillingServiceOptions) {
    return billingRequest<InvoiceDownloadResponse>(
      { method: "GET", url: `/billing/invoices/${invoiceId}/download` },
      options
    );
  },

  /**
   * List payment methods.
   */
  listPaymentMethods(options?: BillingServiceOptions) {
    return billingRequest<PaymentMethodsListResponse>(
      { method: "GET", url: "/billing/payment-methods" },
      options
    );
  },

  /**
   * Add a payment method.
   */
  addPaymentMethod(
    body: AddPaymentMethodRequest,
    options?: BillingServiceOptions
  ) {
    return billingRequest<BillingPaymentMethod>(
      { method: "POST", url: "/billing/payment-methods", data: body },
      options
    );
  },

  /**
   * Remove a payment method by id.
   */
  removePaymentMethod(id: string, options?: BillingServiceOptions) {
    return billingRequest<{ success?: boolean }>(
      { method: "DELETE", url: `/billing/payment-methods/${id}` },
      options
    );
  },

  /**
   * Set default payment method.
   */
  setDefaultPaymentMethod(
    body: SetDefaultPaymentMethodRequest,
    options?: BillingServiceOptions
  ) {
    return billingRequest<{ success?: boolean }>(
      { method: "PUT", url: "/billing/payment-methods/default", data: body },
      options
    );
  },
};
