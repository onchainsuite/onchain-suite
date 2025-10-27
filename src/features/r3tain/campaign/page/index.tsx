"use client";

import { useState } from "react";

import { Button } from "@/ui/button";

import { CampaignCalendar, CampaignTable, EmptyState } from "../components";

export function CampaignDashboard() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [hasCampaigns, setHasCampaigns] = useState(true);

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-foreground text-2xl font-bold">All campaigns</h1>
          <div className="flex items-center gap-3">
            <Button variant={"outline"}>View analytics</Button>
            <Button onClick={() => setHasCampaigns(true)}>Create</Button>
          </div>
        </div>

        <div className="border-border mb-6 flex items-center border-b">
          <button
            className={`cursor-pointer px-4 py-2 text-sm font-medium ${
              view === "list"
                ? "border-primary text-primary border-b-2"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button
            className={`cursor-pointer px-4 py-2 text-sm font-medium ${
              view === "calendar"
                ? "border-primary text-primary border-b-2"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setView("calendar")}
          >
            Calendar
          </button>
        </div>

        {hasCampaigns ? (
          view === "list" ? (
            <CampaignTable />
          ) : (
            <CampaignCalendar />
          )
        ) : (
          <EmptyState onCreateCampaign={() => setHasCampaigns(true)} />
        )}
      </div>
    </main>
  );
}
