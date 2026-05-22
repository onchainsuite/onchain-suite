# OnChain Suite API Endpoints

This document lists the available API endpoints for connecting your frontend.

**Base URL**: `https://onchain-backend-dvxw.onrender.com/api/v1`

## Authentication (BetterAuth & Custom)

All authenticated endpoints typically require a session cookie or a Bearer token (depending on
BetterAuth configuration). The `x-api-key` header is optional and used for rate limiting.

- **Browser (recommended)**: send cookies (`credentials: "include"`).
- **Non-browser / embedded clients**: you can also send a session token via:
  - `Authorization: Bearer <token>`
  - `x-session-token: <token>`
  - Query: `?token=<token>` (or `?sessionToken=<token>`)

### Auth Routes

- `POST /auth/sign-up/email`: Sign up with email/password.
- `POST /auth/sign-in/email`: Sign in with email/password.
- `POST /auth/social/google`: Google One-Click Auth (Body: `{ "idToken": "..." }`).
- `GET /auth/verify-email`: Verify email address (via link).
- `GET /auth/get-session`: Get current session (BetterAuth).

### Cookies

- Session cookie name:
  - Production/HTTPS: `__Secure-better-auth.session_token`
  - Development/HTTP: `better-auth.session_token`
- `GET /auth/get-session` returns:
  - `null` when not authenticated
  - `{ session, user }` when authenticated

## User Management

- `GET /user/profile`: Get current user profile.
- `PUT /user/profile`: Update profile details.
- `PUT /user/password`: Change password.
- `PUT /user/2fa`: Toggle 2FA.

## Onboarding

- `GET /onboarding/progress`: Get onboarding progress (resume/cross-device continuity). Includes
  `onboardingDisplay` with:
  - `defaultLandingPageOption` (always `"default"`),
  - `landingPage` (selected landing page, defaults to `"default"`),
  - `websiteUrl` (website URL entered during onboarding when available).
- `POST /onboarding/track`: Track onboarding steps (Body:
  `{ stepName, action, timeSpentSeconds?, currentStep?, stepData?, flowVersion?, metadata? }`).
- `POST /onboarding/complete`: Mark onboarding completed (Body:
  `{ totalTimeSeconds?, currentStep?, stepData?, flowVersion? }`).
- `GET /onboarding/tasks`: List onboarding tasks (simple checklist used by zk-v2 auto-index hook).
- `PUT /onboarding/tasks/{taskId}/complete`: Mark a task completed.
  - If `taskId === "connect-chain"`, this triggers an indexing job via `POST /indexing/jobs`.
  - **Body (optional)**: `{ contracts?: any[], lookbackDays?: number }`
- `GET /onboarding/admin/summary`: Admin summary metrics (Query: `from?`, `to?`).

## zk-v2 (Wallet-First + Multi-Channel Foundations)

### Identity & ZK (Binding)

- `POST /identity/otp`: Issue OTP for channel binding.
  - **Body**: `{ walletAddress, channelType, destination? }`
  - `channelType` accepts either enum-style (`"EMAIL"`) or lowercase (`"email"`).
- `POST /identity/bind`: Persist encrypted channel binding.
  - **Body**:
    - Required: `{ walletAddress, channelType, valueHash, otp, encryptedValue }`
    - Optional fields supported by the zk-v2 contract:
      `{ proof, identityCommitment, walletSignature, source }`

Example (issue OTP):

```bash
curl -X POST "$BASE_URL/identity/otp" \
  -H "Content-Type: application/json" \
  -H "x-org-id: $ORG_ID" \
  -b "$COOKIE_JAR" \
  -d '{"walletAddress":"0xabc...","channelType":"email","destination":"user@example.com"}'
```

Example (bind):

```bash
curl -X POST "$BASE_URL/identity/bind" \
  -H "Content-Type: application/json" \
  -H "x-org-id: $ORG_ID" \
  -b "$COOKIE_JAR" \
  -d '{"walletAddress":"0xabc...","channelType":"email","valueHash":"0x...","otp":"123456","encryptedValue":{"ciphertext":"...","iv":"...","authTag":"...","wrappedKey":"...","wrapIv":"...","wrapTag":"...","keyVersion":1}}'
```

