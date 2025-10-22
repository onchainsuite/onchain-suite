"use client";

import { Check, ChevronDown, ChevronUp, Star, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { RadioGroupItem } from "@/ui/radio-group";

import type { Feature, Plan } from "../types";
import { FeatureValue } from "./feature-value";

interface MobilePlanCardProps {
  plan: Plan;
  selectedPlan: string;
  featuresByCategory: Record<string, Feature[]>;
}

export function MobilePlanCard({
  plan,
  selectedPlan,
  featuresByCategory,
}: MobilePlanCardProps) {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  return (
    <label htmlFor={plan.id} className="block cursor-pointer">
      <Card
        className={`relative ${selectedPlan === plan.id ? "ring-primary ring-2" : ""}`}
      >
        {plan.recommended && (
          <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
            <Badge className="bg-amber-500 text-white">Best value</Badge>
          </div>
        )}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {plan.description}
              </p>
            </div>
            <RadioGroupItem value={plan.id} id={plan.id} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{plan.price}</span>
            <span className="text-muted-foreground text-sm">{plan.period}</span>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            className={`mb-4 w-full ${plan.buttonClass ?? "bg-teal-600 hover:bg-teal-700"}`}
            variant={plan.id === "free" ? "outline" : "default"}
          >
            {plan.buttonText}
          </Button>

          {/* Key Features for Mobile */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly emails</span>
              <span className="font-medium">{plan.features.emailSends}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Users</span>
              <span className="font-medium">{plan.features.users}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Audiences</span>
              <span className="font-medium">{plan.features.audiences}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">24/7 Support</span>
              {plan.features.support ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="text-muted-foreground h-4 w-4" />
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary mt-4 w-full"
            onClick={() => setShowAllFeatures(!showAllFeatures)}
          >
            {showAllFeatures ? "Hide" : "View"} all features
            {showAllFeatures ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Button>

          {showAllFeatures && (
            <div className="mt-4 space-y-3">
              {Object.entries(featuresByCategory).map(
                ([category, categoryFeatures]) => (
                  <div key={category}>
                    <h4 className="text-foreground mb-2 text-sm font-medium">
                      {category}
                    </h4>
                    <div className="space-y-1">
                      {categoryFeatures.map((feature) => (
                        <div
                          key={feature.key}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">
                              {feature.name}
                            </span>
                            {feature.beta && (
                              <Badge
                                variant="outline"
                                className="px-1 py-0 text-xs"
                              >
                                <Star className="mr-1 h-2 w-2" />
                                Beta
                              </Badge>
                            )}
                          </div>
                          <FeatureValue plan={plan} feature={feature} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </label>
  );
}
