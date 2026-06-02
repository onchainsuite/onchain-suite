"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
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
import { PRIVATE_ROUTES } from "@/shared/config/app-routes";

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
  const { push } = useRouter();
  const searchParams = useSearchParams();

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
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: PRIVATE_ROUTES.DASHBOARD,
      });

      if (error) {
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
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isGoogleConfigured =
    typeof googleClientId === "string" && googleClientId.trim().length > 0;

  return (
    <>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to your R3tain account"
      />

      {isGoogleConfigured ? (
        <GoogleOAuthButtons isLoading={isLoading} setIsLoading={setIsLoading} />
      ) : (
        <OAuthButtons
          onOAuthSignIn={async (_provider: string) => {
            toast.error(
              "Google sign-in is not configured for this environment"
            );
          }}
          isLoading={isLoading}
        />
      )}

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
              icon={Mail}
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
