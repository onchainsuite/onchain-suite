"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import type { Feature, Plan } from "../types";
import { FeatureRow } from "./feature-row";

interface FeatureComparisonTableProps {
  features: Feature[];
  plans: Plan[];
}

export function FeatureComparisonTable({
  features,
  plans,
}: FeatureComparisonTableProps) {
  const [expandedFeatures, setExpandedFeatures] = useState(false);

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-6">
        <h3 className="mb-4 text-center text-lg font-semibold">
          Our Standard plan includes every feature you need to grow.
        </h3>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          Standard customers see up to 24% ROI on average*.
        </p>

        <Collapsible open={expandedFeatures} onOpenChange={setExpandedFeatures}>
          <div className="space-y-1">
            {/* Show first 8 features by default */}
            {features.slice(0, 8).map((feature, index) => (
              <FeatureRow
                key={feature.key}
                feature={feature}
                plans={plans}
                index={index}
              />
            ))}

            <CollapsibleContent className="space-y-1">
              {features.slice(8).map((feature, index) => (
                <FeatureRow
                  key={feature.key}
                  feature={feature}
                  plans={plans}
                  index={index + 8}
                />
              ))}
            </CollapsibleContent>
          </div>

          <div className="mt-6 text-center">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="text-primary">
                {expandedFeatures ? "Show fewer features" : "View all features"}
                {expandedFeatures ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
