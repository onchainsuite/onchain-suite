/**
 * Sections still in active development. They are hidden from the sidebar nav
 * and the ⌘K palette in production builds, so dev and main can share
 * identical code — no more re-commenting nav entries after every merge.
 *
 * Resolution:
 * - `NEXT_PUBLIC_SHOW_WIP_SECTIONS=true`  → always show (e.g. a dev preview)
 * - `NEXT_PUBLIC_SHOW_WIP_SECTIONS=false` → always hide
 * - unset → show in local dev (`next dev`), hide in production builds
 *
 * Routes stay reachable by direct URL — this is nav-level hiding only,
 * matching the previous commented-out behavior.
 */
export const SHOW_WIP_SECTIONS =
  process.env.NEXT_PUBLIC_SHOW_WIP_SECTIONS === "true" ||
  (process.env.NEXT_PUBLIC_SHOW_WIP_SECTIONS !== "false" &&
    process.env.NODE_ENV !== "production");

const WIP_PREFIXES = ["/forms", "/inbox", "/automations", "/intelligence"];

/** True when the href belongs to a work-in-progress section. */
export const isWipHref = (href: string) =>
  WIP_PREFIXES.some(
    (prefix) => href === prefix || href.startsWith(`${prefix}/`)
  );
