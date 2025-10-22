"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { LoadingButton } from "@/ui/loading-button";

import { type ResetPasswordFormData, resetPasswordSchema } from "../validation";
import { AuthHeader, PasswordField, PasswordStrengthIndicator } from "./shared";

interface ResetPasswordFormProps {
  token?: string;
  onPasswordReset?: () => void;
}

export function ResetPasswordForm({
  token,
  onPasswordReset,
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error ?? "Failed to reset password");
        return;
      }

      setIsSuccess(true);
      toast.success("Password reset successfully!");

      // Redirect after success
      setTimeout(() => {
        onPasswordReset?.();
      }, 3000);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.div
          key="reset-form"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
        >
          <AuthHeader
            icon={Shield}
            title="Reset your password"
            subtitle="Create a new secure password for your R3tain account"
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <PasswordField
                  control={form.control}
                  name="password"
                  label="New Password"
                  placeholder="Create a new password"
                />
                <PasswordStrengthIndicator password={password} />
              </div>

              <PasswordField
                control={form.control}
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm your new password"
              />

              <LoadingButton isLoading={isLoading}>
                Reset Password
              </LoadingButton>
            </form>
          </Form>
        </motion.div>
      ) : (
        <motion.div
          key="success-message"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
          >
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </motion.div>

          <h1 className="mb-2 text-2xl font-bold">
            Password reset successful!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your password has been successfully updated. You can now sign in
            with your new password.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
          >
            <p className="text-sm text-green-800 dark:text-green-200">
              Redirecting you to sign in page in 3 seconds...
            </p>
          </motion.div>

          <Button onClick={onPasswordReset} className="group h-12 w-full">
            Continue to Sign In
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
