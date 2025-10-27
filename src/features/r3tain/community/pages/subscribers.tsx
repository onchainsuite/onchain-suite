/* eslint-disable no-console */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/ui/button";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import {
  BulkActions,
  columns,
  DataTable,
  FiltersBar,
  MoreActions,
} from "@/r3tain/community/components/subscribers";
import { mockSubscribers } from "@/r3tain/community/data";
import type { Subscriber, SubscriberFilters } from "@/r3tain/community/types";
import { exportToCSV, exportToPDF } from "@/r3tain/community/utils";

export function SubscribersPage() {
  const router = useRouter();
  const [subscribers] = useState<Subscriber[]>(mockSubscribers);
  const [selectedSubscribers, setSelectedSubscribers] = useState<Subscriber[]>(
    []
  );
  const [filters, setFilters] = useState<SubscriberFilters>({
    segments: [],
    subscriptionStatus: [],
    tags: [],
    signupSource: [],
    search: "",
    advancedFilters: {},
  });

  const totalSubscribers = subscribers.length;
  const emailSubscribers = subscribers.filter(
    (s) => s.emailMarketing === "subscribed"
  ).length;

  const handleTagSubscribers = (subscribers: Subscriber[]) => {
    console.log("Tag subscribers:", subscribers);
  };

  const handleEmailSubscription = (subscribers: Subscriber[]) => {
    console.log("Email subscription:", subscribers);
  };

  const handleArchive = (subscribers: Subscriber[]) => {
    console.log("Archive subscribers:", subscribers);
  };

  const handleDelete = (subscribers: Subscriber[]) => {
    console.log("Delete subscribers:", subscribers);
  };

  const handleExportCSV = () => {
    exportToCSV(subscribers, "subscribers.csv");
  };

  const handleExportPDF = () => {
    exportToPDF(subscribers, "subscribers.pdf");
  };

  const handleAddSubscribers = () => {
    router.push(PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS);
  };

  const handleAddSingleSubscriber = () => {
    router.push(PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS);
  };

  return (
    <>
      <main className="min-w-0 flex-1">
        <div className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-foreground mb-2 text-2xl font-semibold">
                Subscribers
              </h1>
              <p className="text-muted-foreground text-sm">
                {totalSubscribers} total subscribers. {emailSubscribers} email
                subscribers.
              </p>
            </div>
            <MoreActions
              handleAddSubscribers={handleAddSubscribers}
              handleAddSingleSubscriber={handleAddSingleSubscriber}
            />
          </div>

          {/* Filters */}
          <FiltersBar filters={filters} onFiltersChange={setFilters} />

          {/* Analytics Link */}
          <div className="mb-4 flex justify-end">
            <Button variant="link" className="text-primary p-0">
              See community analytics
            </Button>
          </div>

          {/* Bulk Actions */}
          <BulkActions
            selectedSubscribers={selectedSubscribers}
            onTagSubscribers={handleTagSubscribers}
            onEmailSubscription={handleEmailSubscription}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={subscribers}
            searchPlaceholder="Search subscribers"
            onRowSelectionChange={setSelectedSubscribers}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />
        </div>
      </main>
    </>
  );
}
