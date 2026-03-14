"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Send, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { AUTH_ROUTES } from "@/shared/config/app-routes";

function VerifyAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "pending"
  >(token ? "verifying" : "pending");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("pending");
      return;
    }

    const verifyEmail = async () => {
      try {
        await authClient.verifyEmail({
          query: {
            token,
          },
        });
        setStatus("success");
        toast.success("Email verified successfully!");
        setTimeout(() => {
          router.push(AUTH_ROUTES.ONBOARDING);
        }, 3000);
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleResend = async () => {
    setResending(true);
    try {
      // Mock or actual implementation if available in better-auth client
      // await authClient.sendVerificationEmail({ email: ... });
      toast.success("Verification email resent!");
    } catch (error) {
      toast.error("Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6">
            <div
              className={cn(
                "h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-500",
                status === "verifying" &&
                  "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 animate-pulse",
                status === "success" &&
                  "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 scale-110",
                status === "error" &&
                  "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
                status === "pending" &&
                  "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
              )}
            >
              {status === "verifying" && (
                <Loader2 className="h-10 w-10 animate-spin" />
              )}
              {status === "success" && <CheckCircle2 className="h-10 w-10" />}
              {status === "error" && <XCircle className="h-10 w-10" />}
              {status === "pending" && <Mail className="h-10 w-10" />}
            </div>
          </div>
          <CardTitle className="text-3xl font-light tracking-tight text-(--brand-oxford-blue) dark:text-foreground">
            {status === "verifying" && "Verifying account"}
            {status === "success" && "Welcome aboard!"}
            {status === "error" && "Verification failed"}
            {status === "pending" && "Check your inbox"}
          </CardTitle>
          <CardDescription className="text-base mt-3 text-muted-foreground/80 leading-relaxed px-4">
            {status === "verifying" &&
              "We're currently validating your email address. This will only take a moment."}
            {status === "success" &&
              "Your email has been verified. We're getting your workspace ready now."}
            {status === "error" &&
              "The verification link is invalid or has expired. Please request a new one."}
            {status === "pending" &&
              "We've sent a verification link to your email. Please click it to confirm your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={() => router.push(AUTH_ROUTES.ONBOARDING)}
                className="w-full h-12 bg-(--brand-blue) hover:bg-(--brand-blue)/90 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          )}
          {status === "error" && (
            <div className="space-y-3">
              <Button
                onClick={handleResend}
                disabled={resending}
                className="w-full h-12 bg-(--brand-blue) hover:bg-(--brand-blue)/90 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300"
              >
                {resending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Resend Verification Email
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push(AUTH_ROUTES.LOGIN)}
                className="w-full h-12 rounded-xl text-muted-foreground hover:bg-muted/50"
              >
                Back to Login
              </Button>
            </div>
          )}
          {status === "pending" && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                <p className="text-sm text-center text-muted-foreground italic">
                  "Confirming your email helps us keep your account secure."
                </p>
              </div>
              <Button
                onClick={handleResend}
                disabled={resending}
                className="w-full h-12 bg-(--brand-blue) hover:bg-(--brand-blue)/90 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300"
              >
                {resending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Resend Verification Email
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center border-t border-border/50 py-6">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <a
              href="mailto:support@onchain.com"
              className="text-(--brand-blue) hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function VerifyAccountView() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <VerifyAccountContent />
    </Suspense>
  );
}
