"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Tag } from "@/r3tain/community/types";

interface TagSearchInputProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
}

export function TagSearchInput({
  selectedTags,
  availableTags,
  onTagsChange,
  placeholder = "Search for or create tags",
}: TagSearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.some((selected) => selected.id === tag.id)
      );
      setFilteredTags(filtered);
      setIsDropdownOpen(true);
    } else {
      setFilteredTags([]);
      setIsDropdownOpen(false);
    }
  }, [inputValue, availableTags, selectedTags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleInputFocus = () => {
    if (inputValue.trim()) {
      setIsDropdownOpen(true);
    }
  };

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.some((selected) => selected.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleCreateTag = () => {
    if (
      inputValue.trim() &&
      !availableTags.some(
        (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
      )
    ) {
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        name: inputValue.trim(),
        color: getRandomTagColor(),
        usageCount: 0,
        createdAt: new Date().toISOString(),
      };
      onTagsChange([...selectedTags, newTag]);
      setInputValue("");
      setIsDropdownOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleTagRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (filteredTags.length > 0) {
        handleTagSelect(filteredTags[0]);
      } else {
        handleCreateTag();
      }
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      selectedTags.length > 0
    ) {
      handleTagRemove(selectedTags[selectedTags.length - 1].id);
    }
  };

  const getRandomTagColor = () => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const canCreateTag =
    inputValue.trim() &&
    !availableTags.some(
      (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
    ) &&
    !selectedTags.some(
      (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
    );

  return (
    <div className="space-y-3">
      <label
        htmlFor="tag-search"
        className="text-foreground block text-sm font-medium"
      >
        Search for or create tags
      </label>

      <div className="relative">
        {/* Selected Tags */}
        <AnimatePresence>
          {selectedTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3 flex flex-wrap gap-2"
            >
              {selectedTags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 px-3 py-1"
                  >
                    <span>{tag.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTagRemove(tag.id)}
                      className="hover:bg-primary/20 h-4 w-4 rounded-full p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Field */}
        <div className="relative">
          <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
            <Search className="text-muted-foreground h-4 w-4" />
          </div>
          <Input
            ref={inputRef}
            id="tag-search"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-border focus:border-primary/50 h-12 pr-4 pl-10 transition-colors duration-200"
          />
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-card border-border absolute top-full right-0 left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border shadow-lg"
            >
              {/* Create New Tag Option */}
              {canCreateTag && (
                <button
                  onClick={handleCreateTag}
                  className="hover:bg-muted/50 border-border flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors duration-200"
                >
                  <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                    <Plus className="text-primary h-4 w-4" />
                  </div>
                  <span className="text-foreground">
                    Create <strong>&quot;{inputValue}&quot;</strong>
                  </span>
                </button>
              )}

              {/* Existing Tags */}
              {filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagSelect(tag)}
                  className="hover:bg-muted/50 group flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                      <span className="text-muted-foreground text-xs font-medium">
                        #
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground font-medium">
                        {tag.name}
                      </span>
                      <div className="text-muted-foreground text-xs">
                        {tag.usageCount} uses
                      </div>
                    </div>
                  </div>
                  <Check className="text-primary h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </button>
              ))}

              {/* No Results */}
              {!canCreateTag &&
                filteredTags.length === 0 &&
                inputValue.trim() && (
                  <div className="text-muted-foreground px-4 py-6 text-center">
                    <p className="text-sm">
                      No tags found matching &ldquo;{inputValue}&quot;
                    </p>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {!isDropdownOpen && !selectedTags.length && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-2 text-xs"
          >
            Start typing to add a custom tag
          </motion.p>
        )}
      </div>
    </div>
  );
}
