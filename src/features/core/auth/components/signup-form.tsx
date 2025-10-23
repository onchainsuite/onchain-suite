"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { CheckboxFormField, InputFormField } from "@/components/form-fields";
import { Form } from "@/ui/form";
import { LoadingButton } from "@/ui/loading-button";

import { useLocalStorage } from "@/hooks/client";
import { signInWithGoogle } from "@/lib/auth-client";

import {
  AuthHeader,
  AuthLink,
  FormDivider,
  OAuthButtons,
  PasswordField,
  PasswordStrengthIndicator,
} from "./shared";
import { signUp, syncUserDataWithGuard } from "@/auth/actions";
import { type SignUpFormData, signUpSchema } from "@/auth/validation";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { setValue } = useLocalStorage<SignUpFormData | null>("user", null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      marketingEmails: false,
    },
  });

  const password = form.watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      await signUp(data);

      // Store form data for onboarding
      setValue(data);

      // Sync user to our database with additional profile data
      await syncUserDataWithGuard(data);

      toast.success(
        "Account created successfully! Please check your email to verify your account."
      );
    } catch (error: unknown) {
      console.error("Sign up error:", error);
      const message = error instanceof Error ? error.message : undefined;
      toast.error(message ?? "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: string) => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error("OAuth error:", error);
      toast.error(`Failed to sign up with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Create your account"
        subtitle="Join Onchain Suite and revolutionize your marketing"
      />

      <OAuthButtons onOAuthSignIn={handleOAuthSignUp} isLoading={isLoading} />

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
            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <InputFormField
                form={form}
                name="firstName"
                placeholder="First name"
                label="First Name"
                icon={User}
                required
              />

              <InputFormField
                form={form}
                name="lastName"
                placeholder="Last name"
                label="Last Name"
                icon={User}
                required
              />
            </div>

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
            <div className="space-y-2">
              <PasswordField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Create a password"
              />
              <PasswordStrengthIndicator password={password ?? ""} />
            </div>

            {/* Confirm Password Field */}
            <PasswordField
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
            />

            {/* Terms and Marketing Checkboxes */}
            <div className="space-y-3">
              <CheckboxFormField
                form={form}
                name="acceptTerms"
                label={
                  <>
                    I agree to the{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </>
                }
              />

              <CheckboxFormField
                form={form}
                name="marketingEmails"
                label="I'd like to receive marketing emails about Onchain Suite
                      updates and features"
              />
            </div>

            <LoadingButton isLoading={isLoading} disabled={isLoading}>
              Create Account
            </LoadingButton>
          </form>
        </Form>
      </motion.div>

      <AuthLink
        text="Already have an account?"
        linkText="Sign in"
        onClick={onSwitchToSignIn}
      />
    </>
  );
}