### Segments (Reachable)

- `GET /segments/reachable`: Resolve wallet addresses by reachability filter.
  - **Query**:
    - `reachable_on` (optional): comma-separated list, e.g. `inapp,email,telegram`
    - `limit` (optional): default `100`, max `500`
    - `cursor` (optional): last wallet address from previous page

### Channels (Router Entry Point)

- `POST /channels/dispatch`: Create a campaign run record for a fanout.
  - **Body**: `{ automationId, campaignRunId?, walletAddresses?, triggeredBy?, channelsUsed? }`

### In-app Push (WebSocket)

- `WS /inapp` (socket.io namespace)
  - **Handshake**: `handshake.auth.token` or `Authorization: Bearer <token>`
  - **Org context**: `handshake.auth.organizationId` or header `x-org-id` (or session active org)
  - **Client → Server**:
    - `REGISTER` `{ walletAddress }`
    - `EVENT` `{ campaignRunId, deliveryId, type, walletAddress?, metadata? }`

### Analytics (Campaign Runs)

- `GET /analytics/campaign-runs/{id}`: Per-run event counts grouped by channel + event type.

### Auto-Index

- `POST /indexing/jobs`: Enqueue an indexing job.
  - **Body**: `{ contracts, lookbackDays? }`
- `GET /indexing/jobs/{jobId}`: Get job status.
- `POST /indexing/jobs/{jobId}/cancel`: Cancel job.
- `GET /indexing/protocols/{protocolId}/status`: Indexing status for a protocol.
- `POST /indexing/protocols/{protocolId}/reindex`: Manual reindex.

## Organization

- `GET /organization/list`: List user organizations.
- `GET /organization`: Get current organization details.
- `PUT /organization`: Update organization details.
- `POST /organization/create`: Create a new organization.
- `POST /organization/set-active`: Set active organization for the session.
- `POST /organization/subdomain/validate`: Validate subdomain availability.
- `GET /organization/landing-pages`: List available landing page templates.
- `GET /organization/branding`: Get branding settings.
- `PUT /organization/branding/colors`: Update brand colors.
- `POST /organization/branding/colors/reset`: Reset brand colors to default.
- `POST /organization/branding/logo/primary`: Upload primary logo (multipart/form-data).
- `POST /organization/branding/logo/dark`: Upload dark mode logo (multipart/form-data).
- `POST /organization/branding/logo/favicon`: Upload favicon (multipart/form-data).
- `DELETE /organization/branding/logo/primary`: Remove primary logo.

## Sender Identities

- `GET /sender-identities`: List verified sender identities.
- `POST /sender-identities`: Add sender identity.
- `DELETE /sender-identities/{id}`: Remove sender identity.
- `POST /sender-identities/{id}/recheck`: Recheck sender verification.
- `GET /sender-identities/{id}/dns`: Get DNS records for verification.
- `POST /sender-identities/{id}/dns/auto`: Auto-add DNS records.
- `PUT /sender-identities/default`: Set default sender identity.
- `GET /sender-identities/domains/authentication`: Get domain authentication overview.

## Organization Members

**Base Path**: `/organizations/{organizationId}`

### Members

- `GET /members`: List organization members.
  - **Query Params**: `page` (default 1), `limit` (default 10), `search` (name/email).
  - **Permissions**: Viewer, Editor, Admin, Owner.
- `PATCH /members/{userId}`: Update member role or status.
  - **Body**: `{ "role": "ADMIN" | "EDITOR" | "VIEWER", "isEnabled": boolean }`
  - **Permissions**: Owner, Admin. (Owners cannot be downgraded by others; Last Owner protection
    active).
- `DELETE /members/{userId}`: Remove member.
  - **Permissions**: Owner, Admin. (Cannot remove the last Owner).

### Invites

- `POST /invites`: Invite a user to the organization.
  - **Body**: `{ "email": "user@example.com", "role": "EDITOR" }`
  - **Permissions**: Owner, Admin.
  - **Rate Limit**: 5 requests per minute.
