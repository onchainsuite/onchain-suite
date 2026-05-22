import { type NextRequest, NextResponse } from "next/server";

import { isJsonObject } from "@/lib/utils";

export const dynamic = "force-dynamic";

type AudienceImportExportFormat = "csv" | "json";
type AudienceJobState =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

type AudienceImportError = {
  rowNumber?: number;
  key?: string;
  code?: string;
  message: string;
};

type AudienceImportJob = {
  jobId: string;
  orgId: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  state: AudienceJobState;
  format: AudienceImportExportFormat;
  totalRows?: number;
  processedRows: number;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  errors: AudienceImportError[];
};

type AudienceExportJob = {
  jobId: string;
  orgId: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  state: AudienceJobState;
  format: AudienceImportExportFormat;
  processedRows: number;
  totalRows?: number;
  fileName: string;
  contentType: string;
  fileBytes: Uint8Array;
};

const audienceImportJobs = new Map<string, AudienceImportJob>();
const audienceExportJobs = new Map<string, AudienceExportJob>();

const DEFAULT_EDITOR_ORIGIN_PROD = "https://editor.onchainsuite.com";
const DEFAULT_EDITOR_ORIGIN_DEV = "https://email-builder-js-ycf8.onrender.com";

const pickNonEmpty = (...values: Array<string | undefined | null>) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return "";
};

const getAllowedCorsOrigins = () => {
  const allowed = new Set<string>([
    DEFAULT_EDITOR_ORIGIN_PROD,
    DEFAULT_EDITOR_ORIGIN_DEV,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
  ]);

  const extra = pickNonEmpty(process.env.NEXT_PUBLIC_EMAIL_EDITOR_ORIGIN);
  if (extra) {
    try {
      allowed.add(new URL(extra).origin);
    } catch {
      allowed.add(extra.trim());
    }
  }

  return allowed;
};

const getCorsHeaders = (req: NextRequest) => {
  const origin = req.headers.get("origin");
  if (!origin) return null;
  const allowed = getAllowedCorsOrigins();
  if (!allowed.has(origin)) return null;

  const requestHeaders =
    req.headers.get("access-control-request-headers") ??
    "content-type, authorization, x-api-key, x-org-id";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": requestHeaders,
    Vary: "Origin",
  };
};

const getBackendBaseUrl = () => {
  const devDefault = "http://127.0.0.1:3333/api/v1";
  const prodDefault = "https://onchain-backend-dvxw.onrender.com/api/v1";
  const backendUrl = pickNonEmpty(
    process.env.BACKEND_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NODE_ENV === "production" ? prodDefault : devDefault
  );
  return backendUrl.replace(/\/$/, "");
};

const getBackendApiKey = () => {
  return pickNonEmpty(
    process.env.BACKEND_API_KEY,
    process.env.NEXT_PUBLIC_BACKEND_API_KEY,
    process.env.NEXT_PUBLIC_API_KEY
  );
};

const extractTokenFromCookie = (cookieHeader: string): string | null => {
  const pairs = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => {
      const idx = p.indexOf("=");
      if (idx === -1) return [p, ""] as const;
      return [p.slice(0, idx), p.slice(idx + 1)] as const;
    });

  const cookieMap = new Map(pairs);
  const raw = cookieMap.get("onchain.token") ?? null;
  return raw ? decodeURIComponent(raw) : null;
};

const extractBearer = (authorizationHeader: string | null): string | null => {
  if (!authorizationHeader) return null;
  const trimmed = authorizationHeader.trim();
  if (trimmed.length === 0) return null;
  const match = /^Bearer\s+(.+)$/i.exec(trimmed);
  if (!match) return null;
  const token = match[1]?.trim() ?? "";
  return token.length > 0 ? token : null;
};

