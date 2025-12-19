"use client";

import { Check, ChevronsUpDown, List, Star, Zap } from "lucide-react";
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

import {
  CAMPAIGN_LISTS,
  CAMPAIGN_SEGMENTS,
} from "../../../campaigns/constants";

interface AudienceSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
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
              : "Select a list or segment"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 rounded-xl border-border"
        align="start"
      >
        <Command className="rounded-xl">
          <CommandInput
            placeholder="Someone who has opened an email and bought a ring in the last 60 days"
            className="h-12 border-0 focus:ring-0"
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No results found.</CommandEmpty>

            {/* Lists Group */}
            <CommandGroup heading="List" className="p-2">
              {CAMPAIGN_LISTS.map((list) => (
                <CommandItem
                  key={list.id}
                  value={list.id}
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
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <List className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {list.name} ({list.count})
                    </span>
                  </div>
                  {list.starred && (
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Segments Group */}
            <CommandGroup heading="Segment" className="p-2">
              {CAMPAIGN_SEGMENTS.map((segment) => (
                <CommandItem
                  key={segment.id}
                  value={segment.id}
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
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {segment.name} ({segment.count})
                    </span>
                  </div>
                  {segment.starred && (
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  )}
                </CommandItem>
              ))}

              {/* Custom Segment Option */}
              <CommandItem className="flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-300">
                <div className="h-4 w-4 rounded border-2 border-primary bg-background" />
                <span className="text-sm font-medium text-foreground">
                  Describe segment in your own words
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