- `GET /invites`: List pending invitations.
  - **Permissions**: Owner, Admin.

### Public/User Invites

- `POST /invites/{token}/accept`: Accept an invitation.
  - **Auth**: Requires authenticated user session.
  - **Note**: This endpoint is global (not under `/organizations/{orgId}`).

## Domain & Email

- `GET /domain`: List user's domains.
- `GET /domain/check`: Check if a domain is already registered (Query: `domain` required, `type?`).
- `GET /domain/{id}`: Get domain details.
- `GET /domain/{id}/status`: Check verification status.
- `GET /domain/{id}/dns`: Get DNS records for verification.
- `POST /domain`: Register a new domain.
- `POST /domain/{id}/senders`: Add a sender username.
- `POST /domain/{id}/dns/auto`: Auto-add DNS records.
- `POST /domain/{id}/recheck`: Manual refresh of status.
- `POST /email/send`: Queue a single transactional email.
- `DELETE /domain/{id}`: Delete a domain.

## Billing

## Billing & Subscription

- `GET /billing` — Overview of current plan, usage, and limits.
- `GET /billing/usage` — Detailed usage statistics (Query: `period?` = `month` | `current`).
- `GET /billing/plan` — Current plan + upgrade options.
- `GET /billing/plans` — List all available plans.
- `POST /billing/upgrade` — Fiat plan upgrade (Body: `{ plan: "Growth" | "Pro" | "Enterprise" }`).
  Also supports legacy Blockradar body `{ desiredListSize, plan? }`.
- `POST /billing/upgrade/blockradar` — Blockradar crypto upgrade (dynamic list size pricing) (Body:
  `{ desiredListSize, plan? }`).
- `GET /billing/upgrade/blockradar/{reference}` — Check status of a specific Blockradar upgrade.

## Invoices

- `GET /billing/invoices` — List invoices (Query: `page?`, `limit?`, `status?`).
- `GET /billing/invoices/{invoiceId}` — Get single invoice details.
- `GET /billing/invoices/{invoiceId}/download` — Get signed download URL for PDF invoice.

## Payment Methods

- `GET /billing/payment-methods` — List payment methods.
- `POST /billing/payment-methods` — Add payment method (Body:
  `{ type: "card" | "crypto", last4?, brand?, address?, isDefault? }`).
- `DELETE /billing/payment-methods/{id}` — Remove payment method.
- `PUT /billing/payment-methods/default` — Set default payment method (Body: `{ id: string }`).

## Blockradar Webhooks

- `POST /webhook/blockradar` — Handle Blockradar payment notifications (public).

## Audience (CRM)

- `GET /audience/overview`: Get audience stats.
- `GET /audience/profiles`: List contacts.
- `POST /audience/profiles`: Create new contact.
- `GET /audience/profiles/{id}`: Get contact details.
- `PUT /audience/profiles/{id}`: Update contact.
- `GET /audience/tags`: List all tags.
- `POST /audience/tags`: Create a new tag.
- `PUT /audience/profiles/{id}/tags`: Add tags to contact.
- `DELETE /audience/profiles/{id}/tags/{tagName}`: Remove tag from contact.

### Audience Page (List + Detail) — Required Endpoints (Neon DB + Alchemy RPC)

Audience UI requires two data planes:

- **Web2 / Neon (source of truth)**: profiles, tags, attributes, email engagement events, computed
  health/churn snapshots.
- **Web3 / Alchemy RPC (enrichment)**: wallet transaction history, contract activity, onchain
  volume/tx counts, last onchain interaction.

All Audience endpoints are organization-scoped via `x-org-id` and require authentication (cookie
session or `Authorization: Bearer <token>`).

#### 1) List Page (`/audience`) — Table + Filters

**GET `/audience/profiles` (Neon; optionally enriched)**

- **Purpose**: Populate the main table (Profile, Wallet, Health, Last Action) and drive
  filters/search/sort without rendering placeholder values.
- **Headers**:
  - `x-org-id: <orgId>` (required)
  - `Authorization: Bearer <token>` or cookie session (required)
