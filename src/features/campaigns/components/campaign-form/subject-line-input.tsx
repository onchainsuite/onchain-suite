"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Theme, type EmojiClickData } from "emoji-picker-react";
import { Smile, Hash } from "lucide-react";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";
import { MERGE_TAGS } from "../../../campaigns/constants";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  ),
});

interface SubjectLineInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SubjectLineInput({ value, onChange }: SubjectLineInputProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [mergeTagsOpen, setMergeTagsOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(value + emojiData.emoji);
    setEmojiOpen(false);
  };

  const insertMergeTag = (tag: string) => {
    onChange(value + " " + tag);
    setMergeTagsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl border-border bg-background pr-20 transition-all duration-300"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Emoji Picker */}
        <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-muted transition-all duration-300"
            >
              <Smile className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 rounded-xl border-border"
            align="end"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              autoFocusSearch={false}
              width={320}
              height={400}
              lazyLoadEmojis={true}
              theme={Theme.AUTO}
              searchPlaceHolder="Search emojis..."
              previewConfig={{ showPreview: false }}
            />
          </PopoverContent>
        </Popover>

        {/* Merge Tags Dropdown */}
        <Popover open={mergeTagsOpen} onOpenChange={setMergeTagsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-muted transition-all duration-300"
            >
              <Hash className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[280px] p-0 rounded-xl border-border"
            align="end"
          >
            <Command className="rounded-xl">
              <CommandInput
                placeholder="Search merge tags..."
                className="h-9 border-0"
              />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>No merge tags found.</CommandEmpty>
                <CommandGroup heading="Merge Tags" className="p-2">
                  {MERGE_TAGS.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.label}
                      onSelect={() => insertMergeTag(tag.tag)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-all duration-300"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {tag.label}
                      </span>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {tag.tag}
                      </code>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
