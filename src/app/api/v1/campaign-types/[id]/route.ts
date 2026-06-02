import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth-session";

import { campaignTypeStore } from "../store";

export const dynamic = "force-dynamic";

const pickNonEmpty = (...values: Array<string | undefined | null>) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0)
      return value.trim();
  }
  return "";
};

const DEFAULT_ALLOWED_ORIGINS = new Set<string>([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
]);

const getCorsHeaders = (req: NextRequest) => {
  const origin = req.headers.get("origin");
  if (!origin) return null;

  const allowed = new Set(DEFAULT_ALLOWED_ORIGINS);
  const extra = pickNonEmpty(process.env.NEXT_PUBLIC_APP_URL);
  if (extra) {
    try {
      allowed.add(new URL(extra).origin);
    } catch {
      allowed.add(extra);
    }
  }

  if (!allowed.has(origin)) return null;

  const requestHeaders =
    req.headers.get("access-control-request-headers") ??
    "content-type, authorization, x-api-key, x-org-id";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": requestHeaders,
    Vary: "Origin",
  };
};

const okJson = (req: NextRequest, payload: unknown, status = 200) => {
  const cors = getCorsHeaders(req);
  const res =
    status === 204
      ? new NextResponse(null, { status })
      : NextResponse.json(payload, { status });
  if (cors) {
    for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
  }
  return res;
};

const jsonError = (
  req: NextRequest,
  status: number,
  code: string,
  message: string
) => okJson(req, { error: { code, message } }, status);

const getClientIp = (req: NextRequest): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  return realIp && realIp.length > 0 ? realIp : "unknown";
};

type RateState = { count: number; resetAtMs: number };
const RATE_LIMIT_WINDOW_MS = 10_000;
const RATE_LIMIT_MAX = 30;
const rateState = new Map<string, RateState>();

