"use client";

import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-dashed border-border px-6 py-10 text-center">
          <EnvelopeIcon
            className="mx-auto h-6 w-6 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="mt-3 text-sm font-medium text-foreground">
            Select a message
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Choose a conversation to view the thread and reply.
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={selectedThreadId}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
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
    </motion.div>
  );
};

export default Conversation;
