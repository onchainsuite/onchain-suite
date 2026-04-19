# OnChain Suite API Endpoints

This document lists the available API endpoints for connecting your frontend.

**Base URL**: `https://onchain-backend-dvxw.onrender.com/api/v1`

## Authentication (BetterAuth & Custom)

All authenticated endpoints typically require a session cookie or a Bearer token (depending on
BetterAuth configuration). The `x-api-key` header is optional and used for rate limiting.

### Auth Routes

- `POST /auth/sign-up/email`: Sign up with email/password.
- `POST /auth/sign-in/email`: Sign in with email/password.
- `POST /auth/social/google`: Google One-Click Auth (Body: `{ "idToken": "..." }`).
- `GET /auth/verify-email`: Verify email address (via link).
- `GET /auth/get-session`: Get current session (BetterAuth).

## User Management

- `GET /user/profile`: Get current user profile.
- `PUT /user/profile`: Update profile details.
- `PUT /user/password`: Change password.
- `PUT /user/2fa`: Toggle 2FA.

## Onboarding

- `GET /onboarding/progress`: Get onboarding progress (resume/cross-device continuity).
- `POST /onboarding/track`: Track onboarding steps (Body: `{ stepName, action, timeSpentSeconds?, currentStep?, stepData?, flowVersion?, metadata? }`).
- `POST /onboarding/complete`: Mark onboarding completed (Body: `{ totalTimeSeconds?, currentStep?, stepData?, flowVersion? }`).
- `GET /onboarding/admin/summary`: Admin summary metrics (Query: `from?`, `to?`).


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

- `POST /domain`: Register a new domain.
- `GET /domain`: List user's domains.
- `GET /domain/{id}`: Get domain details.
- `DELETE /domain/{id}`: Delete a domain.
- `GET /domain/{id}/status`: Check verification status.
- `POST /domain/{id}/recheck`: Manual refresh of status.
- `GET /domain/{id}/dns`: Get DNS records for verification.
- `POST /domain/{id}/dns/auto`: Auto-add DNS records.
- `POST /domain/{id}/senders`: Add a sender username.
- `POST /email/send`: Queue a single transactional email.

## Billing

## Billing & Subscription

- `GET /billing` — Overview of current plan, usage, and limits.
- `GET /billing/usage` — Detailed usage statistics (Query: `period?` = `month` | `current`).
- `GET /billing/plan` — Current plan + upgrade options.
- `GET /billing/plans` — List all available plans.
- `POST /billing/upgrade` — Fiat plan upgrade (Body: `{ plan: "Growth" | "Pro" | "Enterprise" }`). Also supports legacy Blockradar body `{ desiredListSize, plan? }`.
- `POST /billing/upgrade/blockradar` — Blockradar crypto upgrade (dynamic list size pricing) (Body: `{ desiredListSize, plan? }`).
- `GET /billing/upgrade/blockradar/{reference}` — Check status of a specific Blockradar upgrade.

## Invoices

- `GET /billing/invoices` — List invoices (Query: `page?`, `limit?`, `status?`).
- `GET /billing/invoices/{invoiceId}` — Get single invoice details.
- `GET /billing/invoices/{invoiceId}/download` — Get signed download URL for PDF invoice.

## Payment Methods

- `GET /billing/payment-methods` — List payment methods.
- `POST /billing/payment-methods` — Add payment method (Body: `{ type: "card" | "crypto", last4?, brand?, address?, isDefault? }`).
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

## Campaigns

- `GET /campaigns`: List all campaigns.
- `POST /campaigns`: Create a new campaign.
- `GET /campaigns/{id}`: Get campaign details.
- `PUT /campaigns/{id}`: Update campaign.
- `POST /campaigns/{id}/launch`: Launch a campaign.
- `GET /campaigns/calendar`: Get campaign calendar view.
