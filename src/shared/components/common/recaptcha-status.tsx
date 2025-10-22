"use client";

import { useReCaptcha } from "@/hooks/client";

export function ReCaptchaStatus() {
  const { isLoaded } = useReCaptcha();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`rounded-lg px-3 py-2 text-sm font-medium text-white ${
          isLoaded ? "bg-green-600" : "bg-yellow-600"
        }`}
      >
        reCAPTCHA: {isLoaded ? "Ready" : "Loading..."}
      </div>
    </div>
  );
}
