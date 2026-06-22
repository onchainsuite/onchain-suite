import {
  ArchiveIcon,
  Delete02Icon,
  MoreHorizontalIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { inboxService } from "../inbox.service";
import { type InboxThreadDetail, type InboxThreadListItem } from "../types";

export type ConversationHeaderProps = {
  thread: InboxThreadDetail | InboxThreadListItem;
};

const ConversationHeader = ({ thread }: ConversationHeaderProps) => {
  const queryClient = useQueryClient();
  const starMutation = useMutation({
    mutationFn: async () => inboxService.toggleThreadStar(thread.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inbox", "threads"] });
      await queryClient.invalidateQueries({
        queryKey: ["inbox", "thread", thread.id],
      });
    },
  });

  return (
    <div className="border-b border-border p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="mb-1 text-lg font-medium">{thread.subject}</h2>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {thread.labels?.[0]?.name ?? "Inbox"}
            </span>
            <span className="text-xs text-muted-foreground">
              {thread.fromEmail ?? thread.from ?? ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card">
            <HugeiconsIcon icon={ArchiveIcon} className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => starMutation.mutate()}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card"
          >
            <HugeiconsIcon
              icon={StarIcon}
              className={`h-4 w-4 ${thread.starred ? "fill-amber-400 text-amber-400" : ""}`}
            />
          </button>
          <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card">
            <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card">
            <HugeiconsIcon icon={MoreHorizontalIcon} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
