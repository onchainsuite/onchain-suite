"use client";

import { LayoutTemplateIcon as Template, Plus, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  hasFilters: boolean | string;
  onClearFilters: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Zap className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">
            No flows match your filters
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Try adjusting your search criteria or clear all filters to see all
            flows.
          </p>
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <Zap className="text-primary h-10 w-10" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">
          Create your first automation flow
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Automate your marketing with powerful workflows that engage customers
          at the right time with the right message.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="group">
            <Plus className="mr-2 h-4 w-4" />
            Build from scratch
          </Button>
          <Button variant="outline" className="group">
            <Template className="mr-2 h-4 w-4" />
            Choose template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
