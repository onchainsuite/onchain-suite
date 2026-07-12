"use client";

import {
  ArrowsUpDownIcon,
  BoltIcon,
  CheckIcon,
  StarIcon,
  TagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
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
  /** Audience tags as pickable groups (`tag:<name>` ids). */
  tags?: CampaignList[];
  segments: Segment[];
  isSegmentsLoading?: boolean;
  unresolvedSelectionCount?: number;
}

export function AudienceSelector({
  value,
  onChange,
  lists,
  tags = [],
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
              ? `${value.length} segment${value.length > 1 ? "s" : ""} selected`
              : "Select audience segments"}
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
            placeholder="Search segments (e.g. test-cohort)"
            className="h-12 border-0 focus:ring-0"
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No matching segments found.</CommandEmpty>

            {/* Lists Group — only when a real list source exists. Individual
                contacts are never listed here; audiences are segments. */}
            {lists.length > 0 ? (
              <CommandGroup heading="List" className="p-2">
                {lists.map((list) => (
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
                ))}
              </CommandGroup>
            ) : null}

            {/* Tags Group — audience tags from the Audience page; expanded
                to the tagged contacts at save time. */}
            {tags.length > 0 ? (
              <CommandGroup heading="Tag" className="p-2">
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={`${tag.name} ${tag.id}`}
                    onSelect={() => toggleAudience(tag.id)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center h-4 w-4 border-2 rounded transition-all duration-300",
                          value.includes(tag.id)
                            ? "bg-primary border-primary"
                            : "border-border bg-background"
                        )}
                      >
                        {value.includes(tag.id) && (
                          <CheckIcon
                            aria-hidden="true"
                            className="h-3 w-3 text-primary-foreground"
                          />
                        )}
                      </div>
                      <TagIcon
                        aria-hidden="true"
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {tag.name}
                        {tag.count > 0 ? ` (${tag.count})` : ""}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

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
                  No segments yet. Create one in{" "}
                  <Link
                    href="/intelligence/segments/create"
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    Intelligence → Segments
                  </Link>{" "}
                  to group your contacts (e.g. test-cohort).
                </div>
              )}
            </CommandGroup>
            {unresolvedSelectionCount > 0 ? (
              <div className="border-t border-border/60 px-3 py-3 text-sm text-muted-foreground">
                {unresolvedSelectionCount} saved audience selection
                {unresolvedSelectionCount > 1 ? "s are" : " is"} attached to
                this campaign but cannot be resolved into current segments.
              </div>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
