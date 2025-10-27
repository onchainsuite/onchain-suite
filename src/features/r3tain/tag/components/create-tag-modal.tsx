"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTagModal({ open, onOpenChange }: CreateTagModalProps) {
  const [tagName, setTagName] = useState("");

  const handleCreate = () => {
    if (tagName.trim()) {
      // Handle tag creation logic here
      console.log("Creating tag:", tagName);
      setTagName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>What should we name this tag?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Tag name</Label>
            <Input
              id="tag-name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Enter tag name"
              className="focus-visible:ring-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
            />
            <p className="text-muted-foreground text-sm">
              Examples: Conference Lead, Influencer, or Donor
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!tagName.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
