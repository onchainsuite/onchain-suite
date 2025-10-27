"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div
            className={`flex flex-col justify-center transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Automation flows
            </div>

            <h1 className="text-foreground mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Welcome new customers—even when you&apos;re offline
            </h1>

            <p className="text-muted-foreground mb-8 text-lg lg:text-xl">
              Automate welcome emails to make a great first impression with new
              customers.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group">
                Get started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button variant="outline" size="lg">
                Learn more about automation flows
              </Button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div
            className={`flex items-center justify-center transition-all delay-300 duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative">
              <div className="relative h-96 w-48 rounded-3xl bg-slate-900 p-2 shadow-2xl">
                <div className="h-full w-full overflow-hidden rounded-2xl bg-white">
                  <div className="flex h-full flex-col">
                    {/* Phone Header */}
                    <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs font-medium">TANDU</span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        9:41 AM
                      </div>
                    </div>

                    {/* Email Content */}
                    <div className="flex-1 p-4">
                      <div className="mb-4 h-20 w-full rounded-lg bg-gradient-to-r from-purple-400 to-pink-400" />
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-slate-200" />
                        <div className="h-3 w-3/4 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-200" />
                      </div>

                      <div className="bg-primary mt-6 rounded-lg px-4 py-2 text-center">
                        <span className="text-primary-foreground text-xs font-medium">
                          Shop Now
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-8 -right-4 animate-bounce rounded-full bg-green-500 p-2">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>

              <div className="absolute bottom-16 -left-4 animate-pulse rounded-full bg-blue-500 p-3">
                <div className="h-3 w-3 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
