import { Info, Star } from "lucide-react";

import { Badge } from "@/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";

import type { Feature, Plan } from "../types";
import { FeatureValue } from "./feature-value";

interface FeatureRowProps {
  feature: Feature;
  plans: Plan[];
  index: number;
}

export function FeatureRow({ feature, plans, index }: FeatureRowProps) {
  return (
    <div
      className={`grid grid-cols-5 gap-4 px-4 py-3 ${index % 2 === 0 ? "bg-muted/30" : "bg-transparent"} rounded-md`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{feature.name}</span>
        {feature.beta && (
          <Badge variant="outline" className="px-1 py-0 text-xs">
            <Star className="mr-1 h-3 w-3" />
            Beta
          </Badge>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="text-muted-foreground hover:text-foreground h-3 w-3 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-sm">{feature.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {plans.map((plan) => (
        <div key={plan.id} className="flex items-center justify-center">
          <FeatureValue plan={plan} feature={feature} />
        </div>
      ))}
    </div>
  );
}
