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

### Protocol Server-to-Server Auth (Secret Keys)

Some protocol-facing endpoints accept **secret keys** (`sk_*`) for server-to-server authentication.

- **Header**:
  - `Authorization: Bearer sk_<env>_<keyId>.<verifier>` or
    `x-secret-key: sk_<env>_<keyId>.<verifier>`
- **Org context**: derived from the secret key (no `x-org-id` required for these calls).
- **Key management (org admin)**:
  - `GET /integrations/keys/secret`: List secret keys (masked prefixes only).
  - `POST /integrations/keys/secret`: Create a secret key (Body:
    `{ environment: "live" | "test", name?: string }`).
  - `DELETE /integrations/keys/secret/{keyId}`: Revoke a secret key.

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
- `POST /v2/channels/dispatch`: Protocol server-to-server dispatch (secret-key auth).
  - **Auth**: `Authorization: Bearer sk_*` or `x-secret-key: sk_*`

### In-app Push (SDK Runtime + WebSocket)

- `POST /inapp/challenge`: Get a nonce to sign (publishable-key auth).
  - **Auth**: `x-publishable-key: pk_*` or `Authorization: Bearer pk_*`
  - **Body**: `{ walletAddress }`
  - **Returns**: `{ nonceId, message, expiresAt }`
- `POST /inapp/verify`: Verify signature and mint a short-lived in-app session token.
  - **Auth**: `x-publishable-key: pk_*` or `Authorization: Bearer pk_*`
  - **Body**: `{ walletAddress, signature }`
  - **Returns**: `{ token, wsUrl, expiresAt }`
- `WS /api/v1/inapp/register` (Socket.IO path)
  - **Handshake auth token**:
    - `handshake.auth.token = <token>` (recommended), or `Authorization: Bearer <token>`, or query
      `?t=<token>`
  - **Client → Server**:
    - `REGISTER` `{ walletAddress }`
    - `EVENT`
      `{ campaignRunId, deliveryId, type: "delivered"|"viewed"|"dismissed"|"clicked", walletAddress?, metadata? }`

### In-app Integrations (Org Admin)

- `GET /integrations/inapp/status`: Keys + usage + session count for the active org.
  - **Behavior (lazy publishable keys)**:
    - Publishable keys (`pk_*`) are created automatically the first time an org hits this endpoint
      (or any codepath calling `InappConfigService.getOrCreateKeys`).
    - Storage:
      `Organization.metadata.inapp.keys = { production: "pk_live_...", test: "pk_test_..." }`
  - **Returns** (shape may evolve):
    - `publishableKeys`: `{ production, test }` (preferred) or `publishableKey` (legacy)
    - `secretKeys`: array of secret key metadata (no raw `sk_*` values)
    - `sessionCount`, `usage`
- `GET /integrations/inapp/origins`: List allowed origins.
- `POST /integrations/inapp/origins`: Add allowed origin (Body:
  `{ origin: "https://app.example.com", environment: "production"|"staging"|"development" }`).
- `DELETE /integrations/inapp/origins/{originId}`: Remove allowed origin.
- `POST /integrations/inapp/test-push`: Send a test push to a wallet (Body:
  `{ walletAddress, title, body, ctaLabel?, ctaUrl? }`).
- `POST /integrations/keys/secret`: Create a new secret key token (`sk_*`) (Owner/Admin only).
  - **Body**: `{ environment: "live"|"test", name? }`
  - **Returns**: `{ token: "sk_live_..." }` (token is shown once at creation time; save it
    immediately)
  - **Storage**: only a verifier/hash is stored:
    - `Organization.metadata.apiKeys.secretKeys[]` (stores `id`, `environment`, `verifierHash`,
      timestamps, optional name)

### In-app Protocol Push (Secret Key)

- `POST /inapp/push`: Send an in-app push from a protocol backend (secret-key auth).
  - **Auth**: `Authorization: Bearer sk_*` or `x-secret-key: sk_*`
  - **Body**: `{ walletAddress, title, body, automationId?, ctaLabel?, ctaUrl? }`

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

## Inbox (Gmail-like)

All Inbox endpoints are scoped to the active organization + current user:

- **Org context**: header `x-org-id` or active org in session.
- **Permissions**: Viewer+ for reads, Editor+ for writes.

### Threads

