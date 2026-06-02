"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { inboxService } from "../inbox.service";
import { type InboxThreadDetail, type InboxThreadListItem } from "../types";
import ConversationHeader from "./conversation-header";
import ReplyComposer from "./reply-composer";
import Thread from "./thread";

interface ConversationProps {
  selectedThreadId: string | null;
  selectedThread: InboxThreadDetail | InboxThreadListItem | null;
}

const Conversation = ({
  selectedThreadId,
  selectedThread,
}: ConversationProps) => {
  const [replyText, setReplyText] = useState("");
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const queryClient = useQueryClient();

  const generateAIReply = () => {
    // Mock AI reply generation
    setIsGeneratingReply(true);
    setTimeout(() => {
      setReplyText(
        "Hi there, thanks for reaching out! I'd love to discuss this further. Let's schedule a call."
      );
      setIsGeneratingReply(false);
    }, 1500);
  };

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedThreadId) throw new Error("No thread selected");
      const content = replyText.trim();
      if (content.length === 0) throw new Error("Reply is empty");
      return inboxService.sendReply(selectedThreadId, { content });
    },
    onSuccess: async () => {
      setReplyText("");
      await queryClient.invalidateQueries({ queryKey: ["inbox", "thread"] });
      await queryClient.invalidateQueries({ queryKey: ["inbox", "threads"] });
      await queryClient.invalidateQueries({
        queryKey: ["inbox", "unread-count"],
      });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to send reply";
      toast.error(message);
    },
  });

  if (!selectedThreadId || !selectedThread) {
    return (
      <div className="flex flex-1 items-center justify-center bg-card/50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="mt-4 text-lg font-semibold text-foreground">
            Select a message
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Choose a conversation from the list to view the thread and reply.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ConversationHeader thread={selectedThread} />
      <Thread thread={selectedThread} />
      <ReplyComposer
        replyText={replyText}
        setReplyText={setReplyText}
        generateAIReply={generateAIReply}
        isGeneratingReply={isGeneratingReply}
        onSend={() => sendMutation.mutate()}
        isSending={sendMutation.isPending}
      />
    </div>
  );
};

export default Conversation;
