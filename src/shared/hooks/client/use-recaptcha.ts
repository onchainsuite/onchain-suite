"use client";

import { useReCaptcha as useReCaptchaContext } from "@/providers/recaptcha-provider";

export function useReCaptcha() {
  return useReCaptchaContext();
}