const requireOrgId = (req: NextRequest): string | null => {
  const raw = req.headers.get("x-org-id") ?? "";
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const hasAnyAuth = (req: NextRequest): boolean => {
  const auth = req.headers.get("authorization");
  if (extractBearer(auth)) return true;
  const cookie = req.headers.get("cookie") ?? "";
  if (extractTokenFromCookie(cookie)) return true;
  return /(^|;\s*)(__Secure-)?better-auth\.session_token=/.test(cookie);
};

const randomJobId = () => {
  const cryptoObj = (globalThis as unknown as { crypto?: Crypto }).crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const okJson = (req: NextRequest, payload: unknown, status = 200) => {
  const cors = getCorsHeaders(req);
  const res = NextResponse.json(payload, { status });
  if (cors) {
    for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
  }
  return res;
};

const readJsonSafe = async (req: NextRequest): Promise<unknown> => {
  try {
    return await req.json();
  } catch {
    return null;
  }
};

const parseCsvRow = (line: string): string[] => {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      const next = i + 1 < line.length ? line[i + 1] : "";
      if (inQuotes && next === '"') {
        cur += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
};

const parseCsv = (text: string) => {
  const cleaned = text.replace(/^\uFEFF/, "");
  const lines = cleaned.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] as string[][] };
  const headers = parseCsvRow(lines[0]).map((h) =>
    h.replace(/^"|"$/g, "").trim()
  );
  const rows = lines.slice(1).map((line) => parseCsvRow(line));
  return { headers, rows };
};

const toTags = (raw: unknown): string[] | undefined => {
  if (Array.isArray(raw)) {
    const out = raw
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter((v) => v.length > 0);
    return out.length > 0 ? out : undefined;
  }
  if (typeof raw !== "string") return undefined;
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return parts.length > 0 ? parts : undefined;
};

const buildBackendHeaders = (req: NextRequest) => {
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("accept-encoding");
  ensureBackendAuthHeaders(req, headers);
  const apiKey = getBackendApiKey();
  if (apiKey && !headers.has("x-api-key")) headers.set("x-api-key", apiKey);
  return headers;
};

const fetchBackendJson = async (
  req: NextRequest,
  input: string,
  init: RequestInit
): Promise<{ ok: boolean; status: number; json: unknown; text: string }> => {
  const upstream = await fetch(input, init);
  const text = await upstream.text().catch(() => "");
  const contentType = upstream.headers.get("content-type") ?? "";
  const json =
    contentType.includes("application/json") && text.length > 0
      ? (() => {
          try {
            return JSON.parse(text);
          } catch {
            return null;
          }
        })()
      : null;
  return { ok: upstream.ok, status: upstream.status, json, text };
};

const handleAudienceImportExport = async (
  req: NextRequest,
  path: string[],
  method: string
) => {
  if (path.length < 2 || path[0] !== "audience") return null;
  const sub = path[1] ?? "";
  if (sub !== "imports" && sub !== "exports") return null;

  const orgId = requireOrgId(req);
  if (!orgId) {
    return okJson(
      req,
      {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Missing x-org-id header",
        },
        meta: {
          timestamp: new Date().toISOString(),
          path: req.nextUrl.pathname,
          requestId: "unknown",
        },
      },
      400
    );
  }

  if (!hasAnyAuth(req)) {
    return okJson(
      req,
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication failed",
          details: { error: "Missing session", statusCode: 401 },
        },
        meta: {
          timestamp: new Date().toISOString(),
          path: req.nextUrl.pathname,
          requestId: "unknown",
        },
      },
      401
    );
  }

  const backendBase = getBackendBaseUrl();
  const backendHeaders = buildBackendHeaders(req);

  if (sub === "imports") {
    const jobId = path.length >= 3 ? path[2] : null;
    const extra = path.length >= 4 ? path[3] : null;

    if (method === "POST" && !jobId) {
      const formatFromQuery = (req.nextUrl.searchParams.get("format") ?? "")
        .trim()
        .toLowerCase();
      const fd = await req.formData().catch(() => null);
      const file = fd?.get("file");
      if (!(file instanceof File)) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "BAD_REQUEST", message: "Missing file" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          400
        );
      }

      const maxBytes = 25 * 1024 * 1024;
      if (file.size > maxBytes) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "PAYLOAD_TOO_LARGE", message: "File too large" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          413
        );
      }

      const fileName = file.name.toLowerCase();
      const inferred: AudienceImportExportFormat | null = fileName.endsWith(
        ".csv"
      )
        ? "csv"
        : fileName.endsWith(".json")
          ? "json"
          : null;
      const format: AudienceImportExportFormat | null =
        formatFromQuery === "csv" || formatFromQuery === "json"
          ? (formatFromQuery as AudienceImportExportFormat)
          : inferred;

      if (!format) {
        return okJson(
          req,
          {
            success: false,
            error: {
              code: "UNSUPPORTED_MEDIA_TYPE",
              message: "Only CSV and JSON are supported",
            },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          415
        );
      }

      const mappingRaw = fd?.get("mapping");
      const mapping =
        typeof mappingRaw === "string" && mappingRaw.length > 0
          ? (() => {
              try {
                const json = JSON.parse(mappingRaw);
                return isJsonObject(json)
                  ? (json as Record<string, string>)
                  : null;
              } catch {
                return null;
              }
            })()
          : null;

      const now = new Date().toISOString();
      const createdJobId = randomJobId();
      const job: AudienceImportJob = {
        jobId: createdJobId,
        orgId,
        createdAt: now,
        startedAt: now,
        state: "processing",
        format,
        processedRows: 0,
        createdCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        errorCount: 0,
        errors: [],
      };
      audienceImportJobs.set(createdJobId, job);

      const text = await file.text();
      const maxRows = 2000;

      const pushError = (err: AudienceImportError) => {
        job.errors.push(err);
        job.errorCount = job.errors.length;
      };

      const upsertOne = async (
        body: Record<string, unknown>,
        rowNumber?: number
      ) => {
        const res = await fetchBackendJson(
          req,
          `${backendBase}/audience/profiles`,
          {
            method: "POST",
            headers: (() => {
              const h = new Headers(backendHeaders);
              h.set("content-type", "application/json");
              return h;
            })(),
            body: JSON.stringify(body),
            cache: "no-store",
          }
        );
        if (res.ok) {
          job.createdCount += 1;
          return;
        }
        if (res.status === 409) {
          job.skippedCount += 1;
          return;
        }
        const msg =
          (isJsonObject(res.json) && typeof res.json.message === "string"
            ? res.json.message
            : res.text) || "Failed to import row";
        pushError({ rowNumber, message: msg });
      };

      try {
        if (format === "csv") {
          const { headers, rows } = parseCsv(text);
          job.totalRows = rows.length;
          const headerToIndex = new Map<string, number>();
          headers.forEach((h, i) => headerToIndex.set(h, i));
          const limit = Math.min(rows.length, maxRows);
          for (let i = 0; i < limit; i += 1) {
            const row = rows[i];
            const rowNumber = i + 2;
            const body: Record<string, unknown> = {};
            const attributes: Record<string, unknown> = {};
            for (const [header, idx] of headerToIndex.entries()) {
              const rawValue = idx < row.length ? row[idx] : "";
              const value = rawValue.replace(/^"|"$/g, "").trim();
              if (!value) continue;
              const target =
                mapping && typeof mapping[header] === "string"
                  ? mapping[header]
                  : header;
              const normalized = String(target).trim();
              if (!normalized) continue;
              if (normalized.startsWith("attributes.")) {
                const key = normalized.slice("attributes.".length).trim();
                if (key) attributes[key] = value;
                continue;
              }
              if (
                normalized === "walletAddress" ||
                normalized === "wallet" ||
                normalized === "wallet_address" ||
                normalized === "address"
              ) {
                body.walletAddress = value;
                body.wallet = value;
              } else if (normalized === "tags") body.tags = toTags(value);
              else body[normalized] = value;
            }
            if (Object.keys(attributes).length > 0)
              body.attributes = attributes;
            if (!body.email && !body.wallet && !body.walletAddress) {
              pushError({ rowNumber, message: "Missing email or wallet" });
              job.processedRows += 1;
              continue;
            }
            await upsertOne(body, rowNumber);
            job.processedRows += 1;
          }
        } else {
          const parsed = JSON.parse(text);
          const arr = Array.isArray(parsed)
            ? parsed
            : isJsonObject(parsed) &&
                Array.isArray((parsed as { data?: unknown }).data)
              ? ((parsed as { data?: unknown }).data as unknown[])
              : null;
          if (!arr) {
            job.state = "failed";
            pushError({
              message: "Invalid JSON format. Expected an array or { data: [] }",
            });
          } else {
            job.totalRows = arr.length;
            const limit = Math.min(arr.length, maxRows);
            for (let i = 0; i < limit; i += 1) {
              const item = arr[i];
              const rowNumber = i + 1;
              const obj = isJsonObject(item)
                ? (item as Record<string, unknown>)
                : {};
              const next: Record<string, unknown> = {};
              if (typeof obj.email === "string") next.email = obj.email;
              if (typeof obj.name === "string") next.name = obj.name;
              if (typeof obj.walletAddress === "string") {
                next.walletAddress = obj.walletAddress;
                next.wallet = obj.walletAddress;
              }
              if (
                typeof obj.wallet === "string" &&
                !("walletAddress" in next)
              ) {
                next.walletAddress = obj.wallet;
                next.wallet = obj.wallet;
              }
              if ("tags" in obj) {
                const tags = toTags(obj.tags);
                if (tags) next.tags = tags;
              }
              if (isJsonObject(obj.attributes))
                next.attributes = obj.attributes;
              for (const [k, v] of Object.entries(obj)) {
                if (
                  k === "email" ||
                  k === "name" ||
                  k === "wallet" ||
                  k === "walletAddress" ||
                  k === "tags" ||
                  k === "attributes"
                ) {
                  continue;
                }
                if (!next.attributes) next.attributes = {};
                if (isJsonObject(next.attributes))
                  (next.attributes as Record<string, unknown>)[k] = v;
              }
              if (!next.email && !next.wallet && !next.walletAddress) {
                pushError({ rowNumber, message: "Missing email or wallet" });
                job.processedRows += 1;
                continue;
              }
              await upsertOne(next, rowNumber);
              job.processedRows += 1;
            }
          }
        }

        job.state = job.state === "failed" ? "failed" : "completed";
        job.finishedAt = new Date().toISOString();
      } catch (e) {
        job.state = "failed";
        job.finishedAt = new Date().toISOString();
        pushError({
          message: e instanceof Error ? e.message : "Import failed",
        });
      }

      const responseData = {
        jobId: job.jobId,
        state: job.state,
        format: job.format,
        createdAt: job.createdAt,
      };

      return okJson(
        req,
        {
          success: true,
          message: "Import job created",
          data: responseData,
          timestamp: new Date().toISOString(),
          requestId: "local",
        },
        202
      );
    }

    if (method === "GET" && jobId && !extra) {
      const job = audienceImportJobs.get(jobId);
      if (!job || job.orgId !== orgId) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Job not found" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          404
        );
      }
      const progress =
        typeof job.totalRows === "number" && job.totalRows > 0
          ? Math.round((job.processedRows / job.totalRows) * 100)
          : job.state === "completed"
            ? 100
            : 0;
      return okJson(req, {
        success: true,
        message: "Request processed successfully",
        data: {
          ...job,
          progress,
          errorSample: job.errors.slice(0, 50),
        },
        timestamp: new Date().toISOString(),
        requestId: "local",
      });
    }

    if (method === "GET" && jobId && extra === "errors") {
      const job = audienceImportJobs.get(jobId);
      if (!job || job.orgId !== orgId) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Job not found" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          404
        );
      }
      if (job.errors.length === 0) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "CONFLICT", message: "No errors available" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          409
        );
      }
      const lines = [
        "rowNumber,key,code,message",
        ...job.errors.map((e) => {
          const row =
            typeof e.rowNumber === "number" ? String(e.rowNumber) : "";
          const key =
            typeof e.key === "string" ? e.key.replaceAll('"', '""') : "";
          const code =
            typeof e.code === "string" ? e.code.replaceAll('"', '""') : "";
          const message = e.message.replaceAll('"', '""');
          return `${row},"${key}","${code}","${message}"`;
        }),
      ];
      const csv = lines.join("\n");
      const cors = getCorsHeaders(req);
      const res = new NextResponse(csv, {
        status: 200,
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename="audience-import-errors-${jobId}.csv"`,
        },
      });
      if (cors) {
        for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      }
      return res;
    }

    if (method === "POST" && jobId && extra === "cancel") {
      const job = audienceImportJobs.get(jobId);
      if (!job || job.orgId !== orgId) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Job not found" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          404
        );
      }
      if (job.state === "completed" || job.state === "failed") {
        return okJson(
          req,
          {
            success: false,
            error: { code: "CONFLICT", message: "Job already finished" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          409
        );
      }
      job.state = "cancelled";
      job.finishedAt = new Date().toISOString();
      return okJson(req, {
        success: true,
        message: "Request processed successfully",
        data: { jobId: job.jobId, state: job.state },
        timestamp: new Date().toISOString(),
        requestId: "local",
      });
    }

    return null;
  }

  if (sub === "exports") {
    const jobId = path.length >= 3 ? path[2] : null;
    const extra = path.length >= 4 ? path[3] : null;

    if (method === "POST" && !jobId) {
      const body = (await readJsonSafe(req)) as unknown;
      const formatRaw =
        isJsonObject(body) && typeof body.format === "string"
          ? body.format.toLowerCase().trim()
          : "";
      const format: AudienceImportExportFormat | null =
        formatRaw === "csv" || formatRaw === "json"
          ? (formatRaw as AudienceImportExportFormat)
          : null;
      if (!format) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "BAD_REQUEST", message: "Invalid format" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          400
        );
      }

      const now = new Date().toISOString();
      const createdJobId = randomJobId();
      const job: AudienceExportJob = {
        jobId: createdJobId,
        orgId,
        createdAt: now,
        startedAt: now,
        state: "processing",
        format,
        processedRows: 0,
        fileName: `audience-export-${createdJobId}.${format}`,
        contentType:
          format === "json"
            ? "application/json; charset=utf-8"
            : "text/csv; charset=utf-8",
        fileBytes: new Uint8Array(),
      };
      audienceExportJobs.set(createdJobId, job);

      try {
        const maxItems = 5000;
        const limit = 500;
        let page = 1;
        const all: unknown[] = [];
        while (all.length < maxItems) {
          const url = `${backendBase}/audience/profiles?page=${page}&limit=${limit}`;
          const res = await fetchBackendJson(req, url, {
            method: "GET",
            headers: backendHeaders,
            cache: "no-store",
          });
          if (!res.ok) {
            const msg =
              (isJsonObject(res.json) && typeof res.json.message === "string"
                ? res.json.message
                : res.text) || "Failed to export";
            throw new Error(msg);
          }
          const root = res.json;
          const list = Array.isArray(root)
            ? root
            : isJsonObject(root) &&
                Array.isArray((root as { data?: unknown }).data)
              ? ((root as { data?: unknown }).data as unknown[])
              : isJsonObject(root) &&
                  isJsonObject((root as { data?: unknown }).data) &&
                  Array.isArray(
                    ((root as { data?: unknown }).data as { items?: unknown })
                      .items
                  )
                ? ((((root as { data?: unknown }).data as { items?: unknown })
                    .items as unknown[]) ?? [])
                : [];
          if (!Array.isArray(list) || list.length === 0) break;
          all.push(...list);
          if (list.length < limit) break;
          page += 1;
        }

        job.processedRows = all.length;
        job.totalRows = all.length;

        if (format === "json") {
          const json = JSON.stringify(all, null, 2);
          job.fileBytes = new TextEncoder().encode(json);
        } else {
          const headers = ["email", "name", "wallet", "tags"];
          const lines: string[] = [];
          lines.push(headers.join(","));
          for (const item of all) {
            const obj = isJsonObject(item)
              ? (item as Record<string, unknown>)
              : {};
            const email = typeof obj.email === "string" ? obj.email : "";
            const name =
              typeof obj.name === "string"
                ? obj.name
                : typeof obj.fullName === "string"
                  ? obj.fullName
                  : "";
            const wallet =
              typeof obj.wallet === "string"
                ? obj.wallet
                : typeof obj.walletAddress === "string"
                  ? obj.walletAddress
                  : "";
            const tags = Array.isArray(obj.tags)
              ? obj.tags.filter((t) => typeof t === "string").join(",")
              : "";
            const escape = (v: string) => {
              const s = v.replaceAll('"', '""');
              return /[",\n\r]/.test(s) ? `"${s}"` : s;
            };
            lines.push(
              [escape(email), escape(name), escape(wallet), escape(tags)].join(
                ","
              )
            );
          }
          job.fileBytes = new TextEncoder().encode(lines.join("\n"));
        }

        job.state = "completed";
        job.finishedAt = new Date().toISOString();
      } catch (e) {
        job.state = "failed";
        job.finishedAt = new Date().toISOString();
        return okJson(
          req,
          {
            success: false,
            error: {
              code: "BAD_REQUEST",
              message: e instanceof Error ? e.message : "Export failed",
            },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          400
        );
      }

      return okJson(
        req,
        {
          success: true,
          message: "Export job created",
          data: {
            jobId: job.jobId,
            state: job.state,
            format: job.format,
            createdAt: job.createdAt,
          },
          timestamp: new Date().toISOString(),
          requestId: "local",
        },
        202
      );
    }

    if (method === "GET" && jobId && !extra) {
      const job = audienceExportJobs.get(jobId);
      if (!job || job.orgId !== orgId) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Job not found" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          404
        );
      }
      const progress =
        typeof job.totalRows === "number" && job.totalRows > 0
          ? Math.round((job.processedRows / job.totalRows) * 100)
          : job.state === "completed"
            ? 100
            : 0;
      return okJson(req, {
        success: true,
        message: "Request processed successfully",
        data: {
          jobId: job.jobId,
          state: job.state,
          format: job.format,
          createdAt: job.createdAt,
          startedAt: job.startedAt,
          finishedAt: job.finishedAt,
          progress,
          processedRows: job.processedRows,
          totalRows: job.totalRows,
          fileSizeBytes: job.fileBytes.length,
        },
        timestamp: new Date().toISOString(),
        requestId: "local",
      });
    }

    if (method === "GET" && jobId && extra === "download") {
      const job = audienceExportJobs.get(jobId);
      if (!job || job.orgId !== orgId) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Job not found" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          404
        );
      }
      if (job.state !== "completed") {
        return okJson(
          req,
          {
            success: false,
            error: { code: "CONFLICT", message: "Job not completed" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          409
        );
      }
      const cors = getCorsHeaders(req);
      const bytes = Uint8Array.from(job.fileBytes).buffer;
      const res = new NextResponse(bytes, {
        status: 200,
        headers: {
          "content-type": job.contentType,
          "content-disposition": `attachment; filename="${job.fileName}"`,
        },
      });
      if (cors) {
        for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      }
      return res;
    }

    if (method === "POST" && jobId && extra === "cancel") {
      const job = audienceExportJobs.get(jobId);
      if (!job || job.orgId !== orgId) {
        return okJson(
          req,
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Job not found" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          404
        );
      }
      if (job.state === "completed" || job.state === "failed") {
        return okJson(
          req,
          {
            success: false,
            error: { code: "CONFLICT", message: "Job already finished" },
            meta: {
              timestamp: new Date().toISOString(),
              path: req.nextUrl.pathname,
              requestId: "unknown",
            },
          },
          409
        );
      }
      job.state = "cancelled";
      job.finishedAt = new Date().toISOString();
      return okJson(req, {
        success: true,
        message: "Request processed successfully",
        data: { jobId: job.jobId, state: job.state },
        timestamp: new Date().toISOString(),
        requestId: "local",
      });
    }
  }

  return null;
};

const ensureBackendAuthHeaders = (req: NextRequest, headers: Headers) => {
  const tokenFromAuth = extractBearer(headers.get("authorization"));
  const tokenFromHeader =
    req.headers.get("x-editor-token") ?? req.headers.get("x-session-token");
  const tokenFromQuery =
    req.nextUrl.searchParams.get("token") ??
    req.nextUrl.searchParams.get("sessionToken") ??
    req.nextUrl.searchParams.get("editorToken");
  const tokenFromCookie = extractTokenFromCookie(
    req.headers.get("cookie") ?? ""
  );

  const token =
    tokenFromAuth ?? tokenFromHeader ?? tokenFromQuery ?? tokenFromCookie;
  if (!token) return;

  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("x-session-token")) headers.set("x-session-token", token);
  if (!headers.has("x-editor-token")) headers.set("x-editor-token", token);

  const existingCookie = headers.get("cookie") ?? "";
  const hasSessionCookie =
    /(^|;\s*)(__Secure-)?better-auth\.session_token=/.test(existingCookie) ||
    /(^|;\s*)(__Host-)?better-auth\.session_token=/.test(existingCookie) ||
    /(^|;\s*)(__Secure-)?better-auth\.sessionToken=/.test(existingCookie) ||
    /(^|;\s*)(__Host-)?better-auth\.sessionToken=/.test(existingCookie);
  if (!hasSessionCookie) {
    const nextCookie = `${existingCookie}${existingCookie ? "; " : ""}better-auth.session_token=${encodeURIComponent(token)}`;
    headers.set("cookie", nextCookie);
  }
};

const forward = async (
  req: NextRequest,
  path: string[],
  overrideMethod?: string
) => {
  const cors = getCorsHeaders(req);
  const method = (overrideMethod ?? req.method).toUpperCase();

  const audienceImportExport = await handleAudienceImportExport(
    req,
    path,
    method
  );
  if (audienceImportExport) return audienceImportExport;

  if (method === "OPTIONS" && cors) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...cors,
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const url = new URL(req.url);
  const targetUrl = `${getBackendBaseUrl()}/${path.join("/")}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("accept-encoding");
  ensureBackendAuthHeaders(req, headers);
  const apiKey = getBackendApiKey();
  if (apiKey && !headers.has("x-api-key")) {
    headers.set("x-api-key", apiKey);
  }

  const hasBody = !["GET", "HEAD"].includes(method);
  let body: ArrayBuffer | undefined = undefined;
  if (hasBody) {
    try {
      body = await req.arrayBuffer();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to read request body";
      const res = NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message,
          },
        },
        { status: 400 }
      );
      if (cors) {
        for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      }
      return res;
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream request failed";
    const res = NextResponse.json(
      {
        success: false,
        error: {
          code: "UPSTREAM_UNREACHABLE",
          message,
          details: {
            path: `/${path.join("/")}`,
            method,
          },
        },
      },
      { status: 502 }
    );
    if (cors) {
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
    }
    return res;
  }

  const isOrganizationCreate =
    method === "POST" &&
    path.length === 2 &&
    path[0] === "organization" &&
    path[1] === "create";

  const isOrganizationList =
    method === "GET" &&
    path.length === 2 &&
    path[0] === "organization" &&
    path[1] === "list";

  if (isOrganizationCreate && upstream.status === 409) {
    const base = getBackendBaseUrl();

    let requestedName = "";
    let requestedSlug = "";
    try {
      const text = body ? new TextDecoder().decode(body) : "";
      const json = text ? JSON.parse(text) : null;
      requestedName = String(json?.name ?? "");
      requestedSlug = String(json?.slug ?? "");
    } catch (_e) {
      String(_e);
    }

    try {
      const listRes = await fetch(`${base}/organization/list`, {
        method: "GET",
        headers,
        cache: "no-store",
      });
      const listJson = await listRes.json().catch(() => null);
      const list = Array.isArray(listJson)
        ? listJson
        : Array.isArray(listJson?.data)
          ? listJson.data
          : Array.isArray(listJson?.data?.data)
            ? listJson.data.data
            : [];

      const nameLower = requestedName.toLowerCase().trim();
      const slugLower = requestedSlug.toLowerCase().trim();
      const match = Array.isArray(list)
        ? list.find((org) => {
            if (!isJsonObject(org)) return false;
            const orgName = String(org.name ?? "")
              .toLowerCase()
              .trim();
            const orgSlug = String(org.slug ?? "")
              .toLowerCase()
              .trim();
            return (
              (slugLower && orgSlug === slugLower) ||
              (nameLower && orgName === nameLower)
            );
          })
        : null;

      const orgId = isJsonObject(match)
        ? (match.id ?? match.organizationId ?? null)
        : null;

      if (typeof orgId === "string" && orgId.length > 0) {
        await fetch(`${base}/organization/set-active`, {
          method: "POST",
          headers: (() => {
            const h = new Headers(headers);
            if (!h.has("content-type")) {
              h.set("content-type", "application/json");
            }
            return h;
          })(),
          body: JSON.stringify({ organizationId: orgId }),
          cache: "no-store",
        }).catch(() => null);

        return NextResponse.json(
          { success: true, conflict: true, data: match ?? { id: orgId } },
          { status: 200 }
        );
      }
    } catch (_e) {
      String(_e);
    }

    return NextResponse.json(
      {
        success: false,
        conflict: true,
        message: "Organization already exists",
      },
      { status: 200 }
    );
  }

  if (isOrganizationList && upstream.status === 409) {
    try {
      const json = await upstream.clone().json();
      return NextResponse.json(json, { status: 200 });
    } catch {
      return NextResponse.json({ data: [] }, { status: 200 });
    }
  }

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("connection");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("content-encoding");
  if (cors) {
    for (const [k, v] of Object.entries(cors)) responseHeaders.set(k, v);
  }

  return new NextResponse(
    upstream.status === 204 ? null : await upstream.arrayBuffer(),
    { status: upstream.status, headers: responseHeaders }
  );
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "POST");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "PUT");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "PATCH");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "DELETE");
}

export async function OPTIONS(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forward(req, path, "OPTIONS");
}
