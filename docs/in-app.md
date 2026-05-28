# OnchainSuite In-App Push — Implementation Guide

|              |                                            |
| ------------ | ------------------------------------------ |
| Document ID  | IMPL-OCS-INAPP-001                         |
| Version      | 3.0.0                                      |
| Companion to | PRD-OCS-V2-001 v1.1.0 (Section 5.2)        |
| Status       | Implementation sketch (single-purpose SDK) |
| Last Updated | 2026-05-21                                 |

> **v3.0 scope narrowing**: v2.0 carried a dual SDK surface — `pk_*` for browser in-app push, `sk_*`
> for backend campaign sends — under one package. v3.0 commits to a single purpose: **the SDK exists
> only for in-app push.** Register a wallet, emit events. That's it. The secret key (`sk_*`) still
> exists, but only as REST API auth — not bundled into any SDK. This makes the developer story
> crisp: "install the SDK to add in-app push to your dApp; use the REST API for everything else."

This guide is the concrete implementation companion to the PRD's in-app push section. It covers four
things: the additions to the Integrations tab UI, the new API endpoints, the OCS-side NestJS code
that needs to be built, and the protocol-side code that protocols copy into their dApp.

Design defaults assumed throughout (carried from the PRD discussion):

- **Modal** for First Deposit Welcome (one-off, high-signal moment); **toast** for everything else
- **Queue with 72h TTL**, max 10 unread pushes per wallet, oldest dropped first
- **User-side preferences** (frequency caps, per-protocol controls) deferred to v2.1

---

## 1. Package Strategy — One Package, One Job

`@onchainsuite/sdk` is **the in-app push SDK**. Browser-only. It registers a wallet to receive
real-time push notifications inside the protocol's dApp and emits lifecycle events back. Nothing
else.

|                    |                                                      |
| ------------------ | ---------------------------------------------------- |
| Purpose            | In-app push: register a wallet, emit events          |
| Authenticates with | Publishable key (`pk_live_...` / `pk_test_...`) only |
| Runs in            | Browser                                              |
| Bundle target      | ~12 KB gzipped                                       |

**The secret key is not part of the SDK.** It exists as REST API authentication — use it with
`fetch`, `axios`, `curl`, or any HTTP client in any language to send campaigns, manage automations,
query audiences, and do everything else server-side. There is no "backend SDK." There is the SDK
(in-app push) and there is the REST API (everything else).

This separation is deliberate. Three reasons:

1. **A single-purpose SDK is easier to learn, document, and explain.** Five minutes from
   `npm install` to first push delivered.
2. **The REST API is straightforward enough that a thin wrapper adds little.** A Node.js wrapper
   would force every Python, Go, Ruby, and Rust backend to read JS-flavoured docs. The REST API
   treats every backend equally.
3. **It clarifies positioning.** "Drop our SDK in your dApp for real-time push" is a one-line pitch.
   "Our SDK does push, campaigns, automations, and audiences" is a paragraph.

The SDK ships three import paths under the same package, for the same purpose:

```typescript
import { OnchainSuite } from "@onchainsuite/sdk"; // core, framework-agnostic
import { OnchainSuiteProvider, useInApp } from "@onchainsuite/sdk/react"; // React hooks
import { useInAppWithWagmi } from "@onchainsuite/sdk/react/wagmi"; // wagmi auto-wiring
```

Tree-shaking ensures protocols only ship what they import.

---

## 2. Integrations Tab — Developer Tools additions

The existing Developer Tools section has three cards: **API Key**, **SDK Installation** (the backend
SDK shown in the screenshot), and **Webhooks**. v2.0b adds two more cards in the same section.

### 2.1 Two distinct cards — one per key, one per purpose

Rather than cramming both keys into a single card, separate them into two cards that visually
reflect their different jobs. The existing "API Key" card stays as-is for the secret key (REST API
auth). A new card sits above it for the publishable key (SDK).

**Card A — Publishable Key (for the SDK).** Sits at the top of Developer Tools.

```
┌─────────────────────────────────────────────────────────────────┐
│  📡  Publishable Key                                             │
│  Used by the OnchainSuite SDK in your dApp                      │
│  ──────────────────────────────────────────────────────          │
│                                                                  │
│  Production                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  pk_live_pudgy_abc123def456                       [Copy]│   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Test mode                                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  pk_test_pudgy_xyz789                             [Copy]│   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Safe to embed in your dApp's source code.                      │
│  Scoped to in-app push. Rate-limited per allowed origin.        │
│                                                                  │
│  [Rotate]   [View usage]                                         │
└─────────────────────────────────────────────────────────────────┘
```

**Card B — Secret Key (for REST API calls).** The existing card, with clearer labelling about what
it's for.

