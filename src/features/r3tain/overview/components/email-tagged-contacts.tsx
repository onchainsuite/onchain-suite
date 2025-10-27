"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmailTaggedContacts() {
  return (
    <Card className="border-border bg-card border">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            <div className="relative h-16 w-24">
              {/* Journey visualization */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="h-0.5 flex-1 bg-green-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-muted h-3 w-3 rounded-full" />
                  <div className="bg-muted h-0.5 flex-1" />
                  <div className="bg-muted h-3 w-3 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="h-0.5 flex-1 bg-green-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-card-foreground mb-2 text-lg font-semibold">
              Email tagged contacts
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Trigger automated customer journeys with the power of your tags.
            </p>
            <Button variant="outline" size="sm">
              Use this pre-built journey
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
