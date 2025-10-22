"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Clock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { InputFormField } from "@/components/form-fields";
import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { LoadingButton } from "@/ui/loading-button";

import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from "../validation";
import { AuthHeader } from "./shared";

interface ForgotPasswordFormProps {
  onSwitchToSignIn: () => void;
}

export function ForgotPasswordForm({
  onSwitchToSignIn,
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const email = form.watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error ?? "Failed to send reset email");
        return;
      }

      setIsEmailSent(true);
      setCountdown(60);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error ?? "Failed to send reset email");
        return;
      }

      setCountdown(60);
      toast.success("Password reset email sent again!");
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <AnimatePresence mode="wait">
      {!isEmailSent ? (
        <motion.div
          key="forgot-form"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
        >
          <AuthHeader
            icon={Mail}
            title="Forgot your password?"
            subtitle="No worries! Enter your email and we'll send you a reset link."
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <InputFormField
                form={form}
                name="email"
                placeholder="Email"
                icon={Mail}
                type="email"
                label="Email Address"
                required
              />

              <LoadingButton isLoading={isLoading}>
                Send Reset Link
              </LoadingButton>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToSignIn}
              className="text-muted-foreground hover:text-primary inline-flex items-center text-sm transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </button>
          </div>
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

          <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a password reset link to{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>

          <div className="bg-muted/50 mb-6 rounded-lg p-4 text-left">
            <h3 className="mb-2 font-medium">What&apos;s next?</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Check your email inbox (and spam folder)</li>
              <li>• Click the reset link in the email</li>
              <li>• Create a new password</li>
              <li>• Sign in with your new password</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="h-12 w-full"
              disabled={countdown > 0 || isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
                />
              ) : countdown > 0 ? (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Resend in {countdown}s
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Email
                </>
              )}
            </Button>

            <button
              onClick={onSwitchToSignIn}
              className="text-muted-foreground hover:text-primary inline-flex items-center text-sm transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
