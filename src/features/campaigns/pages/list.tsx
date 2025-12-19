"use client";

import { useState } from "react";
import { Plus, LayoutGrid, CalendarIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { CampaignsTable } from "../../campaigns/components/table";
import { CampaignsCalendar } from "../../campaigns/components/calendar";
import { MOCK_CAMPAIGNS } from "../../campaigns/constants";

export function CampaignsListsView() {
  const [activeTab, setActiveTab] = useState("table");
  const hasCampaigns = MOCK_CAMPAIGNS.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Campaigns
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your email campaigns
          </p>
        </div>
        <Button
          asChild
          className="rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          <Link href="/campaigns/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {hasCampaigns ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-sm rounded-xl bg-muted p-1">
            <TabsTrigger
              value="table"
              className="rounded-lg transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <LayoutGrid className="mr-2 h-4 w-2" />
              Table View
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="rounded-lg transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <CalendarIcon className="mr-2 h-4 w-2" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-6 ">
            <CampaignsTable data={MOCK_CAMPAIGNS} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CampaignsCalendar campaigns={MOCK_CAMPAIGNS} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">No campaigns available</p>
        </div>
      )}
    </div>
  );
}
