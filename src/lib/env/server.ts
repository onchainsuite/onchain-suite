import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    ARCJET_KEY: z.string().min(1),
    // BACKEND_URL is optional because we fallback to NEXT_PUBLIC_BACKEND_URL if needed
    BACKEND_URL: z.string().url().optional(),
    DATABASE_URL: z.url(),
    R3TAIN_INFRA_URL: z
      .string()
      .url()
      .default("https://r3tain-infra.onrender.com"),
    RESEND_API_KEY: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  //  For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: process.env,
});