- `GET /inbox/threads` — List threads.
  - **Query**:
    - `folder?` = `INBOX | SENT | ARCHIVE | TRASH`
    - `unread?` = `true|false` (when `true`, only threads with `unreadCount > 0`)
    - `starred?` = `true|false`
    - `labelId?` = label id
    - `q?` = search across subject + snippet + message content
    - `page?` (default `1`), `limit?` (default `50`, max `200`)
  - **Response**:
    - `{ items: ThreadListItem[], meta: { totalItems, totalPages, page, limit, hasPreviousPage, hasNextPage } }`

- `GET /inbox/threads/unread-count` — Global unread count.
  - **Response**: `{ unreadCount: number }`

- `GET /inbox/threads/{threadId}` — Full thread + messages (up to 200).

- `GET /inbox/threads/{threadId}/messages` — List messages (cursor pagination).
  - **Query**: `cursor?` (messageId), `limit?` (default `50`, max `200`)
  - **Response**: `{ items: Message[], nextCursor: string|null }`

### Sending

- `POST /inbox/threads/{threadId}/messages` — Send reply in an existing thread.
  - **Status**: `202`
  - **Body**: `{ content: string, to?: string, fromEmail?: string, attachments?: any }`
  - **Notes**: If `to` is omitted, backend attempts to reply to the most recent inbound sender in
    the thread.
  - **Response**: `{ ok: true, messageId: string }`

- `POST /inbox/messages` — Send a new message (creates a new thread in `SENT`).
  - **Status**: `202`
  - **Body**:
    `{ to: string[]|string, subject: string, content: string, fromEmail?: string, attachments?: any }`
  - **Response**: `{ ok: true, threadId: string, messageId: string }`

### Thread actions

- `PUT /inbox/threads/{threadId}/read` — Mark thread read (sets `unreadCount = 0`).
- `PUT /inbox/threads/{threadId}/unread` — Mark thread unread (sets `unreadCount = 1` if currently
  `0`).
- `PUT /inbox/threads/{threadId}/star` — Toggle/set starred.
  - **Body**: `{ starred?: boolean }` (if omitted, toggles)
  - **Response**: `{ ok: true, starred: boolean }`
- `PUT /inbox/threads/{threadId}/label` — Add/remove labels on a thread.
  - **Body**: `{ add?: string[], remove?: string[] }`
  - **Response**: `{ ok: true, labels: { id, name, color }[] }`

### Labels

- `GET /inbox/labels` — List labels.
  - **Response**: `{ items: { id, name, color }[] }`
- `POST /inbox/labels` — Create label.
  - **Body**: `{ name: string, color?: string }`
  - **Response**: `{ id, name, color }`

### Search

- `GET /inbox/search?q=...&limit?=...` — Global search across threads + messages.
  - **Response**: `{ threads: ThreadSearchItem[], messages: MessageSearchItem[] }`

### Drafts

- `GET /inbox/drafts` — List drafts.
- `POST /inbox/drafts` — Create draft.
  - **Body**: `{ to?: string[], subject?: string, content: string, attachments?: any }`
- `PUT /inbox/drafts/{draftId}` — Update draft.
  - **Body**: `{ to?: string[], subject?: string, content?: string, attachments?: any }`

### Real-time (Socket.IO)

- `WS /ws/inbox` (Socket.IO)
  - **Handshake**:
    - `handshake.auth.token` or `Authorization: Bearer <token>`
    - Org context: `handshake.auth.organizationId` or header `x-org-id` (or active org in session)
  - **Server → Client events**:
    - `new_message` `{ threadId, message }`
    - `thread_updated` `{ threadId, thread?: any, patch?: any }`
    - `unread_count_changed` `{ unreadCount }`

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

## Intelligence

All Intelligence endpoints are org-scoped (send `x-org-id`) and require authentication.

### Query

- `POST /intelligence/query/run`: Execute a user query (async).
  - **Body**: `{ query: "SELECT ..." }`
  - **Response**: `{ queryId, status, resultSummary?, columns, rows, totalRows }`
- `POST /intelligence/query/validate`: Validate query syntax before running.
  - **Body**: `{ query: "..." }`
  - **Response**: `{ valid: true, suggestions?: string[] }`
- `GET /intelligence/query/history`: List recent queries run by the current user.
- `GET /intelligence/query/{queryId}/status`: Check status (`running|completed|failed`).
- `GET /intelligence/query/{queryId}/results`: Fetch paginated results.
  - **Query**: `page?=1`, `limit?=50`
  - **Response**: `{ rows: [...], total: number }`
- `GET /intelligence/query/{queryId}/summary`: Summary line for a query.
  - **Response**: `{ summary, winbackPotential, score }`
- `POST /intelligence/query/{queryId}/save`: Save query as a named report.
  - **Body**: `{ name: string }`
