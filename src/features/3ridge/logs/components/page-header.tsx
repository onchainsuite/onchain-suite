import { Download } from "lucide-react";

import { Button } from "@/ui/button";

export function PageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-balance text-3xl font-bold tracking-tight">
          System Logs
        </h1>
        <p className="text-pretty text-muted-foreground">
          Monitor and debug system activity with comprehensive logging
        </p>
      </div>
      <Button className="gap-2 sm:shrink-0">
        <Download className="h-4 w-4" />
        Export Logs
      </Button>
    </div>
  );
}