- **Query**:
  - `page?` number (default `1`)
  - `limit?` number (default `50`, max `200`)
  - `q?` string (search across name/email/wallet)
  - `status?` `"verified"|"pending"|"unverified"`
  - `tag?` string (filter by tag name)
  - `engagement?` `"active"|"cooling"|"cold"` (derived from health score or engagement snapshot)
  - `hasWallet?` boolean
  - `sort?` `"name"|"healthScore"|"lastActionAt"` (default `"healthScore"`)
  - `direction?` `"asc"|"desc"` (default `"desc"`)
  - `include?` comma-separated:
    - `wallets` (include wallet(s) relation if stored separately)
    - `attributes` (include attributes map)
    - `tags` (include tags; prefer string array, but tag objects are acceptable)
    - `health` (include health snapshot: score + updatedAt)
    - `lastAction` (include lastAction summary: label + at + type)
- **Response (200)**:
  - `{ data: AudienceProfileRow[], meta: { page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage } }`
  - `AudienceProfileRow`:
    - `id: string`
    - `name: string`
    - `email?: string`
    - `walletAddress?: string` (canonical full address for UI + copy)
    - `wallets?: Array<{ address: string; chain?: string; isPrimary?: boolean }>`
    - `tags?: string[] | Array<{ id: string; name: string; color?: string }>`
    - `attributes?: Record<string, string | number | boolean | null>`
    - `health?: { score: number; trend?: "up"|"down"|"stable"; updatedAt: string }`
    - `lastAction?: { type: string; label: string; at: string }`
- **Validation / Error handling**:
  - 400 if `limit > 200` or invalid enum values
  - 401 if unauthenticated
  - 403 if org access denied
  - 429 if rate-limited

**GET `/audience/overview` (Neon)**

- **Purpose**: top-of-page audience stats (counts and health distribution).
- **Headers**: `x-org-id`, auth required.
- **Response (200)**:
  - `{ data: { total, withWallet, avgHealth, activeCount, coolingCount, coldCount, updatedAt } }`

**GET `/audience/attributes/keys` (Neon)**

- **Purpose**: Drive filter UI and safely render “Attributes” without guessing keys client-side.
- **Headers**: `x-org-id`, auth required.
- **Query**: `q?` (search keys), `limit?` (max 500)
- **Response (200)**:
  - `{ data: { keys: Array<{ key: string; type: "string"|"number"|"boolean"|"date"; label?: string; exampleValues?: string[]; countProfiles?: number }> } }`

**GET `/audience/attributes/{key}/values` (Neon; optional)**

- **Purpose**: Power dropdown filters for high-cardinality attributes without shipping all profiles.
- **Headers**: `x-org-id`, auth required.
- **Query**: `q?`, `limit?` (default 50, max 200)
- **Response (200)**:
  - `{ data: { key: string, values: Array<{ value: string; count: number }> } }`

#### 2) Profile Detail Page (`/audience/{id}`) — Cards + Tabs

**GET `/audience/profiles/{id}` (Neon; optionally enriched)**

- **Purpose**: Header section (name/email/wallet/status/tags) + quick stats.
- **Headers**: `x-org-id`, auth required.
- **Query**: `include?=tags,attributes,wallets,health,lastAction` (same semantics as list)
- **Response (200)**:
  - `{ data: AudienceProfileDetail }`
  - `AudienceProfileDetail` includes all `AudienceProfileRow` fields plus:
    - `createdAt: string`
    - `updatedAt: string`
    - `primaryWallet?: { address: string; chain?: string }`
    - `emailStats?: { sent: number; opened: number; clicked: number; openRate: number; clickRate: number }`
    - `onchainSummary?: { totalTxns: number; totalVolumeUsd?: number; lastInteractionAt?: string; chainBreakdown?: Record<string, number> }`

**GET `/audience/profiles/{id}/activity` (Neon; unified timeline)**

- **Purpose**: “Activity Timeline” tab (email + web + onchain events) in a single feed.
- **Headers**: `x-org-id`, auth required.
- **Query**:
  - `cursor?` string (pagination token)
  - `limit?` number (default 50, max 200)
  - `types?` comma-separated (e.g. `email_open,email_click,onchain_tx,tag_added,profile_created`)
  - `from?` / `to?` ISO timestamps
