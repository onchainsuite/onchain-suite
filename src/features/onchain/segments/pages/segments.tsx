/* eslint-disable no-console */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import {
  PageHeader,
  SegmentsTable,
  StatsGrid,
} from "@/onchain/segments/components";
import { initialSegments } from "@/onchain/segments/data";
import {
  type CreateSegmentFormData,
  type Segment,
} from "@/onchain/segments/types";

export function SegmentsPage() {
  const [segments] = useState<Segment[]>(initialSegments);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const { push } = useRouter();

  const handleCreateSegment = (data: CreateSegmentFormData) => {
    console.log("Creating segment:", data);
    // In a real app, this would make an API call
  };

  const handleSync = (id: string) => {
    console.log("Syncing segment:", id);
    // In a real app, this would make an API call
  };

  const handleOptimize = (id: string) => {
    console.log("Optimizing segment:", id);
    // In a real app, this would make an API call
  };

  const handleHistoryClick = () => {
    push(PRIVATE_ROUTES.ONCHAIN.SEGMENTS_VERSIONED);
    // In a real app, this would navigate to the history page
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        setIsCreateOpen={setIsCreateOpen}
        isCreateOpen={isCreateOpen}
        onHistoryClick={handleHistoryClick}
        handleCreateSegment={handleCreateSegment}
      />

      <StatsGrid segments={segments} />

      <Card>
        <CardHeader>
          <CardTitle>Segments</CardTitle>
          <CardDescription>
            Manage your user segments and sync to R3tain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SegmentsTable
            segments={segments}
            onSync={handleSync}
            onOptimize={handleOptimize}
          />
        </CardContent>
      </Card>
    </div>
  );
}
