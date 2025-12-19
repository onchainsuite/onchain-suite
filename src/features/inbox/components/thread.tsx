import React from "react";

import { type Email } from "../types";

interface ThreadProps {
  selectedEmail: Email;
}

const Thread = ({ selectedEmail }: ThreadProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        {selectedEmail.thread.map((message) => {
          const isYou = message.from === "You";
          return (
            <div
              key={message.id}
              className={`flex ${isYou ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[80%] gap-2 ${isYou ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    isYou
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {isYou ? "Y" : selectedEmail.avatar}
                </div>
                <div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isYou
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-card text-foreground border border-border"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <p
                    className={`mt-1 text-xs text-muted-foreground ${
                      isYou ? "text-right" : "text-left"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Thread;
