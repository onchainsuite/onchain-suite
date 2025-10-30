"use client";

import { useState } from "react";

import {
  VersionChart,
  VersionDiff,
  VersionedPageHeader,
  VersionTimeline,
} from "@/onchain/segments/components";
import { diffData, segmentOptions, versions } from "@/onchain/segments/data";

export function VersionedSegmentsPage() {
  const [selectedSegment, setSelectedSegment] = useState<string>("high-value");

  return (
    <div className="p-6 space-y-6">
      <VersionedPageHeader
        selectedSegment={selectedSegment}
        onSegmentChange={setSelectedSegment}
        segments={segmentOptions}
      />

      <VersionChart />

      <div className="grid gap-6 md:grid-cols-2">
        <VersionTimeline versions={versions} />
        <VersionDiff diffData={diffData} />
      </div>
    </div>
  );
}
