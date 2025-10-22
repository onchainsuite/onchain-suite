import type { ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

interface CheckboxFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: ReactNode | string;
  description?: string;
}

export function CheckboxFormField<T extends FieldValues>({
  form,
  name,
  label,
  description,
}: CheckboxFormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="mt-1"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer text-sm leading-relaxed">
              {label}
            </FormLabel>
            {description && (
              <FormMessage className="text-muted-foreground text-xs">
                {description}
              </FormMessage>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