- **Response (200)**:
  - `{ data: { items: ActivityEvent[], nextCursor?: string } }`
  - `ActivityEvent`: `{ id, type, title, description?, at, metadata? }`

**GET `/audience/profiles/{id}/emails` (Neon)**

- **Purpose**: “Email History” tab (campaign sends/opens/clicks).
- **Headers**: `x-org-id`, auth required.
- **Query**: `cursor?`, `limit?`, `from?`, `to?`, `campaignId?`
- **Response (200)**:
  - `{ data: { items: Array<{ id, campaignId, subject, status: "sent"|"opened"|"clicked"|"bounced", sentAt, openedAt?, clickedAt? }>, nextCursor? } }`

**GET `/audience/profiles/{id}/transactions` (Alchemy-backed + cached in Neon)**

- **Purpose**: “Transactions” tab + contract activity.
- **Headers**: `x-org-id`, auth required.
- **Query**:
  - `chain?` `"eth-mainnet"|"base-mainnet"|...` (default org/campaign chain or inferred)
  - `cursor?` string
  - `limit?` number (default 25, max 100)
  - `fromBlock?` / `toBlock?` (optional)
- **Response (200)**:
  - `{ data: { items: Array<{ hash, from, to, value, valueUsd?, asset?, blockNumber, blockTimestamp, status?, method?, contractAddress? }>, nextCursor? }, meta?: { source: "cache"|"alchemy", refreshedAt? } }`
- **Implementation requirements**:
  - Cache results per `(orgId, walletAddress, chain)` in Neon with TTL (e.g. 5–15 minutes) to avoid
    hitting Alchemy for every page load.
  - Server-side rate limit Alchemy requests per org + per IP.

**GET `/audience/profiles/{id}/contract-activity` (Alchemy-backed + cached in Neon)**

- **Purpose**: “Contract Activity” card (top contracts + volume + tx counts).
- **Headers**: `x-org-id`, auth required.
- **Query**: `chain?`, `from?`, `to?`, `limit?` (default 10, max 50)
- **Response (200)**:
  - `{ data: { items: Array<{ contractAddress, contractName?, label?, volumeUsd?, txCount }>, refreshedAt } }`

**GET `/audience/profiles/{id}/health` (Neon; computed)**

- **Purpose**: Health score + trend used in list and detail.
- **Headers**: `x-org-id`, auth required.
- **Response (200)**:
  - `{ data: { score: number, trend: "up"|"down"|"stable", updatedAt: string, factors?: Array<{ key: string, value: number|string, weight: number }> } }`
- **Implementation requirements**:
  - Health is computed from Neon-backed events (email/web/app usage) + onchain summary (cached).
  - Persist periodic snapshots in Neon to make list sorting/filtering fast.

**GET `/audience/profiles/{id}/churn` (Neon; computed)**

- **Purpose**: Churn Prediction card (risk + score) + predicted LTV.
- **Headers**: `x-org-id`, auth required.
- **Response (200)**:
  - `{ data: { risk: "low"|"medium"|"high", score: number, predictedLtvUsd?: number, updatedAt: string, explanation?: string[] } }`

**POST `/audience/profiles/{id}/enrich` (triggers Alchemy refresh; optional)**

- **Purpose**: Manual refresh button (or background job) to re-fetch onchain summary/contracts/txns.
- **Headers**: `x-org-id`, auth required.
- **Body**: `{ chains?: string[], force?: boolean }`
- **Response (202)**:
  - `{ data: { jobId: string } }`
- **Implementation requirements**:
  - Use a background queue; do not block request on Alchemy.
  - Enforce stricter rate limits (per user/org).

#### 3) Security / Logging / Rate limiting (Audience + Alchemy)

- **AuthZ**: Verify org membership + role:
  - Viewer+: read endpoints
  - Editor+: create/update/import/enrich
- **Rate limiting**:
  - Apply org-scoped rate limits for `transactions`, `contract-activity`, `enrich` to protect
    Alchemy quota.
