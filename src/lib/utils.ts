import type { Column, FilterFn } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

// Utility function for combining class names

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPinningStyles = <T>(column: Column<T>): CSSProperties => {
  const isPinned = column.getIsPinned();
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

export const dateFilterFn = <T, K extends keyof T>(
  columnId: K
): FilterFn<T> => {
  return (row, _, value: { from: Date; to: Date }) => {
    const rowDate = row.getValue(columnId as string) as Date;
    const { from, to } = value;

    if (from && to) {
      return rowDate >= from && rowDate <= to;
    }

    return rowDate >= from;
  };
};

export function getInitials(firstName?: string, lastName?: string): string {
  const firstInitial = firstName?.trim()?.charAt(0).toUpperCase();
  const lastInitial = lastName?.trim()?.charAt(0).toUpperCase();

  if (firstInitial || lastInitial) {
    return `${firstInitial ?? ""}${lastInitial ?? ""}`;
  }

  return "A";
}

function capitalizeWord(word: string, isFirstWord: boolean): string {
  const lower = word.toLowerCase();

  // common name prefixes that should stay lowercase unless they're first
  const prefixes = [
    "van",
    "von",
    "de",
    "da",
    "di",
    "del",
    "della",
    "la",
    "le",
    "du",
    "dos",
    "das",
    "der",
  ];

  if (!isFirstWord && prefixes.includes(lower)) {
    return lower;
  }

  // handle hyphenated or apostrophe words
  return word
    .split(/([-'])/g)
    .map((part) =>
      /^[a-zA-Z]+$/.test(part)
        ? `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`
        : part
    )
    .join("");
}

function capitalizeName(input?: string, isFirstName = false): string {
  if (!input) return "";
  const parts = input.trim().split(/\s+/);
  return parts
    .map((part, idx) => capitalizeWord(part, isFirstName && idx === 0))
    .join(" ");
}

export function getFullName(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return "";
  const full = `${capitalizeName(firstName, true)} ${capitalizeName(lastName)}`;
  return full.trim();
}

/**
 * Type guard to check if a value is a valid JSON object
 */
export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
