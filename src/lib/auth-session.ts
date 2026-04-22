import { headers } from "next/headers";

import { isJsonObject } from "@/lib/utils";

const normalizeSessionResponse = (payload: unknown) => {
  const payloadObj = isJsonObject(payload) ? payload : undefined;
  const root = payloadObj?.data ?? payload;
  const rootObj = isJsonObject(root) ? root : payloadObj;
  const nestedRoot = isJsonObject(rootObj?.data) ? rootObj.data : undefined;

  const userCandidate =
    rootObj?.user ?? nestedRoot?.user ?? payloadObj?.user ?? null;
  const user = isJsonObject(userCandidate) ? userCandidate : null;
  if (!user) return null;

  const sessionCandidate =
    rootObj?.session ?? nestedRoot?.session ?? payloadObj?.session ?? {};
  const session = isJsonObject(sessionCandidate) ? sessionCandidate : {};

  return { session, user };
};

export async function getSession() {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie") ?? "";
    const cookieLength = cookie.length;
    const hasCookieHeader = cookieLength > 0;
    const cookiePairs = cookie
      .split(";")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .map((p) => {
        const idx = p.indexOf("=");
        if (idx === -1) return [p, ""] as const;
        return [p.slice(0, idx), p.slice(idx + 1)] as const;
      });
    const cookieNames = cookiePairs.map(([name]) => name);
    const cookieMap = new Map(cookiePairs);
    const sessionTokenRaw =
      cookieMap.get("better-auth.session_token") ??
      cookieMap.get("__Secure-better-auth.session_token") ??
      cookieMap.get("__Host-better-auth.session_token") ??
      cookieMap.get("better-auth.sessionToken") ??
      cookieMap.get("__Secure-better-auth.sessionToken") ??
      cookieMap.get("__Host-better-auth.sessionToken") ??
      cookieMap.get("onchain.token") ??
      null;
    const sessionToken = sessionTokenRaw
      ? decodeURIComponent(sessionTokenRaw)
      : null;
    const hasBetterAuthCookie = cookieNames.some((n) =>
      n.toLowerCase().includes("better-auth")
    );

    const forwardedProto = headersList.get("x-forwarded-proto") ?? "http";
    const forwardedHost =
      headersList.get("x-forwarded-host") ?? headersList.get("host");
    const inferredBase = forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : null;

    const appBase =
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.APP_URL ??
      inferredBase ??
      "http://localhost:3000";
    const appClean = appBase.replace(/\/$/, "");

    try {
      // 1) Prefer local proxy so it can inject Authorization from onchain.token
      const sessionResponse = await fetch(
        `${appClean}/api/v1/auth/get-session`,
        {
          headers: {
            Cookie: cookie,
            ...(sessionToken
              ? { Authorization: `Bearer ${sessionToken}` }
              : {}),
          },
          cache: "no-store",
        }
      );

      if (sessionResponse.ok) {
        const sessionJson = await sessionResponse.json();
        const normalized = normalizeSessionResponse(sessionJson);
        const user = normalized?.user ?? null;

        if (user?.id || user?.email) {
          return {
            session: sessionJson?.session ?? {},
            user,
          };
        }
      }

      if (!sessionResponse.ok) {
        if (sessionResponse.status !== 404 && sessionResponse.status !== 401) {
          console.warn("[getSession]", {
            at: new Date().toISOString(),
            ok: false,
            status: sessionResponse.status,
            hasCookieHeader,
            cookieLength,
            endpoint: "/auth/get-session",
            tokenPresent: !!sessionToken,
          });
        }
      }

      // 2) Fallback to profile check directly if get-session failed or didn't return a user
      const profileResponse = await fetch(`${appClean}/api/v1/user/profile`, {
        headers: {
          Cookie: cookie,
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        cache: "no-store",
      });

      if (!profileResponse.ok) {
        console.warn("[getSession]", {
          at: new Date().toISOString(),
          ok: false,
          status: profileResponse.status,
          hasCookieHeader,
          cookieLength,
          endpoint: "/user/profile",
          tokenPresent: !!sessionToken,
          hasBetterAuthCookie,
          cookieNames: cookieNames.slice(0, 10),
        });
        return null;
      }

      const profileJson = await profileResponse.json();
      const normalized = normalizeSessionResponse(profileJson);
      const user = normalized?.user ?? null;

      if (!user?.id && !user?.email) {
        console.warn("[getSession]", {
          at: new Date().toISOString(),
          ok: true,
          invalidShape: true,
          hasCookieHeader,
          cookieLength,
          endpoint: "/user/profile",
          tokenPresent: !!sessionToken,
          hasBetterAuthCookie,
          cookieNames: cookieNames.slice(0, 10),
        });
        return null;
      }

      return {
        session: { token: sessionToken },
        user,
      };
    } catch (innerError) {
      console.error("Inner fetch failed:", innerError);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
}
