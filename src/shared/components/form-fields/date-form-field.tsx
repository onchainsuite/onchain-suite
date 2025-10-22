import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { DatePicker } from "@/ui/date-picker";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

import { cn } from "@/lib/utils";

interface DateFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder?: string;
  required?: boolean;
  label?: string;
  disabledDates?: (date: Date) => boolean;
  description?: string;
  className?: string;
}

export function DateFormField<T extends FieldValues>({
  form,
  name,
  label,
  disabledDates,
  description,
  className,
}: DateFormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              disabledDates={disabledDates}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