const enforceRateLimit = (key: string) => {
  const now = Date.now();
  const existing = rateState.get(key);
  if (!existing || existing.resetAtMs <= now) {
    rateState.set(key, { count: 1, resetAtMs: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true as const };
  }
  if (existing.count >= RATE_LIMIT_MAX) {
    return {
      ok: false as const,
      retryAfterMs: Math.max(0, existing.resetAtMs - now),
    };
  }
  existing.count += 1;
  return { ok: true as const };
};

const isAdmin = (session: Awaited<ReturnType<typeof getSession>> | null) => {
  const role = session?.user?.role;
  if (typeof role !== "string") return false;
  const normalized = role.toLowerCase();
  return normalized === "admin" || normalized === "owner";
};

const patchSchema = z.object({
  label: z.string().trim().min(1).max(100).optional(),
  channels: z.array(z.string().trim().min(1).max(32)).optional(),
  supportsSchedule: z.boolean().optional(),
  supportsSequence: z.boolean().optional(),
});

export async function OPTIONS(req: NextRequest) {
  const cors = getCorsHeaders(req);
  const res = new NextResponse(null, { status: 204 });
  if (cors) {
    for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
  }
  return res;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startedAt = Date.now();
  const ip = getClientIp(req);

  try {
    const session = await getSession();
    if (!session?.user?.id && !session?.user?.email) {
      return jsonError(req, 401, "UNAUTHORIZED", "Authentication required.");
    }

    const orgId = (req.headers.get("x-org-id") ?? "").trim();
    if (orgId.length === 0) {
      return jsonError(req, 400, "MISSING_ORG", "x-org-id header is required.");
    }

    const { id } = await params;
    const safeId = (id ?? "").trim();
    if (safeId.length === 0) {
      return jsonError(req, 422, "VALIDATION_FAILED", "id is required.");
    }

    const rateKey = `campaign-types:get:${orgId}:${ip}`;
    const rate = enforceRateLimit(rateKey);
    if (!rate.ok) {
      const res = jsonError(req, 429, "RATE_LIMITED", "Too many requests.");
      const retrySeconds = Math.ceil(rate.retryAfterMs / 1000);
      res.headers.set("Retry-After", String(Math.max(1, retrySeconds)));
      return res;
    }

    const record = campaignTypeStore.get(orgId, safeId);
    if (!record) {
      return jsonError(req, 404, "NOT_FOUND", "Campaign type not found.");
    }

    console.warn("[api] campaign-types get", {
      at: new Date().toISOString(),
      orgId,
      ip,
      ok: true,
      status: 200,
      latencyMs: Date.now() - startedAt,
      id: record.id,
    });

    return okJson(req, { data: record }, 200);
  } catch (e) {
    console.error("[api] campaign-types get error", e);
    return jsonError(req, 500, "INTERNAL", "Failed to fetch campaign type.");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startedAt = Date.now();
  const ip = getClientIp(req);

  try {
    const session = await getSession();
    if (!session?.user?.id && !session?.user?.email) {
      return jsonError(req, 401, "UNAUTHORIZED", "Authentication required.");
    }

    if (!isAdmin(session)) {
      return jsonError(req, 403, "FORBIDDEN", "Admin access required.");
    }

    const orgId = (req.headers.get("x-org-id") ?? "").trim();
    if (orgId.length === 0) {
      return jsonError(req, 400, "MISSING_ORG", "x-org-id header is required.");
    }

    const { id } = await params;
    const safeId = (id ?? "").trim();
    if (safeId.length === 0) {
      return jsonError(req, 422, "VALIDATION_FAILED", "id is required.");
    }

    const rateKey = `campaign-types:update:${orgId}:${ip}`;
    const rate = enforceRateLimit(rateKey);
    if (!rate.ok) {
      const res = jsonError(req, 429, "RATE_LIMITED", "Too many requests.");
      const retrySeconds = Math.ceil(rate.retryAfterMs / 1000);
      res.headers.set("Retry-After", String(Math.max(1, retrySeconds)));
      return res;
    }

    const json = await req.json().catch(() => null);
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(req, 422, "VALIDATION_FAILED", "Invalid request body.");
    }

    const existing = campaignTypeStore.get(orgId, safeId);
    if (!existing) {
      return jsonError(req, 404, "NOT_FOUND", "Campaign type not found.");
    }
    if (existing.isSystem) {
      return jsonError(
        req,
        409,
        "CONFLICT",
        "System campaign types cannot be modified."
      );
    }

    const next = campaignTypeStore.update(orgId, safeId, parsed.data);
    if (!next) {
      return jsonError(req, 404, "NOT_FOUND", "Campaign type not found.");
    }

    console.warn("[api] campaign-types update", {
      at: new Date().toISOString(),
      orgId,
      ip,
      ok: true,
      status: 200,
      latencyMs: Date.now() - startedAt,
      id: next.id,
    });

    return okJson(req, { data: next }, 200);
  } catch (e) {
    console.error("[api] campaign-types update error", e);
    return jsonError(req, 500, "INTERNAL", "Failed to update campaign type.");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startedAt = Date.now();
  const ip = getClientIp(req);

  try {
    const session = await getSession();
    if (!session?.user?.id && !session?.user?.email) {
      return jsonError(req, 401, "UNAUTHORIZED", "Authentication required.");
    }

    if (!isAdmin(session)) {
      return jsonError(req, 403, "FORBIDDEN", "Admin access required.");
    }

    const orgId = (req.headers.get("x-org-id") ?? "").trim();
    if (orgId.length === 0) {
      return jsonError(req, 400, "MISSING_ORG", "x-org-id header is required.");
    }

    const { id } = await params;
    const safeId = (id ?? "").trim();
    if (safeId.length === 0) {
      return jsonError(req, 422, "VALIDATION_FAILED", "id is required.");
    }

    const rateKey = `campaign-types:delete:${orgId}:${ip}`;
    const rate = enforceRateLimit(rateKey);
    if (!rate.ok) {
      const res = jsonError(req, 429, "RATE_LIMITED", "Too many requests.");
      const retrySeconds = Math.ceil(rate.retryAfterMs / 1000);
      res.headers.set("Retry-After", String(Math.max(1, retrySeconds)));
      return res;
    }

    const existing = campaignTypeStore.get(orgId, safeId);
    if (!existing) {
      return jsonError(req, 404, "NOT_FOUND", "Campaign type not found.");
    }

    const result = campaignTypeStore.delete(orgId, safeId);
    if (!result.deleted) {
      if (result.reason === "SYSTEM") {
        return jsonError(
          req,
          409,
          "CONFLICT",
          "System campaign types cannot be deleted."
        );
      }
      return jsonError(req, 404, "NOT_FOUND", "Campaign type not found.");
    }

    console.warn("[api] campaign-types delete", {
      at: new Date().toISOString(),
      orgId,
      ip,
      ok: true,
      status: 204,
      latencyMs: Date.now() - startedAt,
      id: safeId,
    });

    return okJson(req, null, 204);
  } catch (e) {
    console.error("[api] campaign-types delete error", e);
    return jsonError(req, 500, "INTERNAL", "Failed to delete campaign type.");
  }
}
