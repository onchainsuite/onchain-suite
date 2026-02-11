"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";

import { AUTH_ROUTES } from "@/shared/config/app-routes";

function VerifyAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
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
        // Optional: Redirect after a few seconds
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

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {status === "verifying" && (
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          )}
          {status === "error" && (
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl font-bold">
          {status === "verifying" && "Verifying your email"}
          {status === "success" && "Email verified"}
          {status === "error" && "Verification failed"}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {status === "verifying" &&
            "Please wait while we verify your email address..."}
          {status === "success" &&
            "Your email has been successfully verified. You will be redirected shortly."}
          {status === "error" &&
            "We couldn't verify your email. The link may be invalid or expired."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {status === "success" && (
          <Button
            onClick={() => router.push(AUTH_ROUTES.ONBOARDING)}
            className="w-full"
          >
            Continue to Onboarding
          </Button>
        )}
        {status === "error" && (
          <Button
            variant="outline"
            onClick={() => router.push(AUTH_ROUTES.LOGIN)}
            className="w-full"
          >
            Back to Sign In
          </Button>
        )}
      </CardContent>
      {status === "verifying" && (
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          This shouldn't take long
        </CardFooter>
      )}
    </Card>
  );
}

export function VerifyAccountView() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAccountContent />
    </Suspense>
  );
}
