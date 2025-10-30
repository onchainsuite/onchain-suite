"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { type CreateSegmentFormData } from "../types";

interface CreateSegmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSegmentFormData) => void;
}

export function CreateSegmentDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateSegmentDialogProps) {
  const [formData, setFormData] = useState<CreateSegmentFormData>({
    name: "",
    criteria: "",
    dateRange: "",
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: "", criteria: "", dateRange: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Segment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Segment</DialogTitle>
          <DialogDescription>
            Define criteria for your user segment
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Segment Name</Label>
            <Input
              id="name"
              placeholder="e.g., High-Value Traders"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="criteria">Criteria</Label>
            <Input
              id="criteria"
              placeholder="e.g., Volume > $10,000"
              value={formData.criteria}
              onChange={(e) =>
                setFormData({ ...formData, criteria: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range</Label>
            <Input
              id="dateRange"
              type="text"
              placeholder="Last 30 days"
              value={formData.dateRange}
              onChange={(e) =>
                setFormData({ ...formData, dateRange: e.target.value })
              }
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Create Segment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
