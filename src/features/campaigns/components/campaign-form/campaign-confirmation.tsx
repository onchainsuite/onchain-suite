"use client";

import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { PRIVATE_ROUTES } from "@/config/app-routes";

interface ConfirmationPageProps {
  sendOption: "now" | "schedule";
  scheduleDate?: Date;
  scheduleTime?: string;
  timezone?: string;
}

export function ConfirmationPage({
  sendOption,
  scheduleDate,
  scheduleTime,
  timezone,
}: ConfirmationPageProps) {
  const [mounted, setMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowDetails(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const isScheduled = sendOption === "schedule";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 -right-20 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl transition-transform duration-2000 ${mounted ? "translate-x-0 scale-100" : "translate-x-full scale-0"}`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl transition-transform duration-2000 delay-200 ${mounted ? "translate-x-0 scale-100" : "-translate-x-full scale-0"}`}
        />
        {mounted && (
          <>
            <Sparkles className="absolute top-38 left-38 w-6 h-6 text-primary/20 animate-pulse" />
            <Sparkles className="absolute bottom-48 right-40 w-4 h-4 text-primary/20 animate-pulse delay-300" />
            <Sparkles className="absolute top-64 right-64 w-5 h-5 text-primary/20 animate-pulse delay-700" />
          </>
        )}
      </div>

      <div className="max-w-2xl w-full relative">
        {/* Success Icon Animation */}
        <div className="flex justify-center mb-8">
          <div
            className={`relative transition-all duration-700 ${mounted ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-primary rounded-full p-6">
              {isScheduled ? (
                <Calendar className="w-8 h-8 text-primary-foreground animate-bounce-in" />
              ) : (
                <CheckCircle className="w-8 h-8 text-primary-foreground animate-bounce-in" />
              )}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div
          className={`bg-card rounded-2xl shadow-2xl shadow-primary/10 p-8 md:p-12 border border-border transition-all duration-700 delay-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {isScheduled ? "Campaign Scheduled!" : "Campaign Sent!"}
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              {isScheduled
                ? "Your campaign is scheduled and ready to go"
                : "Your campaign has been sent successfully to all recipients"}
            </p>
          </div>

          {/* Details Card */}
          <div
            className={`bg-muted rounded-xl p-6 mb-8 border border-border transition-all duration-700 delay-500 ${showDetails ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <div className="space-y-4">
              {isScheduled ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3 mt-0.5">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">
                        Scheduled Date & Time
                      </div>
                      <div className="text-muted-foreground">
                        {scheduleDate && scheduleTime ? (
                          <>
                            {scheduleDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            {" at "}
                            {scheduleTime}
                          </>
                        ) : (
                          "Friday, December 19, 2025 at 09:00 AM"
                        )}
                      </div>
                    </div>
                  </div>
                  {timezone && (
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-lg p-3 mt-0.5">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-1">
                          Timezone
                        </div>
                        <div className="text-muted-foreground">{timezone}</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3 mt-0.5">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground mb-1">
                      Sent Time
                    </div>
                    <div className="text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div
            className={`bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 transition-all duration-700 delay-700 ${showDetails ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isScheduled ? (
                <>
                  <span className="font-semibold text-primary">
                    What happens next?
                  </span>{" "}
                  We&apos;ll send your campaign at the scheduled time. You can
                  manage or cancel this campaign from your dashboard.
                </>
              ) : (
                <>
                  <span className="font-semibold text-primary">
                    What happens next?
                  </span>{" "}
                  Your recipients will receive the campaign shortly. You can
                  track performance and engagement from your analytics
                  dashboard.
                </>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-900 ${showDetails ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <Button asChild size="lg" className="flex-1 group">
              <Link href={PRIVATE_ROUTES.DASHBOARD}>
                View Dashboard
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 bg-transparent"
            >
              <Link href={PRIVATE_ROUTES.NEW_CAMPAIGN}>
                Create Another Campaign
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Text */}
        <p
          className={`text-center text-sm text-muted-foreground mt-6 transition-all duration-700 delay-1000 ${showDetails ? "opacity-100" : "opacity-0"}`}
        >
          Need help? Visit our{" "}
          <Link href="/support" className="text-primary hover:underline">
            support center
          </Link>
        </p>
      </div>
    </div>
  );
}
