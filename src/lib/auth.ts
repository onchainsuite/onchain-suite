import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/prisma";

import { serverEnv } from "./env";
import { getFullName } from "./utils";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "@/shared/emails/actions";

const vercelBase =
  process.env.VERCEL_ENV === "production"
    ? (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)
    : process.env.VERCEL_URL;

const envBetterAuthUrl = process.env.BETTER_AUTH_URL?.split("||")[0]?.trim();
const shouldUseEnvUrl =
  envBetterAuthUrl &&
  !(
    process.env.NODE_ENV === "production" &&
    envBetterAuthUrl.includes("localhost")
  );

const runtimeBaseURL = shouldUseEnvUrl
  ? envBetterAuthUrl
  : vercelBase
    ? `https://${vercelBase}`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://onchain-suite.vercel.app";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: runtimeBaseURL,
  trustedOrigins: [
    runtimeBaseURL,
    "https://onchain-suite.vercel.app",
    "https://onchain-suite-nu.vercel.app",
    "https://onchainsuite.com",
    "https://www.onchainsuite.com",
    // Add all preview deployments for onchain-suite
    "https://onchain-suite-*-jorshimayors-projects.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        to: user.email,
        name: user.name,
        resetUrl: url,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent",
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile.family_name,
          name:
            getFullName(profile.given_name, profile.family_name) ??
            getFullName(profile.name),
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified,
        };
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: user.email,
        verifyUrl: url,
        name: user.name,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  rateLimit: {
    window: 60, // time window in seconds
    max: 100, // max requests in the window
    customRules: {
      "/sign-in/email": {
        window: 10,
        max: 3,
      },
    },
  },
  onAPIError: {
    throw: true,
    onError: (error) => {
      // Custom error handling
      throw error;
    },
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // don't allow user to set role
      },
      isNewUser: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
