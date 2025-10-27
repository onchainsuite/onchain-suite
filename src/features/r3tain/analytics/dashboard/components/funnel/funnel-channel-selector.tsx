"use client";

import { Check } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Channel } from "@/r3tain/analytics/types";

const channels = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "all", label: "All" },
];

interface FunnelChannelSelectorProps {
  selectedChannel: Channel;
  onChannelChange: (channel: Channel) => void;
}

export function FunnelChannelSelector({
  selectedChannel,
  onChannelChange,
}: FunnelChannelSelectorProps) {
  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Channel:</span>
        <Select value={selectedChannel} onValueChange={onChannelChange}>
          <SelectTrigger className="border-primary w-auto min-w-[100px] border-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {channels.map((channel) => (
              <SelectItem key={channel.value} value={channel.value}>
                <div className="flex items-center gap-2">
                  {selectedChannel === channel.value && (
                    <Check className="text-primary h-4 w-4" />
                  )}
                  {channel.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
