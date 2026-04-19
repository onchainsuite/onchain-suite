"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { mutate as swrMutate } from "swr";

import { BackToTop } from "@/ui/back-to-top";
import { Toaster } from "@/ui/sonner";

import { ThemeProvider } from "./theme-provider";

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const handler = () => {
      queryClient.clear();
      swrMutate(() => true, undefined, { revalidate: false });
    };

    window.addEventListener("onchain:org-changed", handler as any);
    return () =>
      window.removeEventListener("onchain:org-changed", handler as any);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <BackToTop />
      </ThemeProvider>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 3000 }}
        richColors
      />
    </QueryClientProvider>
  );
};
