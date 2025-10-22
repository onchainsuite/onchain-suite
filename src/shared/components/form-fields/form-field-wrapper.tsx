import type { ReactElement } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormFieldWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  required?: boolean;
  renderChild: (field: ControllerRenderProps<T, Path<T>>) => ReactElement;
}

export function FormFieldWrapper<T extends FieldValues>({
  control,
  name,
  label,
  renderChild,
  description,
  required,
}: FormFieldWrapperProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>{renderChild(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
