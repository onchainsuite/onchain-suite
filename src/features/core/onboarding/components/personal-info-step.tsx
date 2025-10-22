"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";

import { CheckboxFormField, InputFormField } from "@/components/form-fields";
import { Alert, AlertDescription } from "@/ui/alert";
import { Button } from "@/ui/button";
import { Form } from "@/ui/form";
import { PhoneInput } from "@/ui/phone-input";

import type { PersonalInfoStepProps } from "../types";
import { type PersonalInfoFormData, personalInfoSchema } from "../validation";

export function PersonalInfoStep({
  initialData,
  onNext,
}: PersonalInfoStepProps) {
  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: initialData.firstName ?? "",
      lastName: initialData.lastName ?? "",
      protocolName: initialData.protocolName ?? "",
      phoneNumber: initialData.phoneNumber ?? "",
      marketingEmails: initialData.marketingEmails ?? false,
    },
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    await onNext(data);
  };

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Tell us a bit about you
        </h1>
      </div>

      {hasErrors && (
        <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            There{" "}
            {Object.keys(form.formState.errors).length === 1 ? "is" : "are"}{" "}
            {Object.keys(form.formState.errors).length} error
            {Object.keys(form.formState.errors).length === 1 ? "" : "s"} in your
            form.
            <ul className="mt-2 list-disc pl-4">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>{error?.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InputFormField
              form={form}
              name="firstName"
              label="First Name"
              required
            />

            <InputFormField
              form={form}
              name="lastName"
              label="Last Name"
              required
            />
          </div>

          <InputFormField
            form={form}
            name="protocolName"
            label="Protocol Name"
            description="You can always change this later in your account settings."
            required
          />

          <InputFormField
            form={form}
            name="phoneNumber"
            label="Phone Number"
            additionalLabel="Recommended"
            description="You can always change this later in your account settings."
            renderChild={(field) => (
              <PhoneInput {...field} value={field.value as string} />
            )}
          />

          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              By clicking next, you agree to our{" "}
              <button type="button" className="text-primary hover:underline">
                Terms
              </button>{" "}
              and have read and acknowledged the{" "}
              <button type="button" className="text-primary hover:underline">
                Global Privacy Statement
              </button>
              .
            </p>

            <CheckboxFormField
              form={form}
              name="marketingEmails"
              label="I want to receive emails about R3tain and related
                      products, feature updates, marketing best practices, and
                      promotions from R3tain."
            />
          </div>

          <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}
