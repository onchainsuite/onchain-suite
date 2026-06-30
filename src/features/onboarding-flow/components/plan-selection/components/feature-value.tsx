import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import type { Feature, Plan } from "../types";

interface FeatureValueProps {
  plan: Plan;
  feature: Feature;
}

export function FeatureValue({ plan, feature }: FeatureValueProps) {
  const value = plan.features[feature.key];

  if (value === true) {
    return (
      <CheckIcon
        aria-hidden="true"
        className="h-4 w-4 flex-shrink-0 text-green-600"
      />
    );
  } else if (value === false) {
    return (
      <XMarkIcon
        aria-hidden="true"
        className="text-muted-foreground h-4 w-4 flex-shrink-0"
      />
    );
  } else if (typeof value === "string") {
    return <span className="text-right text-sm font-medium">{value}</span>;
  }

  return (
    <XMarkIcon
      aria-hidden="true"
      className="text-muted-foreground h-4 w-4 flex-shrink-0"
    />
  );
}
