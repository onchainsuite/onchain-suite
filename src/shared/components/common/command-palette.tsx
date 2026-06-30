"use client";

import {
  Cog6ToothIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
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
        <EnvelopeIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      );
    case "settings":
      return (
        <Cog6ToothIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      );
    case "sparkles":
      return (
        <SparklesIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      );
    default:
      return (
        <MagnifyingGlassIcon
          className="h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        />
      );
  }
}

function Kbd({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {keys.map((k) => (
        <kbd
          key={k}
          className="pointer-events-none inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-md border border-border bg-muted px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)]"
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
        <DialogContent
          showCloseButton={false}
          className="max-w-[600px] gap-0 overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-0 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.65)] ring-1 ring-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85 sm:max-w-[600px]"
        >
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
            {/* Search row */}
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <CommandInput
                placeholder="Search commands or ask AI anything…"
                aria-label="Command palette input"
                className="h-7 flex-1 bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close command palette"
                className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
              >
                Esc
              </button>
            </div>

            <ScrollArea className="max-h-[min(60vh,420px)]">
              <CommandList className="px-2 pb-2 pt-1.5">
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-1.5 px-2 py-10 text-center">
                    <MagnifyingGlassIcon
                      className="h-6 w-6 text-muted-foreground/40"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium text-foreground">
                      No results found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Press{" "}
                      <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">
                        ↵
                      </kbd>{" "}
                      to ask AI instead.
                    </p>
                  </div>
                </CommandEmpty>

                <CommandGroup
                  heading="General"
                  className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {options
                    .filter((o) => o.id !== "ask-ai")
                    .map((o) => (
                      <CommandOption
                        key={o.id}
                        value={o}
                        className="group relative flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/40 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary opacity-0 transition-opacity group-data-[active=true]:opacity-100"
                        />
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors group-data-[active=true]:border-primary/30 group-data-[active=true]:bg-primary/15 group-data-[active=true]:text-primary">
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
                    <CommandSeparator className="my-2 h-px bg-border/60" />
                    <CommandGroup
                      heading="AI"
                      className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted-foreground"
                    >
                      {options
                        .filter((o) => o.id === "ask-ai")
                        .map((o) => (
                          <CommandOption
                            key={o.id}
                            value={o}
                            className="group relative flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/40 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary opacity-0 transition-opacity group-data-[active=true]:opacity-100"
                            />
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
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
              <div className="border-t border-border/60 bg-muted/10 px-4 py-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <SparklesIcon
                        className="h-3.5 w-3.5 text-primary"
                        aria-hidden="true"
                      />
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

                  <ScrollArea className="max-h-[180px] rounded-xl border border-border/60 bg-muted/20">
                    <div
                      className="p-3 text-[13px] leading-relaxed text-foreground"
                      aria-live="polite"
                    >
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

            {/* Footer hints */}
            <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Kbd keys={["↑", "↓"]} />
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd keys={["↵"]} />
                  Select
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <SparklesIcon
                  className="h-3.5 w-3.5 text-primary"
                  aria-hidden="true"
                />
                Type anything to ask AI
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </CommandPaletteContext.Provider>
  );
}
