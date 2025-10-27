"use client";

import {
  Check,
  FileText,
  Folder,
  Globe,
  Mail,
  Megaphone,
  Plus,
  Share2,
  Smartphone,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

const statusFilters: FilterOption[] = [
  { id: "all", label: "All", icon: FileText },
  { id: "ongoing", label: "Ongoing", icon: Zap },
  { id: "completed", label: "Completed", icon: Check },
];

const typeFilters: FilterOption[] = [
  { id: "emails", label: "Emails", icon: Mail, count: 0 },
  { id: "sms", label: "SMS", icon: Smartphone, count: 0 },
  { id: "automations", label: "Automations", icon: Zap, count: 0 },
  { id: "landing-pages", label: "Landing pages", icon: Globe, count: 0 },
  { id: "ads", label: "Ads", icon: Megaphone, count: 0 },
  { id: "social-posts", label: "Social Posts", icon: Share2, count: 0 },
  { id: "surveys", label: "Surveys", icon: FileText, count: 0 },
];

interface CampaignFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

export function CampaignFilters({
  selectedStatus,
  onStatusChange,
  selectedTypes,
  onTypesChange,
}: CampaignFiltersProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState<string[]>(["new folder"]);

  const handleCreateFolder = () => {
    if (isCreatingFolder) {
      const name = folderName.trim() || "untitled";
      if (!folders.includes(name)) {
        setFolders([...folders, name]);
      }
      setFolderName("");
      setIsCreatingFolder(false);
    } else {
      setIsCreatingFolder(true);
    }
  };

  const handleCancelFolder = () => {
    setIsCreatingFolder(false);
    setFolderName("");
  };

  const handleTypeToggle = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      onTypesChange(selectedTypes.filter((id) => id !== typeId));
    } else {
      onTypesChange([...selectedTypes, typeId]);
    }
  };

  return (
    <div className="bg-card/50 border-border/50 scrollbar-thin h-full w-full space-y-6 overflow-y-auto border-r p-4 lg:w-64">
      {/* View by Status */}
      <div className="space-y-3">
        <Label className="text-foreground text-sm font-medium">
          View by Status
        </Label>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 lg:grid-cols-1">
          {statusFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedStatus === filter.id ? "secondary" : "ghost"}
              className={cn(
                "h-9 w-full justify-start gap-2 px-3",
                selectedStatus === filter.id
                  ? "bg-primary/10 text-primary border-primary/20 border"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              onClick={() => onStatusChange(filter.id)}
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* View by Type */}
      <div className="space-y-3">
        <Label className="text-foreground text-sm font-medium">
          View by Type
        </Label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {typeFilters.map((filter) => (
            <div key={filter.id} className="flex items-center space-x-3">
              <Checkbox
                id={filter.id}
                checked={selectedTypes.includes(filter.id)}
                onCheckedChange={() => handleTypeToggle(filter.id)}
                className="border-border/50"
              />
              <Label
                htmlFor={filter.id}
                className="text-muted-foreground hover:text-foreground flex flex-1 cursor-pointer items-center gap-2 text-sm"
              >
                <filter.icon className="h-4 w-4" />
                <span className="flex-1">{filter.label}</span>
                {filter.count !== undefined && (
                  <span className="bg-muted ml-auto rounded px-1.5 py-0.5 text-xs">
                    {filter.count}
                  </span>
                )}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Create Folder */}
      <div className="border-border/50 space-y-3 border-t pt-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateFolder}
            className="text-primary hover:text-primary/80 hover:bg-primary/10 h-auto p-0 font-medium"
          >
            <Plus className="mr-1 h-4 w-4" />
            Create Folder
          </Button>
        </div>

        {isCreatingFolder && (
          <div className="animate-in slide-in-from-top-2 space-y-2 duration-200">
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="untitled"
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateFolder();
                } else if (e.key === "Escape") {
                  handleCancelFolder();
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateFolder}
                className="h-7 px-2 text-xs"
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelFolder}
                className="h-7 px-2 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Folders List */}
        <div className="space-y-1">
          {folders.map((folder, index) => (
            <div
              key={index}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition-colors"
            >
              <Folder className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{folder}</span>
              <span className="bg-muted rounded px-1.5 py-0.5 text-xs">0</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
