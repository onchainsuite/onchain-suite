"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { contactRanges } from "../constants";
import type { OnboardingStepsProps } from "../types";
import { type ContactCountFormData, contactCountSchema } from "../validation";

export function ContactCountStep({
  initialData,
  onNext,
  onBack,
}: OnboardingStepsProps) {
  const form = useForm<ContactCountFormData>({
    resolver: zodResolver(contactCountSchema),
    defaultValues: {
      contactCount: initialData.contactCount ?? "",
    },
  });

  const onSubmit = async (data: ContactCountFormData) => {
    await onNext(data);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          How many email contacts do you have?
        </h1>
        <p className="text-muted-foreground">
          An estimate will do. We&apos;ll recommend ways to grow and manage your
          audience based on your answer.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="contactCount"
            render={({ field }) => (
              <FormItem>
                <label className="text-foreground text-sm font-medium">
                  Select your contact range
                </label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contactRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
