# OnChain Suite API Endpoints

This document lists the available backend API endpoints for connecting your frontend.

**Base URL**: `https://onchain-backend-dvxw.onrender.com/api/v1`

## Authentication (BetterAuth & Custom)

All authenticated endpoints typically require a session cookie or a Bearer token (depending on
BetterAuth configuration). The `x-api-key` header is optional and used for rate limiting.

### Auth Routes

- `POST /auth/sign-up/email`: Sign up with email/password.
- `POST /auth/sign-in/email`: Sign in with email/password.
- `GET /auth/verify-email`: Verify email address (via link).
- `GET /auth/get-session`: Get current session (BetterAuth).

## User Management

- `GET /user/profile`: Get current user profile.
- `PUT /user/profile`: Update profile details.
- `PUT /user/password`: Change password.
- `PUT /user/2fa`: Toggle 2FA.

## Organization

- `GET /organization`: Get current organization details.
- `PUT /organization`: Update organization details.
- `GET /organization/branding`: Get branding settings.
- `PUT /organization/branding/colors`: Update brand colors.
- `GET /organization/sender-identities`: List verified sender identities.
- `POST /organization/sender-identities`: Add sender identity.
- `DELETE /organization/sender-identities/{id}`: Remove sender identity.
- `POST /organization/sender-identities/{id}/recheck`: Recheck sender verification.

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

- `GET /billing`: Get current plan and usage.
- `POST /billing/upgrade`: Create upgrade checkout.
