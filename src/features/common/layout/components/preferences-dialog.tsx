"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import {
  PreferencesAccessibility,
  PreferencesDisplay,
  PreferencesNotifications,
} from "./preferences";
import { usePreferences } from "@/common/layout/hooks";

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreferencesDialog({
  open,
  onOpenChange,
}: PreferencesDialogProps) {
  const {
    preferences,
    updateNotificationPreferences,
    updateDisplayPreferences,
    updateAccessibilityPreferences,
    resetPreferences,
  } = usePreferences();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>
            Customize your dashboard experience. All preferences are saved
            automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Notifications Section */}
          <PreferencesNotifications
            preferences={preferences.notifications}
            onUpdate={updateNotificationPreferences}
          />

          <Separator />

          {/* Display Section */}
          <PreferencesDisplay
            preferences={preferences.display}
            onUpdate={updateDisplayPreferences}
          />

          <Separator />

          {/* Accessibility Section */}
          <PreferencesAccessibility
            preferences={preferences.accessibility}
            onUpdate={updateAccessibilityPreferences}
          />

          <Separator />

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={resetPreferences}>
              Reset to defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
