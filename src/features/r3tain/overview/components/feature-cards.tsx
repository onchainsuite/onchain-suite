"use client";

import { Clock, MessageSquare, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureCards() {
  return (
    <Card className="border-border bg-card border">
      <CardHeader className="bg-muted/50 px-4 py-4 pb-3 lg:px-6 lg:pb-4">
        <CardTitle className="text-center text-lg font-semibold lg:text-xl">
          Powerful features to grow your business
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* Organize contacts */}
          <div className="flex h-full flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#10b981]/20 lg:mb-4 lg:h-14 lg:w-14">
              <Users className="h-6 w-6 text-[#10b981] lg:h-7 lg:w-7" />
            </div>
            <h3 className="text-card-foreground text-base font-semibold lg:text-lg">
              Organize your contacts
            </h3>
            <p className="text-muted-foreground mt-2 flex-1 text-sm">
              Create highly targeted campaigns with smart segmentation and lists
              based on customer behavior.
            </p>
            <Link href="/contacts" className="mt-auto w-full pt-3 lg:pt-4">
              <Button
                className="w-full bg-[#10b981] text-white hover:bg-[#10b981]/90"
                size="sm"
              >
                Add contacts
              </Button>
            </Link>
          </div>

          {/* Meet customers */}
          <div className="flex h-full flex-col items-center text-center">
            <div className="bg-primary/20 mb-3 flex h-12 w-12 items-center justify-center rounded-full lg:mb-4 lg:h-14 lg:w-14">
              <MessageSquare className="text-primary h-6 w-6 lg:h-7 lg:w-7" />
            </div>
            <h3 className="text-card-foreground text-base font-semibold lg:text-lg">
              Multi-channel campaigns
            </h3>
            <p className="text-muted-foreground mt-2 flex-1 text-sm">
              Reach customers on their preferred channels: email, WhatsApp, SMS,
              and Web Push notifications.
            </p>
            <Link href="/campaigns" className="mt-auto w-full pt-3 lg:pt-4">
              <Button className="w-full" size="sm">
                Create Campaign
              </Button>
            </Link>
          </div>

          {/* Deliver messages */}
          <div className="flex h-full flex-col items-center text-center sm:col-span-2 lg:col-span-1">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b]/20 lg:mb-4 lg:h-14 lg:w-14">
              <Clock className="h-6 w-6 text-[#f59e0b] lg:h-7 lg:w-7" />
            </div>
            <h3 className="text-card-foreground text-base font-semibold lg:text-lg">
              Perfect timing
            </h3>
            <p className="text-muted-foreground mt-2 flex-1 text-sm">
              Send timely messages with automation: welcome emails, cart
              reminders, and order confirmations.
            </p>
            <Link href="/automations" className="mt-auto w-full pt-3 lg:pt-4">
              <Button
                className="w-full bg-[#f59e0b] text-white hover:bg-[#f59e0b]/90"
                size="sm"
              >
                Create automation
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
