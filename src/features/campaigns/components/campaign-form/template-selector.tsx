"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  Search,
  Grid3x3,
  LayoutList,
  Plus,
  MoreVertical,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CampaignFormData } from "../../validations";
import { EMAIL_TEMPLATES } from "../../../campaigns/constants";

interface TemplateSelectorProps {
  form: UseFormReturn<CampaignFormData>;
}

export function TemplateSelector({ form }: TemplateSelectorProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [templateSearch, setTemplateSearch] = useState("");

  const selectedTemplate = form.watch("selectedTemplate");

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Templates
        </h2>
        <div className="flex items-center gap-2">
          <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300">
            <Plus className="h-4 w-4" />
            Create
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="bg-muted rounded-xl p-1 w-fit">
          <TabsTrigger
            value="library"
            className="rounded-lg data-[state=active]:bg-background"
          >
            Email library
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="rounded-lg data-[state=active]:bg-background"
          >
            Email: saved
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search & View Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={templateSearch}
            onChange={(e) => setTemplateSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-border bg-background transition-all duration-300"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-300",
              viewMode === "grid" && "bg-background shadow-sm"
            )}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("list")}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-300",
              viewMode === "list" && "bg-background shadow-sm"
            )}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
        <Select defaultValue="recent">
          <SelectTrigger className="w-[200px] h-10 rounded-xl border-border bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="recent">Edited most recently</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Template Grid/List */}
      <div
        className={cn(
          "gap-4 transition-all duration-300",
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2"
            : "flex flex-col"
        )}
      >
        {EMAIL_TEMPLATES.map((temp) => (
          <div
            key={temp.id}
            onClick={() => form.setValue("selectedTemplate", temp.id)}
            className={cn(
              "group cursor-pointer rounded-2xl border-2 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg",
              selectedTemplate === temp.id
                ? "border-primary shadow-lg ring-2 ring-primary/20"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <div className="aspect-3/2 bg-muted relative overflow-hidden">
              <img
                src={temp.preview || "/placeholder.svg"}
                alt={temp.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {selectedTemplate === temp.id && (
                <div className="absolute top-3 right-3 bg-primary rounded-full p-1.5 shadow-lg">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                {temp.title}
              </h3>
              <p className="text-sm text-muted-foreground">{temp.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
