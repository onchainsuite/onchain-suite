"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/ui/button";

import { PRIVATE_ROUTES } from "@/config/app-routes";

export const AddSubscriberHeader = () => {
  const { push } = useRouter();

  return (
    <div className="bg-background/95 border-border sticky top-0 z-40 flex items-center justify-between border-b px-4 py-4 backdrop-blur-sm lg:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Add a single subscriber
        </h1>
        <p className="text-muted-foreground">
          Add subscriber information to your community
        </p>
      </div>
      <Button onClick={() => push(PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS)}>
        Import subscribers
      </Button>
    </div>
  );
};
