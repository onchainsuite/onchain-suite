/**
 * Shared resolution of organization branding asset URLs.
 *
 * The backend returns logo URLs that can be relative to the *backend* origin
 * (e.g. "/uploads/logo-primary.png"). Rendering those as-is makes the browser
 * resolve them against the frontend origin, which 404s and hides the logo.
 * Every consumer of branding URLs (navbar logo hook, settings tiles, email
 * builder, …) must resolve through this helper instead of duplicating the
 * logic.
 */

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return undefined;
};

// Mirrors the defaults used by the server proxy routes
// (src/app/api/v1/organization/branding/route.ts, src/app/api/upload/logo/[type]/route.ts)
// so the client resolves assets against the same backend the proxies talk to
// when NEXT_PUBLIC_BACKEND_URL is not configured.
const DEV_BACKEND_DEFAULT = "http://127.0.0.1:3333/api/v1";
const PROD_BACKEND_DEFAULT = "https://api.onchainsuite.com/api/v1";

/** Origin ("protocol://host") of the backend that serves branding assets. */
export const getBackendAssetOrigin = (): string | undefined => {
  const rawBase = pickString(
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NODE_ENV === "production"
      ? PROD_BACKEND_DEFAULT
      : DEV_BACKEND_DEFAULT
  );
  if (!rawBase) return undefined;
  try {
    const parsed = new URL(rawBase);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return undefined;
  }
};

/**
 * Picks the first non-empty string among `values` and resolves it to an
 * absolute URL a browser can load:
 * - data:/blob:/http(s) URLs pass through untouched;
 * - protocol-relative URLs get https;
 * - backend-relative paths are prefixed with the backend origin.
 */
export const resolveBrandAssetUrl = (
  ...values: unknown[]
): string | undefined => {
  const raw = pickString(...values);
  if (!raw) return undefined;
  if (
    raw.startsWith("data:") ||
    raw.startsWith("blob:") ||
    /^https?:\/\//i.test(raw)
  ) {
    return raw;
  }
  if (raw.startsWith("//")) return `https:${raw}`;

  const backendOrigin = getBackendAssetOrigin();
  if (raw.startsWith("/")) {
    return backendOrigin ? `${backendOrigin}${raw}` : raw;
  }
  return backendOrigin ? `${backendOrigin}/${raw.replace(/^\/+/, "")}` : raw;
};
