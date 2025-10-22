import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    ARCJET_KEY: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLOUD_PROJECT_ID: z.string().min(1),
    GOOGLE_APPLICATION_CREDENTIALS_JSON: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    // NODE_ENV: z
    //   .enum(["development", "test", "production"])
    //   .default("development"),
  },
  //  For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: process.env,
});