```
┌─────────────────────────────────────────────────────────────────┐
│  🔐  Secret API Key                                              │
│  Used for server-side REST API calls (curl, fetch, axios)       │
│  ──────────────────────────────────────────────────────          │
│                                                                  │
│  Production                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  sk_live_••••••••••••••••••••••  [Show] [Copy]         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Test mode                                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  sk_test_••••••••••••••••••••••  [Show] [Copy]         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ⚠ Server-side only. Never expose in browser code, mobile       │
│    apps, or public repos. Use the publishable key for those.    │
│                                                                  │
│  [Rotate]   [Audit log]                                          │
└─────────────────────────────────────────────────────────────────┘
```

Visual treatment cues the purpose:

- **Publishable key**: shown in plaintext, single click to copy, "Safe to embed" callout. No
  hide-by-default.
- **Secret key**: masked by default with a "Show" button (5s reveal), prominent ⚠ warning, audit log
  link. The masking does the educating — "this is the dangerous one."

Two cards, not one combined card, because the keys serve different audiences and different code
paths. Splitting them prevents the cognitive load of "wait, which key goes where?" — the card titles
answer the question before the developer asks.

### 2.2 SDK Installation — a tabbed Quick Start

A single card with framework tabs. Every tab is a fully-working snippet that installs the SDK and
starts receiving pushes. There is no "Backend SDK" tab — server-side concerns live in a separate
"REST API" page in the docs, not on this card.

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡  SDK Installation                                            │
│  Add in-app push to your dApp in under 5 minutes                │
│  ──────────────────────────────────────────────────────          │
│                                                                  │
│  Status: ● Active  ·  2,847 connected sessions  ·  12.4k today  │
│                                                                  │
│  ┌─ [React + wagmi] [Next.js] [Vue] [Vanilla JS] ──────────────┐│
│  │                                                              ││
│  │  1. Install                                                  ││
│  │  ┌──────────────────────────────────────────────────────┐  ││
│  │  │ npm install @onchainsuite/sdk                        │  ││
│  │  └──────────────────────────────────────────────────────┘  ││
│  │                                                              ││
│  │  2. Wrap your app                                            ││
│  │  ┌──────────────────────────────────────────────────────┐  ││
│  │  │ import { OnchainSuiteProvider } from                 │  ││
│  │  │   '@onchainsuite/sdk/react'                          │  ││
│  │  │                                                       │  ││
│  │  │ <OnchainSuiteProvider                                │  ││
│  │  │   publishableKey="pk_live_pudgy_abc123">             │  ││
│  │  │   <App />                                            │  ││
│  │  │ </OnchainSuiteProvider>                              │  ││
│  │  └──────────────────────────────────────────────────────┘  ││
│  │                                                              ││
│  │  3. Connect (auto-wires to wagmi)                            ││
│  │  ┌──────────────────────────────────────────────────────┐  ││
│  │  │ import { useInAppWithWagmi } from                    │  ││
│  │  │   '@onchainsuite/sdk/react/wagmi'                    │  ││
│  │  │                                                       │  ││
│  │  │ function App() {                                     │  ││
│  │  │   useInAppWithWagmi()                                │  ││
│  │  │   return <YourDApp />                                │  ││
│  │  │ }                                                    │  ││
│  │  └──────────────────────────────────────────────────────┘  ││
│  │                                                              ││
│  │  That's it. The hook watches your wallet via wagmi,         ││
│  │  prompts the user for a single signature on first connect,  ││
│  │  and starts receiving pushes.                                ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [Open in CodeSandbox ↗]   [Test Push to my wallet ↗]           │
│                                                                  │
│  ──────────────────────────────────────────────────────          │
│  Need to send a campaign or query audiences from your backend?   │
│  See REST API docs → [docs.onchainsuite.com/api ↗]              │
└─────────────────────────────────────────────────────────────────┘
```

Three things make this card pull its weight:

- **Tabs by framework, all browser.** Every tab installs the same package the same way — only the
  wallet-integration idiom differs (wagmi hooks vs Vue composables vs vanilla `window.ethereum`).
- **"Test Push to my wallet" button.** Send a sample push to the wallet currently connected to the
  OCS dashboard, immediately. Closes the loop in under 60 seconds — "I installed it, I see it
  working." Single highest-leverage DX detail in the whole product.
- **Explicit REST API link at the bottom.** Stops a backend developer from going "wait, where's the
  SDK for my Node/Python/Go backend?" — and routes them to the right place. No hidden second SDK.

### 2.3 Existing Card — Allowed Origins (carried over)

Unchanged from v1.0 of this guide except for the enforcement layer: the API now rejects
publishable-key calls from unlisted origins server-side, in addition to the SDK's client-side check.
Add a clear inline error message in the SDK console when this happens: _"Origin https://yoursite.com
is not in your Allowed Origins list. Add it at [link]."_

### 2.2 New Card — Allowed Origins

WS connections are rejected from origins not on this list. Sits below the In-App Push SDK card.

```
┌─────────────────────────────────────────────────────────────────┐
│  🔒  Allowed Origins                                             │
│  Domains permitted to open in-app push connections              │
│  ──────────────────────────────────────────────                 │
│                                                                  │
│  Production                                                      │
│  • https://app.pudgypenguins.com                  [Remove]      │
│  • https://www.pudgypenguins.com                  [Remove]      │
│                                                                  │
│  Staging                                                         │
│  • https://staging.pudgypenguins.com              [Remove]      │
│                                                                  │
│  Development                                                     │
│  • http://localhost:3000                          [Remove]      │
│                                                                  │
│  [+ Add origin]                                                  │
│                                                                  │
│  Wildcards (e.g., *.preview.app.com) supported for staging.     │
│  Production origins must be exact matches and HTTPS-only.       │
└─────────────────────────────────────────────────────────────────┘
```

A protocol that forgets to add their dApp's origin will see WS connections fail with a clear error
message in the SDK console, telling them to add it here. Wildcards permitted for non-production
environments only.

### 2.3 Why this lives in Developer Tools, not Connected Apps

Connected Apps is for **third-party services** the protocol authorises OCS to talk to (Zapier,
Slack, Shopify). In-app push is the opposite — it's a first-party OCS surface the protocol installs
into their own app. It belongs with the API key and the backend SDK in Developer Tools, not in the
Connected Apps grid.

The same logic applies to the Webhooks card. Both are "how do you wire your code to OCS" rather than
"what other services do you want OCS to talk to."

---

## 3. API Endpoints — Additions to the Integrations Spec

### 3.1 Settings / Management Endpoints

Live under `/api/integrations/inapp/*`. Used by the Developer Tools UI.

| Endpoint                                     | Method | Description                                                          |
| -------------------------------------------- | ------ | -------------------------------------------------------------------- |
| `/api/integrations/inapp/status`             | GET    | Active session count, today's quota usage, daily limit               |
| `/api/integrations/inapp/origins`            | GET    | List allowed origins                                                 |
| `/api/integrations/inapp/origins`            | POST   | Add an allowed origin. Body: `{ origin, environment }`               |
| `/api/integrations/inapp/origins/{originId}` | DELETE | Remove an allowed origin                                             |
| `/api/integrations/inapp/test-push`          | POST   | Send a test push to a specific wallet (for protocol's own debugging) |

Example `GET /api/integrations/inapp/status` response:

```json
{
  "active": true,
  "activeSessions": 2847,
  "dailyUsage": {
    "used": 12447,
    "limit": 50000,
    "percentage": 24.9,
    "resetsAt": "2026-05-22T00:00:00Z"
  },
  "allowedOriginsCount": 4,
  "protocolId": "pp_pudgypenguins"
}
```

### 3.2 Runtime Endpoints

All called by the SDK in the browser, authenticated by the publishable key. **No protocol-side
backend involvement.**

| Endpoint                  | Method | Caller | Description                                     |
| ------------------------- | ------ | ------ | ----------------------------------------------- |
| `/api/v2/inapp/challenge` | POST   | SDK    | Get a nonce to sign. Auth: `pk_*` key           |
| `/api/v2/inapp/verify`    | POST   | SDK    | Submit signed nonce, get session token + WS URL |
| `/api/v2/inapp/register`  | WS     | SDK    | Open websocket using session token              |
| `/api/v2/inapp/event`     | WS msg | SDK    | Emit delivered / viewed / dismissed / clicked   |

The challenge → verify → register flow happens silently inside the SDK on first connect. The user
sees **one signature prompt**; the result is cached in `localStorage` and reused until the session
token expires (24h default), so subsequent page loads are silent.

Example flow:

```json
// 1. SDK → POST /api/v2/inapp/challenge
//    Headers: { Authorization: "Bearer pk_live_pudgy_abc", Origin: "https://app.pudgy.com" }
//    Body: { "wallet": "0x8d35...a2f1" }
//    Response: { "nonce": "Sign in to Pudgy Penguins via OnchainSuite\n\nNonce: 7f3a...",
//                "expiresIn": 300 }

// 2. SDK asks the wallet to sign `nonce` via the standard EIP-191 personal_sign

// 3. SDK → POST /api/v2/inapp/verify
//    Headers: { Authorization: "Bearer pk_live_pudgy_abc", Origin: "https://app.pudgy.com" }
//    Body: { "wallet": "0x8d35...a2f1", "nonce": "...", "signature": "0x..." }
//    Response: { "sessionToken": "eyJhbGciOi...", "expiresIn": 86400,
//                "wsUrl": "wss://push.onchainsuite.com/v2/inapp/register" }

// 4. SDK opens WS with `?t=<sessionToken>` — connection upgrades to encrypted
```

The publishable key is rate-limited and origin-restricted server-side. The session token is what
authenticates the WS. The protocol never touches any of this.

---

## 4. OCS-Side Implementation (NestJS)

Module structure under `backend/src/`:

```
src/
├── inapp/
│   ├── inapp.module.ts
│   ├── auth/
│   │   ├── challenge.controller.ts      # /api/v2/inapp/challenge
│   │   ├── verify.controller.ts         # /api/v2/inapp/verify
│   │   ├── auth.service.ts              # nonce gen + signature verify
│   │   └── publishable-key.guard.ts     # validates pk_* + Origin
│   ├── gateway/
│   │   ├── inapp.gateway.ts             # WS handler (@WebSocketGateway)
│   │   ├── connection-registry.ts       # in-memory wallet→socket map
│   │   └── origin-guard.ts              # production-strict check
│   ├── channel/
│   │   └── inapp-push.service.ts        # implements ChannelService
│   ├── queue/
│   │   ├── pending-pushes.service.ts    # 72h queue for offline wallets
│   │   └── pending-pushes.entity.ts
│   ├── analytics/
│   │   └── delivery-events.service.ts   # writes to delivery_events
│   └── settings/
│       ├── origins.controller.ts        # /api/integrations/inapp/origins
│       └── status.controller.ts         # /api/integrations/inapp/status
```

### 4.1 Auth Service — challenge + verify

Two small endpoints handle wallet authentication entirely server-side. The SDK calls them in
sequence and the user signs once.

```typescript
// auth.service.ts
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { verifyMessage } from "ethers";
import { randomBytes } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly nonces: NonceCache, // Redis, 5-min TTL
    private readonly protocols: ProtocolService
  ) {}

  async createChallenge(protocolId: string, wallet: string) {
    const protocol = await this.protocols.byId(protocolId);
    const nonce = randomBytes(16).toString("hex");
    const message =
      `Sign in to ${protocol.name} via OnchainSuite\n\n` +
      `Wallet: ${wallet}\n` +
      `Nonce: ${nonce}\n` +
      `Issued: ${new Date().toISOString()}`;

    await this.nonces.set(`${protocolId}:${wallet}:${nonce}`, message, 300);
    return { nonce: message, expiresIn: 300 };
  }

  async verify(protocolId: string, wallet: string, nonce: string, signature: string) {
    const stored = await this.nonces.get(`${protocolId}:${wallet}:${nonce}`);
    if (!stored) throw new UnauthorizedException("NONCE_INVALID_OR_EXPIRED");

    const recovered = verifyMessage(stored, signature);
    if (recovered.toLowerCase() !== wallet.toLowerCase()) {
      throw new UnauthorizedException("SIGNATURE_MISMATCH");
    }
    await this.nonces.delete(`${protocolId}:${wallet}:${nonce}`); // single-use

    const sessionToken = await this.jwt.signAsync(
      { sub: wallet, protocolId, type: "inapp-session" },
      { expiresIn: "24h", algorithm: "RS256" }
    );
    return {
      sessionToken,
      expiresIn: 86400,
      wsUrl: process.env.INAPP_WS_URL,
    };
  }
}
```

Key choices:

- Nonces are scoped `(protocolId, wallet, nonce)` and single-use. Replay attacks are dead in the
  water.
- Session tokens are 24h, not 10min. The user signs once per day at worst. Cached in `localStorage`
  on the SDK side.
- Standard EIP-191 `personal_sign` — works with every wallet library and every wallet UI.
- The message format is human-readable so wallet popups show something the user can verify.

### 4.2 WebSocket Gateway — the connection hub

The single load-bearing service. NestJS's `@WebSocketGateway` decorator handles connection
lifecycle; you implement the business logic.

```typescript
// inapp.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, WebSocket } from "ws";
import { JwtService } from "@nestjs/jwt";

@WebSocketGateway({ path: "/v2/inapp/register" })
export class InAppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly registry: ConnectionRegistry,
    private readonly originGuard: OriginGuard,
    private readonly pending: PendingPushesService,
    private readonly analytics: DeliveryEventsService
  ) {}

  async handleConnection(client: WebSocket, request: any) {
    const origin = request.headers.origin;
    const token = new URL(request.url, "wss://x").searchParams.get("t");
    if (!token) return client.close(4001, "missing token");

    let payload;
    try {
      payload = await this.jwt.verifyAsync(token);
    } catch {
      return client.close(4002, "invalid token");
    }

    const originOk = await this.originGuard.check(payload.protocolId, origin);
    if (!originOk) return client.close(4003, "origin not allowed");

    const { sub: wallet, protocolId, sessionId } = payload;
    this.registry.add(wallet, protocolId, sessionId, client);

    // Drain queued pushes for this wallet (72h TTL, max 10)
    const queued = await this.pending.drain(wallet, protocolId);
    for (const push of queued) {
      client.send(JSON.stringify({ type: "PUSH", payload: push }));
    }

    // Start heartbeat
    const hb = setInterval(() => client.ping(), 30_000);
    client.on("close", () => clearInterval(hb));
  }

  async handleDisconnect(client: WebSocket) {
    this.registry.removeByClient(client);
  }

  @SubscribeMessage("EVENT")
  async handleEvent(client: WebSocket, data: ClientEvent) {
    const conn = this.registry.findByClient(client);
    if (!conn) return;
    await this.analytics.record({
      walletAddress: conn.wallet,
      protocolId: conn.protocolId,
      channel: "inapp",
      eventType: data.type, // 'delivered' | 'viewed' | 'dismissed' | 'clicked'
      deliveryId: data.deliveryId,
      metadata: data.metadata,
    });
  }

  // Called by InAppPushService when a push is dispatched
  pushToWallet(wallet: string, protocolId: string, payload: InAppPayload) {
    const conn = this.registry.find(wallet, protocolId);
    if (!conn) {
      return this.pending.enqueue(wallet, protocolId, payload); // offline path
    }
    conn.client.send(JSON.stringify({ type: "PUSH", payload }));
  }
}
```

### 4.3 Connection Registry — wallet → socket map

In-memory for v2.0b. If you scale to multiple gateway instances, swap this for Redis pub/sub later.

```typescript
// connection-registry.ts
@Injectable()
export class ConnectionRegistry {
  private byWallet = new Map<string, ConnectionInfo>();
  private byClient = new WeakMap<WebSocket, string>(); // client → key

  add(wallet: string, protocolId: string, sessionId: string, client: WebSocket) {
    const key = `${protocolId}:${wallet}`;
    const existing = this.byWallet.get(key);
    if (existing) existing.client.close(4000, "replaced by newer session");

    const info = { wallet, protocolId, sessionId, client };
    this.byWallet.set(key, info);
    this.byClient.set(client, key);
  }

  find(wallet: string, protocolId: string) {
    return this.byWallet.get(`${protocolId}:${wallet}`);
  }

  findByClient(client: WebSocket) {
    const key = this.byClient.get(client);
    return key ? this.byWallet.get(key) : undefined;
  }

  removeByClient(client: WebSocket) {
    const key = this.byClient.get(client);
    if (key) this.byWallet.delete(key);
    this.byClient.delete(client);
  }
}
```

### 4.4 InAppPushService — the ChannelService implementation

This is what the channel router calls. Implements the shared `ChannelService` interface from the PRD
§5.1.

```typescript
// inapp-push.service.ts
@Injectable()
export class InAppPushService implements ChannelService {
  readonly channelType = "inapp" as const;

  constructor(
    private readonly gateway: InAppGateway,
    private readonly quotas: QuotaService,
    private readonly rateLimiter: RateLimiterService
  ) {}

  async dispatch(req: ChannelDeliveryRequest): Promise<ChannelDeliveryResult> {
    const protocolId = await this.getProtocolId(req.automationId);

    // Check protocol-level quota first
    const quotaOk = await this.quotas.check(protocolId, "inapp", req.walletAddresses.length);
    if (!quotaOk) {
      return {
        ...emptyResult(req),
        failed: req.walletAddresses.map((w) => ({
          walletAddress: w,
          reason: "QUOTA_EXCEEDED",
        })),
      };
    }

    const results = await Promise.allSettled(
      req.walletAddresses.map(async (wallet) => {
        // Per-wallet rate limit (e.g., 5/hour from any one protocol)
        const allowed = await this.rateLimiter.allow(wallet, protocolId, "inapp");
        if (!allowed) return { wallet, status: "rate_limited" };

        const payload = this.buildPayload(req, wallet);
        this.gateway.pushToWallet(wallet, protocolId, payload);
        return { wallet, status: "dispatched", deliveryId: payload.deliveryId };
      })
    );

    return this.aggregateResults(results, req);
  }

  private buildPayload(req: ChannelDeliveryRequest, wallet: string): InAppPayload {
    return {
      deliveryId: randomUUID(),
      kind: req.payloadTemplate.kind ?? "toast",
      title: this.resolveVars(req.payloadTemplate.subject, wallet, req),
      body: this.resolveVars(req.payloadTemplate.body, wallet, req),
      cta: req.payloadTemplate.cta && {
        label: req.payloadTemplate.cta.label,
        url: this.resolveVars(req.payloadTemplate.cta.url, wallet, req),
      },
      ttl: req.payloadTemplate.ttl ?? 86400,
    };
  }
}
```

### 4.5 Pending Pushes — the 72h queue

For wallets that aren't connected when the trigger fires. New Postgres table:

```sql
CREATE TABLE pending_pushes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  VARCHAR(255) NOT NULL,
  protocol_id     UUID NOT NULL,
  payload         JSONB NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  drained_at      TIMESTAMPTZ
);
CREATE INDEX idx_pending_wallet
  ON pending_pushes (protocol_id, wallet_address, created_at DESC)
  WHERE drained_at IS NULL AND expires_at > NOW();
```

The service maintains the 10-per-wallet cap on `enqueue` (delete oldest if over limit) and drains on
WS register.

```typescript
// pending-pushes.service.ts
@Injectable()
export class PendingPushesService {
  constructor(@InjectRepository(PendingPush) private readonly repo) {}

  async enqueue(wallet: string, protocolId: string, payload: InAppPayload) {
    const existing = await this.repo.count({
      where: { walletAddress: wallet, protocolId, drainedAt: IsNull() },
    });
    if (existing >= 10) {
      // Drop oldest
      const oldest = await this.repo.findOne({
        where: { walletAddress: wallet, protocolId, drainedAt: IsNull() },
        order: { createdAt: "ASC" },
      });
      if (oldest) await this.repo.softDelete(oldest.id);
    }
    await this.repo.save({
      walletAddress: wallet,
      protocolId,
      payload,
      expiresAt: new Date(Date.now() + 72 * 3600 * 1000),
    });
  }

  async drain(wallet: string, protocolId: string): Promise<InAppPayload[]> {
    const rows = await this.repo.find({
      where: {
        walletAddress: wallet,
        protocolId,
        drainedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      order: { createdAt: "ASC" },
    });
    await this.repo.update({ id: In(rows.map((r) => r.id)) }, { drainedAt: new Date() });
    return rows.map((r) => r.payload);
  }
}
```

A daily cron deletes rows where `expires_at < NOW()` to keep the table small.

### 4.6 Origin Guard

Reads from a small `inapp_allowed_origins` table populated via the settings endpoints.

```typescript
@Injectable()
export class OriginGuard {
  async check(protocolId: string, origin: string): Promise<boolean> {
    const allowed = await this.repo.find({ where: { protocolId } });
    return allowed.some((row) => {
      if (row.origin === origin) return true;
      if (row.origin.includes("*") && row.environment !== "production") {
        const pattern = new RegExp("^" + row.origin.replace(/\*/g, ".+") + "$");
        return pattern.test(origin);
      }
      return false;
    });
  }
}
```

Hard rule enforced in the writer: production origins cannot contain wildcards and must start with
`https://`.

