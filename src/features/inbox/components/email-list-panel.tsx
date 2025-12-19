import React, { RefObject } from "react";
import Link from "next/link";
import {
  Search,
  Send,
  Star,
  Archive,
  Check,
  Clock,
  Paperclip,
} from "lucide-react";
import { Email } from "../types";

interface Folder {
  name: string;
  count: number;
  icon: React.ElementType;
}

interface EmailListPanelProps {
  filteredEmails: Email[];
  selectedEmail: Email | null;
  setSelectedEmail: (email: Email) => void;
  selectedEmails: number[];
  toggleSelectAll: () => void;
  toggleEmailSelection: (id: number) => void;
  folders: Folder[];
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  emailListRef: RefObject<HTMLDivElement | null>;
  focusedIndex: number;
  setSelectedEmails: (ids: number[]) => void;
}

const EmailListPanel = ({
  filteredEmails,
  selectedEmail,
  setSelectedEmail,
  selectedEmails,
  toggleSelectAll,
  toggleEmailSelection,
  folders,
  selectedFolder,
  setSelectedFolder,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  emailListRef,
  focusedIndex,
  setSelectedEmails,
}: EmailListPanelProps) => {
  return (
    <div className="w-80 shrink-0 overflow-y-auto border-r border-border">
      {/* Search + Folder Tabs / Bulk Actions */}
      <div className="border-b border-border p-3">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search... ( / )"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center justify-between">
          {selectedEmails.length > 0 ? (
            // Bulk actions when emails selected
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedEmails.length === filteredEmails.length}
                onChange={toggleSelectAll}
                className="h-3.5 w-3.5 rounded border-border accent-emerald-500"
              />
              <span className="text-xs font-medium text-emerald-400">
                {selectedEmails.length}
              </span>
              <div className="mx-1 h-4 w-px bg-border" />
              <button
                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-emerald-400"
                title="Send Email"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
              <button
                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-amber-400"
                title="Star"
              >
                <Star className="h-3.5 w-3.5" />
              </button>
              <button
                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-blue-400"
                title="Archive"
              >
                <Archive className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setSelectedEmails([])}
                className="ml-auto rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                title="Clear selection"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            // Folder tabs when no selection
            <div className="flex items-center gap-0.5">
              {folders.map((folder) => {
                const Icon = folder.icon;
                const isActive = selectedFolder === folder.name;
                return (
                  <button
                    key={folder.name}
                    onClick={() => setSelectedFolder(folder.name)}
                    className={`relative flex items-center justify-center rounded-lg p-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-muted-foreground hover:bg-card"
                    }`}
                    title={`${folder.name} (${folder.count})`}
                  >
                    <Icon className="h-4 w-4" />
                    {folder.count > 0 && folder.name === "Unread" && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                        {folder.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Email List */}
      <div ref={emailListRef} className="divide-y divide-border">
        {filteredEmails.map((email, index) => (
          <div
            key={email.id}
            className={`group relative transition-colors ${
              selectedEmail?.id === email.id
                ? "bg-emerald-500/10"
                : focusedIndex === index
                  ? "bg-card"
                  : "hover:bg-card"
            }`}
          >
            <div className="absolute left-2 top-4 z-10">
              <input
                type="checkbox"
                checked={selectedEmails.includes(email.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleEmailSelection(email.id);
                }}
                className="h-3.5 w-3.5 rounded border-border opacity-0 accent-emerald-500 transition-opacity group-hover:opacity-100"
                style={{
                  opacity: selectedEmails.includes(email.id) ? 1 : undefined,
                }}
              />
            </div>

            <div
              onClick={() => setSelectedEmail(email)}
              className="w-full cursor-pointer p-4 pl-8 text-left"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/audience/${email.profileId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-transform hover:scale-110"
                    style={{
                      backgroundColor: email.unread
                        ? "rgba(16, 185, 129, 0.2)"
                        : "var(--color-elevated)",
                      color: email.unread
                        ? "rgb(52, 211, 153)"
                        : "var(--color-text-muted)",
                    }}
                  >
                    {email.avatar}
                  </Link>
                  <span
                    className={`text-sm ${
                      email.unread
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {email.from}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {email.hasAttachment && (
                    <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  {email.starred && (
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {email.time}
                  </span>
                </div>
              </div>
              <p
                className={`mb-1 truncate text-sm ${
                  email.unread
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {email.subject}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {email.preview}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {email.campaign}
                </span>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-emerald-400"
                    title="Archive"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-amber-400"
                    title="Star"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-blue-400"
                    title="Snooze"
                  >
                    <Clock className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailListPanel;
