"use client";

import { Bell, Check } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";

import { NotificationItem } from "./notification-item";
import { useKeyboardNavigation, useNotifications } from "@/common/layout/hooks";

function NotificationsContent({ onClose }: { onClose?: () => void }) {
  const {
    notifications,
    unreadCount,
    groupedNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    dismissNotification,
  } = useNotifications();

  const [activeTab, setActiveTab] = React.useState("all");
  const notificationRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const currentNotifications = React.useMemo(() => {
    if (activeTab === "all") return notifications;
    return (
      groupedNotifications[activeTab as keyof typeof groupedNotifications] || []
    );
  }, [activeTab, notifications, groupedNotifications]);

  const { selectedIndex } = useKeyboardNavigation({
    itemCount: currentNotifications.length,
    onSelect: (index) => {
      const notification = currentNotifications[index];
      if (notification) {
        if (notification.read) {
          markAsUnread(notification.id);
        } else {
          markAsRead(notification.id);
        }
      }
    },
    onEscape: onClose,
    enabled: currentNotifications.length > 0,
  });

  React.useEffect(() => {
    if (notificationRefs.current[selectedIndex]) {
      notificationRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    onClose?.();
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 className="font-semibold text-base">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={handleMarkAllAsRead}
          >
            <Check className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        )}
      </div>
      <Separator />

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            No notifications
          </p>
          <p className="text-xs text-muted-foreground">
            You&apos;re all caught up!
          </p>
        </div>
      ) : (
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-4 h-9">
              <TabsTrigger value="all" className="text-xs">
                All
                {notifications.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-muted-foreground">
                    {notifications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="mention" className="text-xs">
                Mentions
                {groupedNotifications.mention.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-muted-foreground">
                    {groupedNotifications.mention.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="update" className="text-xs">
                Updates
                {groupedNotifications.update.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-muted-foreground">
                    {groupedNotifications.update.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="alert" className="text-xs">
                Alerts
                {groupedNotifications.alert.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-muted-foreground">
                    {groupedNotifications.alert.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[400px]">
            <TabsContent value="all" className="mt-0 p-2 space-y-1">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  ref={(el) => {
                    if (activeTab === "all")
                      notificationRefs.current[index] = el;
                  }}
                  className={cn(
                    "rounded-lg transition-colors",
                    activeTab === "all" &&
                      selectedIndex === index &&
                      "ring-2 ring-ring"
                  )}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onMarkAsUnread={markAsUnread}
                    onDismiss={dismissNotification}
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="mention" className="mt-0 p-2 space-y-1">
              {groupedNotifications.mention.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No mentions
                </div>
              ) : (
                groupedNotifications.mention.map((notification, index) => (
                  <div
                    key={notification.id}
                    ref={(el) => {
                      if (activeTab === "mention")
                        notificationRefs.current[index] = el;
                    }}
                    className={cn(
                      "rounded-lg transition-colors",
                      activeTab === "mention" &&
                        selectedIndex === index &&
                        "ring-2 ring-ring"
                    )}
                  >
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onMarkAsUnread={markAsUnread}
                      onDismiss={dismissNotification}
                    />
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="update" className="mt-0 p-2 space-y-1">
              {groupedNotifications.update.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No updates
                </div>
              ) : (
                groupedNotifications.update.map((notification, index) => (
                  <div
                    key={notification.id}
                    ref={(el) => {
                      if (activeTab === "update")
                        notificationRefs.current[index] = el;
                    }}
                    className={cn(
                      "rounded-lg transition-colors",
                      activeTab === "update" &&
                        selectedIndex === index &&
                        "ring-2 ring-ring"
                    )}
                  >
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onMarkAsUnread={markAsUnread}
                      onDismiss={dismissNotification}
                    />
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="alert" className="mt-0 p-2 space-y-1">
              {groupedNotifications.alert.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No alerts
                </div>
              ) : (
                groupedNotifications.alert.map((notification, index) => (
                  <div
                    key={notification.id}
                    ref={(el) => {
                      if (activeTab === "alert")
                        notificationRefs.current[index] = el;
                    }}
                    className={cn(
                      "rounded-lg transition-colors",
                      activeTab === "alert" &&
                        selectedIndex === index &&
                        "ring-2 ring-ring"
                    )}
                  >
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onMarkAsUnread={markAsUnread}
                      onDismiss={dismissNotification}
                    />
                  </div>
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </>
  );
}

interface NotificationsCenterProps {
  mobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NotificationsCenter({
  mobile = false,
  open,
  onOpenChange,
}: NotificationsCenterProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const { unreadCount } = useNotifications();

  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  if (mobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Notifications</DrawerTitle>
          </DrawerHeader>
          <NotificationsContent onClose={() => setIsOpen(false)} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-sidebar-foreground hover:bg-sidebar-foreground/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center animate-in zoom-in-50">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0" align="end" sideOffset={8}>
        <NotificationsContent />
      </PopoverContent>
    </Popover>
  );
}

export function NotificationsBellIcon({ className }: { className?: string }) {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Bell className={cn("h-full w-full", className)} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
}