---

## 5. Protocol-Side Integration — the minimal DX

**Total protocol code: 5 lines for the easy path, 10 for the explicit path. Zero backend code.**

### 5.1 The easy path — React + wagmi

For any protocol using wagmi (most modern dApps), the entire integration is:

```tsx
// app/layout.tsx
import { OnchainSuiteProvider } from "@onchainsuite/sdk/react";

export default function RootLayout({ children }) {
  return (
    <OnchainSuiteProvider publishableKey="pk_live_pudgy_abc123">{children}</OnchainSuiteProvider>
  );
}
```

```tsx
// app/page.tsx
"use client";
import { useInAppWithWagmi } from "@onchainsuite/sdk/react/wagmi";

export default function App() {
  useInAppWithWagmi(); // detects wallet via wagmi, prompts one signature
  return <YourDApp />;
}
```

That's it. The hook:

- Watches `useAccount()` from wagmi
- When `address` becomes truthy, runs the challenge/sign/verify dance silently
- Prompts the user for **one** wallet signature (cached 24h)
- Opens the websocket
- Re-runs on wallet change, cleans up on disconnect
- Renders pushes via the SDK's shadow-root mount

If the user is already authenticated (session in localStorage), there's no signature prompt.

### 5.2 The explicit path — non-wagmi or vanilla

