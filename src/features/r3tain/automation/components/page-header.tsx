"use client";

import { LayoutTemplateIcon as Template, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PRIVATE_ROUTES } from "@/config/app-routes";

export function PageHeader() {
  const { push } = useRouter();

  return (
    <div className="border-border bg-card/50 sticky top-0 z-10 border-b backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              Automation flows
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Create automated workflows to engage your audience
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="group"
              onClick={() => push(PRIVATE_ROUTES.R3TAIN.TEMPLATES)}
            >
              <Template className="mr-2 h-4 w-4" />
              Choose flow template
            </Button>

            <Button className="group">
              <Plus className="mr-2 h-4 w-4" />
              Build from scratch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
