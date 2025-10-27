"use client";

import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { MessageInbox } from "@/r3tain/community/types";

interface MessagesInboxProps {
  inbox: MessageInbox;
  onViewInbox: () => void;
}

export function MessagesInbox({ inbox, onViewInbox }: MessagesInboxProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Mail className="h-4 w-4" />
          Messages Inbox
        </CardTitle>
        <Button
          variant="link"
          className="p-0 text-blue-600"
          onClick={onViewInbox}
        >
          View Inbox
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          You&apos;ve received {inbox.messageCount} messages in the last{" "}
          {inbox.daysPeriod} days.
        </p>
      </CardContent>
    </Card>
  );
}
