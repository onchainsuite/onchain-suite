"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

import ConversationPanel from "../components/conversation";
import EmailListPanel from "../components/email-list-panel";
import FloatingBulk from "../components/floating-bulk";
import { folders } from "../data";
import { connectInboxSocket, inboxService } from "../inbox.service";
import { type InboxThreadListItem } from "../types";

export function InboxPages() {
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const emailListRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const listParams = useMemo(() => {
    const q = searchQuery.trim();
    if (selectedFolder === "Archived") {
      return { folder: "ARCHIVE" as const, q: q.length > 0 ? q : undefined };
    }
    if (selectedFolder === "Unread") {
      return {
        folder: "INBOX" as const,
        unread: true as const,
        q: q.length > 0 ? q : undefined,
      };
    }
    if (selectedFolder === "Starred") {
      return {
        folder: "INBOX" as const,
        starred: true as const,
        q: q.length > 0 ? q : undefined,
      };
    }
    return { folder: "INBOX" as const, q: q.length > 0 ? q : undefined };
  }, [searchQuery, selectedFolder]);

  const threadsQuery = useQuery({
    queryKey: ["inbox", "threads", listParams],
    queryFn: () =>
      inboxService.listThreads({ ...listParams, page: 1, limit: 100 }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const unreadQuery = useQuery({
    queryKey: ["inbox", "unread-count"],
    queryFn: () => inboxService.getUnreadCount(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const threads: InboxThreadListItem[] = threadsQuery.data?.items ?? [];

  const selectedThread = useMemo(() => {
    if (!selectedThreadId) return null;
    return threads.find((t) => t.id === selectedThreadId) ?? null;
  }, [selectedThreadId, threads]);

  const threadDetailQuery = useQuery({
    queryKey: ["inbox", "thread", selectedThreadId],
    queryFn: () => inboxService.getThread(selectedThreadId!),
    enabled: !!selectedThreadId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const markReadMutation = useMutation({
    mutationFn: async (threadId: string) =>
      inboxService.markThreadRead(threadId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inbox", "threads"] });
      await queryClient.invalidateQueries({
        queryKey: ["inbox", "unread-count"],
      });
    },
  });

  useEffect(() => {
    if (!selectedThreadId) return;
    const unreadCount =
      (selectedThread?.unreadCount ?? 0) ||
      ((threadDetailQuery.data as { unreadCount?: number } | null)
        ?.unreadCount ??
        0);
    if (unreadCount > 0) {
      markReadMutation.mutate(selectedThreadId);
    }
  }, [selectedThread?.unreadCount, selectedThreadId, threadDetailQuery.data]);

  const toggleThreadSelection = (threadId: string) => {
    setSelectedThreadIds((prev) =>
      prev.includes(threadId)
        ? prev.filter((id) => id !== threadId)
        : [...prev, threadId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedThreadIds.length === threads.length) {
      setSelectedThreadIds([]);
    } else {
      setSelectedThreadIds(threads.map((t) => t.id));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      switch (e.key) {
        case "j":
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, threads.length - 1));
          break;
        case "k":
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (threads[focusedIndex]) {
            setSelectedThreadId(threads[focusedIndex].id);
          }
          break;
        case "x":
          e.preventDefault();
          if (threads[focusedIndex]) {
            toggleThreadSelection(threads[focusedIndex].id);
          }
          break;
        case "r":
          e.preventDefault();
          if (selectedThreadId) {
            document.querySelector("textarea")?.focus();
          }
          break;
        case "e":
          e.preventDefault();
          // Archive action
          break;
        case "s":
          e.preventDefault();
          // Star toggle
          break;
        case "/":
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, selectedThreadId, threads]);

  useEffect(() => {
    const emailElement = emailListRef.current?.children[
      focusedIndex
    ] as HTMLElement;
    emailElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusedIndex]);

  useEffect(() => {
    const socket = connectInboxSocket(null);
    const onNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "threads"] });
      queryClient.invalidateQueries({ queryKey: ["inbox", "unread-count"] });
      if (selectedThreadId) {
        queryClient.invalidateQueries({
          queryKey: ["inbox", "thread", selectedThreadId],
        });
      }
    };
    socket.on("new_message", onNewMessage);
    socket.on("thread_updated", onNewMessage);
    socket.on("unread_count_changed", onNewMessage);
    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("thread_updated", onNewMessage);
      socket.off("unread_count_changed", onNewMessage);
      socket.disconnect();
    };
  }, [queryClient, selectedThreadId]);

  const unreadCount = unreadQuery.data?.unreadCount ?? 0;
  const foldersUi = useMemo(() => {
    return folders.map((f) => {
      if (f.name === "Unread") return { ...f, count: unreadCount };
      return { ...f, count: f.count };
    });
  }, [unreadCount]);

  return (
    <div className="flex h-full min-h-[calc(100vh-8rem)] bg-background text-foreground">
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Inbox</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        {/* 2-Panel Layout */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Email List Panel */}
          <EmailListPanel
            threads={threads}
            isLoading={threadsQuery.isFetching}
            selectedThreadId={selectedThreadId}
            setSelectedThreadId={setSelectedThreadId}
            selectedThreadIds={selectedThreadIds}
            toggleSelectAll={toggleSelectAll}
            toggleThreadSelection={toggleThreadSelection}
            folders={foldersUi}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchInputRef={searchInputRef}
            emailListRef={emailListRef}
            focusedIndex={focusedIndex}
            setSelectedThreadIds={setSelectedThreadIds}
          />

          {/* Right Panel - Conversation */}
          <ConversationPanel
            selectedThreadId={selectedThreadId}
            selectedThread={threadDetailQuery.data ?? selectedThread}
          />

          <FloatingBulk
            selectedThreadIds={selectedThreadIds}
            setSelectedThreadIds={setSelectedThreadIds}
          />
        </div>
      </main>
    </div>
  );
}
