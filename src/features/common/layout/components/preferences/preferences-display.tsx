"use client";

import { Eye } from "lucide-react";

import { HelpTooltip } from "../help-tooltip";
import { PreferenceItem } from "./preference-item";

interface DisplayPreferences {
  compactMode: boolean;
  showAvatars: boolean;
  animationsEnabled: boolean;
}

interface PreferencesDisplayProps {
  preferences: DisplayPreferences;
  onUpdate: (updates: Partial<DisplayPreferences>) => void;
}

export function PreferencesDisplay({
  preferences,
  onUpdate,
}: PreferencesDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Eye className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Display</h3>
        <HelpTooltip content="Customize the visual appearance and layout of the dashboard interface." />
      </div>
      <div className="space-y-3 pl-7">
        <PreferenceItem
          id="compact-mode"
          label="Compact mode"
          description="Reduce spacing and padding for a denser layout"
          helpText="Reduce spacing and padding throughout the interface to fit more content on screen."
          checked={preferences.compactMode}
          onCheckedChange={(checked) => onUpdate({ compactMode: checked })}
        />
        <PreferenceItem
          id="show-avatars"
          label="Show avatars"
          description="Display user avatars throughout the interface"
          helpText="Display user profile pictures in notifications, comments, and user menus."
          checked={preferences.showAvatars}
          onCheckedChange={(checked) => onUpdate({ showAvatars: checked })}
        />
        <PreferenceItem
          id="animations-enabled"
          label="Enable animations"
          description="Show smooth transitions and animations"
          helpText="Show smooth transitions and animations when interacting with the interface. Disable for better performance."
          checked={preferences.animationsEnabled}
          onCheckedChange={(checked) =>
            onUpdate({ animationsEnabled: checked })
          }
        />
      </div>
    </div>
  );
}
