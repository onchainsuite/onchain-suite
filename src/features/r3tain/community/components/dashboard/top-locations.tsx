"use client";

import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { LocationData } from "@/r3tain/community/types";

interface TopLocationsProps {
  locationData: LocationData;
  onLearnMore: () => void;
}

export function TopLocations({ locationData, onLearnMore }: TopLocationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <MapPin className="h-4 w-4" />
          Top locations
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Based on your subscribers&apos; IP address when they interact with
          your emails and signup forms.
        </p>
      </CardHeader>

      <CardContent className="py-8 text-center">
        {!locationData.hasData ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>

            <p className="text-muted-foreground mb-4 text-sm">
              {locationData.message}
            </p>

            <Button
              variant="link"
              className="text-primary p-0"
              onClick={onLearnMore}
            >
              What data will show here?
            </Button>
          </>
        ) : (
          <div>{/* Location data would be rendered here when available */}</div>
        )}
      </CardContent>
    </Card>
  );
}
