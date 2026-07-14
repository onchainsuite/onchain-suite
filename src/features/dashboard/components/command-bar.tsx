"use client";

import {
  ArrowUpIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useCommandPalette } from "@/components/common/command-palette";
import { Button } from "@/components/ui/button";

type SpeechRecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  onresult: ((event: unknown) => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Dashboard command bar — the same surface as ⌘K. Typing a query and
 * submitting opens the command palette prefilled with it, which provides
 * navigation commands, semantic search over the workspace, and the
 * streamed "Ask AI" answer with all its bounded/error handling. Voice
 * input transcribes into the query.
 */
export function CommandBar() {
  const palette = useCommandPalette();
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(
    null
  );

  const handleSubmit = () => {
    const q = query.trim();
    palette.open(q.length > 0 ? q : undefined);
    setQuery("");
  };

  const toggleListening = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new Ctor();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onerror = () => {
      setListening(false);
      toast.error("Voice input failed.");
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.onresult = (event: unknown) => {
      const e = event as {
        results?: ArrayLike<
          ArrayLike<{ transcript?: string; confidence?: number }>
        >;
      };
      const { results } = e;
      if (!results || results.length === 0) return;
      const last = results[results.length - 1];
      const alt = last?.[0] ?? null;
      const text =
        alt && typeof alt.transcript === "string" ? alt.transcript : "";
      if (text.trim().length > 0) setQuery(text.trim());
    };

    setListening(true);
    recognition.start();
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="relative flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-ring">
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-muted-foreground"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Search, jump to a page, or ask AI…"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="Search or ask AI"
        />
        <kbd
          aria-hidden="true"
          className="pointer-events-none hidden rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground sm:inline-flex"
        >
          ⌘K
        </kbd>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-lg"
          onClick={toggleListening}
          aria-label={listening ? "Stop voice input" : "Voice input"}
        >
          <MicrophoneIcon
            aria-hidden="true"
            className={listening ? "h-5 w-5 text-primary" : "h-5 w-5"}
          />
        </Button>
        <Button
          type="button"
          size="icon"
          className="rounded-lg"
          onClick={handleSubmit}
          aria-label="Search"
        >
          <ArrowUpIcon aria-hidden="true" className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
