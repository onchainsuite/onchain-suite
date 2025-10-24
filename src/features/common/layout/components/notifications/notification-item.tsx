"use client";

import { formatDistanceToNow } from "date-fns";
import { AlertCircle, AtSign, Bell, Check, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import {
  type Notification,
  type NotificationType,
} from "@/common/layout/hooks";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDismiss: (id: string) => void;
}

const typeIcons: Record<NotificationType, React.ReactNode> = {
  mention: <AtSign className="h-4 w-4" />,
  update: <Bell className="h-4 w-4" />,
  alert: <AlertCircle className="h-4 w-4" />,
};

const typeColors: Record<NotificationType, string> = {
  mention: "text-blue-500 bg-blue-500/10",
  update: "text-green-500 bg-green-500/10",
  alert: "text-orange-500 bg-orange-500/10",
};

export const NotificationItem = React.memo(function NotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDismiss,
}: NotificationItemProps) {
  const handleAction = () => {
    if (notification.actionUrl) {
      console.log("[v0] Navigate to:", notification.actionUrl);
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex gap-3 p-3 rounded-lg transition-colors hover:bg-accent/50",
        !notification.read && "bg-accent/20"
      )}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
      )}

      {/* Type icon */}
      <div
        className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          typeColors[notification.type]
        )}
      >
        {typeIcons[notification.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground leading-tight">
            {notification.title}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-snug">
          {notification.message}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          {notification.actionUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleAction}
            >
              {notification.actionLabel ?? "View"}
            </Button>
          )}
          <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            {!notification.read ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onMarkAsUnread(notification.id)}
              >
                <Bell className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onDismiss(notification.id)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
