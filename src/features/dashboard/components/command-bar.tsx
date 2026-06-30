"use client";

import {
  ArrowPathIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/auth-client";
import { getSelectedOrganizationId } from "@/lib/utils";

type StreamDonePayload = {
  answer?: string;
  citations?: unknown;
  queryLogId?: string;
  latencyMs?: number;
  variant?: string;
  redactions?: unknown;
};

function buildPersonalizedQuery(input: string, user: unknown): string {
  const u = user as { name?: unknown; timezone?: unknown; email?: unknown };
  const name = typeof u?.name === "string" ? u.name : "";
  const tz = typeof u?.timezone === "string" ? u.timezone : "";
  const email = typeof u?.email === "string" ? u.email : "";
  const ctx = [
    name ? `name=${name}` : null,
    tz ? `timezone=${tz}` : null,
    email ? `email=${email}` : null,
  ]
    .filter((v): v is string => Boolean(v && v.length > 0))
    .join(", ");
  if (!ctx) return input;
  return `UserContext(${ctx})\n\n${input}`;
}

async function streamQueryText(args: {
  query: string;
  mode?: "fast" | "best";
  orgId?: string | null;
  signal?: AbortSignal;
  onToken: (token: string) => void;
  onDone: (done: StreamDonePayload) => void;
}): Promise<void> {
  const params = new URLSearchParams();
  params.set("query", args.query);
  if (args.mode) params.set("mode", args.mode);

  const headers: Record<string, string> = {};
  if (args.orgId) headers["x-org-id"] = args.orgId;

  const res = await fetch(`/api/v1/query/text/stream?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers,
    signal: args.signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`AI request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const evt of events) {
      const lines = evt.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const jsonText = trimmed.slice("data:".length).trim();
        if (!jsonText) continue;
        try {
          const parsed = JSON.parse(jsonText) as {
            type?: unknown;
            token?: unknown;
            data?: unknown;
          };
          if (parsed.type === "token" && typeof parsed.token === "string") {
            args.onToken(parsed.token);
          } else if (
            parsed.type === "done" &&
            parsed.data &&
            typeof parsed.data === "object"
          ) {
            args.onDone(parsed.data as StreamDonePayload);
          }
        } catch {
          continue;
        }
      }
    }
  }
}

type SpeechRecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
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

export function CommandBar() {
  const { data: session } = authClient.useSession();

  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState<StreamDonePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [listening, setListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(
    null
  );

  const showResponse =
    loading || error !== null || answer.trim().length > 0 || done !== null;

  const stopSpeech = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {
      return;
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    if (!text.trim()) return;
    stopSpeech();
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } catch {
      return;
    }
  };

  const clearResponse = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setError(null);
    setAnswer("");
    setDone(null);
    stopSpeech();
  };

  const handleSubmit = async () => {
    const q = query.trim();
    if (!q) return;
    const orgId = getSelectedOrganizationId();

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAnswer("");
    setDone(null);
    setError(null);
    setLoading(true);

    const enriched = buildPersonalizedQuery(q, session?.user);

    try {
      await streamQueryText({
        query: enriched,
        mode: "best",
        orgId,
        signal: controller.signal,
        onToken: (t) => setAnswer((prev) => prev + t),
        onDone: (d) => {
          setDone(d);
          const nextAnswer =
            typeof d.answer === "string" && d.answer.length > 0 ? d.answer : "";
          if (nextAnswer.length > 0) setAnswer(nextAnswer);
          if (nextAnswer.length > 0) speak(nextAnswer);
          setLoading(false);
        },
      });
      setLoading(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI request failed";
      setError(msg);
      setLoading(false);
      toast.error(msg);
    }
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
      abortRef.current?.abort();
      recognitionRef.current?.stop();
      stopSpeech();
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
          placeholder="What can I do for you?"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="AI query"
        />
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
          variant="ghost"
          size="icon"
          className="rounded-lg"
          onClick={() => setVoiceEnabled((v) => !v)}
          aria-label={
            voiceEnabled ? "Disable voice output" : "Enable voice output"
          }
          title={voiceEnabled ? "Voice output: on" : "Voice output: off"}
        >
          {voiceEnabled ? (
            <SpeakerWaveIcon aria-hidden="true" className="h-5 w-5" />
          ) : (
            <SpeakerXMarkIcon aria-hidden="true" className="h-5 w-5" />
          )}
        </Button>
        <Button
          type="button"
          size="icon"
          className="rounded-lg"
          onClick={handleSubmit}
          aria-label="Submit"
          disabled={loading || query.trim().length === 0}
        >
          {loading ? (
            <ArrowPathIcon
              aria-hidden="true"
              className="h-5 w-5 animate-spin"
            />
          ) : (
            <ArrowUpIcon aria-hidden="true" className="h-5 w-5" />
          )}
        </Button>
      </div>

      {showResponse ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-3 rounded-2xl border border-border bg-card p-4 shadow-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-foreground">
                Response
              </div>
              <div className="text-xs text-muted-foreground">
                Streaming from /query/text/stream
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  abortRef.current?.abort();
                  abortRef.current = null;
                  setLoading(false);
                }}
                disabled={!loading}
              >
                Stop
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => speak(answer)}
                disabled={!voiceEnabled || answer.trim().length === 0}
              >
                Speak
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-xl"
                onClick={clearResponse}
              >
                Dismiss
              </Button>
            </div>
          </div>

          <div className="mt-3 whitespace-pre-wrap rounded-xl bg-muted/40 p-4 text-sm text-foreground">
            {error ?? (answer.length > 0 ? answer : "…")}
          </div>

          {done?.queryLogId ? (
            <div className="mt-2 text-xs text-muted-foreground">
              <span>queryLogId:</span> {done.queryLogId}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
