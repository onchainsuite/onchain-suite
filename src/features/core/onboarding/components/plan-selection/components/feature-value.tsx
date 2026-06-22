import { Cancel01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Feature, Plan } from "../types";

interface FeatureValueProps {
  plan: Plan;
  feature: Feature;
}

export function FeatureValue({ plan, feature }: FeatureValueProps) {
  const value = plan.features[feature.key];

  if (value === true) {
    return (
      <HugeiconsIcon
        icon={Tick01Icon}
        className="h-4 w-4 shrink-0 text-green-600"
      />
    );
  } else if (value === false) {
    return (
      <HugeiconsIcon
        icon={Cancel01Icon}
        className="text-muted-foreground h-4 w-4 shrink-0"
      />
    );
  } else if (typeof value === "string") {
    return <span className="text-right text-sm font-medium">{value}</span>;
  }

  return (
    <HugeiconsIcon
      icon={Cancel01Icon}
      className="text-muted-foreground h-4 w-4 shrink-0"
    />
  );
}
