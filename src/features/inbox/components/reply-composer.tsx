import { Paperclip, Send } from "lucide-react";
import React from "react";

interface ReplyComposerProps {
  replyText: string;
  setReplyText: (text: string) => void;
  generateAIReply?: () => void;
  isGeneratingReply?: boolean;
}

const ReplyComposer = ({
  replyText,
  setReplyText,
  generateAIReply,
  isGeneratingReply = false,
}: ReplyComposerProps) => {
  return (
    <div className="border-t border-border p-4">
      <div className="mx-auto flex max-w-2xl items-end gap-3">
        <div className="flex-1 rounded-2xl border border-border bg-card p-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            rows={1}
            className="max-h-32 min-h-[24px] w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted">
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                onClick={generateAIReply}
                disabled={isGeneratingReply}
                className="rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-50"
              >
                {isGeneratingReply ? "..." : "Cerebra"}
              </button>
            </div>
          </div>
        </div>
        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ReplyComposer;
