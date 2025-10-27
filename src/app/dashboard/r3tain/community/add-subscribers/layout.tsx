"use client";

import { ImportProvider } from "@/r3tain/community/context";

export default function AddSubscribersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ImportProvider>{children}</ImportProvider>;
}
