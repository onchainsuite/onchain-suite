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

interface SaveSegmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (segmentName: string) => void;
  onBack: () => void;
}

export function SaveSegmentModal({
  isOpen,
  onOpenChange,
  onSave,
  onBack,
}: SaveSegmentModalProps) {
  const [segmentName, setSegmentName] = useState("");

  const handleSave = () => {
    if (segmentName.trim()) {
      onSave(segmentName.trim());
      setSegmentName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Name your segment</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="segment-name">Segment name</Label>
            <Input
              id="segment-name"
              placeholder="Give your segment a name"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && segmentName.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onBack}>
            Go back to editing
          </Button>
          <Button
            onClick={handleSave}
            disabled={!segmentName.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            Save & exit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
