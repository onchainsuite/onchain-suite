import {
  PaperAirplaneIcon,
  PaperClipIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import React from "react";

interface ReplyComposerProps {
  replyText: string;
  setReplyText: (text: string) => void;
  onSend?: () => void;
  isSending?: boolean;
  generateAIReply?: () => void;
  isGeneratingReply?: boolean;
}

const ReplyComposer = ({
  replyText,
  setReplyText,
  onSend,
  isSending = false,
  generateAIReply,
  isGeneratingReply = false,
}: ReplyComposerProps) => {
  const disabled = isSending || replyText.trim().length === 0;
  return (
    <div className="border-t border-border p-3 md:p-4">
      <div className="mx-auto flex max-w-2xl items-end gap-2">
        <div className="min-w-0 flex-1 rounded-2xl border border-border bg-background p-3">
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
          <div className="mt-2 flex items-center gap-1">
            <button
              type="button"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Attach"
            >
              <PaperClipIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={generateAIReply}
              disabled={isGeneratingReply}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-50"
            >
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {isGeneratingReply ? "..." : "Cerebra"}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          title="Send"
        >
          <PaperAirplaneIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default ReplyComposer;
