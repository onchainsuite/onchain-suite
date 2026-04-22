"use client";

import { Mail } from "lucide-react";
import React, { useState } from "react";

import { type Email } from "../types";
import ConversationHeader from "./conversation-header";
import ReplyComposer from "./reply-composer";
import Thread from "./thread";

interface ConversationProps {
  selectedEmail: Email | null;
}

const Conversation = ({ selectedEmail }: ConversationProps) => {
  const [replyText, setReplyText] = useState("");
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

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

  if (!selectedEmail) {
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
      <ConversationHeader selectedEmail={selectedEmail} />
      <Thread selectedEmail={selectedEmail} />
      <ReplyComposer
        replyText={replyText}
        setReplyText={setReplyText}
        generateAIReply={generateAIReply}
        isGeneratingReply={isGeneratingReply}
      />
    </div>
  );
};

export default Conversation;
