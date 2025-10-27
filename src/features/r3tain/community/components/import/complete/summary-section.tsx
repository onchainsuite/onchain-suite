"use client";

import { ImportSummaryCard } from "../import-summary-card";
import { PlanLimitWarning } from "../plan-limit-warning";
import type { ImportSummary } from "@/r3tain/community/types";

interface SummarySectionProps {
  summary: ImportSummary;
}

export function SummarySection({ summary }: SummarySectionProps) {
  return (
    <>
      <ImportSummaryCard summary={summary} />

      {summary.planLimit && (
        <PlanLimitWarning
          current={summary.planLimit.current}
          limit={summary.planLimit.limit}
          planType={summary.planLimit.planType}
          newSubscribers={summary.subscriberCount}
        />
      )}
    </>
  );
}