- `POST /intelligence/query/segments/from-query`: Create an audience segment from query results.
  - **Body**: `{ queryId: string, name: string, tags?: string[] }`
  - **Response**: `{ segmentId, profileCount }`
- `POST /intelligence/query/campaign/from-query`: Create a campaign from query results.
  - **Body**: `{ queryId: string, subject?: string, templateId?: any }`
  - **Response**: `{ campaignId }`

### Meta

- `GET /intelligence/schema`: Schema hints for query editor autocomplete.
- `GET /intelligence/metrics`: Top-right metrics.
  - **Response**: `{ score, segmentsCount, revenuePotential }`

### Segments

- `GET /intelligence/segments`: List segments.
  - **Query**: `search?`, `page?`, `limit?`, `sort?`
- `GET /intelligence/segments/metrics`: Segments metrics.
  - **Response**: `{ segmentsCount, revenuePotential }`
- `GET /intelligence/segments/{segmentId}`: Segment detail.
- `POST /intelligence/segments`: Create segment (manual).
  - **Body**: `{ name, rules?, tags? }`
  - **Response**: `{ segmentId, size }`
- `POST /intelligence/segments/import-from-query`: Create segment from a previous query.
  - **Body**: `{ queryId, name }`
  - **Response**: `{ segmentId, size, emailMatch?, revenue? }`
- `PUT /intelligence/segments/{segmentId}`: Update segment (rename/rules).
- `DELETE /intelligence/segments/{segmentId}`: Delete segment.
- `POST /intelligence/segments/{segmentId}/refresh`: Refresh segment stats.
- `GET /intelligence/segments/{segmentId}/profiles`: Paginated profiles in segment.
  - **Query**: `page?`, `limit?`
- `POST /intelligence/segments/{segmentId}/use`: Mark segment used (updates last used timestamp).

### Reports

- `GET /intelligence/reports`: List reports (campaign-backed MVP).
  - **Query**: `search?`, `page?`, `limit?`
- `GET /intelligence/reports/{reportId}`: Report detail (campaign row).
- `GET /intelligence/reports/metrics`: Reports metrics.
- `GET /intelligence/reports/summary`: Reports summary.
- `GET /intelligence/reports/filters`: Reports filter options.
- `POST /intelligence/reports/{reportId}/refresh`: Refresh report (no-op MVP).

## Automations

All Automations endpoints are org-scoped (send `x-org-id`) and require authentication.

- `GET /automations`: List automations.
  - **Query**: `status?=draft|active|paused`, `tab?=drafts`, `search?`, `page?=1`, `limit?=20`
- `GET /automations/search`: Search automations.
  - **Query**: `q?`, `page?`, `limit?`
- `GET /automations/counts`: Tab counters.
  - **Response**: `{ active, drafts, templates }`
- `GET /automations/metrics`: Summary badges (MVP).
  - **Response**: `{ active, entries, conversions, revenue }`

- `POST /automations`: Create automation (starts as draft). Permissions: Editor+.
  - **Body**: `{ name, description?, triggerSpec? | trigger?, flowGraph? | builder? | steps? }`
  - **Response**: `{ automationId, status: "draft" }`
- `GET /automations/{automationId}`: Get automation detail.
- `PUT /automations/{automationId}`: Update automation. Permissions: Editor+.
- `PUT /automations/{automationId}/status`: Quick status toggle. Permissions: Editor+.
  - **Body**: `{ status: "active"|"paused"|"draft"|"archived" }`
- `POST /automations/{automationId}/publish`: Publish draft → active. Permissions: Editor+.
- `POST /automations/{automationId}/duplicate`: Duplicate automation → new draft. Permissions:
  Editor+.
- `DELETE /automations/{automationId}`: Delete automation. Permissions: Editor+.
- `GET /automations/{automationId}/last-edited`: Last edited timestamp (legacy).

### Templates

- `GET /automations/templates`: List automation templates (Plays).
- `GET /automations/templates/{templateId}`: Get template.
- `POST /automations/templates/{templateId}/apply`: Apply template → create draft automation.
  Permissions: Editor+.

### Builder

- `GET /automations/{automationId}/builder`: Load builder definition.
- `PUT /automations/{automationId}/builder`: Save builder graph. Permissions: Editor+.
- `PUT /automations/{automationId}/builder/draft`: Auto-save builder graph. Permissions: Editor+.
- `POST /automations/{automationId}/builder/validate`: Validate builder graph.
  - **Response**: `{ errors: [{code,message}], warnings: [{code,message}] }`
