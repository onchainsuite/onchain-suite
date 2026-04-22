"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, List, Mail, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/ui/tabs";

import { CampaignsCalendar } from "../../campaigns/components/calendar";
import { CampaignsTable } from "../../campaigns/components/table";
import { campaignsService } from "../campaigns.service";
import type { CampaignStatus } from "../types/campaign";
import { PRIVATE_ROUTES } from "@/shared/config/app-routes";

export function CampaignsListsView() {
  const normalizeStatus = (value: unknown): CampaignStatus => {
    switch (value) {
      case "draft":
      case "scheduled":
      case "sending":
      case "sent":
      case "paused":
      case "failed":
        return value;
      default:
        return "draft";
    }
  };

  const [activeTab, setActiveTab] = useState("table");
  const campaignsQuery = useQuery({
    queryKey: ["campaigns", "list"],
    queryFn: () => campaignsService.listCampaigns({ page: 1, limit: 200 }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const calendarQuery = useQuery({
    queryKey: ["campaigns", "calendar"],
    queryFn: () => campaignsService.getCalendar(),
    enabled: activeTab === "calendar",
    retry: false,
    refetchOnWindowFocus: false,
  });

  const campaigns = campaignsQuery.data ?? [];
  const hasCampaigns = campaigns.length > 0;
  const calendarCampaigns =
    calendarQuery.data && calendarQuery.data.length > 0
      ? calendarQuery.data.map((item) => {
          const scheduledFor = item.scheduledFor
            ? new Date(String(item.scheduledFor))
            : undefined;
          const sentAt = item.sentAt
            ? new Date(String(item.sentAt))
            : undefined;
          return {
            id: String(item.id ?? ""),
            name: String(item.name ?? "Untitled"),
            type: "email-blast" as const,
            status: normalizeStatus(item.status),
            subject: "",
            audience: [] as string[],
            recipients: 0,
            createdAt: new Date(),
            scheduledFor:
              scheduledFor && !Number.isNaN(scheduledFor.getTime())
                ? scheduledFor
                : undefined,
            sentAt:
              sentAt && !Number.isNaN(sentAt.getTime()) ? sentAt : undefined,
          };
        })
      : campaigns;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Campaigns
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter, and manage all of your campaigns from one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border bg-card px-3"
          >
            View library
          </Button>
          <div className="hidden items-center gap-1 rounded-full border border-border bg-card px-1 py-1 text-xs sm:flex">
            <button
              type="button"
              onClick={() => setActiveTab("table")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                activeTab === "table"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <List className="h-3.5 w-3.5" aria-hidden="true" />
              List
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                activeTab === "calendar"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Calendar
            </button>
          </div>
          <Button asChild size="sm" className="rounded-xl">
            <Link href={PRIVATE_ROUTES.NEW_CAMPAIGN}>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs sm:text-sm">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-8 w-full rounded-md border border-transparent bg-muted pl-7 pr-2 text-xs text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-border"
            placeholder="Search campaigns"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-muted px-2 py-1 text-xs text-foreground hover:border-border"
          >
            Last 30 days
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-muted px-2 py-1 text-xs text-foreground hover:border-border"
          >
            Audience
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-muted px-2 py-1 text-xs text-foreground hover:border-border"
          >
            Status
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-muted px-2 py-1 text-xs text-foreground hover:border-border"
          >
            More filters
          </button>
        </div>
      </div>

      {campaignsQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Loading campaigns...
        </div>
      ) : campaignsQuery.isError ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Failed to load campaigns.
        </div>
      ) : hasCampaigns ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="table">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <CampaignsTable data={campaigns} />
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <CampaignsCalendar campaigns={calendarCampaigns} />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            You haven&apos;t created any campaigns yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Start by creating your first campaign. You can duplicate it later,
            schedule follow-ups, and view performance in this table.
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild className="rounded-xl">
              <Link href={PRIVATE_ROUTES.NEW_CAMPAIGN}>
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Create campaign
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