If a protocol uses a non-wagmi wallet library (ethers, viem, RainbowKit without wagmi, custom
signers), they pass a signer function explicitly:

```tsx
import { useInApp } from "@onchainsuite/sdk/react";

function App() {
  const { address } = useMyWalletLib();
  const signer = useMySignerLib();

  useInApp({
    wallet: address,
    signMessage: (message) => signer.signMessage(message),
  });

  return <YourDApp />;
}
```

Or vanilla, no React at all:

```typescript
import { OnchainSuite } from "@onchainsuite/sdk";

const ocs = new OnchainSuite("pk_live_pudgy_abc123", {
  theme: { primary: "#FFD700" },
});

// After wallet connect
await ocs.connect({
  wallet: "0x8d35...a2f1",
  signMessage: async (msg) =>
    await window.ethereum.request({
      method: "personal_sign",
      params: [msg, "0x8d35...a2f1"],
    }),
});

// On wallet disconnect
ocs.disconnect();
```

Six lines. No backend code.

### 5.3 The SDK public API

The whole surface area:

```typescript
class OnchainSuite {
  constructor(
    publishableKey: string, // pk_live_... or pk_test_...
    opts?: {
      theme?: Partial<ThemeTokens>;
      position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-banner";
      onClick?: (delivery: { deliveryId: string; url: string }) => void;
      onError?: (error: OcsError) => void;
      debug?: boolean;
    }
  );

  // Connect a wallet to start receiving pushes
  connect(opts: {
    wallet: string;
    signMessage: (message: string) => Promise<string>;
  }): Promise<void>;

  // Disconnect (e.g., on wallet disconnect)
  disconnect(): Promise<void>;

  // Subscribe to lifecycle events
  on(event: "connected" | "disconnected" | "push" | "error", cb: Function): void;
  off(event: string, cb: Function): void;
}
```

