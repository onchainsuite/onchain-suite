import { describe, expect, it } from "vitest";

const originRaw = process.env.E2E_ORIGIN ?? "";
const origin = originRaw.replace(/\/$/, "");

const describeIf = origin.length > 0 ? describe : describe.skip;

const parseJsonSafe = async (res: Response) => {
  const text = await res.text();
  if (text.trim().length === 0) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const findRedirectUrl = (payload: unknown): string | null => {
  if (typeof payload !== "object" || payload === null) return null;
  const obj = payload as Record<string, unknown>;
  const redirectObj =
    typeof obj.redirect === "object" && obj.redirect !== null
      ? (obj.redirect as Record<string, unknown>)
      : null;
  const dataObj =
    typeof obj.data === "object" && obj.data !== null
      ? (obj.data as Record<string, unknown>)
      : null;

  const candidates: Array<unknown> = [
    obj.url,
    obj.redirectUrl,
    obj.redirectURL,
    redirectObj?.url,
    redirectObj?.to,
    redirectObj?.href,
    redirectObj?.location,
    dataObj?.url,
  ];

  const url = candidates.find(
    (v) => typeof v === "string" && v.trim().length > 0
  ) as string | undefined;

  return url ?? null;
};

const hasAnySessionCookie = (setCookie: string) =>
  /(^|,\s*)(__Secure-)?better-auth\.session_token=/.test(setCookie) ||
  /(^|,\s*)(__Host-)?better-auth\.session_token=/.test(setCookie) ||
  /(^|,\s*)(__Secure-)?better-auth\.sessionToken=/.test(setCookie) ||
  /(^|,\s*)(__Host-)?better-auth\.sessionToken=/.test(setCookie);

describeIf("Google OAuth (E2E)", () => {
  it("initiates Google OAuth and returns a Google authorization URL", async () => {
    const startUrl = `${origin}/api/v1/auth/sign-in/social`;
    const body = JSON.stringify({
      provider: "google",
      callbackURL: "/dashboard",
    });

    const doPost = async (url: string) =>
      fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        redirect: "manual",
      });

    let res = await doPost(startUrl);
    for (let i = 0; i < 3; i += 1) {
      const location = res.headers.get("location");
      if (!location) break;
      const next = new URL(location, startUrl);
      if (!/onchainsuite\.com$/i.test(next.hostname)) break;
      res = await doPost(next.toString());
    }

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500);

    const headerLocation = res.headers.get("location");
    const payload = headerLocation ? null : await parseJsonSafe(res);
    const redirectUrl = headerLocation ?? findRedirectUrl(payload);
    expect(redirectUrl).toBeTruthy();

    const url = new URL(redirectUrl as string);
    expect(url.hostname).toMatch(/google/i);
    expect(url.searchParams.get("redirect_uri")).toMatch(
      /\/api\/v1\/auth\/callback\/google$/
    );
    expect(url.searchParams.get("client_id")).toBeTruthy();
    expect(url.searchParams.get("response_type")).toBeTruthy();
    expect(url.searchParams.get("scope")).toContain("openid");
    expect(url.searchParams.get("state")).toBeTruthy();
  });

  it("does not create a session when the callback is invoked with an OAuth error", async () => {
    const res = await fetch(
      `${origin}/api/v1/auth/callback/google?error=access_denied&error_description=denied`,
      { redirect: "manual" }
    );

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500);

    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(hasAnySessionCookie(setCookie)).toBe(false);
  });

  const idToken = process.env.E2E_GOOGLE_ID_TOKEN ?? "";
  const itIfIdToken = idToken.trim().length > 0 ? it : it.skip;

  itIfIdToken(
    "exchanges a Google ID token and establishes a session",
    async () => {
      const signIn = await fetch(`${origin}/api/v1/auth/social/google`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
        redirect: "manual",
      });

      expect(signIn.status).toBeGreaterThanOrEqual(200);
      expect(signIn.status).toBeLessThan(400);

      const setCookie = signIn.headers.get("set-cookie") ?? "";
      expect(hasAnySessionCookie(setCookie)).toBe(true);

      const sessionRes = await fetch(`${origin}/api/v1/auth/get-session`, {
        headers: { cookie: setCookie },
        redirect: "manual",
      });

      expect(sessionRes.status).toBe(200);
      const sessionJson = (await parseJsonSafe(sessionRes)) as unknown;
      expect(sessionJson).toBeTruthy();
    }
  );
});
