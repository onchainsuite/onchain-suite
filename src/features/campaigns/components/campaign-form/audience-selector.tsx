"use client";

import {
  ArrowsUpDownIcon,
  BoltIcon,
  CheckIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import type { List as CampaignList, Segment } from "../../../campaigns/types";

interface AudienceSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  lists: CampaignList[];
  segments: Segment[];
  isSegmentsLoading?: boolean;
  unresolvedSelectionCount?: number;
}

export function AudienceSelector({
  value,
  onChange,
  lists,
  segments,
  isSegmentsLoading = false,
  unresolvedSelectionCount = 0,
}: AudienceSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleAudience = (audienceId: string) => {
    const newValue = value.includes(audienceId)
      ? value.filter((id) => id !== audienceId)
      : [...value, audienceId];
    onChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-12 justify-between rounded-xl border-border bg-background text-foreground hover:bg-muted/50 transition-all duration-300"
        >
          <span
            className={cn(
              "text-muted-foreground",
              value.length > 0 && "text-foreground"
            )}
          >
            {value.length > 0
              ? `${value.length} audience${value.length > 1 ? "s" : ""} selected`
              : "Select audience users or intelligence segments"}
          </span>
          <ArrowsUpDownIcon
            aria-hidden="true"
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 rounded-xl border-border"
        align="start"
      >
        <Command className="rounded-xl">
          <CommandInput
            placeholder="Search audience users or intelligence segments"
            className="h-12 border-0 focus:ring-0"
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No saved audience sources found.</CommandEmpty>

            {/* Lists Group */}
            <CommandGroup heading="List" className="p-2">
              {lists.length > 0 ? (
                lists.map((list) => (
                  <CommandItem
                    key={list.id}
                    value={`${list.name} ${list.id}`}
                    onSelect={() => toggleAudience(list.id)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center h-4 w-4 border-2 rounded transition-all duration-300",
                          value.includes(list.id)
                            ? "bg-primary border-primary"
                            : "border-border bg-background"
                        )}
                      >
                        {value.includes(list.id) && (
                          <CheckIcon
                            aria-hidden="true"
                            className="h-3 w-3 text-primary-foreground"
                          />
                        )}
                      </div>
                      <UserGroupIcon
                        aria-hidden="true"
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {list.name} ({list.count})
                      </span>
                    </div>
                    {list.starred ? (
                      <StarIcon
                        aria-hidden="true"
                        className="h-4 w-4 fill-amber-500 text-amber-500"
                      />
                    ) : null}
                  </CommandItem>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
                  No audience users available yet.
                </div>
              )}
            </CommandGroup>

            {/* Segments Group */}
            <CommandGroup heading="Segment" className="p-2">
              {isSegmentsLoading ? (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
                  Loading saved segments...
                </div>
              ) : segments.length > 0 ? (
                segments.map((segment) => (
                  <CommandItem
                    key={segment.id}
                    value={`${segment.name} ${segment.id}`}
                    onSelect={() => toggleAudience(segment.id)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center h-4 w-4 border-2 rounded transition-all duration-300",
                          value.includes(segment.id)
                            ? "bg-primary border-primary"
                            : "border-border bg-background"
                        )}
                      >
                        {value.includes(segment.id) && (
                          <CheckIcon
                            aria-hidden="true"
                            className="h-3 w-3 text-primary-foreground"
                          />
                        )}
                      </div>
                      <BoltIcon
                        aria-hidden="true"
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {segment.name} ({segment.count})
                      </span>
                    </div>
                    {segment.starred ? (
                      <StarIcon
                        aria-hidden="true"
                        className="h-4 w-4 fill-amber-500 text-amber-500"
                      />
                    ) : null}
                  </CommandItem>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
                  No intelligence segments available yet.
                </div>
              )}
            </CommandGroup>
            {unresolvedSelectionCount > 0 ? (
              <div className="border-t border-border/60 px-3 py-3 text-sm text-muted-foreground">
                {unresolvedSelectionCount} saved audience selection
                {unresolvedSelectionCount > 1 ? "s are" : " is"} attached to
                this campaign but cannot be resolved into current audience users
                or intelligence segments.
              </div>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
