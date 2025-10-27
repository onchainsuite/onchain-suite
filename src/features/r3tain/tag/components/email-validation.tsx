"use client";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailValidationProps {
  validEmails: string[];
  errors: string[];
  maxErrorsShown?: number;
}

export function EmailValidation({
  validEmails,
  errors,
  maxErrorsShown = 5,
}: EmailValidationProps) {
  if (validEmails.length === 0 && errors.length === 0) return null;

  return (
    <div className="space-y-2">
      {validEmails.length > 0 && (
        <p className="text-sm text-green-600">
          {validEmails.length} valid email(s) found
        </p>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {errors.slice(0, maxErrorsShown).map((error, index) => (
                <div key={index} className="text-sm">
                  {error}
                </div>
              ))}
              {errors.length > maxErrorsShown && (
                <div className="text-sm">
                  ... and {errors.length - maxErrorsShown} more errors
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
