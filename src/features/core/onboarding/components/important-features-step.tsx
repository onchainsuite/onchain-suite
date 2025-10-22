"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { featureOptions } from "../constants";
import { type OnboardingStepsProps } from "../types";
import {
  type ImportantFeaturesFormData,
  importantFeaturesSchema,
} from "../validation";

export function ImportantFeaturesStep({
  initialData,
  onNext,
  onBack,
}: OnboardingStepsProps) {
  const form = useForm<ImportantFeaturesFormData>({
    resolver: zodResolver(importantFeaturesSchema),
    defaultValues: {
      importantFeatures: initialData.importantFeatures ?? [],
    },
  });

  const onSubmit = async (data: ImportantFeaturesFormData) => {
    await onNext(data);
  };

  const selectedFeatures = form.watch("importantFeatures") || [];

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          What are the most important features for your protocol?
        </h1>
        <p className="text-muted-foreground mb-4">
          We&apos;ll use your selections to guide you in the platform.
        </p>
        <p className="text-muted-foreground">Select all that apply.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="importantFeatures"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {featureOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="importantFeatures"
                      render={({ field }) => {
                        const isSelected = selectedFeatures.includes(option.id);
                        return (
                          <FormItem key={option.id}>
                            <FormControl>
                              <label
                                className={`hover:bg-muted/50 flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card hover:border-muted-foreground/30"
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    const updatedFeatures = checked
                                      ? [...selectedFeatures, option.id]
                                      : selectedFeatures.filter(
                                          (feature) => feature !== option.id
                                        );
                                    field.onChange(updatedFeatures);
                                  }}
                                  className="mr-3"
                                />
                                <span className="text-card-foreground font-medium">
                                  {option.label}
                                </span>
                              </label>
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
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
