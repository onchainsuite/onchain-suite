"use client";

import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

// Sample message data - in real app this would come from API
const sampleMessages = [
  { id: "1", name: "Welcome Email Campaign", type: "welcome" },
  { id: "2", name: "Weekly Newsletter #45", type: "newsletter" },
  { id: "3", name: "Product Launch Announcement", type: "announcement" },
  { id: "4", name: "Black Friday Sale", type: "promotional" },
  { id: "5", name: "Customer Feedback Survey", type: "survey" },
  { id: "6", name: "Holiday Greetings 2024", type: "seasonal" },
  { id: "7", name: "Abandoned Cart Reminder", type: "automation" },
  { id: "8", name: "Monthly Report Summary", type: "newsletter" },
  { id: "9", name: "New Feature Update", type: "announcement" },
  { id: "10", name: "Summer Sale Campaign", type: "promotional" },
  { id: "11", name: "Onboarding Series - Part 1", type: "welcome" },
  { id: "12", name: "Customer Success Stories", type: "content" },
];

interface MessageFilterComboboxProps {
  selectedMessages: string[];
  onSelectionChange: (messages: string[]) => void;
}

export function MessageFilterCombobox({
  selectedMessages,
  onSelectionChange,
}: MessageFilterComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = sampleMessages.filter((message) =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (messageId: string) => {
    const isSelected = selectedMessages.includes(messageId);
    if (isSelected) {
      onSelectionChange(selectedMessages.filter((id) => id !== messageId));
    } else {
      onSelectionChange([...selectedMessages, messageId]);
    }
  };

  const handleRemove = (messageId: string) => {
    onSelectionChange(selectedMessages.filter((id) => id !== messageId));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const getSelectedMessageNames = () => {
    return selectedMessages
      .map((id) => sampleMessages.find((msg) => msg.id === id)?.name)
      .filter(Boolean) as string[];
  };

  const selectedCount = selectedMessages.length;
  const displayText =
    selectedCount === 0
      ? "0 messages selected"
      : `${selectedCount} message${selectedCount === 1 ? "" : "s"} selected`;

  return (
    <div className="space-y-2">
      <Label
        htmlFor="message-filter"
        className="text-foreground text-sm font-medium"
      >
        Filter by message name
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background border-input hover:bg-accent w-full justify-between"
          >
            <span className="truncate">{displayText}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0"
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <div className="border-border border-b p-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {selectedCount > 0 && (
            <div className="border-border border-b p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-foreground text-sm font-medium">
                  Selected ({selectedCount})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {getSelectedMessageNames().map((name, index) => {
                  const messageId = selectedMessages[index];
                  return (
                    <Badge
                      key={messageId}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1 text-xs"
                    >
                      <span className="max-w-[120px] truncate">{name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive hover:text-destructive-foreground h-3 w-3 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(messageId);
                        }}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1">
            {filteredMessages.length === 0 ? (
              <div className="text-muted-foreground py-6 text-center text-sm">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((message) => {
                const isSelected = selectedMessages.includes(message.id);
                return (
                  <button
                    key={message.id}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none",
                      isSelected && "bg-accent"
                    )}
                    onClick={() => handleSelect(message.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "text-primary opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{message.name}</div>
                      <div className="text-muted-foreground text-xs capitalize">
                        {message.type}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
