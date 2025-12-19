"use client";

import { useEffect, useRef, useState } from "react";

import ConversationPanel from "../components/conversation";
import EmailListPanel from "../components/email-list-panel";
import FloatingBulk from "../components/floating-bulk";
import { emails, folders } from "../data";
import { type Email } from "../types";

export function InboxPages() {
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const emailListRef = useRef<HTMLDivElement>(null);

  const filteredEmails = emails.filter((email) => {
    const matchesFolder =
      selectedFolder === "All" ||
      (selectedFolder === "Unread" && email.unread) ||
      (selectedFolder === "Starred" && email.starred);
    const matchesSearch =
      searchQuery === "" ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const toggleEmailSelection = (emailId: number) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmails.length === filteredEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredEmails.map((e) => e.id));
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
          setFocusedIndex((prev) =>
            Math.min(prev + 1, filteredEmails.length - 1)
          );
          break;
        case "k":
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredEmails[focusedIndex]) {
            setSelectedEmail(filteredEmails[focusedIndex]);
          }
          break;
        case "x":
          e.preventDefault();
          if (filteredEmails[focusedIndex]) {
            toggleEmailSelection(filteredEmails[focusedIndex].id);
          }
          break;
        case "r":
          e.preventDefault();
          if (selectedEmail) {
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
  }, [filteredEmails, focusedIndex, selectedEmail]);

  useEffect(() => {
    const emailElement = emailListRef.current?.children[
      focusedIndex
    ] as HTMLElement;
    emailElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusedIndex]);

  const unreadCount = emails.filter((e) => e.unread).length;

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
            filteredEmails={filteredEmails}
            selectedEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
            selectedEmails={selectedEmails}
            toggleSelectAll={toggleSelectAll}
            toggleEmailSelection={toggleEmailSelection}
            folders={folders}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchInputRef={searchInputRef}
            emailListRef={emailListRef}
            focusedIndex={focusedIndex}
            setSelectedEmails={setSelectedEmails}
          />

          {/* Right Panel - Conversation */}
          <ConversationPanel selectedEmail={selectedEmail} />

          <FloatingBulk
            selectedEmails={selectedEmails}
            setSelectedEmails={setSelectedEmails}
          />
        </div>
      </main>
    </div>
  );
}
