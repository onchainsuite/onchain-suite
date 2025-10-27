"use client";

import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PredictedDemographicsProps {
  onUpgrade: () => void;
}

export function PredictedDemographics({
  onUpgrade,
}: PredictedDemographicsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Users className="h-4 w-4" />
            Predicted demographics
          </CardTitle>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Paid Feature
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Your subscribers broken down by their predicted gender and age.
        </p>
      </CardHeader>

      <CardContent className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Users className="h-8 w-8 text-gray-400" />
        </div>

        <h3 className="mb-2 text-lg font-semibold">
          Know your people even better
        </h3>
        <p className="text-muted-foreground mb-6 text-sm">
          Send targeted campaigns based on your subscribers&apos; demographics.
        </p>

        <Button onClick={onUpgrade}>Upgrade Now</Button>
      </CardContent>
    </Card>
  );
}
