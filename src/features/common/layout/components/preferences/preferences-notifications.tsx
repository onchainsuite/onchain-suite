"use client";

import { Bell } from "lucide-react";

import { HelpTooltip } from "../help-tooltip";
import { PreferenceItem } from "./preference-item";

interface NotificationPreferences {
  enabled: boolean;
  showBadges: boolean;
  playSound: boolean;
}

interface PreferencesNotificationsProps {
  preferences: NotificationPreferences;
  onUpdate: (updates: Partial<NotificationPreferences>) => void;
}

export function PreferencesNotifications({
  preferences,
  onUpdate,
}: PreferencesNotificationsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Notifications</h3>
        <HelpTooltip content="Control how you receive and view notifications throughout the dashboard." />
      </div>
      <div className="space-y-3 pl-7">
        <PreferenceItem
          id="notifications-enabled"
          label="Enable notifications"
          description="Receive notifications for important updates"
          helpText="Turn on to receive real-time notifications for mentions, updates, and important events."
          checked={preferences.enabled}
          onCheckedChange={(checked) => onUpdate({ enabled: checked })}
        />
        <PreferenceItem
          id="show-badges"
          label="Show notification badges"
          description="Display unread count on the notification icon"
          helpText="Display a red badge with the unread count on the notification bell icon."
          checked={preferences.showBadges}
          onCheckedChange={(checked) => onUpdate({ showBadges: checked })}
        />
        <PreferenceItem
          id="play-sound"
          label="Play notification sound"
          description="Play a sound when receiving notifications"
          helpText="Play an audio alert when you receive a new notification. Make sure your browser allows sound."
          checked={preferences.playSound}
          onCheckedChange={(checked) => onUpdate({ playSound: checked })}
        />
      </div>
    </div>
  );
}
