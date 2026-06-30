import {
  ArchiveBoxIcon,
  EllipsisHorizontalIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
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
    <div className="border-b border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">
            {thread.subject}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {thread.labels?.[0]?.name ?? "Inbox"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {thread.fromEmail ?? thread.from ?? ""}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Archive"
          >
            <ArchiveBoxIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => starMutation.mutate()}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-amber-500"
            title="Star"
          >
            {thread.starred ? (
              <StarSolidIcon
                className="h-4 w-4 text-amber-500"
                aria-hidden="true"
              />
            ) : (
              <StarIcon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="More"
          >
            <EllipsisHorizontalIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
