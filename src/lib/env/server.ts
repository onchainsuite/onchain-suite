import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    ARCJET_KEY: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
    R3TAIN_INFRA_URL: z
      .string()
      .url()
      .default("https://r3tain-infra.onrender.com"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  experimental__runtimeEnv: process.env,
});
