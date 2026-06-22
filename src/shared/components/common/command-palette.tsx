"use client";

import {
  Mail01Icon,
  Search01Icon,
  Settings01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { ScrollArea } from "@/ui/scroll-area";

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
  shortcut?: string[];
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
      return (
        <HugeiconsIcon
          icon={Mail01Icon}
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        />
      );
    case "settings":
      return (
        <HugeiconsIcon
          icon={Settings01Icon}
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        />
      );
    case "sparkles":
      return (
        <HugeiconsIcon
          icon={SparklesIcon}
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        />
      );
    default:
      return (
        <HugeiconsIcon
          icon={Search01Icon}
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        />
      );
  }
}

function Kbd({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((k) => (
        <kbd
          key={k}
          className="pointer-events-none inline-flex h-4 items-center justify-center rounded border border-border/60 bg-muted/30 px-1 font-mono text-[10px] font-medium text-muted-foreground"
        >
          {k}
        </kbd>
      ))}
    </div>
  );
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
  const lastShortcutAtRef = useRef<number>(0);
  const openRef = useRef<boolean>(false);

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
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isK =
        e.code === "KeyK" ||
        (typeof e.key === "string" && e.key.toLowerCase() === "k");
      const hasPrimaryModifier = e.metaKey || e.ctrlKey;
      const hasExtraModifier = e.altKey || e.shiftKey;

      if (isK && hasPrimaryModifier && !hasExtraModifier) {
        const target = e.target as
          | HTMLElement
          | null
          | (EventTarget & { tagName?: string; isContentEditable?: boolean });
        const tag =
          typeof target?.tagName === "string"
            ? target.tagName.toLowerCase()
            : "";
        const isEditable =
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          Boolean(
            target && "isContentEditable" in target && target.isContentEditable
          );
        if (isEditable) return;

        const now = Date.now();
        if (now - lastShortcutAtRef.current < 450) return;
        lastShortcutAtRef.current = now;

        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }

        if (openRef.current) {
          const input = document.querySelector<HTMLInputElement>(
            "[data-slot='dialog-content'] input"
          );
          input?.focus();
          return;
        }

        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      abortRef.current = null;
      setAiLoading(false);
      return;
    }
    const t = window.setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(
        "[data-slot='dialog-content'] input"
      );
      input?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const options = useMemo<PaletteOption[]>(() => {
    const base: PaletteOption[] = [
      {
        id: "connect-email",
        label: "Connect email",
        keywords: ["email", "inbox", "connect"],
        icon: "mail",
        shortcut: ["⌘", "E"],
        data: { kind: "action", href: PRIVATE_ROUTES.INBOX },
      },
      {
        id: "open-settings",
        label: "Open settings",
        keywords: ["settings", "preferences"],
        icon: "settings",
        shortcut: ["⌘", ","],
        data: { kind: "action", href: PRIVATE_ROUTES.SETTINGS },
      },
      {
        id: "personalize",
        label: "Personalize workspace",
        keywords: ["onboarding", "personalize"],
        icon: "sparkles",
        shortcut: ["⌘", "P"],
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
        shortcut: ["↵"],
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
        <DialogContent className="max-w-[520px] overflow-hidden rounded-xl border border-border/60 bg-background/90 p-0 shadow-2xl ring-1 ring-black/10 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:max-w-[520px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Command palette</DialogTitle>
          </DialogHeader>
          <Command
            options={options}
            filter={fuzzyFilter}
            value={query}
            onValueChange={setQuery}
            onSelect={(selected) => handleSelect(selected as PaletteOption)}
          >
            <div className="border-b border-border/60 bg-muted/10 px-3 py-2">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <CommandInput
                  placeholder="Type a command or ask AI…"
                  aria-label="Command palette input"
                  className="h-9 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
                />
                <Kbd keys={["Esc"]} />
              </div>
            </div>

            <ScrollArea className="max-h-fit">
              <CommandList className="px-1 py-1">
                <CommandEmpty>
                  <div className="px-2 py-6 text-sm text-muted-foreground">
                    No results found.
                  </div>
                </CommandEmpty>

                <CommandGroup heading="General">
                  {options
                    .filter((o) => o.id !== "ask-ai")
                    .map((o) => (
                      <CommandOption
                        key={o.id}
                        value={o}
                        className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-foreground hover:bg-muted/30 data-[active=true]:bg-muted/40"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/30 text-muted-foreground group-data-[active=true]:bg-muted/40">
                          {iconFor(o)}
                        </div>
                        <span className="flex-1 font-medium leading-snug">
                          {o.label}
                        </span>
                        {o.shortcut && o.shortcut.length > 0 ? (
                          <Kbd keys={o.shortcut} />
                        ) : null}
                      </CommandOption>
                    ))}
                </CommandGroup>

                {options.some((o) => o.id === "ask-ai") ? (
                  <>
                    <CommandSeparator className="my-1.5" />
                    <CommandGroup heading="AI">
                      {options
                        .filter((o) => o.id === "ask-ai")
                        .map((o) => (
                          <CommandOption
                            key={o.id}
                            value={o}
                            className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-foreground hover:bg-muted/30 data-[active=true]:bg-muted/40"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/30 text-muted-foreground group-data-[active=true]:bg-muted/40">
                              {iconFor(o)}
                            </div>
                            <span className="flex-1 font-medium leading-snug">
                              {o.label}
                            </span>
                            {o.shortcut && o.shortcut.length > 0 ? (
                              <Kbd keys={o.shortcut} />
                            ) : null}
                          </CommandOption>
                        ))}
                    </CommandGroup>
                  </>
                ) : null}
              </CommandList>
            </ScrollArea>

            {aiVisible ? (
              <div className="border-t border-border/60 bg-muted/10 px-3 py-2">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">
                      AI response
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
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

                  <ScrollArea className="max-h-[180px] rounded-lg border border-border/60 bg-muted/20">
                    <div className="p-2 text-[13px] leading-relaxed text-foreground">
                      <div className="whitespace-pre-wrap">
                        {aiError ?? (aiAnswer.length > 0 ? aiAnswer : "…")}
                      </div>
                    </div>
                  </ScrollArea>

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
              </div>
            ) : null}
          </Command>
        </DialogContent>
      </Dialog>
    </CommandPaletteContext.Provider>
  );
}