That's the entire public API. Six methods. No namespaces, no submodules, no `campaigns.*` or
`audiences.*` or `automations.*` — those don't exist in the SDK. If a developer wants to send a
campaign, they hit the REST API from their backend with a secret key.

Misuse handling: if a developer passes a string that doesn't start with `pk_`, the constructor
throws immediately with a clear message: _"OnchainSuite SDK requires a publishable key (starts with
`pk_`). For REST API access from your backend, see [docs link]."_ Misuse fails at construction time,
not at call time.

### 5.4 React Hooks — the full surface

```typescript
// Wraps the app, holds the singleton OnchainSuite client
<OnchainSuiteProvider publishableKey="pk_live_..." theme={...}>

// The general hook — pass wallet + signer, get connection state
const { connected, error, latestPush } = useInApp({ wallet, signMessage })

// The wagmi auto-wire hook — zero args, reads from wagmi context
const { connected, error } = useInAppWithWagmi()

// Imperative API access if needed (rare)
const ocs = useOnchainSuite()
ocs.disconnect()
```

`useInAppWithWagmi()` is the recommended path for new dApps. The explicit `useInApp()` exists for
protocols that need to control the signer (custom wallets, account abstraction, embedded wallets).

### 5.5 Render Components

Three components ship in v2.0b. The Play's payload dictates which one renders:

