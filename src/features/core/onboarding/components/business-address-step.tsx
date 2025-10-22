"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  CityFormField,
  CountryFormField,
  InputFormField,
  StateFormField,
} from "@/components/form-fields";
import { Button } from "@/ui/button";
import { Form } from "@/ui/form";

import { type OnboardingStepsProps } from "../types";
import {
  type BusinessAddressFormData,
  businessAddressSchema,
} from "../validation";

export function BusinessAddressStep({
  initialData,
  onNext,
  onBack,
}: OnboardingStepsProps) {
  const form = useForm<BusinessAddressFormData>({
    resolver: zodResolver(businessAddressSchema),
    defaultValues: {
      addressLine1: initialData.addressLine1 ?? "",
      addressLine2: initialData.addressLine2 ?? "",
      city: initialData.city ?? "",
      state: initialData.state ?? "",
      zipCode: initialData.zipCode ?? "",
      country: initialData.country ?? "",
    },
  });

  const onSubmit = async (data: BusinessAddressFormData) => {
    await onNext(data);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          What&apos;s your business address?
        </h1>
        <p className="text-muted-foreground">
          To follow{" "}
          <button type="button" className="text-primary hover:underline">
            anti-spam laws
          </button>
          , your address will appear in the footer of every email you send with
          R3tain. Don&apos;t have an official business address? Learn about{" "}
          <button type="button" className="text-primary hover:underline">
            alternatives
          </button>
          .
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <CountryFormField control={form.control} name="country" required />
            <StateFormField
              control={form.control}
              name="state"
              countryName="country"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <CityFormField
              control={form.control}
              name="city"
              countryName="country"
              stateName="state"
              required
            />

            <InputFormField
              form={form}
              name="zipCode"
              label="Zip / Postal code"
              required
            />
          </div>

          <InputFormField
            form={form}
            name="addressLine1"
            label="Address line 1 (Street
                  address or post office box)"
            required
          />

          <InputFormField
            form={form}
            name="addressLine2"
            label="Address line 2"
            additionalLabel="Optional"
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
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
