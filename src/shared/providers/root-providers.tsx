"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { ThemeProvider } from "./theme-provider";

import { BackToTop } from "@/ui/back-to-top";
import { Toaster } from "@/ui/sonner";

const queryClient = new QueryClient();

export const RootProviders = ({ children }: { children: ReactNode }) => {
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