```typescript
// Toast — corner, 6s auto-dismiss (default)
{ kind: 'toast', title: 'Swap confirmed', body: 'You received 1,247 USDC' }

// Banner — sticky top, persistent until dismissed
{ kind: 'banner', title: 'v2 launches in 3 days', cta: { label: 'Learn more', url: '...' } }

// Modal — blocking, requires interaction (use sparingly)
{ kind: 'modal', title: 'Welcome aboard', body: '...', cta: { label: 'Take a tour', url: '...' } }
```

Per the agreed defaults: **First Deposit Welcome ships as a modal** (one-off, high-signal);
**everything else as a toast** (low-friction, dismissable).

### 5.6 Where complexity goes (so the SDK stays minimal)

| Concern                                           | Where it lives                                    |
| ------------------------------------------------- | ------------------------------------------------- |
| Challenge/sign/verify dance                       | Inside the SDK, transparent                       |
| Session token cache                               | SDK `localStorage`, invisible to protocol         |
| WS auto-reconnect                                 | SDK, exponential backoff up to 30s                |
| Token refresh on expiry                           | SDK, automatic via re-running challenge silently  |
| Shadow-DOM CSS isolation                          | SDK render layer                                  |
| Variable resolution in payloads                   | OCS backend, before dispatch                      |
| Wallet signature verification                     | OCS backend, on `/verify`                         |
| Origin validation                                 | OCS API (server-side) and SDK (preflight warning) |
| Rate limiting per protocol/wallet                 | OCS backend                                       |
| 72h offline queue                                 | OCS backend                                       |
| Campaign sends, audience queries, automation CRUD | **REST API only** — not in the SDK                |

