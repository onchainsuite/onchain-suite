"use client";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  className?: string;
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className = "",
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <LockClosedIcon
                aria-hidden="true"
                className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform"
              />
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className={`h-12 pr-10 pl-10 ${fieldState.error ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <EyeIcon aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
