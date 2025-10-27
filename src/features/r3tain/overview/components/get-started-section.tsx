"use client";

import { ArrowRight, Mail, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PRIVATE_ROUTES } from "@/config/app-routes";

export function GetStartedSection() {
  return (
    <Card className="border-border bg-card overflow-hidden border">
      <CardHeader className="bg-muted/50 px-4 py-4 pb-3 lg:px-6 lg:pb-4">
        <CardTitle className="text-center text-lg font-semibold lg:text-xl">
          Get started with R3tain
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-border grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          {/* Step 1: Add contacts */}
          <div className="p-4 lg:p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 lg:mb-6">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full lg:h-16 lg:w-16">
                  <span className="text-primary text-xl font-bold lg:text-2xl">
                    1
                  </span>
                </div>
                <div className="bg-primary absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full shadow-lg lg:-top-2 lg:-right-2 lg:h-8 lg:w-8">
                  <Users className="text-primary-foreground h-3 w-3 lg:h-4 lg:w-4" />
                </div>
              </div>

              <h3 className="text-card-foreground text-base font-semibold lg:text-lg">
                Add your first contacts
              </h3>
              <p className="text-muted-foreground mt-2 text-sm lg:mt-3">
                You need contacts to create a campaign. Build your contact
                database or add the recipients of your first campaign.
              </p>
              <Link
                href={PRIVATE_ROUTES.R3TAIN.COMMUNITY}
                className="mt-4 w-full lg:mt-6 lg:w-auto"
              >
                <Button className="w-full lg:w-auto" size="sm">
                  Import your contacts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Step 2: Create campaign */}
          <div className="p-4 lg:p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 lg:mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0ea5e9]/10 lg:h-16 lg:w-16">
                  <span className="text-xl font-bold text-[#0ea5e9] lg:text-2xl">
                    2
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0ea5e9] shadow-lg lg:-top-2 lg:-right-2 lg:h-8 lg:w-8">
                  <Mail className="h-3 w-3 text-white lg:h-4 lg:w-4" />
                </div>
              </div>

              <h3 className="text-card-foreground text-base font-semibold lg:text-lg">
                Create your first campaign
              </h3>
              <p className="text-muted-foreground mt-2 text-sm lg:mt-3">
                Time to get creative and craft a campaign. Need inspiration?
                Pick an email template and use our AI writing assistant.
              </p>
              <Link
                href={PRIVATE_ROUTES.R3TAIN.NEW_CAMPAIGN}
                className="mt-4 w-full lg:mt-6 lg:w-auto"
              >
                <Button
                  className="w-full bg-[#0ea5e9] text-white hover:bg-[#0ea5e9]/90 lg:w-auto"
                  size="sm"
                >
                  Create your first campaign
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
