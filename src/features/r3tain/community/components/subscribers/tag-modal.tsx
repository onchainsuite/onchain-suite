"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/ui/responsive-modal";

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const availableTags = [
  "another new tag",
  "someNew",
  "newTag",
  "Customer",
  "Influencer",
  "VIP",
  "Newsletter",
  "Premium",
  "Trial",
  "Active",
];

const popularTags = ["Staff", "Member", "2025"];

export function TagsModal({
  isOpen,
  onClose,
  selectedTags,
  onTagsChange,
}: TagsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedTags, setTempSelectedTags] =
    useState<string[]>(selectedTags);

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tag: string) => {
    setTempSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateTag = () => {
    if (
      searchQuery &&
      !availableTags.includes(searchQuery) &&
      !tempSelectedTags.includes(searchQuery)
    ) {
      setTempSelectedTags((prev) => [...prev, searchQuery]);
      // Add to available tags for future searches
      availableTags.push(searchQuery);
      setSearchQuery("");
    }
  };

  const handleSave = () => {
    onTagsChange(tempSelectedTags);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedTags(selectedTags);
    setSearchQuery("");
    onClose();
  };

  const TagsContent = () => (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search existing tags or create new"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="focus:ring-primary/20 pl-10 transition-all duration-200 focus:ring-2"
        />
        {searchQuery && !availableTags.includes(searchQuery) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCreateTag}
            className="text-primary hover:text-primary/90 absolute top-1/2 right-2 -translate-y-1/2"
          >
            Create
          </Button>
        )}
      </div>

      <div className="max-h-60 space-y-2 overflow-y-auto">
        {filteredTags.map((tag) => (
          <div
            key={tag}
            className="hover:bg-muted/50 flex items-center space-x-2 rounded-md p-2 transition-colors duration-150"
          >
            <Checkbox
              id={tag}
              checked={tempSelectedTags.includes(tag)}
              onCheckedChange={() => handleTagToggle(tag)}
              className="transition-all duration-200"
            />
            <label
              htmlFor={tag}
              className="flex-1 cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {tag}
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Popular tags</h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={tempSelectedTags.includes(tag) ? "default" : "secondary"}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose}>
      <ResponsiveModalContent size="xl" className="w-full">
        <ResponsiveModalHeader>
          <div>
            <ResponsiveModalTitle>Add tags</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              Add tags to contact
            </ResponsiveModalDescription>
          </div>
          <ResponsiveModalClose />
        </ResponsiveModalHeader>
        <ResponsiveModalBody>
          <div className="px-4 pb-4">
            <TagsContent />
          </div>
        </ResponsiveModalBody>
        <ResponsiveModalFooter>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              Add tags
            </Button>
          </div>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
