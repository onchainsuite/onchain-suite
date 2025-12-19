import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "primary" | "secondary";
  defaultColor?: string;
  onColorChange?: (color: string) => void;
}

const ColorPicker = ({
  open,
  onOpenChange,
  type,
  defaultColor = "#000000",
  onColorChange,
}: ColorPickerProps) => {
  const [color, setColor] = useState(defaultColor);
  const [saving, setSaving] = useState(false);

  const handleSave = async (callback: () => void) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    if (onColorChange) onColorChange(color);
    callback();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-tight text-foreground">
            Choose {type} color
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a color for your brand
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-16 w-16 cursor-pointer appearance-none overflow-hidden rounded-xl border-2 border-border/80 bg-transparent lg:h-20 lg:w-20"
            />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-12 flex-1 border-border/80 font-mono uppercase"
            />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">Presets</p>
            <div className="flex flex-wrap gap-2">
              {[
                "#10b981",
                "#6366f1",
                "#f59e0b",
                "#ec4899",
                "#8b5cf6",
                "#14b8a6",
                "#f43f5e",
                "#3b82f6",
              ].map((presetColor) => (
                <motion.button
                  key={presetColor}
                  onClick={() => setColor(presetColor)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 rounded-lg shadow-md transition-transform"
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border/80"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSave(() => onOpenChange(false))}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save color
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColorPicker;