- **Logging**:
  - Log `orgId`, `userId`, endpoint, walletAddress (hashed), chain, duration, upstream Alchemy calls
    count.
  - Never log full wallet lists or full raw Alchemy payloads in production logs.

### Audience Import/Export (Jobs)

All import/export endpoints are organization-scoped via `x-org-id`.

- `POST /audience/imports`: Create an import job (multipart/form-data).
  - **Body**: `file` (required), `mapping` (optional JSON string), `options` (optional JSON string)
  - **Query**: `format?=csv|json`, `dryRun?=true|false`, `mode?=upsert|create_only|update_only`,
    `onConflict?=skip|update`, `dedupeKey?=email|walletAddress`, `maxErrors?=0..10000`
  - **Permissions**: Editor, Admin, Owner.
- `GET /audience/imports/{jobId}`: Get import job status (progress + counts).
  - **Permissions**: Viewer+.
- `GET /audience/imports/{jobId}/errors`: Download import error report (CSV).
  - **Permissions**: Viewer+.
- `POST /audience/imports/{jobId}/cancel`: Cancel an import job.
  - **Permissions**: Editor+.

- `POST /audience/exports`: Create an export job (CSV/JSON).
  - **Body**: `{ format: "csv"|"json", filters?, fields?, includeAttributes?, includeTags?, sort? }`
  - **Permissions**: Viewer+.
- `GET /audience/exports/{jobId}`: Get export job status (includes `downloadUrl` when complete).
  - **Permissions**: Viewer+.
- `GET /audience/exports/{jobId}/download`: Download the export file (streams CSV/JSON).
  - **Permissions**: Viewer+.
- `POST /audience/exports/{jobId}/cancel`: Cancel an export job.
  - **Permissions**: Editor+.

## Campaigns

- `GET /campaigns`: List all campaigns.
  - **Query**: `search?`, `status?` (comma-separated), `type?` (comma-separated), `sort?`
    (`createdAt` | `name` | `schedule`), `page?`, `limit?`.
  - **Response**:
    `{ data: Campaign[], meta: { page, limit, totalItems, totalPages, hasMore, hasPreviousPage, hasNextPage } }`
- `POST /campaigns`: Create a new campaign.
- `GET /campaigns/{id}`: Get campaign details.
- `GET /campaigns/{id}/email`: Get campaign email (headers + html + optional editor payload).
- `PUT /campaigns/{id}/email`: Update campaign email (headers + html + optional editor payload).
- `PUT /campaigns/{id}`: Update campaign.
- `DELETE /campaigns/{id}`: Delete a campaign.
- `POST /campaigns/{id}/autosave`: Autosave campaign draft (frequent saves).
- `PUT /campaigns/{id}/audience`: Attach audience selection (Body:
  `{ listIds: string[], segmentIds: string[] }`).
- `GET /campaigns/{id}/audience`: Get currently attached audience selection.
- `POST /campaigns/{id}/audience/estimate`: Estimate recipient count for attached audience.
- `PUT /campaigns/{id}/tracking`: Update tracking settings (Body:
  `{ smartSending: boolean, trackingParameters: boolean, utm?: object }`).
- `GET /campaigns/{id}/tracking`: Get tracking settings.
- `PUT /campaigns/{id}/content`: Update email content metadata (Body:
  `{ subject, previewText, senderName, senderEmail, replyToEmail }`).
- `GET /campaigns/{id}/content`: Get email content metadata.
- `PUT /campaigns/{id}/template`: Attach template (Body: `{ templateId: string }`).
- `GET /campaigns/{id}/editor-session`: Get editor session config (Response:
  `{ editorUrl, token, expiresAt }`).
- `POST /campaigns/{id}/editor/saved`: Store editor payload (Body:
  `{ html, json, textVersion, assets }`).
- `GET /campaigns/{id}/editor/content`: Get latest stored editor payload.
- `POST /campaigns/{id}/preview`: Render preview payload (Response: `{ html, text }`).
- `POST /campaigns/{id}/send-test`: Send test email (Body:
  `{ to: string, subjectOverride?: string }`).
