import { apiClient } from "@/lib/api-client";

/**
 * Transactional sends from the signed-in user via the backend's
 * `POST /email/send` (session-auth; queues into the Azure pipeline).
 * DTO per docs/backend.md: `{ to, subject, html, text?, from?, tags?,
 * configurationSet? }` — omit `from` to use the platform sender
 * (the official onchainsuite.com address).
 */

export const COMPANY_EMAIL = "hello@onchainsuite.com";

export interface SendOfficialEmailBody {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const officialEmailService = {
  async send(body: SendOfficialEmailBody): Promise<void> {
    await apiClient.post("/email/send", body);
  },
};
