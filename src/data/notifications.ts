import type { Notification } from "@/types/notification";

// Sample notification data
export const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Campaign launched",
    description: "Your 'Summer Sale' campaign has been launched successfully.",
    time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "New subscriber",
    description: "Alex Johnson has subscribed to your newsletter.",
    time: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "Automation warning",
    description: "Your 'Welcome Email' automation has low engagement rates.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
    type: "warning",
  },
  {
    id: "4",
    title: "New message",
    description: "You have a new message from the support team.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    type: "message",
  },
  {
    id: "5",
    title: "Analytics report",
    description: "Your weekly analytics report is now available.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    type: "info",
  },
];