- `PUT /campaigns/{id}/schedule`: Save schedule settings (Body:
  `{ sendOption: "now" | "schedule", scheduleDate, scheduleTime, timezone }`).
- `GET /campaigns/{id}/schedule`: Get schedule settings.
- `POST /campaigns/{id}/validate`: Validate campaign for launch (Response:
  `{ valid: boolean, errors: [] }`).
- `POST /campaigns/{id}/duplicate`: Duplicate campaign (creates new DRAFT).
- `POST /campaigns/{id}/cancel`: Cancel scheduled campaign (returns campaign to DRAFT).
- `GET /campaigns/{id}/events`: Campaign timeline/status events.
- `POST /campaigns/{id}/launch`: Launch a campaign.
- `GET /campaigns/calendar`: Get campaign calendar view.
  - **Query**: `start?`, `end?` (ISO date strings). Returns only scheduled campaigns in range.
  - **Response**: `{ data: Campaign[] }`

### Campaigns UI (Frontend)

- Campaigns landing page view toggle (List / Calendar / View library) is client-side and uses
  existing endpoints:
  - List: `GET /campaigns`
  - Calendar: `GET /campaigns/calendar`
  - Library: `GET /templates` (org-scoped via `x-org-id`)

### Email Builder Integration (Frontend)

All campaign endpoints are organization-scoped via the `x-org-id` header.

There are two supported auth patterns:

1. **Same-site browser app (cookie session)**

- Sign in using `POST /auth/sign-in/email` from the browser.
- Use `credentials: "include"` on all subsequent requests.

Example (fetch):

```ts
const baseUrl = "https://onchain-backend-dvxw.onrender.com/api/v1";
const orgId = "<org-id>";
const campaignId = "<campaign-id>";

const res = await fetch(`${baseUrl}/campaigns/${campaignId}/email`, {
  method: "GET",
  credentials: "include",
  headers: {
    "x-org-id": orgId,
  },
});
```

2. **Embedded builder (no cookies) via editor token (recommended)**

- Step A: Your app (with a cookie session) requests an editor token:
  - `GET /campaigns/{id}/editor-session` with `credentials: "include"` and `x-org-id`
- Step B: Pass that editor token into the embedded builder (e.g. query param or postMessage).
- Step C: The embedded builder calls the editor endpoints using the editor token:
  - Send `Authorization: Bearer <editorToken>` (or `x-editor-token: <editorToken>`)

Endpoints that accept editor token auth:

- `GET /campaigns/{id}/email`
- `PUT /campaigns/{id}/email`
- `GET /campaigns/{id}/editor/content`
- `POST /campaigns/{id}/editor/saved`

Example (builder fetch without cookies):

```ts
const baseUrl = "https://onchain-backend-dvxw.onrender.com/api/v1";
const orgId = "<org-id>";
const campaignId = "<campaign-id>";
const editorToken = "<editor-token>";

await fetch(`${baseUrl}/campaigns/${campaignId}/email`, {
  method: "GET",
  headers: {
    "x-org-id": orgId,
    Authorization: `Bearer ${editorToken}`,
  },
});
```

### Campaign Types

- `GET /campaign-types`: List allowed campaign types.

## Templates

These endpoints are organization-scoped (send `x-org-id` header).

- `GET /templates`: List templates (Query: `search?`, `sort?`, `page?`, `limit?`, `folder?`).
- `POST /templates`: Create template (Body: `{ name, folder?, content? }`).
- `GET /templates/{id}`: Get template details.
- `PUT /templates/{id}`: Update template (Body: `{ name?, folder?, content? }`).
- `DELETE /templates/{id}`: Delete template.

## Notifications

- `GET /notifications`: List current user notifications (Query: `page?`, `limit?`).
- `PUT /notifications/{id}/read`: Mark a notification as read.
- `PUT /notifications/read-all`: Mark all notifications as read.

### Notifications WebSocket

- **Namespace**: `/notifications`
- **Handshake**: provide token via `handshake.auth.token` or `Authorization: Bearer <token>` header.
- **Server events**: `notification` (payload is the persisted notification row)
