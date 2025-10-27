"use client";

import { CreditCard, HelpCircle, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PlanUsageCard() {
  return (
    <Card className="border-border bg-card border">
      <CardHeader className="bg-muted/50 px-4 py-4 pb-3 lg:px-6 lg:pb-4">
        <CardTitle className="text-center text-lg font-semibold lg:text-xl">
          Your plan usage
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Emails usage */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="text-primary h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-card-foreground text-sm font-medium lg:text-base">
                Emails
              </span>
              <HelpCircle className="text-muted-foreground h-4 w-4" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">300 remaining</span>
                <span className="text-card-foreground font-medium">
                  300/300
                </span>
              </div>
              <Progress value={0} className="h-2" />
              <p className="text-muted-foreground mt-1 text-xs">
                Resets on 24/05/2025
              </p>
            </div>
          </div>

          {/* Prepaid credits */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#f59e0b] lg:h-5 lg:w-5" />
              <span className="text-card-foreground text-sm font-medium lg:text-base">
                Prepaid credits
              </span>
              <HelpCircle className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground text-sm">
                0 credits available
              </span>
              <Link href="/settings">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Buy credits
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center lg:mt-6">
          <Link href="/settings">
            <Button variant="outline" className="w-full sm:w-auto">
              Manage your plan
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