The protocol's SDK code only ever knows about a `publishableKey`, a wallet, and (optionally) a
signer. Everything else — including everything server-side — is either invisible (handled inside the
SDK) or out of scope (REST API).

---

## 6. How This Plugs Into the Automation Builder

The existing Automation Builder spec already has an "Available Actions" endpoint
(`/api/automations/builder/actions`). Add a new action type:

```typescript
{
  type: 'send_inapp_push',
  label: 'Send In-App Push',
  configSchema: {
    kind: { type: 'select', options: ['toast', 'banner', 'modal'], default: 'toast' },
    title: { type: 'string', required: true, supportsVariables: true },
    body:  { type: 'markdown', required: true, supportsVariables: true },
    cta:   { type: 'object', required: false, fields: {
      label: { type: 'string' },
      url:   { type: 'string', supportsVariables: true },
    }},
    ttl:   { type: 'number', default: 86400, description: 'Auto-dismiss after N seconds' },
  }
}
```

The flow builder renders this as a configurable node sibling to "Send Email." When the user picks
`kind: 'modal'`, the builder shows a soft warning: "Modals interrupt the user. Use for high-priority
moments only." Defaults make it easy to do the right thing.

---

## 7. Analytics — the new delivery_events rows

Already covered in the PRD §5.7. For in-app push specifically, four event types flow in:

