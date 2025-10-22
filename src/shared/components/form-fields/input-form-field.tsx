import type { LucideIcon } from "lucide-react";
import type { HTMLInputTypeAttribute, ReactElement, ReactNode } from "react";
import type {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";

import { cn } from "@/lib/utils";

interface InputFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder?: string;
  required?: boolean;
  label?: string;
  additionalLabel?: string;
  description?: string | ReactNode;
  className?: string;
  icon?: LucideIcon;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
  renderChild?: (field: ControllerRenderProps<T, Path<T>>) => ReactElement;
}

export function InputFormField<T extends FieldValues>({
  form,
  name,
  placeholder,
  required,
  label,
  additionalLabel,
  description,
  className,
  icon: Icon,
  type = "text",
  disabled,
  renderChild,
}: InputFormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-medium">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
            {additionalLabel && (
              <span className="text-muted-foreground text-sm">
                {additionalLabel}
              </span>
            )}
          </div>
          <FormControl>
            {renderChild ? (
              renderChild(field)
            ) : (
              <div className="relative">
                {Icon && (
                  <Icon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                )}
                <Input
                  {...field}
                  type={type}
                  disabled={disabled}
                  placeholder={placeholder}
                  className={cn(
                    Icon ? "pl-10" : "pl-3",
                    fieldState.error ? "border-destructive" : "",
                    className
                  )}
                />
              </div>
            )}
          </FormControl>
          <FormMessage className="text-destructive" />
          {description && (
            <FormDescription className="text-muted-foreground text-sm">
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
