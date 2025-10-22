"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";

import { goalOptions } from "../constants";
import type { OnboardingStepsProps } from "../types";
import { type BusinessGoalFormData, businessGoalSchema } from "../validation";

export function BusinessGoalStep({
  initialData,
  onNext,
  onBack,
}: OnboardingStepsProps) {
  const form = useForm<BusinessGoalFormData>({
    resolver: zodResolver(businessGoalSchema),
    defaultValues: {
      businessGoal: initialData.businessGoal ?? "",
    },
  });

  const onSubmit = async (data: BusinessGoalFormData) => {
    await onNext(data);
  };

  const selectedGoal = form.watch("businessGoal");

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          What&apos;s your top goal with R3tain?
        </h1>
        <p className="text-muted-foreground">
          We&apos;ll get you started with personalized recommendations based on
          your focus.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="businessGoal"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-4"
                  >
                    {goalOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-0"
                      >
                        <label
                          htmlFor={option.id}
                          className={`hover:bg-muted/50 flex w-full cursor-pointer items-center rounded-lg border-2 p-4 transition-all ${
                            selectedGoal === option.id
                              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                              : "border-border bg-card hover:border-muted-foreground/30"
                          }`}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mr-4"
                          />
                          <span className="text-card-foreground font-medium">
                            {option.label}
                          </span>
                          {selectedGoal === option.id && (
                            <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-teal-600">
                              <svg
                                className="h-4 w-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost">
                Skip
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Next
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
