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

import { organizationOptions } from "../constants";
import type { OnboardingStepsProps } from "../types";
import {
  type OrganizationTypeFormData,
  organizationTypeSchema,
} from "../validation";

export function OrganizationTypeStep({
  initialData,
  onNext,
  onBack,
}: OnboardingStepsProps) {
  const form = useForm<OrganizationTypeFormData>({
    resolver: zodResolver(organizationTypeSchema),
    defaultValues: {
      organizationTypes: initialData.organizationTypes ?? [],
    },
  });

  const onSubmit = async (data: OrganizationTypeFormData) => {
    await onNext(data);
  };

  const selectedTypes = form.watch("organizationTypes") || [];

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          What best describes your organization?
        </h1>
        <p className="text-muted-foreground">Select all that apply.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="organizationTypes"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {organizationOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="organizationTypes"
                      render={({ field }) => {
                        const isSelected = selectedTypes.includes(option.id);
                        return (
                          <FormItem key={option.id}>
                            <FormControl>
                              <label
                                className={`hover:bg-muted/50 flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card hover:border-muted-foreground/30"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                      const updatedTypes = checked
                                        ? [...selectedTypes, option.id]
                                        : selectedTypes.filter(
                                            (type) => type !== option.id
                                          );
                                      field.onChange(updatedTypes);
                                    }}
                                    className="mt-0.5"
                                  />
                                  <div className="flex-1">
                                    <h3 className="text-card-foreground font-semibold">
                                      {option.label}
                                    </h3>
                                    {option.description && (
                                      <p className="text-muted-foreground mt-1 text-sm">
                                        {option.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
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
