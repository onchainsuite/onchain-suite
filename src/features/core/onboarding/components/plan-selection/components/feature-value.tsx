import { Check, X } from "lucide-react";

import type { Feature, Plan } from "../types";

interface FeatureValueProps {
  plan: Plan;
  feature: Feature;
}

export function FeatureValue({ plan, feature }: FeatureValueProps) {
  const value = plan.features[feature.key];

  if (value === true) {
    return <Check className="h-4 w-4 flex-shrink-0 text-green-600" />;
  } else if (value === false) {
    return <X className="text-muted-foreground h-4 w-4 flex-shrink-0" />;
  } else if (typeof value === "string") {
    return <span className="text-right text-sm font-medium">{value}</span>;
  }

  return <X className="text-muted-foreground h-4 w-4 flex-shrink-0" />;
}
