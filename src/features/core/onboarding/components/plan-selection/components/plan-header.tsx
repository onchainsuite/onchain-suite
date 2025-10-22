import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { RadioGroupItem } from "@/ui/radio-group";

import type { Plan } from "../types";

interface PlanHeaderProps {
  plan: Plan;
  selectedPlan: string;
}

export function PlanHeader({ plan, selectedPlan }: PlanHeaderProps) {
  return (
    <div className="relative">
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <Badge className="bg-amber-500 text-white">Best value</Badge>
        </div>
      )}
      <label
        htmlFor={plan.id}
        className={`block cursor-pointer rounded-lg border-2 p-4 transition-all ${
          selectedPlan === plan.id
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-muted-foreground/30"
        }`}
      >
        <div className="text-center">
          <div className="mb-2 flex items-center justify-center">
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <RadioGroupItem value={plan.id} id={plan.id} className="ml-2" />
          </div>
          <p className="text-muted-foreground mb-4 min-h-[40px] text-sm">
            {plan.description}
          </p>

          <div className="mb-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold">{plan.price}</span>
            </div>
            <div className="text-muted-foreground text-sm">{plan.period}</div>
          </div>

          <Button
            type="button"
            className={`w-full ${plan.buttonClass ?? "bg-teal-600 hover:bg-teal-700"}`}
            variant={plan.id === "free" ? "outline" : "default"}
          >
            {plan.buttonText}
          </Button>

          <div className="text-muted-foreground mt-4 text-xs">
            *See Offer Terms. Overages apply if contact or email send limit is
            exceeded.
          </div>
        </div>
      </label>
    </div>
  );
}