- `POST /automations/{automationId}/builder/discard`: Discard changes (no-op MVP).
- `GET /automations/builder/triggers`: List trigger types.
- `GET /automations/builder/triggers/{triggerType}`: Trigger config schema.
- `GET /automations/triggers/available`: Alias for trigger list.
- `GET /automations/builder/actions`: List action node types.
- `GET /automations/builder/actions/{actionType}`: Action config schema.
- `POST /automations/{automationId}/preview`: Preview audience match for a trigger.
  - **Response**: `{ matches, trigger }`

### Stats

- `GET /automations/{automationId}/stats`: Stats overview.
- `GET /automations/{automationId}/stats/preview`: Projected stats preview.
- `GET /automations/{automationId}/stats/time-series`: Time series.
  - **Query**: `period?=7days|30days|90days`
- `GET /automations/{automationId}/stats/paths`: Path performance (MVP).
- `GET /automations/{automationId}/stats/entries`: Paginated entries.
  - **Query**: `page?`, `limit?`, `sort?`
- `GET /automations/{automationId}/stats/entries/{entryId}`: Entry details.
- `GET /automations/{automationId}/stats/revenue`: Revenue attribution (MVP).
- `GET /automations/{automationId}/performance`: Alias for stats overview.

## Audience (CRM)

- `GET /audience/overview`: Top-of-page audience stats (org-scoped).
  - **Response**:
    `{ total, withWallet, avgHealth, activeCount, coolingCount, coldCount, updatedAt }`

- `GET /audience/profiles`: Audience list/table endpoint (org-scoped).
  - **Query**:
    - `page?` (default `1`)
    - `limit?` (default `50`, max `200`)
    - `q?` (or legacy `search?`)
    - `status?=verified|pending|unverified` (matches contact metadata `status` /
      `verificationStatus`)
    - `tag?=<tagName>`
    - `engagement?=active|cooling|cold` (derived from health score thresholds)
    - `hasWallet?=true|false`
    - `sort?=name|healthScore|lastActionAt` (default `healthScore`)
    - `direction?=asc|desc` (default `desc`)
    - `include?=wallets,tags,attributes,health,lastAction` (comma-separated; legacy: `wallet`)
    - `fields?=...` (comma-separated allowlist)
  - **Includes**:
    - `wallets`: adds `wallets: [{ address, chain?, isPrimary? }]`
    - `tags`: adds `tags: string[]` (default included when `include` is omitted)
    - `attributes`: adds `attributes` from contact metadata
    - `health`: adds `health { score, trend, updatedAt }`
    - `lastAction`: adds `lastAction { type, label, at }` (derived from delivery events)
    - `wallet` (legacy): adds `wallet { address, network, health_score, status }`
  - **Pagination wrapper**:
    - `data.data` is the array of rows
    - `meta` contains `{ page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage }`

- `GET /audience/profiles/{id}`: Profile detail (org-scoped).
  - **Query**: `include?=tags,attributes,wallets,health,lastAction` (same semantics as list)
  - **Response**: Profile fields + `{ createdAt, updatedAt, primaryWallet?, emailStats? }`
- `DELETE /audience/profiles/{id}`: Delete a profile/contact (org-scoped). Permissions: Editor+.

- `GET /audience/profiles/{id}/activity`: Unified activity timeline (org-scoped).
  - **Query**: `cursor?`, `limit?=50` (max `200`), `types?=...`, `from?`, `to?`
  - **Response**: `{ items: [{ id, type, title, description?, at, metadata }], nextCursor }`

- `GET /audience/profiles/{id}/emails`: Email history (org-scoped).
  - **Query**: `cursor?`, `limit?=50` (max `200`), `from?`, `to?`, `campaignId?`
  - **Response**:
    `{ items: [{ id, campaignId, subject, status, sentAt, openedAt?, clickedAt? }], nextCursor }`

- `GET /audience/profiles/{id}/balances`: Wallet balances (GoldRush-backed; cached).
  - **Query**: `chain?=eth-mainnet|base-mainnet|...`, `noSpam?=true|false` (default `true`)
  - **Response**:
    `{ items: [{ contractAddress, symbol, name, decimals, balance, quoteRate?, quote?, isNativeToken?, logoUrl?, type?, isSpam? }], meta: { source, refreshedAt? } }`

