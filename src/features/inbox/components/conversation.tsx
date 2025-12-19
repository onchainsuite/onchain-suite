"use client";

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
      <div className="flex flex-1 items-center justify-center text-muted-foreground bg-card/50">
        <div className="text-center">
          <p>Select an email to view conversation</p>
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
