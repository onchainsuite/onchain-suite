"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TimePeriodTabs } from "../shared/time-period-tabs";
import type { Channel, Period } from "@/r3tain/analytics/types";

interface ConversionsFiltersProps {
  selectedChannel: Channel;
  onChannelChange: (channel: Channel) => void;
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export function ConversionsFilters({
  selectedChannel,
  onChannelChange,
  selectedPeriod,
  onPeriodChange,
}: ConversionsFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Channel:</span>
        <Select value={selectedChannel} onValueChange={onChannelChange}>
          <SelectTrigger className="border-primary text-primary w-auto min-w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TimePeriodTabs
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
      />
    </div>
  );
}
