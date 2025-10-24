"use client";

import { Accessibility } from "lucide-react";

import { HelpTooltip } from "../help-tooltip";
import { PreferenceItem } from "./preference-item";

interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
}

interface PreferencesAccessibilityProps {
  preferences: AccessibilityPreferences;
  onUpdate: (updates: Partial<AccessibilityPreferences>) => void;
}

export function PreferencesAccessibility({
  preferences,
  onUpdate,
}: PreferencesAccessibilityProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Accessibility className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Accessibility</h3>
        <HelpTooltip content="Adjust settings to improve accessibility and usability for different needs." />
      </div>
      <div className="space-y-3 pl-7">
        <PreferenceItem
          id="reduce-motion"
          label="Reduce motion"
          description="Minimize animations and transitions"
          helpText="Minimize animations and transitions for users sensitive to motion or to improve performance."
          checked={preferences.reduceMotion}
          onCheckedChange={(checked) => onUpdate({ reduceMotion: checked })}
        />
        <PreferenceItem
          id="high-contrast"
          label="High contrast"
          description="Increase contrast for better visibility"
          helpText="Increase color contrast between text and backgrounds for better readability and visibility."
          checked={preferences.highContrast}
          onCheckedChange={(checked) => onUpdate({ highContrast: checked })}
        />
      </div>
    </div>
  );
}
