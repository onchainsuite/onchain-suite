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

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: PRIVATE_ROUTES.DASHBOARD,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully signed in!");
            // Check for redirect parameter
            const redirectTo = searchParams.get("redirectTo");
            if (redirectTo) {
              push(redirectTo);
            } else {
              push(PRIVATE_ROUTES.DASHBOARD);
            }
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      });
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signInWithGoogle();

      // Sync user to our database
      // await fetch("/api/auth/sync-user", { method: "POST" });
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error(`Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to your R3tain account"
      />

      <OAuthButtons onOAuthSignIn={handleOAuthSignIn} isLoading={isLoading} />

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
