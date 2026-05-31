"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandOption,
  CommandSeparator,
} from "@kmenu/react";
import { fuzzyFilter } from "kmenu";
import { Mail, Search, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { PRIVATE_ROUTES } from "@/config/app-routes";
import { authClient } from "@/lib/auth-client";
import { getSelectedOrganizationId } from "@/lib/utils";

type PaletteOptionData =
  | {
      kind: "action";
      href?: string;
      run?: () => void;
    }
  | {
      kind: "ai";
      query: string;
    };

type PaletteOption = {
  id: string;
  label: string;
  keywords?: string[];
  icon?: "mail" | "settings" | "sparkles" | "search";
  data: PaletteOptionData;
};

type CommandPaletteApi = {
  open: (prefill?: string) => void;
  close: () => void;
  setQuery: (value: string) => void;
};

const CommandPaletteContext = createContext<CommandPaletteApi | null>(null);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("CommandPaletteProvider missing");
  return ctx;
}

function iconFor(option: PaletteOption) {
  switch (option.icon) {
    case "mail":
      return <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />;
    case "settings":
      return <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />;
    case "sparkles":
      return <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />;
    default:
      return <Search className="h-4 w-4 shrink-0" aria-hidden="true" />;
  }
}

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

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiDone, setAiDone] = useState<StreamDonePayload | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const api = useMemo<CommandPaletteApi>(
    () => ({
      open: (prefill) => {
        setAiAnswer("");
        setAiDone(null);
        setAiError(null);
        setAiLoading(false);
        if (typeof prefill === "string") setQuery(prefill);
        setOpen(true);
      },
      close: () => setOpen(false),
      setQuery,
    }),
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      abortRef.current = null;
      setAiLoading(false);
    }
  }, [open]);

  const options = useMemo<PaletteOption[]>(() => {
    const base: PaletteOption[] = [
      {
        id: "connect-email",
        label: "Connect email",
        keywords: ["email", "inbox", "connect"],
        icon: "mail",
        data: { kind: "action", href: PRIVATE_ROUTES.INBOX },
      },
      {
        id: "open-settings",
        label: "Open settings",
        keywords: ["settings", "preferences"],
        icon: "settings",
        data: { kind: "action", href: PRIVATE_ROUTES.SETTINGS },
      },
      {
        id: "personalize",
        label: "Personalize workspace",
        keywords: ["onboarding", "personalize"],
        icon: "sparkles",
        data: { kind: "action", href: "/onboarding" },
      },
    ];

    const q = query.trim();
    if (q.length > 0) {
      base.unshift({
        id: "ask-ai",
        label: `Ask AI: ${q}`,
        keywords: ["ai", "ask", "help", "search"],
        icon: "search",
        data: { kind: "ai", query: q },
      });
    }

    return base;
  }, [query]);

  const handleSelect = useCallback(
    (opt: PaletteOption) => {
      if (opt.data.kind === "action") {
        setOpen(false);
        if (opt.data.run) opt.data.run();
        if (opt.data.href) window.location.href = opt.data.href;
        return;
      }

      const orgId = getSelectedOrganizationId();
      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;

      setAiAnswer("");
      setAiDone(null);
      setAiError(null);
      setAiLoading(true);

      const enriched = buildPersonalizedQuery(opt.data.query, session?.user);

      streamQueryText({
        query: enriched,
        mode: "best",
        orgId,
        signal: controller.signal,
        onToken: (t) => setAiAnswer((prev) => prev + t),
        onDone: (d) => {
          setAiDone(d);
          if (typeof d.answer === "string" && d.answer.length > 0) {
            setAiAnswer(d.answer);
          }
          setAiLoading(false);
        },
      }).catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "AI request failed";
        setAiError(message);
        setAiLoading(false);
        toast.error(message);
      });
    },
    [session?.user]
  );

  const aiVisible = aiLoading || aiAnswer.length > 0 || aiError !== null;

  return (
    <CommandPaletteContext.Provider value={api}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          <Command
            open={open}
            onOpenChange={setOpen}
            options={options}
            filter={fuzzyFilter}
            value={query}
            onValueChange={setQuery}
            onSelect={(selected) => handleSelect(selected as PaletteOption)}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <CommandInput
                placeholder="Type a command or ask AI..."
                className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="hidden text-xs text-muted-foreground sm:block">
                Ctrl K
              </div>
            </div>

            <CommandList className="max-h-[420px] overflow-auto p-2">
              <CommandEmpty>
                <div className="px-3 py-6 text-sm text-muted-foreground">
                  No results found.
                </div>
              </CommandEmpty>

              <CommandGroup heading="Actions">
                {options
                  .filter((o) => o.id !== "ask-ai")
                  .map((o) => (
                    <CommandOption
                      key={o.id}
                      value={o}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent/20 data-[active=true]:bg-accent/30"
                    >
                      {iconFor(o)}
                      <span className="flex-1">{o.label}</span>
                    </CommandOption>
                  ))}
              </CommandGroup>

              {options.some((o) => o.id === "ask-ai") ? (
                <>
                  <CommandSeparator className="my-2" />
                  <CommandGroup heading="AI">
                    {options
                      .filter((o) => o.id === "ask-ai")
                      .map((o) => (
                        <CommandOption
                          key={o.id}
                          value={o}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent/20 data-[active=true]:bg-accent/30"
                        >
                          {iconFor(o)}
                          <span className="flex-1">{o.label}</span>
                        </CommandOption>
                      ))}
                  </CommandGroup>
                </>
              ) : null}

              {aiVisible ? (
                <>
                  <CommandSeparator className="my-2" />
                  <div className="space-y-2 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-muted-foreground">
                        AI response
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => {
                          abortRef.current?.abort();
                          abortRef.current = null;
                          setAiLoading(false);
                        }}
                        disabled={!aiLoading}
                      >
                        Stop
                      </Button>
                    </div>
                    <div className="min-h-[96px] whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground">
                      {aiError ?? (aiAnswer.length > 0 ? aiAnswer : "…")}
                    </div>
                    {aiDone?.queryLogId ? (
                      <div className="text-xs text-muted-foreground">
                        <span>queryLogId:</span> {aiDone.queryLogId}
                      </div>
                    ) : null}
                    <div className="text-xs text-muted-foreground">
                      <Link href="/settings" className="hover:underline">
                        Change organization or permissions in Settings
                      </Link>
                    </div>
                  </div>
                </>
              ) : null}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </CommandPaletteContext.Provider>
  );
}
