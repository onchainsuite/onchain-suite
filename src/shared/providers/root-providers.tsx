"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { mutate as swrMutate } from "swr";

import { CommandPaletteProvider } from "@/components/common/command-palette";
import { BackToTop } from "@/ui/back-to-top";
import { Toaster } from "@/ui/sonner";

import { ThemeProvider } from "./theme-provider";

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const handler = (_event: Event) => {
      queryClient.clear();
      swrMutate(() => true, undefined, { revalidate: false });
    };

    window.addEventListener("onchain:org-changed", handler);
    return () => window.removeEventListener("onchain:org-changed", handler);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <CommandPaletteProvider>{children}</CommandPaletteProvider>
          </GoogleOAuthProvider>
        ) : (
          <CommandPaletteProvider>{children}</CommandPaletteProvider>
        )}
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
