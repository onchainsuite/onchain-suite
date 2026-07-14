"use client";

import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { InputFormField } from "@/components/form-fields";
import { Form } from "@/ui/form";
import { LoadingButton } from "@/ui/loading-button";

import { authClient, signInWithGoogle } from "@/lib/auth-client";

import {
  AuthHeader,
  AuthLink,
  FormDivider,
  OAuthButtons,
  PasswordField,
} from "./shared";
import { type SignInFormData, signInSchema } from "@/auth/validation";
import { AUTH_ROUTES, PRIVATE_ROUTES } from "@/shared/config/app-routes";

/**
 * Detects "account does not exist" sign-in failures.
 *
 * Note: better-auth deliberately returns the same generic
 * `INVALID_EMAIL_OR_PASSWORD` (401) for both unknown-email and
 * wrong-password (anti-enumeration), so this only matches if the backend
 * surfaces a distinct code/message. The generic case is handled by the
 * inline "Don't have an account?" affordance after a failed attempt.
 */
const isUserNotFoundError = (error: {
  code?: string;
  message?: string;
}): boolean => {
  if (error.code === "USER_NOT_FOUND") return true;
  const message = error.message ?? "";
  return /user\s+not\s+found|no\s+account|not\s+registered|account\s+does\s+not\s+exist/i.test(
    message
  );
};

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

function GoogleOAuthButtons({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: (next: boolean) => void;
}) {
  const searchParams = useSearchParams();

  const safeRedirectPath = (raw: string | null): string | null => {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed.startsWith("/")) return null;
    if (trimmed.startsWith("//")) return null;
    return trimmed;
  };

  const handleOAuthSignIn = async () => {
    setIsLoading(true);
    try {
      const redirectToRaw = searchParams?.get("redirectTo") ?? null;
      const redirectTo = safeRedirectPath(redirectToRaw);
      const callbackURL = redirectTo ?? PRIVATE_ROUTES.DASHBOARD;

      await signInWithGoogle({ callbackURL });
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "Failed to sign in with Google";
      console.error("Google OAuth start error:", error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OAuthButtons
      onOAuthSignIn={async (_provider: string) => {
        await handleOAuthSignIn();
      }}
      isLoading={isLoading}
    />
  );
}

export function SignInForm({
  onSwitchToSignUp,
  onSwitchToForgotPassword,
}: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [failedEmail, setFailedEmail] = useState<string | null>(null);
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const goToSignUpWithEmail = (email: string) => {
    push(`${AUTH_ROUTES.REGISTER}?email=${encodeURIComponent(email)}`);
  };

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const pickNonEmptyString = (...values: unknown[]) => {
    for (const value of values) {
      if (typeof value === "string" && value.trim().length > 0) return value;
    }
    return undefined;
  };

  const safeRedirectPath = (raw: string | null): string | null => {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed.startsWith("/")) return null;
    if (trimmed.startsWith("//")) return null;
    return trimmed;
  };

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setFailedEmail(null);
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: PRIVATE_ROUTES.DASHBOARD,
      });

      if (error) {
        if (isUserNotFoundError(error)) {
          toast.info("No account found for this email — create one");
          goToSignUpWithEmail(data.email);
          return;
        }
        // Backend returns a generic invalid-credentials error for both
        // unknown-email and wrong-password — surface a sign-up affordance
        // instead of guessing which one it was.
        setFailedEmail(data.email);
        toast.error(
          pickNonEmptyString(error.message) ?? "Invalid email or password"
        );
        return;
      }

      toast.success("Successfully signed in!");
      const redirectToRaw = searchParams?.get("redirectTo") ?? null;
      const redirectTo = safeRedirectPath(redirectToRaw);
      if (redirectTo) {
        push(redirectTo);
      } else {
        push(PRIVATE_ROUTES.DASHBOARD);
      }
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      const displayMessage =
        pickNonEmptyString(
          error instanceof Error ? error.message : undefined,
          String(error)
        ) ?? "Failed to sign in. Please try again.";
      toast.error(displayMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to your Onchain Suite account"
      />

      <GoogleOAuthButtons isLoading={isLoading} setIsLoading={setIsLoading} />

      <div className="my-6">
        <FormDivider />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <InputFormField
              form={form}
              name="email"
              placeholder="Email"
              icon={EnvelopeIcon}
              type="email"
              label="Email Address"
              required
            />

            {/* Password Field */}
            <PasswordField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-primary text-sm transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <LoadingButton isLoading={isLoading} disabled={isLoading}>
              Sign In
            </LoadingButton>

            {failedEmail ? (
              <div className="border-border bg-muted text-muted-foreground rounded-md border p-3 text-sm">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => goToSignUpWithEmail(failedEmail)}
                  className="text-primary font-medium hover:underline"
                >
                  Sign up with {failedEmail}
                </button>
              </div>
            ) : null}
          </form>
        </Form>
      </motion.div>

      <AuthLink
        text="Don't have an account?"
        linkText="Sign up"
        onClick={onSwitchToSignUp}
      />
    </>
  );
}
