import { Plus } from "lucide-react";

import { Button } from "@/ui/button";

export function PageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-balance text-3xl font-bold tracking-tight">
          Route Policies
        </h1>
        <p className="text-pretty text-muted-foreground">
          Configure security and access control policies for your routes
        </p>
      </div>
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        Create Policy
      </Button>
    </div>
  );
}