- `GET /audience/profiles/{id}/transactions`: Transactions (GoldRush-backed; cached).
  - **Query**: `chain?=eth-mainnet|base-mainnet|...`, `cursor?`, `limit?=25` (max `100`),
    `fromBlock?`, `toBlock?`
  - **Response**: `{ items: [...], nextCursor, meta: { source: "cache"|"goldrush", refreshedAt? } }`

- `GET /audience/profiles/{id}/contract-activity`: Contract activity (GoldRush-backed; derived from
  txns).
  - **Query**: `chain?`, `from?`, `to?`, `limit?=10` (max `50`)
  - **Response**:
    `{ items: [{ contractAddress, contractName?, label?, volumeUsd?, txCount }], refreshedAt? }`

- `GET /audience/profiles/{id}/health`: Health detail (org-scoped).
  - **Response**: `{ score, trend, updatedAt, factors: [] }`

- `GET /audience/profiles/{id}/churn`: Churn prediction (org-scoped).
  - **Response**: `{ risk, score, predictedLtvUsd?, updatedAt, explanation? }`

- `POST /audience/profiles/{id}/enrich`: Trigger onchain enrichment refresh (org-scoped, async).
  - **Body**: `{ chains?: string[], force?: boolean }`
  - **Response**: `{ jobId }` (HTTP `202`)

- `GET /audience/attributes`: List attribute keys (schema) (org-scoped).
  - **Query**: `q?`, `limit?` (max `500`)
  - **Response**: `{ keys: [{ key, type, label?, exampleValues?, countProfiles? }] }`
- `GET /audience/attributes/keys`: Alias for `/audience/attributes`.
  - **Query**: `q?`, `limit?` (max `500`)
- `GET /audience/attributes/{key}/values`: List values for an attribute key (org-scoped).
  - **Query**: `q?`, `limit?` (default `50`, max `200`)
  - **Response**: `{ key, values: [{ value, count }] }`

- `POST /audience/profiles`: Create new contact.
- `PUT /audience/profiles/{id}`: Update contact.
- `GET /audience/tags`: List all tags.
- `POST /audience/tags`: Create a new tag.
- `PUT /audience/profiles/{id}/tags`: Add tags to contact.
- `DELETE /audience/profiles/{id}/tags/{tagName}`: Remove tag from contact.

- `GET /audience/fields`: List available profile fields for import mapping.

- `GET /audience/profiles/{id}/dapp-stats`: Derived dapp/onchain stats.
  - **Query**: `chain?`
  - **Response**: `{ total_volume_usd, transactions_count, active_days }`

- `GET /audience/segments`: List saved segments.
- `POST /audience/segments`: Create a new segment (Body: `{ name, criteria? }`).

- `GET /audience/reengagement-count`: Quick count of profiles needing re-engagement.
  - **Response**: `{ count }`

- `GET /audience/health-score`: Health score calculation details (legacy alias).
  - **Query**: `profileId?` (if provided, returns that profile's health detail)

- `GET /audience/automation/suggestions`: Suggested automations (legacy alias).
  - **Response**: `{ items: [{ id, title, description }] }`

### Audience Import/Export (Legacy Aliases)

These endpoints exist for backward compatibility with older frontend flows. Prefer the Jobs APIs
below for new development.

- `GET /audience/import/sample/csv`: Download sample CSV template.
- `GET /audience/import/sample/json`: Download sample JSON template.

- `POST /audience/import/upload`: Upload import file (alias; returns
  `{ importId, status, filename }`).
- `POST /audience/import`: Import multiple profiles (alias; returns
  `{ importId, status, filename }`).
- `GET /audience/import/recent`: List recent imports.
- `GET /audience/import/{importId}`: Get import details.
- `GET /audience/import/{importId}/status`: Get import status (`progress`, `recordsProcessed`,
  `totalRecords`, `errors`).
- `GET /audience/import/{importId}/errors`: Get import error list (from job `errorSample`).
- `POST /audience/import/{importId}/map`: Map import columns (no-op placeholder, returns
  `{ status: "mapped" }`).
- `POST /audience/import/{importId}/confirm`: Confirm import (no-op placeholder, returns
  `{ status: "started" }`).

- `POST /audience/export`: Start export job (alias; returns `{ exportId, status }`).
- `GET /audience/export/options`: Export options for UI cards.
- `GET /audience/export/recent`: List recent exports.
- `GET /audience/export/{exportId}`: Export details.
- `GET /audience/export/{exportId}/status`: Export job status.
- `GET /audience/export/status/{exportId}`: Export job status (alternate legacy path).
- `GET /audience/export/download/{exportId}`: Download export file.
- `DELETE /audience/export/{exportId}`: Delete an export record.

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
