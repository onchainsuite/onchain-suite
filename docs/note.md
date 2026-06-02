- There shouldn't be unneccasry reload when uploading logos, also I'm often redirected to the
  homepage.
- Display logo image on the select-orginaztion top-bar when it has been uploaded.

- Optimize the design of the website.
- Make the dashboard fully functional, from the AI search voice/text input to full answer with
  hyperlinks to questions about the app.

- The 'Templates' section should show the templates that have been created by the user. It should
  also show with the filters of 'Edited Most Recently', 'Used Most Recently', 'Oldest First' and
  'A-Z'.
- We should have a public 'Email Library' recommended by the app and a private 'Email Saved' section
  for custom templates by the user.
- We should add a last section which is to preview the campaign before it is sent.

- The 'Schedule your campaign', 'Templates' and all Campamign flow sections should be wired to the
  backend so we can either send emails immediately or schedule it, the timezone should also be the
  same as the Settings timezone. For other Campaign sections without API endpoints, let me know what
  endpoints are needed and the usage.
- The 'Schedule your campaign' section should have a preview of the campaign before it is sent.

- Map these endpoints exactly to the current frontend steps (“Schedule”, “Templates”, “Launch”) and
  point out which screens need which new calls for Drip + Smart.
- For Smart Sending, this campaign will not be sent to profiles who received a message from you in
  the last 10 hours. Smart Sending (thresholds) can be updated in account settings.
- For tracking, links in this campaign will include audience tracking information, called UTM
  parameters. This allows bounce tracking within third-party analytics tools such as Google
  Analytics. Learn more about UTM.

backend="https://onchain-backend-dvxw.onrender.com/api/v1" campaign="cmp4g0z890003a8302x9beztz"
orgId="a309f5b6-fc56-4dbd-a361-80929c131db0"
sessionCookie="YGPDc96O8PTD2aO3XEFPBM5Np16DWg2T.8wZ0TnsYl4gKuPMneXGND54KVZdATm%2BzFJ3fvBJFvCA%3D"

backend="https://onchain-backend-dvxw.onrender.com/api/v1"
orgId="7dd27aa6-515b-4dbf-b787-3c54e33d7528" campaign="cmp4g0z890003a8302x9beztz"
token="YGPDc96O8PTD2aO3XEFPBM5Np16DWg2T.8wZ0TnsYl4gKuPMneXGND54KVZdATm%2BzFJ3fvBJFvCA%3D"

curl -sS \
 -H "Cookie:
better-auth.session_token=${sessionCookie}" \
  -H "x-org-id: ${orgId}" \
  "${backend}/templates/cmpwcvd48000a2zen5fw9klgo"

curl -sS \
 -H "Cookie:
better-auth.session_token=${sessionCookie}" \
  -H "x-org-id: ${orgId}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Saved Template","folder":"saved","content":{"html":"<h1>Hi</h1>","textVersion":"Hi"}}' \
  "${backend}/templates"

curl -sS \
 -H "Cookie:
better-auth.session_token=${sessionCookie}" \
  -H "x-org-id: ${orgId}" \
  "${backend}/templates?folder=saved&limit=20"

## Google OAuth (Onchain Suite)

### Implementation

- Frontend starts Google sign-in via Better Auth social redirect flow (Google OAuth consent screen),
  not via access-token userinfo + `sub`.
- Auth proxy rewrites upstream session cookies for localhost HTTP, and fails gracefully with `502`
  when the upstream auth service is unreachable.

Code:

- [signin-form.tsx](file:///c:/Users/USER/onchain-suite/src/features/core/auth/components/signin-form.tsx)
- [auth-client.ts](file:///c:/Users/USER/onchain-suite/src/lib/auth-client.ts)
- [auth proxy route.ts](file:///c:/Users/USER/onchain-suite/src/app/api/v1/auth/%5B...path%5D/route.ts)

### Automated Tests

Unit/integration (cookie rewriting, upstream failure handling, blocked account passthrough):

- Run: `npx vitest run src/app/api/v1/auth/[...path]/route.test.ts`
- Result (2026-06-02): 3/3 passing
- Test file:
  [route.test.ts](file:///c:/Users/USER/onchain-suite/src/app/api/v1/auth/%5B...path%5D/route.test.ts)

End-to-end parity suite (same tests for local + staging/prod):

- Run: `E2E_ORIGIN=<app-origin> npm run test:e2e:google-oauth`
- Example local origin: `E2E_ORIGIN=http://localhost:3000`
- Example prod origin: `E2E_ORIGIN=https://onchainsuite.com`
- Optional success flow (requires real token; do not commit): set `E2E_GOOGLE_ID_TOKEN=<jwt>`

E2E results (production origin, 2026-06-02):

- `initiates Google OAuth and returns a Google authorization URL`: passing
- `does not create a session when callback is invoked with an OAuth error`: passing
- `exchanges a Google ID token and establishes a session`: skipped (no `E2E_GOOGLE_ID_TOKEN`
  provided)

### Google Cloud Console Branding (Consent Screen)

Requirement:

- App name: `Onchain Suite`
- Logo file: 512x512 PNG

Asset available in repo:

- [icon-512.png](file:///c:/Users/USER/onchain-suite/public/icon-512.png)

Console steps (Google Cloud Console → APIs & Services):

- OAuth consent screen → Branding:
  - Set Application name to `Onchain Suite`
  - Upload 512x512 PNG (use `public/icon-512.png`)
  - Save and publish changes
- Credentials → OAuth 2.0 Client IDs → Web client:
  - Ensure redirect URIs include:
    - `http://localhost:3000/api/v1/auth/callback/google`
    - `https://onchainsuite.com/api/v1/auth/callback/google`
    - `https://api.onchainsuite.com/api/v1/auth/callback/google`
  - Ensure authorized JavaScript origins include the correct local and production origins

Verification checklist:

- Google OAuth consent screen shows `Onchain Suite` and the uploaded icon before granting access
  (test from both local and production deployments).
