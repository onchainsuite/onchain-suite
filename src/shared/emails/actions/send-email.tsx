"use server";

import { Resend } from "resend";

import { serverEnv } from "@/lib/env";

import { EmailVerificationEmail, PasswordResetEmail } from "../templates";

const resend = new Resend(serverEnv.RESEND_API_KEY);
const DEFAULT_FROM = "Onchain Suite <noreply@onchainsuite.com>";

export async function sendResetPasswordEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  await resend.emails.send({
    from: DEFAULT_FROM,
    to,
    subject: "Reset your password 🔐",
    react: <PasswordResetEmail name={name} resetUrl={resetUrl} />,
  });
}

export async function sendVerificationEmail({
  to,
  name,
  verifyUrl,
}: {
  to: string;
  name?: string;
  verifyUrl: string;
}) {
  await resend.emails.send({
    from: DEFAULT_FROM,
    to,
    subject: "Verify your account ✅",
    react: <EmailVerificationEmail name={name} verifyUrl={verifyUrl} />,
  });
}