| Event       | Source                    | Counts toward                      |
| ----------- | ------------------------- | ---------------------------------- |
| `delivered` | SDK WS ack on receipt     | Reach                              |
| `viewed`    | Component in viewport >1s | Visibility                         |
| `dismissed` | User closed or TTL fired  | (negative signal if before viewed) |
| `clicked`   | User clicked CTA          | Conversion                         |

The Automation Stats tab's "Path Performance" already groups by automation node. With in-app push as
a new node type, it'll render alongside email rows automatically. No schema changes needed beyond
adding `'inapp'` to the channel enum.

---

## 8. Build Order (Sprint 2 / v2.0b)

Mapped to the PRD's Sprint 2 commitments, in dependency order:

1. **Publishable-key infra** (1 day) — `pk_*` and `sk_*` key generation, scope enforcement,
   origin-restricted middleware
2. **Auth service: challenge + verify** (2 days) — nonce cache (Redis), EIP-191 signature
   verification, RS256 session JWTs
3. **WS gateway + Origin guard** (2 days) — handle connect/disconnect, in-memory connection registry
4. **InAppPushService (ChannelService impl)** (2 days) — dispatch, quota, rate limit, payload build
5. **Pending pushes queue** (1 day) — 72h TTL, 10-per-wallet cap, drain on register
6. **Automation node integration** (1 day) — new action type in builder, validator, preview
7. **`@onchainsuite/sdk` core package** (3 days) — `OnchainSuite` class, `connect/disconnect/on`, WS
   client, shadow-root rendering, three components, theme tokens, localStorage session cache,
   auto-reconnect, NPM publish
8. **`@onchainsuite/sdk/react` + wagmi adapter** (2 days) — Provider, `useInApp`,
   `useInAppWithWagmi`, `useOnchainSuite`
9. **Analytics wiring** (1 day) — `delivery_events` writes from WS event handler
10. **Settings UI: Publishable Key card + Secret Key card + SDK Installation Quick Start + Test Push
    button** (3 days) — the highest-leverage DX piece in the whole product
11. **Allowed Origins card** (1 day) — CRUD + server-side enforcement on publishable-key calls
12. **CodeSandbox templates** (1 day) — pre-configured sandboxes for React+wagmi, Next.js, Vue,
    vanilla
13. **End-to-end test + dogfood** (2 days) — install on a test dApp, fire a real push from a real
    automation

About **22 engineering-days**, slightly less than v2.0 because the SDK package is smaller (no `sk_*`
code path, no server-side method surfaces). The DX investment (Quick Start tabs, Test Push button,
sandboxes) stays — that's where the adoption curve is won.

---

## 9. What I'm Deliberately Not Building in v2.0b

For future sprints. Worth flagging so engineering doesn't over-engineer day one.

- **User-side preferences panel** — frequency caps, per-protocol mute. v2.1.
- **Native browser push API fallback** — for when the user isn't in the dApp. v2.2 if data
  justifies.
- **Headless mode** — protocol owns the rendering, SDK just delivers payloads. v2.2 for protocols
  with strict design systems.
- **Multi-region WS gateway** — for now, one region. Add CDN-edge gateways in v2.2 if latency
  outside US becomes a real issue.
- **Push payload signing** — payloads aren't currently signed by OCS. The WS connection is already
  authenticated end-to-end (TLS + token), so an MITM on the payload itself is implausible. Add HMAC
  signing if a customer asks.
- **Web push for cross-protocol delivery** — i.e., showing a push from OCS even when the user isn't
  on the protocol's dApp. Out of scope and arguably out of mandate.

---
