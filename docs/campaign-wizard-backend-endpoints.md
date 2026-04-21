# Campaign Wizard Backend Endpoints (All Steps)

This file lists the wizard-specific backend endpoints needed for all steps in the multi-step
Campaign Creation Wizard, excluding endpoints that are already documented in
[backend.md](file:///c:/Users/USER/onchain-suite/docs/backend.md).

## Already Documented In backend.md

- `GET /campaigns`
- `POST /campaigns`
- `GET /campaigns/{id}`
- `PUT /campaigns/{id}`
- `POST /campaigns/{id}/launch`
- `GET /campaigns/calendar`

## Step 1: Campaign Details

### Uses Existing Endpoints

- Use `POST /campaigns` to create the draft and get the `campaignId`.
- Use `GET /campaigns/{id}` to hydrate when resuming.
- Use `PUT /campaigns/{id}` for updates while the user edits Step 1.

### Recommended

- `GET /campaign-types`
  - Purpose: provide allowed campaign types and labels from backend config.

- `POST /campaigns/{id}/autosave`
  - Purpose: frequent draft saves without full update semantics.

## Step 2: Audience & Tracking

### Audience Selection

- `GET /audience/lists`
  - Purpose: list selectable static lists.
  - Response item fields:
    - `id`
    - `name`
    - `count`
    - `starred`

- `GET /audience/segments`
  - Purpose: list selectable dynamic segments.
  - Response item fields:
    - `id`
    - `name`
    - `count`
    - `starred`

- `PUT /campaigns/{id}/audience`
  - Purpose: attach selected audiences to campaign.
  - Body:
    - `listIds: string[]`
    - `segmentIds: string[]`

- `GET /campaigns/{id}/audience`
  - Purpose: read currently attached audience for edit flow.

### Tracking & Smart Sending

- `PUT /campaigns/{id}/tracking`
  - Purpose: save toggles/options from Step 2.
  - Body:
    - `smartSending: boolean`
    - `trackingParameters: boolean`
    - `utm` (optional object for UTM params)

- `GET /campaigns/{id}/tracking`
  - Purpose: hydrate tracking settings.

### Optional Validation Endpoint

- `POST /campaigns/{id}/audience/estimate`
  - Purpose: estimate recipient count before schedule/launch.
  - Response:
    - `recipientCount`
    - `excludedBySmartSending`

## Step 3: Templates & Email Message

### Template Library

- `GET /templates`
  - Purpose: list templates for the left panel.
  - Query:
    - `search`
    - `sort`
    - `page`
    - `folder`

- `POST /templates`
  - Purpose: create a template from scratch (Create button in template panel).

- `GET /templates/{id}`
  - Purpose: load selected template detail.

- `PUT /templates/{id}`
  - Purpose: update saved template metadata/content.

- `DELETE /templates/{id}`
  - Purpose: remove template from library.

### Campaign Email Content

- `PUT /campaigns/{id}/content`
  - Purpose: save message-level fields from top bar.
  - Body:
    - `subject`
    - `previewText`
    - `senderName`
    - `senderEmail`
    - `replyToEmail`

- `GET /campaigns/{id}/content`
  - Purpose: hydrate top bar fields on edit/reload.

- `PUT /campaigns/{id}/template`
  - Purpose: attach template to campaign.
  - Body:
    - `templateId`

### Embedded Editor Integration

- `GET /campaigns/{id}/editor-session`
  - Purpose: return short-lived editor token/config for iframe if needed.
  - Response:
    - `editorUrl`
    - `token`
    - `expiresAt`

- `POST /campaigns/{id}/editor/saved`
  - Purpose: webhook/callback from editor on save (optional if editor writes directly).
  - Body:
    - `html`
    - `json`
    - `textVersion`
    - `assets`

- `GET /campaigns/{id}/editor/content`
  - Purpose: retrieve latest editor payload for preview and sending.

### Validation & Preview

- `POST /campaigns/{id}/preview`
  - Purpose: return rendered preview html/text from merge data.

- `POST /campaigns/{id}/send-test`
  - Purpose: send test email before scheduling.
  - Body:
    - `to`
    - `subjectOverride` (optional)

## Step 4: Schedule

- `PUT /campaigns/{id}/schedule`
  - Purpose: save send option and schedule config.
  - Body:
    - `sendOption` (`now | schedule`)
    - `scheduleDate` (ISO date)
    - `scheduleTime`
    - `timezone`

- `GET /campaigns/{id}/schedule`
  - Purpose: hydrate schedule step.

### Uses Existing Endpoints

- Use `GET /campaigns/calendar` for calendar view (already in backend.md).

## Finalize / Launch / Status

- `POST /campaigns/{id}/validate`
  - Purpose: final preflight validation across all steps.
  - Response:
    - `valid: boolean`
    - `errors: []`

### Uses Existing Endpoints

- Use `POST /campaigns/{id}/launch` to launch or queue (already in backend.md).

- `POST /campaigns/{id}/duplicate`
  - Purpose: create copy for "reuse campaign" flow.

- `POST /campaigns/{id}/cancel`
  - Purpose: cancel queued campaign before send time.

### Notes

- Use `GET /campaigns` for dashboard/table (already in backend.md).

- `GET /campaigns/{id}/events`
  - Purpose: status timeline (drafted, scheduled, launched, sent, failed).

## Suggested Request/Response Conventions

- Always accept org scope via `x-org-id` header.
- Use consistent envelope:
  - success: `{ "data": ... }`
  - error: `{ "error": { "message": "...", "code": "..." } }`
- Return `id` on every create endpoint.
- Support partial updates with `PUT` (or switch to `PATCH` consistently if preferred).
