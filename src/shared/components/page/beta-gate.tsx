"use client";

import { signOut } from "@/lib/auth-client";

import { Button } from "@/shared/components/ui/button";

export function BetaGate({ email }: { email: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 w-fit rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
          Private beta
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          OnchainSuite is invite-only right now
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The account <span className="font-medium">{email}</span> doesn’t have
          beta access yet. If you think it should, reach us at{" "}
          <a
            href="mailto:hello@onchainsuite.com"
            className="text-primary underline"
          >
            hello@onchainsuite.com
          </a>
          .
        </p>
        <Button variant="outline" className="mt-6" onClick={signOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
