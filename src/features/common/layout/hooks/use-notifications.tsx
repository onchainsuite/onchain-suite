"use client";

import { useCallback, useState } from "react";

export type NotificationType = "mention" | "update" | "alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "mention",
    title: "Sarah mentioned you",
    message:
      "Sarah mentioned you in a comment on the Marketing Campaign project",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    actionUrl: "/projects/marketing",
    actionLabel: "View comment",
  },
  {
    id: "2",
    type: "update",
    title: "Project updated",
    message: "The Q4 Sales Report has been updated with new data",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    actionUrl: "/reports/q4-sales",
    actionLabel: "View report",
  },
  {
    id: "3",
    type: "alert",
    title: "Payment due soon",
    message: "Your subscription payment is due in 3 days",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: "/billing",
    actionLabel: "View billing",
  },
  {
    id: "4",
    type: "mention",
    title: "John mentioned you",
    message: "John mentioned you in the Design Review meeting notes",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    actionUrl: "/meetings/design-review",
    actionLabel: "View notes",
  },
  {
    id: "5",
    type: "update",
    title: "New feature released",
    message: "Check out the new analytics dashboard we just launched",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actionUrl: "/features/analytics",
    actionLabel: "Explore",
  },
];

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAsUnread = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: false } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      acc[notification.type].push(notification);
      return acc;
    },
    { mention: [], update: [], alert: [] } as Record<
      NotificationType,
      Notification[]
    >
  );

  return {
    notifications,
    unreadCount,
    groupedNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    dismissNotification,
  };
}
