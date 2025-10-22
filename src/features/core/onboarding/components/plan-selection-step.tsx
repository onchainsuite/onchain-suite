"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form";
import { RadioGroup } from "@/ui/radio-group";
import { TooltipProvider } from "@/ui/tooltip";

import { type OnboardingStepsProps } from "../types";
import { type PlanSelectionFormData, planSelectionSchema } from "../validation";
import {
  FeatureComparisonTable,
  FooterDisclaimer,
  MobilePlanCard,
  PlanHeader,
  StepHeader,
} from "./plan-selection/components";
// Import data and types
import { features, plans } from "./plan-selection/data";

export function PlanSelectionStep({
  initialData,
  onNext,
  onBack,
}: OnboardingStepsProps) {
  const form = useForm<PlanSelectionFormData>({
    resolver: zodResolver(planSelectionSchema),
    defaultValues: {
      selectedPlan: initialData.selectedPlan ?? "",
    },
  });

  const onSubmit = async (data: PlanSelectionFormData) => {
    await onNext(data);
  };

  const selectedPlan = form.watch("selectedPlan");
  console.warn("🚀 ~ selectedPlan:", selectedPlan);

  // Group features by category
  const featuresByCategory = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    },
    {} as Record<string, typeof features>
  );

  return (
    <TooltipProvider>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <StepHeader onBack={onBack} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8"
          >
            <FormField
              control={form.control}
              name="selectedPlan"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {/* Mobile Plan Cards */}
                      <div className="block space-y-4 lg:hidden">
                        {plans.map((plan) => (
                          <MobilePlanCard
                            key={plan.id}
                            plan={plan}
                            selectedPlan={selectedPlan}
                            featuresByCategory={featuresByCategory}
                          />
                        ))}
                      </div>

                      {/* Desktop Plan Headers and Feature Table */}
                      <div className="hidden lg:block">
                        {/* Plan Headers */}
                        <div className="mb-6 grid grid-cols-5 gap-4">
                          <div className="col-span-1" />
                          {plans.map((plan) => (
                            <PlanHeader
                              key={plan.id}
                              plan={plan}
                              selectedPlan={selectedPlan}
                            />
                          ))}
                        </div>

                        {/* Feature Comparison Table */}
                        <FeatureComparisonTable
                          features={features}
                          plans={plans}
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={!selectedPlan}
                className="w-full bg-teal-600 px-6 hover:bg-teal-700 sm:w-auto sm:px-8"
              >
                Continue with Selected Plan
              </Button>
            </div>

            <FooterDisclaimer />
          </form>
        </Form>
      </div>
    </TooltipProvider>
  );
}
